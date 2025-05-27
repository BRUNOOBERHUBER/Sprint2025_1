from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.database import get_db
from backend.utils import validar_token
from backend.schemas import ColaboradorCreate, ColaboradorDB, ColaboradorUpdate

router = APIRouter(
    prefix="/colaboradores",
    tags=["colaboradores"],
    dependencies=[Depends(validar_token)],
)

COLLECTION = "colaboradores"

def colaborador_helper(doc: dict) -> ColaboradorDB:
    doc["_id"] = str(doc["_id"])
    return ColaboradorDB(**doc)

@router.get("/", response_model=List[ColaboradorDB])
async def listar_colaboradores(db: AsyncIOMotorDatabase = Depends(get_db)):
    docs = await db[COLLECTION].find().to_list(length=100)
    return [colaborador_helper(d) for d in docs]

@router.post("/", response_model=ColaboradorDB, status_code=status.HTTP_201_CREATED)
async def criar_colaborador(
    colaborador: ColaboradorCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    data = colaborador.dict()
    data["criadoEm"] = datetime.utcnow()
    result = await db[COLLECTION].insert_one(data)
    novo = await db[COLLECTION].find_one({"_id": result.inserted_id})
    return colaborador_helper(novo)

@router.get("/{id}", response_model=ColaboradorDB)
async def obter_colaborador(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    try:
        doc = await db[COLLECTION].find_one({"_id": ObjectId(id)})
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID inválido")
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Colaborador não encontrado")
    return colaborador_helper(doc)

@router.put("/{id}", response_model=ColaboradorDB)
async def atualizar_colaborador(
    id: str,
    colaborador: ColaboradorUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    updates = {k: v for k, v in colaborador.dict(exclude_unset=True).items()}
    if not updates:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Nenhum campo para atualizar")
    await db[COLLECTION].update_one({"_id": ObjectId(id)}, {"$set": updates})
    doc = await db[COLLECTION].find_one({"_id": ObjectId(id)})
    return colaborador_helper(doc)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_colaborador(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    res = await db[COLLECTION].delete_one({"_id": ObjectId(id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Colaborador não encontrado") 