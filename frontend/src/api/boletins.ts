import api from "./http";

export interface DisciplinaNota {
  nome: string;
  nota: number;
}

export interface Boletim {
  _id?: string;
  ano: number;
  bimestre: number;
  disciplinas: DisciplinaNota[];
  mediaGeral?: number;
}

export async function listarBoletins(alunoId: string) {
  const { data } = await api.get<Boletim[]>(`/alunos/${alunoId}/boletins`);
  return data;
}

export async function criarBoletim(alunoId: string, boletim: Boletim) {
  const { data } = await api.post<Boletim>(`/alunos/${alunoId}/boletins`, boletim);
  return data;
}

export async function atualizarBoletim(alunoId: string, boletimId: string, boletim: Boletim) {
  const { data } = await api.put<Boletim>(`/alunos/${alunoId}/boletins/${boletimId}`, boletim);
  return data;
}

export async function deletarBoletim(alunoId: string, boletimId: string) {
  await api.delete(`/alunos/${alunoId}/boletins/${boletimId}`);
} 