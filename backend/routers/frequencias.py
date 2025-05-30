from flask import Blueprint, request, jsonify
from typing import List
from bson import ObjectId
from database import get_db
from utils import validar_token
from schemas import FrequenciaCreate, FrequenciaDB

router = Blueprint("frequencias", __name__)
COLLECTION = "frequencias"

def freq_helper(doc: dict) -> FrequenciaDB:
    doc["_id"] = str(doc["_id"])
    return FrequenciaDB(**doc)

@router.route("/alunos/<aluno_id>/frequencias", methods=["GET"])
@validar_token
def listar_frequencias(aluno_id: str):
    db = get_db()
    cursor = db[COLLECTION].find({"alunoId": aluno_id})
    docs = list(cursor)
    return jsonify([freq_helper(d).dict() for d in docs])

@router.route("/alunos/<aluno_id>/frequencias", methods=["POST"])
@validar_token
def criar_frequencia(aluno_id: str):
    data = request.get_json()
    frequencia = FrequenciaCreate(**data)
    frequencia.alunoId = aluno_id
    db = get_db()
    result = db[COLLECTION].insert_one(frequencia.dict())
    novo = db[COLLECTION].find_one({"_id": result.inserted_id})
    return jsonify(freq_helper(novo).dict()), 201

@router.route("/alunos/<aluno_id>/frequencias/<freq_id>", methods=["GET"])
@validar_token
def get_frequencia(aluno_id: str, freq_id: str):
    db = get_db()
    frequencia = db[COLLECTION].find_one({
        "_id": ObjectId(freq_id),
        "alunoId": aluno_id
    })
    if not frequencia:
        return jsonify({"detail": "Frequência não encontrada"}), 404
    return jsonify(freq_helper(frequencia).dict())

@router.route("/alunos/<aluno_id>/frequencias/<freq_id>", methods=["DELETE"])
@validar_token
def deletar_frequencia(aluno_id: str, freq_id: str):
    db = get_db()
    result = db[COLLECTION].delete_one({
        "_id": ObjectId(freq_id),
        "alunoId": aluno_id
    })
    if result.deleted_count == 0:
        return jsonify({"detail": "Frequência não encontrada"}), 404
    return "", 204 