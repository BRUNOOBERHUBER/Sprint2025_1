import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../../components/ui/table";
import { listarBoletins, criarBoletim, atualizarBoletim, deletarBoletim, Boletim } from "../../../api/boletins";

export default function BoletinsTab() {
  const { id: alunoId } = useParams();
  const queryClient = useQueryClient();

  const { data: boletins = [], isLoading } = useQuery(
    ["boletins", alunoId],
    () => listarBoletins(alunoId!),
    { enabled: !!alunoId }
  );

  const createMutation = useMutation((b: Boletim) => criarBoletim(alunoId!, b), {
    onSuccess: () => {
      queryClient.invalidateQueries(["boletins", alunoId]);
      setShowForm(false);
      resetForm();
    },
  });
  const updateMutation = useMutation(
    (b: Boletim) => atualizarBoletim(alunoId!, b._id!, b),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["boletins", alunoId]);
        setShowForm(false);
        resetForm();
      },
    }
  );
  const deleteMutation = useMutation(
    (boletimId: string) => deletarBoletim(alunoId!, boletimId),
    {
      onSuccess: () => queryClient.invalidateQueries(["boletins", alunoId]),
    }
  );

  const [showForm, setShowForm] = useState(false);
  const [editingBoletim, setEditingBoletim] = useState<Boletim | null>(null);
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [bimestre, setBimestre] = useState<number>(1);
  const [nota, setNota] = useState<number>(0);

  const openNew = () => {
    setEditingBoletim(null);
    setAno(new Date().getFullYear());
    setBimestre(1);
    setNota(0);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    const boletimData: Boletim = { _id: editingBoletim?._id, ano, bimestre, disciplinas: [{ nome: "Disciplina", nota }] };
    if (editingBoletim) {
      await updateMutation.mutateAsync(boletimData);
    } else {
      await createMutation.mutateAsync(boletimData);
    }
  };

  const handleEdit = (b: Boletim) => {
    setEditingBoletim(b);
    setAno(b.ano);
    setBimestre(b.bimestre);
    setNota(b.disciplinas[0]?.nota || 0);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Excluir boletim?")) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setEditingBoletim(null);
    setAno(new Date().getFullYear());
    setBimestre(1);
    setNota(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <CardTitle className="text-xl">Boletins</CardTitle>
        <Button onClick={openNew} className="bg-primary hover:bg-primary/90 text-white">
        Adicionar Boletim
        </Button>
      </div>
      <Card className="border-secondary">
        <CardHeader>
          <CardTitle>Lista de Boletins</CardTitle>
        </CardHeader>
        <CardContent>
      {isLoading ? (
        <p>Carregando...</p>
          ) : boletins.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ano</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Nota</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boletins.map((b) => (
                  <TableRow key={b._id} className="hover:bg-secondary/10">
                    <TableCell>{b.ano}</TableCell>
                    <TableCell>{b.bimestre}º</TableCell>
                    <TableCell>{b.mediaGeral?.toFixed(1)}</TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(b)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDelete(b._id!)}>
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
          ))}
              </TableBody>
            </Table>
          ) : (
            <p>Nenhum boletim cadastrado.</p>
      )}
        </CardContent>
      </Card>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingBoletim ? "Editar Boletim" : "Novo Boletim"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 mb-1">Ano</label>
                <Input type="number" value={ano} onChange={(e) => setAno(+e.target.value)} />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Período (Bimestre)</label>
                <Input type="number" value={bimestre} onChange={(e) => setBimestre(+e.target.value)} />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Nota</label>
                <Input type="number" step="0.1" value={nota} onChange={(e) => setNota(+e.target.value)} />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} className="bg-primary text-white">
                {editingBoletim ? "Atualizar" : "Salvar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 