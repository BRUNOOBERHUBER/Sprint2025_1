from typing import List, Optional, Dict
from pydantic import BaseModel, Field, EmailStr
from datetime import date, datetime


class ContatoResponsavel(BaseModel):
    nome: str
    fone: str
    email: Optional[EmailStr]


class DadosPessoais(BaseModel):
    enderecoCompleto: Optional[str] = None
    contatosPais: Optional[List[ContatoResponsavel]] = Field(default_factory=list)


class AlunoBase(BaseModel):
    nome: str
    sobrenome: str
    dataNascimento: datetime
    anoEscolar: str  # ex.: "5º Ano"
    endereco: str
    contatosResponsaveis: List[ContatoResponsavel] = Field(default_factory=list)
    fotoAlunoId: Optional[str] = None
    tagsAtencao: List[str] = Field(default_factory=list)
    matricula: Optional[str] = None
    ra: Optional[str] = None
    cpf: Optional[str] = None
    dadosPessoais: Optional[DadosPessoais] = None


class AlunoCreate(AlunoBase):
    dataNascimento: datetime


class AlunoUpdate(BaseModel):
    nome: Optional[str] = None
    sobrenome: Optional[str] = None
    dataNascimento: Optional[datetime] = None
    anoEscolar: Optional[str] = None
    endereco: Optional[str] = None
    contatosResponsaveis: Optional[List[ContatoResponsavel]] = None
    fotoAlunoId: Optional[str] = None
    tagsAtencao: Optional[List[str]] = None
    matricula: Optional[str] = None
    ra: Optional[str] = None
    cpf: Optional[str] = None
    dadosPessoais: Optional[DadosPessoais] = None


class AlunoDB(AlunoBase):
    idade: int
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True
        orm_mode = True


class LoginRequest(BaseModel):
    user: str
    passw: str


class TokenResponse(BaseModel):
    token: str


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3)
    password: str = Field(..., min_length=3)


class UserDB(BaseModel):
    id: str = Field(alias="_id")
    username: str
    password: str

    class Config:
        populate_by_name = True
        orm_mode = True


class DisciplinaNota(BaseModel):
    nome: str
    nota: float


class BoletimCreate(BaseModel):
    ano: int
    bimestre: int
    disciplinas: List[DisciplinaNota]

    @property
    def mediaGeral(self) -> float:
        if not self.disciplinas:
            return 0.0
        return sum(d.nota for d in self.disciplinas) / len(self.disciplinas)


class BoletimDB(BoletimCreate):
    id: str = Field(alias="_id")
    alunoId: str

    class Config:
        populate_by_name = True
        orm_mode = True


class BoletimUpdate(BaseModel):
    ano: Optional[int] = None
    bimestre: Optional[int] = None
    disciplinas: Optional[List[DisciplinaNota]] = None


# Modelos para Projetos de Contraturno
class ContraturnoBase(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    alunosInscritos: List[str] = Field(default_factory=list)
    professor: Optional[str] = None
    horario: Optional[str] = None
    vagas: Optional[int] = 0
    categoria: Optional[str] = None
    status: Optional[str] = "Ativo"


class ContraturnoCreate(ContraturnoBase):
    pass


class ContraturnoUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    alunosInscritos: Optional[List[str]] = None
    professor: Optional[str] = None
    horario: Optional[str] = None
    vagas: Optional[int] = None
    categoria: Optional[str] = None
    status: Optional[str] = None


class ContraturnoDB(ContraturnoBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True
        orm_mode = True


# Nova seção para Colaboradores
class ColaboradorBase(BaseModel):
    nome: str
    cargoFuncao: str
    email: EmailStr
    celular: str


class ColaboradorCreate(ColaboradorBase):
    pass


class ColaboradorUpdate(BaseModel):
    nome: Optional[str] = None
    cargoFuncao: Optional[str] = None
    email: Optional[EmailStr] = None
    celular: Optional[str] = None


class ColaboradorDB(ColaboradorBase):
    id: str = Field(alias="_id")
    criadoEm: Optional[datetime] = None

    class Config:
        populate_by_name = True
        orm_mode = True


class FrequenciaBase(BaseModel):
    ano: int
    totalAulas: int
    faltas: int
    percentPresenca: float
    # criadoEm: datetime = Field(default_factory=datetime.utcnow) # Removido conforme PRD


class FrequenciaCreate(FrequenciaBase):
    alunoId: str # Adicionado para criação
    criadoEm: datetime = Field(default_factory=datetime.utcnow) # Adicionado para criação


class FrequenciaUpdate(BaseModel):
    ano: Optional[int] = None
    totalAulas: Optional[int] = None
    faltas: Optional[int] = None
    percentPresenca: Optional[float] = None
    # Não permitir atualização de alunoId e criadoEm


class FrequenciaDB(FrequenciaBase):
    id: str = Field(alias="_id")
    alunoId: str
    criadoEm: datetime # Adicionado para exibição

    class Config:
        populate_by_name = True
        orm_mode = True


# NOVOS SCHEMAS DE SAÚDE (conforme PRD v1.2a)

class CondicaoSaude(BaseModel):
    nome: str
    status: str  # "confirmado", "controlada", "monitorada"
    descricao: str
    dataDiagnostico: Optional[datetime] = None
    profissionalSaude: Optional[str] = None
    crm: Optional[str] = None

class Medicacao(BaseModel):
    nome: str
    dosagem: Optional[str] = None
    frequencia: Optional[str] = None
    observacoes: Optional[str] = None
    autorizadoPor: Optional[str] = None # Nome de quem autorizou (ex: responsável, médico)

class ContatoEmergencia(BaseModel):
    nome: str
    telefone: str
    relacao: Optional[str] = None # Ex: "Mãe", "Pai", "Avó"

class SaudeBase(BaseModel):
    condicoesSaude: List[CondicaoSaude] = Field(default_factory=list)
    medicacoes: List[Medicacao] = Field(default_factory=list)
    alergias: List[str] = Field(default_factory=list)
    contatosEmergencia: List[ContatoEmergencia] = Field(default_factory=list)
    documentosIds: List[str] = Field(default_factory=list)
    # criadoEm e atualizadoEm serão gerenciados na criação/atualização

class SaudeCreate(SaudeBase):
    alunoId: str # Obrigatório na criação
    criadoEm: datetime = Field(default_factory=datetime.utcnow)
    atualizadoEm: datetime = Field(default_factory=datetime.utcnow)

class SaudeUpdate(BaseModel): # Permite atualização parcial dos campos
    condicoesSaude: Optional[List[CondicaoSaude]] = None
    medicacoes: Optional[List[Medicacao]] = None
    alergias: Optional[List[str]] = None
    contatosEmergencia: Optional[List[ContatoEmergencia]] = None
    documentosIds: Optional[List[str]] = None
    # atualizadoEm será definido na lógica da rota PUT

class SaudeDB(SaudeBase):
    id: str = Field(alias="_id")
    alunoId: str
    criadoEm: datetime
    atualizadoEm: datetime

    class Config:
        populate_by_name = True
        # orm_mode = True # orm_mode é para Pydantic v1. Para v2, use from_attributes = True
        from_attributes = True


class AtendimentoCreate(BaseModel):
    titulo: str
    data: date
    motivo: str
    resultado: Optional[str] = None
    responsavelColabId: str
    documentoId: Optional[str] = None


class AtendimentoUpdate(BaseModel):
    titulo: Optional[str] = None
    data: Optional[date] = None
    motivo: Optional[str] = None
    resultado: Optional[str] = None
    responsavelColabId: Optional[str] = None
    documentoId: Optional[str] = None


class AtendimentoDB(AtendimentoCreate):
    id: str = Field(alias="_id")
    alunoId: str

    class Config:
        populate_by_name = True
        orm_mode = True 