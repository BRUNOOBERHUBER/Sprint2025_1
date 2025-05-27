import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getContraturno, deleteContraturno, Contraturno } from "../../api/contraturno";
import { listarAlunos, Aluno } from "../../api/alunos";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export default function ContraturnoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: projeto, isLoading } = useQuery<Contraturno>(
    ["contraturno", id],
    () => getContraturno(id!),
    { enabled: !!id }
  );
  const { data: allAlunos = [] } = useQuery<Aluno[]>(
    ["alunos"],
    listarAlunos
  );

  const [toDelete, setToDelete] = useState<Contraturno | null>(null);
  const [confirmText, setConfirmText] = useState("");

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteContraturno(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["contraturno"]);
      navigate("/contraturno");
    },
  });

  if (isLoading || !projeto) return <p>Carregando...</p>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary-dark">Detalhes do Projeto</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate(`/contraturno/${id}/edit`)}>
            Editar
          </Button>
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700"
            onClick={() => setToDelete(projeto)}
          >
            Excluir
          </Button>
        </div>
      </div>

      <Card className="border-secondary">
        <CardHeader>
          <CardTitle className="text-primary-dark">Informações Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Título:</strong> {projeto.titulo}</p>
          <p><strong>Descrição:</strong> {projeto.descricao || '—'}</p>
          <p><strong>Professor:</strong> {projeto.professor}</p>
          <p><strong>Horário:</strong> {projeto.horario}</p>
          <p><strong>Vagas:</strong> {projeto.vagas}</p>
          <p><strong>Categoria:</strong> {projeto.categoria}</p>
          <p><strong>Status:</strong> {projeto.status}</p>
        </CardContent>
      </Card>

      <Card className="border-secondary">
        <CardHeader>
          <CardTitle className="text-primary-dark">Alunos Inscritos</CardTitle>
        </CardHeader>
        <CardContent>
          {projeto.alunosInscritos.length === 0 ? (
            <p>Nenhum aluno inscrito.</p>
          ) : (
            <ul className="list-disc pl-5">
              {projeto.alunosInscritos.map((aid) => {
                const a = allAlunos.find((al) => al._id === aid);
                return <li key={aid}>{a ? `${a.nome} ${a.sobrenome}` : aid}</li>;
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {toDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Confirmar exclusão</h3>
            <p>Digite o título do projeto <strong>{toDelete.titulo}</strong> para confirmar:</p>
            <Input
              className="my-4"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => { setToDelete(null); setConfirmText(""); }}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                disabled={confirmText !== toDelete.titulo}
                onClick={() => deleteMutation.mutate(toDelete._id!)}
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 