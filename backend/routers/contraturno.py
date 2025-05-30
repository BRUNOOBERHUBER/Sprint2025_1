from flask import Blueprint, request, jsonify
from typing import List, Optional
from schemas import ContraturnoCreate, ContraturnoDB, ContraturnoUpdate
from database import get_db
from utils import validar_token
from bson import ObjectId

router = Blueprint("contraturno", __name__)
COLLECTION = "contraturno"

def contraturno_helper(doc: dict) -> ContraturnoDB:
    doc["_id"] = str(doc["_id"])
    return ContraturnoDB(**doc)

@router.route("/", methods=["GET"])
@validar_token
def listar_contraturno():
    db = get_db()
    cursor = db[COLLECTION].find()
    docs = list(cursor)
    return jsonify([contraturno_helper(d).model_dump() for d in docs])

@router.route("/", methods=["POST"])
@validar_token
def criar_contraturno():
    data = request.get_json()
    contraturno = ContraturnoCreate(**data)
    db = get_db()
    result = db[COLLECTION].insert_one(contraturno.model_dump())
    novo = db[COLLECTION].find_one({"_id": result.inserted_id})
    return jsonify(contraturno_helper(novo).model_dump()), 201

@router.route("/<contraturno_id>", methods=["GET"])
@validar_token
def get_contraturno(contraturno_id: str):
    db = get_db()
    contraturno = db[COLLECTION].find_one({"_id": ObjectId(contraturno_id)})
    if not contraturno:
        return jsonify({"detail": "Contraturno não encontrado"}), 404
    return jsonify(contraturno_helper(contraturno).model_dump())

@router.route("/<contraturno_id>", methods=["PUT"])
@validar_token
def atualizar_contraturno(contraturno_id: str):
    data = request.get_json()
    contraturno = ContraturnoUpdate(**data)
    db = get_db()
    result = db[COLLECTION].update_one(
        {"_id": ObjectId(contraturno_id)},
        {"$set": contraturno.model_dump(exclude_unset=True)}
    )
    if result.matched_count == 0:
        return jsonify({"detail": "Contraturno não encontrado"}), 404
    atualizado = db[COLLECTION].find_one({"_id": ObjectId(contraturno_id)})
    return jsonify(contraturno_helper(atualizado).model_dump())

@router.route("/<contraturno_id>", methods=["DELETE"])
@validar_token
def deletar_contraturno(contraturno_id: str):
    db = get_db()
    result = db[COLLECTION].delete_one({"_id": ObjectId(contraturno_id)})
    if result.deleted_count == 0:
        return jsonify({"detail": "Contraturno não encontrado"}), 404
    return "", 204

@router.route("/<contraturno_id>/inscricoes", methods=["POST"])
@validar_token
def inscrever_aluno(contraturno_id: str):
    data = request.get_json()
    aluno_id = data.get("alunoId")
    if not aluno_id:
        return jsonify({"detail": "ID do aluno é obrigatório"}), 400
    db = get_db()
    result = db[COLLECTION].update_one(
        {"_id": ObjectId(contraturno_id)},
        {"$addToSet": {"alunosInscritos": aluno_id}}
    )
    if result.matched_count == 0:
        return jsonify({"detail": "Contraturno não encontrado"}), 404
    atualizado = db[COLLECTION].find_one({"_id": ObjectId(contraturno_id)})
    return jsonify(contraturno_helper(atualizado).model_dump())

@router.route("/<contraturno_id>/inscricoes/<aluno_id>", methods=["DELETE"])
@validar_token
def cancelar_inscricao(contraturno_id: str, aluno_id: str):
    db = get_db()
    result = db[COLLECTION].update_one(
        {"_id": ObjectId(contraturno_id)},
        {"$pull": {"alunosInscritos": aluno_id}}
    )
    if result.matched_count == 0:
        return jsonify({"detail": "Contraturno não encontrado"}), 404
    atualizado = db[COLLECTION].find_one({"_id": ObjectId(contraturno_id)})
    return jsonify(contraturno_helper(atualizado).model_dump()) 