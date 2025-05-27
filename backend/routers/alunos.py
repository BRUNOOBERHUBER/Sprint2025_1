from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from backend.schemas import AlunoCreate, AlunoDB, AlunoUpdate
from backend.database import get_db
from backend.utils import validar_token
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import date

router = APIRouter(prefix="/alunos", tags=["alunos"], dependencies=[Depends(validar_token)])

COLLECTION = "alunos"


def aluno_helper(doc: dict) -> AlunoDB:
    doc["_id"] = str(doc["_id"])
    # calcula idade a partir da dataNascimento
    if isinstance(doc.get("dataNascimento"), (str,)):
        nascimento = date.fromisoformat(doc["dataNascimento"][:10])
    else:
        nascimento = doc.get("dataNascimento")
    hoje = date.today()
    idade = hoje.year - nascimento.year - ((hoje.month, hoje.day) < (nascimento.month, nascimento.day))
    doc["idade"] = idade
    return AlunoDB(**doc)


@router.get("/", response_model=List[AlunoDB])
async def listar_alunos(nome: Optional[str] = None, tag: Optional[str] = None, db: AsyncIOMotorDatabase = Depends(get_db)):
    filtro = {}
    if nome:
        filtro["nome"] = {"$regex": nome, "$options": "i"}
    if tag:
        filtro["tagsAtencao"] = tag
    cursor = db[COLLECTION].find(filtro)
    docs = await cursor.to_list(length=100)
    return [aluno_helper(d) for d in docs]


@router.post("/", response_model=AlunoDB, status_code=status.HTTP_201_CREATED)
async def criar_aluno(aluno: AlunoCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    payload = aluno.dict()
    payload["dataNascimento"] = aluno.dataNascimento.isoformat()
    result = await db[COLLECTION].insert_one(payload)
    novo = await db[COLLECTION].find_one({"_id": result.inserted_id})
    return aluno_helper(novo)


@router.get("/{id}", response_model=AlunoDB)
async def obter_aluno(id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    doc = await db[COLLECTION].find_one({"_id": ObjectId(id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return aluno_helper(doc)


@router.put("/{id}", response_model=AlunoDB)
async def atualizar_aluno(id: str, aluno: AlunoUpdate, db: AsyncIOMotorDatabase = Depends(get_db)):
    updates = {k: v for k, v in aluno.dict(exclude_unset=True).items()}
    if not updates:
        raise HTTPException(status_code=400, detail="Nenhum campo para atualizar")
    await db[COLLECTION].update_one({"_id": ObjectId(id)}, {"$set": updates})
    doc = await db[COLLECTION].find_one({"_id": ObjectId(id)})
    return aluno_helper(doc)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_aluno(id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    res = await db[COLLECTION].delete_one({"_id": ObjectId(id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Aluno não encontrado") 