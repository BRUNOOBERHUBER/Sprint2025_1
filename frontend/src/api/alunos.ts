import api from "./http";

export interface ContatoResponsavel {
  nome: string;
  fone: string;
  email?: string;
}

export interface Aluno {
  _id?: string;
  nome: string;
  sobrenome: string;
  dataNascimento: string; // ISO string
  anoEscolar: string;
  endereco: string;
  contatosResponsaveis: ContatoResponsavel[];
  fotoAlunoId?: string;
  tagsAtencao: string[];
  matricula?: string;
  ra?: string;
  cpf?: string;
  dadosPessoais?: {
    enderecoCompleto: string;
    contatosPais: ContatoResponsavel[];
  };
}

export type AlunoUpdate = Partial<Omit<Aluno, "_id">>;

export async function listarAlunos() {
  const { data } = await api.get<Aluno[]>("/alunos");
  return data;
}

export async function criarAluno(aluno: Aluno) {
  const { data } = await api.post<Aluno>("/alunos", aluno);
  return data;
}

export async function getAluno(id: string) {
  const { data } = await api.get<Aluno>(`/alunos/${id}`);
  return data;
}

export async function updateAluno(id: string, updates: AlunoUpdate) {
  const { data } = await api.put<Aluno>(`/alunos/${id}`, updates);
  return data;
}

export async function deleteAluno(id: string): Promise<void> {
  await api.delete(`/alunos/${id}`);
} 