from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from typing import List
from datetime import datetime

from backend.database import get_db
from backend.utils import validar_token
from backend.schemas import BoletimCreate, BoletimDB

router = APIRouter(prefix="/alunos/{aluno_id}/boletins", tags=["boletins"], dependencies=[Depends(validar_token)])

COLLECTION = "boletins"


def boletim_helper(doc: dict) -> BoletimDB:
    doc["_id"] = str(doc["_id"])
    return BoletimDB(**doc)


@router.get("/", response_model=List[BoletimDB])
async def listar_boletins(aluno_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    cursor = db[COLLECTION].find({"alunoId": aluno_id})
    return [boletim_helper(b) async for b in cursor]


@router.post("/", response_model=BoletimDB, status_code=status.HTTP_201_CREATED)
async def criar_boletim(aluno_id: str, boletim: BoletimCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    payload = boletim.dict()
    payload["alunoId"] = aluno_id
    payload["mediaGeral"] = boletim.mediaGeral
    res = await db[COLLECTION].insert_one(payload)
    novo = await db[COLLECTION].find_one({"_id": res.inserted_id})
    return boletim_helper(novo)


@router.get("/{boletim_id}", response_model=BoletimDB)
async def obter_boletim(aluno_id: str, boletim_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    doc = await db[COLLECTION].find_one({"_id": ObjectId(boletim_id), "alunoId": aluno_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Boletim não encontrado")
    return boletim_helper(doc)


@router.delete("/{boletim_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_boletim(aluno_id: str, boletim_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    res = await db[COLLECTION].delete_one({"_id": ObjectId(boletim_id), "alunoId": aluno_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Boletim não encontrado")


@router.put("/{boletim_id}", response_model=BoletimDB)
async def atualizar_boletim(
    aluno_id: str,
    boletim_id: str,
    boletim: BoletimCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    # Atualiza boletim existente
    updates = boletim.dict()
    # Recalcula média geral
    updates["mediaGeral"] = boletim.mediaGeral
    result = await db[COLLECTION].update_one(
        {"_id": ObjectId(boletim_id), "alunoId": aluno_id},
        {"$set": updates},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Boletim não encontrado")
    doc = await db[COLLECTION].find_one({"_id": ObjectId(boletim_id), "alunoId": aluno_id})
    return boletim_helper(doc) 