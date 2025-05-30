from flask import Blueprint, request, jsonify
from typing import List
from datetime import datetime
from bson import ObjectId
from database import get_db
from utils import validar_token
from schemas import ColaboradorCreate, ColaboradorDB, ColaboradorUpdate

router = Blueprint("colaboradores", __name__)
COLLECTION = "colaboradores"

def colaborador_helper(doc: dict) -> ColaboradorDB:
    doc["_id"] = str(doc["_id"])
    return ColaboradorDB(**doc)

@router.route("/", methods=["GET"])
@validar_token
def listar_colaboradores():
    db = get_db()
    cursor = db[COLLECTION].find()
    docs = list(cursor)
    return jsonify([colaborador_helper(d).dict() for d in docs])

@router.route("/", methods=["POST"])
@validar_token
def criar_colaborador():
    data = request.get_json()
    colaborador = ColaboradorCreate(**data)
    db = get_db()
    result = db[COLLECTION].insert_one(colaborador.dict())
    novo = db[COLLECTION].find_one({"_id": result.inserted_id})
    return jsonify(colaborador_helper(novo).dict()), 201

@router.route("/<colaborador_id>", methods=["GET"])
@validar_token
def get_colaborador(colaborador_id: str):
    db = get_db()
    colaborador = db[COLLECTION].find_one({"_id": ObjectId(colaborador_id)})
    if not colaborador:
        return jsonify({"detail": "Colaborador não encontrado"}), 404
    return jsonify(colaborador_helper(colaborador).dict())

@router.route("/<colaborador_id>", methods=["PUT"])
@validar_token
def atualizar_colaborador(colaborador_id: str):
    data = request.get_json()
    colaborador = ColaboradorUpdate(**data)
    db = get_db()
    result = db[COLLECTION].update_one(
        {"_id": ObjectId(colaborador_id)},
        {"$set": colaborador.dict(exclude_unset=True)}
    )
    if result.matched_count == 0:
        return jsonify({"detail": "Colaborador não encontrado"}), 404
    atualizado = db[COLLECTION].find_one({"_id": ObjectId(colaborador_id)})
    return jsonify(colaborador_helper(atualizado).dict())

@router.route("/<colaborador_id>", methods=["DELETE"])
@validar_token
def deletar_colaborador(colaborador_id: str):
    db = get_db()
    result = db[COLLECTION].delete_one({"_id": ObjectId(colaborador_id)})
    if result.deleted_count == 0:
        return jsonify({"detail": "Colaborador não encontrado"}), 404
    return "", 204 