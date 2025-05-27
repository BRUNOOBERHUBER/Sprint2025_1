import api from "./http";

export interface Contraturno {
  _id?: string;
  titulo: string;
  descricao?: string;
  alunosInscritos: string[];
  professor: string;
  horario: string;
  vagas: number;
  categoria: string;
  status: string;
}

export interface ContraturnoCreate {
  titulo: string;
  descricao?: string;
  alunosInscritos: string[];
  professor: string;
  horario: string;
  vagas: number;
  categoria: string;
  status: string;
}

export type ContraturnoUpdate = Partial<ContraturnoCreate>;

export async function listarContraturno() {
  const { data } = await api.get<Contraturno[]>("/contraturno");
  return data;
}

export async function criarContraturno(payload: ContraturnoCreate) {
  const { data } = await api.post<Contraturno>("/contraturno", payload);
  return data;
}

export async function getContraturno(id: string) {
  const { data } = await api.get<Contraturno>(`/contraturno/${id}`);
  return data;
}

export async function updateContraturno(id: string, updates: ContraturnoUpdate) {
  const { data } = await api.put<Contraturno>(`/contraturno/${id}`, updates);
  return data;
}

export async function deleteContraturno(id: string) {
  await api.delete(`/contraturno/${id}`);
} 