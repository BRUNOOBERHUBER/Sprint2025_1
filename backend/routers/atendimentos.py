from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from bson import ObjectId
from backend.database import get_db
from backend.utils import validar_token
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.schemas import AtendimentoCreate, AtendimentoUpdate, AtendimentoDB

router = APIRouter(prefix="/alunos/{aluno_id}/atendimentos", tags=["atendimentos"], dependencies=[Depends(validar_token)])

COLLECTION = "atendimentos"

def at_helper(doc: dict) -> AtendimentoDB:
    doc["_id"] = str(doc["_id"])
    return AtendimentoDB(**doc)

@router.get("/", response_model=List[AtendimentoDB])
async def listar_atendimentos(aluno_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    cursor = db[COLLECTION].find({"alunoId": aluno_id})
    return [at_helper(a) async for a in cursor]

@router.post("/", response_model=AtendimentoDB, status_code=status.HTTP_201_CREATED)
async def criar_atendimento(aluno_id: str, payload: AtendimentoCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    data = payload.dict()
    data["alunoId"] = aluno_id
    res = await db[COLLECTION].insert_one(data)
    novo = await db[COLLECTION].find_one({"_id": res.inserted_id})
    return at_helper(novo)

@router.put("/{atendimento_id}", response_model=AtendimentoDB)
async def atualizar_at(aluno_id: str, atendimento_id: str, updates: AtendimentoUpdate, db: AsyncIOMotorDatabase = Depends(get_db)):
    updates_dict = {k: v for k, v in updates.dict(exclude_unset=True).items()}
    await db[COLLECTION].update_one({"_id": ObjectId(atendimento_id), "alunoId": aluno_id}, {"$set": updates_dict})
    doc = await db[COLLECTION].find_one({"_id": ObjectId(atendimento_id), "alunoId": aluno_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Atendimento não encontrado")
    return at_helper(doc)

@router.delete("/{atendimento_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_at(aluno_id: str, atendimento_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    res = await db[COLLECTION].delete_one({"_id": ObjectId(atendimento_id), "alunoId": aluno_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Atendimento não encontrado") 