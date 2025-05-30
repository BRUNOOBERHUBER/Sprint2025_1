from flask import Blueprint, request, jsonify
from typing import List
from bson import ObjectId
from database import get_db
from utils import validar_token
from schemas import SaudeCreate, SaudeDB

router = Blueprint("saude", __name__)
COLLECTION = "saude"

def saude_helper(doc: dict) -> SaudeDB:
    doc["_id"] = str(doc["_id"])
    return SaudeDB(**doc)

@router.route("/alunos/<aluno_id>/saude", methods=["GET"])
@validar_token
def listar_saude(aluno_id: str):
    db = get_db()
    cursor = db[COLLECTION].find({"alunoId": aluno_id})
    docs = list(cursor)
    return jsonify([saude_helper(d).dict() for d in docs])

@router.route("/alunos/<aluno_id>/saude", methods=["POST"])
@validar_token
def criar_saude(aluno_id: str):
    data = request.get_json()
    saude = SaudeCreate(**data)
    saude.alunoId = aluno_id
    db = get_db()
    result = db[COLLECTION].insert_one(saude.dict())
    novo = db[COLLECTION].find_one({"_id": result.inserted_id})
    return jsonify(saude_helper(novo).dict()), 201

@router.route("/alunos/<aluno_id>/saude/<saude_id>", methods=["GET"])
@validar_token
def get_saude(aluno_id: str, saude_id: str):
    db = get_db()
    saude = db[COLLECTION].find_one({
        "_id": ObjectId(saude_id),
        "alunoId": aluno_id
    })
    if not saude:
        return jsonify({"detail": "Registro de saúde não encontrado"}), 404
    return jsonify(saude_helper(saude).dict())

@router.route("/alunos/<aluno_id>/saude/<saude_id>", methods=["DELETE"])
@validar_token
def deletar_saude(aluno_id: str, saude_id: str):
    db = get_db()
    result = db[COLLECTION].delete_one({
        "_id": ObjectId(saude_id),
        "alunoId": aluno_id
    })
    if result.deleted_count == 0:
        return jsonify({"detail": "Registro de saúde não encontrado"}), 404
    return "", 204 