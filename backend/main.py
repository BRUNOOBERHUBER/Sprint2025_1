from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import auth, alunos, boletins, contraturno, colaboradores
from backend.routers.dashboard import router as dashboard_router
from backend.routers.frequencias import router as freq_router
from backend.routers.saude import router as saude_router
from backend.routers.atendimentos import router as at_router

app = FastAPI(title="Portfólio Escolar Digital – EMEF Gonzaguinha")

# CORS simples para facilitar testes locais
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(alunos.router, prefix="/api")
app.include_router(boletins.router, prefix="/api")
app.include_router(contraturno.router, prefix="/api")
app.include_router(colaboradores.router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(freq_router, prefix="/api")
app.include_router(saude_router, prefix="/api")
app.include_router(at_router, prefix="/api")


@app.get("/", tags=["root"])
async def root():
    return {"msg": "API do Portfólio Escolar Digital – EMEF"} 