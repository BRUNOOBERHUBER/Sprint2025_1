from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from bson import ObjectId
from backend.database import get_db
from backend.utils import validar_token
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.schemas import FrequenciaCreate, FrequenciaDB

router = APIRouter(prefix="/alunos/{aluno_id}/frequencias", tags=["frequencias"], dependencies=[Depends(validar_token)])

COLLECTION = "frequencias"


def freq_helper(doc: dict) -> FrequenciaDB:
    doc["_id"] = str(doc["_id"])
    return FrequenciaDB(**doc)


@router.get("/", response_model=List[FrequenciaDB])
async def listar_frequencias(aluno_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    cursor = db[COLLECTION].find({"alunoId": aluno_id})
    return [freq_helper(f) async for f in cursor]


@router.post("/", response_model=FrequenciaDB, status_code=status.HTTP_201_CREATED)
async def criar_freq(aluno_id: str, payload: FrequenciaCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    data = payload.dict()
    data["alunoId"] = aluno_id
    res = await db[COLLECTION].insert_one(data)
    novo = await db[COLLECTION].find_one({"_id": res.inserted_id})
    return freq_helper(novo)


@router.put("/{freq_id}", response_model=FrequenciaDB)
async def atualizar_freq(aluno_id: str, freq_id: str, payload: FrequenciaCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    updates = payload.dict()
    await db[COLLECTION].update_one({"_id": ObjectId(freq_id), "alunoId": aluno_id}, {"$set": updates})
    doc = await db[COLLECTION].find_one({"_id": ObjectId(freq_id), "alunoId": aluno_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Frequência não encontrada")
    return freq_helper(doc)


@router.delete("/{freq_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_freq(aluno_id: str, freq_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    res = await db[COLLECTION].delete_one({"_id": ObjectId(freq_id), "alunoId": aluno_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Frequência não encontrada") 