import api from "./http";

export interface Atendimento {
  _id?: string;
  titulo: string;
  data: string; // ISO
  motivo: string;
  resultado?: string;
  responsavelColabId: string;
  documentoId?: string;
}

export async function listarAtendimentos(alunoId: string) {
  const { data } = await api.get<Atendimento[]>(`/alunos/${alunoId}/atendimentos`);
  return data;
}

export async function criarAtendimento(alunoId: string, payload: Atendimento) {
  const { data } = await api.post<Atendimento>(`/alunos/${alunoId}/atendimentos`, payload);
  return data;
}

export async function atualizarAtendimento(alunoId: string, atId: string, payload: Partial<Atendimento>) {
  const { data } = await api.put<Atendimento>(`/alunos/${alunoId}/atendimentos/${atId}`, payload);
  return data;
}

export async function deletarAtendimento(alunoId: string, atId: string) {
  await api.delete(`/alunos/${alunoId}/atendimentos/${atId}`);
} 