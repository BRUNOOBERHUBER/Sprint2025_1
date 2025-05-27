import api from "./http";

export interface Frequencia {
  _id?: string;
  ano: number;
  totalAulas: number;
  faltas: number;
  percentPresenca: number;
}

export async function listarFrequencias(alunoId: string) {
  const { data } = await api.get<Frequencia[]>(`/alunos/${alunoId}/frequencias`);
  return data;
}

export async function criarFrequencia(alunoId: string, payload: Frequencia) {
  const { data } = await api.post<Frequencia>(`/alunos/${alunoId}/frequencias`, payload);
  return data;
}

export async function atualizarFrequencia(alunoId: string, freqId: string, payload: Frequencia) {
  const { data } = await api.put<Frequencia>(`/alunos/${alunoId}/frequencias/${freqId}`, payload);
  return data;
}

export async function deletarFrequencia(alunoId: string, freqId: string) {
  await api.delete(`/alunos/${alunoId}/frequencias/${freqId}`);
} 