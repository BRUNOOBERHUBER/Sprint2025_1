from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from bson import ObjectId
from backend.database import get_db
from backend.utils import validar_token
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.schemas import SaudeCreate, SaudeDB

router = APIRouter(prefix="/alunos/{aluno_id}/saude", tags=["saude"], dependencies=[Depends(validar_token)])

COLLECTION = "saude"

def saude_helper(doc: dict) -> SaudeDB:
    doc["_id"] = str(doc["_id"])
    return SaudeDB(**doc)

@router.get("/", response_model=List[SaudeDB])
async def listar_saude(aluno_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    cursor = db[COLLECTION].find({"alunoId": aluno_id})
    return [saude_helper(s) async for s in cursor]

@router.post("/", response_model=SaudeDB, status_code=status.HTTP_201_CREATED)
async def criar_saude(aluno_id: str, payload: SaudeCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    data = payload.dict()
    data["alunoId"] = aluno_id
    res = await db[COLLECTION].insert_one(data)
    novo = await db[COLLECTION].find_one({"_id": res.inserted_id})
    return saude_helper(novo)

@router.delete("/{saude_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_saude(aluno_id: str, saude_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    res = await db[COLLECTION].delete_one({"_id": ObjectId(saude_id), "alunoId": aluno_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Registro saúde não encontrado") 