from flask import Blueprint, request, jsonify
from typing import List
from bson import ObjectId
from database import get_db
from utils import validar_token
from schemas import AtendimentoCreate, AtendimentoUpdate, AtendimentoDB

router = Blueprint("atendimentos", __name__)
COLLECTION = "atendimentos"

def at_helper(doc: dict) -> AtendimentoDB:
    doc["_id"] = str(doc["_id"])
    return AtendimentoDB(**doc)

@router.route("/alunos/<aluno_id>/atendimentos", methods=["GET"])
@validar_token
def listar_atendimentos(aluno_id: str):
    db = get_db()
    cursor = db[COLLECTION].find({"alunoId": aluno_id})
    docs = list(cursor)
    return jsonify([at_helper(d).dict() for d in docs])

@router.route("/alunos/<aluno_id>/atendimentos", methods=["POST"])
@validar_token
def criar_atendimento(aluno_id: str):
    data = request.get_json()
    atendimento = AtendimentoCreate(**data)
    atendimento.alunoId = aluno_id
    db = get_db()
    result = db[COLLECTION].insert_one(atendimento.dict())
    novo = db[COLLECTION].find_one({"_id": result.inserted_id})
    return jsonify(at_helper(novo).dict()), 201

@router.route("/alunos/<aluno_id>/atendimentos/<atendimento_id>", methods=["GET"])
@validar_token
def get_atendimento(aluno_id: str, atendimento_id: str):
    db = get_db()
    atendimento = db[COLLECTION].find_one({
        "_id": ObjectId(atendimento_id),
        "alunoId": aluno_id
    })
    if not atendimento:
        return jsonify({"detail": "Atendimento não encontrado"}), 404
    return jsonify(at_helper(atendimento).dict())

@router.route("/alunos/<aluno_id>/atendimentos/<atendimento_id>", methods=["PUT"])
@validar_token
def atualizar_atendimento(aluno_id: str, atendimento_id: str):
    data = request.get_json()
    atendimento = AtendimentoUpdate(**data)
    db = get_db()
    result = db[COLLECTION].update_one(
        {"_id": ObjectId(atendimento_id), "alunoId": aluno_id},
        {"$set": atendimento.dict(exclude_unset=True)}
    )
    if result.matched_count == 0:
        return jsonify({"detail": "Atendimento não encontrado"}), 404
    atualizado = db[COLLECTION].find_one({"_id": ObjectId(atendimento_id)})
    return jsonify(at_helper(atualizado).dict())

@router.route("/alunos/<aluno_id>/atendimentos/<atendimento_id>", methods=["DELETE"])
@validar_token
def deletar_atendimento(aluno_id: str, atendimento_id: str):
    db = get_db()
    result = db[COLLECTION].delete_one({
        "_id": ObjectId(atendimento_id),
        "alunoId": aluno_id
    })
    if result.deleted_count == 0:
        return jsonify({"detail": "Atendimento não encontrado"}), 404
    return "", 204 