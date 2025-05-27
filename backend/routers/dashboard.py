from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.database import get_db
from backend.utils import validar_token

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"],
    dependencies=[Depends(validar_token)],
)

@router.get("/stats")
async def get_dashboard_stats(db: AsyncIOMotorDatabase = Depends(get_db)):
    # Contagem de alunos
    total_alunos = await db["alunos"].count_documents({})
    # Contagem de colaboradores
    total_colaboradores = await db["colaboradores"].count_documents({})
    # Alunos com tags de atenção
    alunos_com_atencao = await db["alunos"].count_documents({"tagsAtencao": {"$exists": True, "$ne": []}})
    # Atendimentos deste mês (caso a coleção exista)
    try:
        total_atendimentos_mes = await db["atendimentos"].count_documents({})
    except Exception:
        total_atendimentos_mes = 0
    return {
        "totalAlunos": total_alunos,
        "totalColaboradores": total_colaboradores,
        "alunosComAtencao": alunos_com_atencao,
        "atendimentosMes": total_atendimentos_mes,
    } 