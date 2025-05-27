from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from backend.schemas import ContraturnoCreate, ContraturnoDB, ContraturnoUpdate
from backend.database import get_db
from backend.utils import validar_token
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

router = APIRouter(prefix="/contraturno", tags=["contraturno"], dependencies=[Depends(validar_token)])

COLLECTION = "contraturno"

class Inscricao(BaseModel):
    alunoId: str

def contraturno_helper(doc: dict) -> ContraturnoDB:
    doc["_id"] = str(doc["_id"])
    return ContraturnoDB(**doc)


@router.get("/", response_model=List[ContraturnoDB])
async def listar_contraturno(db: AsyncIOMotorDatabase = Depends(get_db)):
    docs = await db[COLLECTION].find().to_list(length=100)
    return [contraturno_helper(d) for d in docs]


@router.post("/", response_model=ContraturnoDB, status_code=status.HTTP_201_CREATED)
async def criar_contraturno(payload: ContraturnoCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    data = payload.dict()
    result = await db[COLLECTION].insert_one(data)
    novo = await db[COLLECTION].find_one({"_id": result.inserted_id})
    return contraturno_helper(novo)


@router.get("/{id}", response_model=ContraturnoDB)
async def obter_contraturno(id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        doc = await db[COLLECTION].find_one({"_id": ObjectId(id)})
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido")
    if not doc:
        raise HTTPException(status_code=404, detail="Projeto de Contraturno não encontrado")
    return contraturno_helper(doc)


@router.put("/{id}", response_model=ContraturnoDB)
async def atualizar_contraturno(id: str, updates: ContraturnoUpdate, db: AsyncIOMotorDatabase = Depends(get_db)):
    updates_dict = {k: v for k, v in updates.dict(exclude_unset=True).items()}
    if not updates_dict:
        raise HTTPException(status_code=400, detail="Nenhum campo para atualizar")
    await db[COLLECTION].update_one({"_id": ObjectId(id)}, {"$set": updates_dict})
    doc = await db[COLLECTION].find_one({"_id": ObjectId(id)})
    return contraturno_helper(doc)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_contraturno(id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    res = await db[COLLECTION].delete_one({"_id": ObjectId(id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Projeto de Contraturno não encontrado")
    return


@router.post("/{id}/inscrever", response_model=ContraturnoDB)
async def inscrever_aluno(
    id: str,
    inscricao: Inscricao,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Adiciona alunoId ao array, sem duplicar
    await db[COLLECTION].update_one(
        {"_id": ObjectId(id)},
        {"$addToSet": {"alunosInscritos": inscricao.alunoId}},
    )
    doc = await db[COLLECTION].find_one({"_id": ObjectId(id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Projeto de Contraturno não encontrado")
    return contraturno_helper(doc)


@router.delete("/{id}/inscrever/{aluno_id}", response_model=ContraturnoDB)
async def remover_inscricao(
    id: str,
    aluno_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Remove alunoId do array
    await db[COLLECTION].update_one(
        {"_id": ObjectId(id)},
        {"$pull": {"alunosInscritos": aluno_id}},
    )
    doc = await db[COLLECTION].find_one({"_id": ObjectId(id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Projeto de Contraturno não encontrado")
    return contraturno_helper(doc) 