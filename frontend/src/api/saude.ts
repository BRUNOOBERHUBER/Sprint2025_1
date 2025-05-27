import api from "./http";

export interface Saude {
  _id?: string;
  tipo: string;
  descricao: string;
  dataLaudo?: string;
  documentosIds?: string[];
}

export async function listarSaude(alunoId: string) {
  const { data } = await api.get<Saude[]>(`/alunos/${alunoId}/saude`);
  return data;
}

export async function criarSaude(alunoId: string, payload: Saude) {
  const { data } = await api.post<Saude>(`/alunos/${alunoId}/saude`, payload);
  return data;
}

export async function deletarSaude(alunoId: string, saudeId: string) {
  await api.delete(`/alunos/${alunoId}/saude/${saudeId}`);
} 