from flask import Blueprint, request, jsonify
from typing import List
from bson import ObjectId
from pydantic import ValidationError
from datetime import datetime

from database import get_db
from utils import validar_token
from schemas import SaudeCreate, SaudeUpdate, SaudeDB

router = Blueprint("saude_alunos_bp", __name__)
COLLECTION = "saude_documentos"

def saude_helper(doc: dict) -> SaudeDB:
    doc["_id"] = str(doc["_id"])
    return SaudeDB(**doc)

@router.route("/alunos/<aluno_id>/saude", methods=["GET"])
@validar_token
def get_dados_saude_aluno(aluno_id: str):
    db = get_db()
    saude_doc_db = db[COLLECTION].find_one({"alunoId": aluno_id})
    if not saude_doc_db:
        return jsonify({"detail": "Dados de saúde não encontrados para este aluno."}), 404
    return jsonify(saude_helper(saude_doc_db).model_dump())

@router.route("/alunos/<aluno_id>/saude", methods=["POST"])
@validar_token
def criar_dados_saude_aluno(aluno_id: str):
    db = get_db()
    existente = db[COLLECTION].find_one({"alunoId": aluno_id})
    if existente:
        return jsonify({"detail": "Dados de saúde já existem para este aluno. Use PUT para atualizar."}), 409

    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({"detail": "Corpo da requisição inválido. Esperado um objeto JSON."}), 400

    data_com_aluno_id = {**data, "alunoId": aluno_id}
    
    try:
        saude_doc_pydantic = SaudeCreate(**data_com_aluno_id)
    except ValidationError as e:
        return jsonify({"detail": "Erro de validação nos dados de saúde.", "errors": e.errors()}), 422
    except Exception as e:
        print(f"[SAUDE POST Validação] Erro: {str(e)}")
        return jsonify({"detail": "Erro interno ao validar dados de saúde."}), 500

    try:
        dados_para_inserir = saude_doc_pydantic.model_dump()
        result = db[COLLECTION].insert_one(dados_para_inserir)
    except Exception as e:
        print(f"[SAUDE POST DB] Erro: {str(e)}")
        return jsonify({"detail": "Erro ao salvar dados de saúde no banco."}), 500
        
    novo_doc_db = db[COLLECTION].find_one({"_id": result.inserted_id})
    if not novo_doc_db:
        return jsonify({"detail": "Erro ao recuperar dados de saúde após criação."}), 500
    
    return jsonify(saude_helper(novo_doc_db).model_dump()), 201

@router.route("/alunos/<aluno_id>/saude", methods=["PUT"])
@validar_token
def atualizar_dados_saude_aluno(aluno_id: str):
    db = get_db()
    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({"detail": "Corpo da requisição inválido."}), 400

    try:
        saude_update_pydantic = SaudeUpdate(**data)
    except ValidationError as e:
        return jsonify({"detail": "Erro de validação nos dados de saúde para atualização.", "errors": e.errors()}), 422
    
    update_fields = saude_update_pydantic.model_dump(exclude_unset=True)
    if not update_fields:
        return jsonify({"detail": "Nenhum dado válido fornecido para atualização."}), 400
    
    update_fields["atualizadoEm"] = datetime.utcnow()

    result = db[COLLECTION].update_one(
        {"alunoId": aluno_id},
        {"$set": update_fields}
    )

    if result.matched_count == 0:
        return jsonify({"detail": "Dados de saúde não encontrados para este aluno. Use POST para criar primeiro."}), 404
    
    updated_doc_db = db[COLLECTION].find_one({"alunoId": aluno_id})
    if not updated_doc_db:
         return jsonify({"detail": "Erro ao recuperar dados de saúde após atualização."}), 500
    return jsonify(saude_helper(updated_doc_db).model_dump()), 200

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