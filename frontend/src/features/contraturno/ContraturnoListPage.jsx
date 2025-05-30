import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listarContraturnos, deletarContraturno } from "../../api/contraturno";
import { Card, CardHeader, CardContent, CardTitle } from "../../components/ui/card";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { Trash2, Edit, Eye } from "lucide-react";

export default function ContraturnoListPage() {
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading } = useQuery({ queryKey: ["contraturno"], queryFn: listarContraturnos });
  const deleteMutation = useMutation({
    mutationFn: (id) => deletarContraturno(id),
    onSuccess: () => queryClient.invalidateQueries(["contraturno"]),
  });
  const [toDelete, setToDelete] = useState(null);

  if (isLoading) return <p>Carregando projetos...</p>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary-dark">Projetos de Contraturno</h1>
        <Link to="/contraturno/novo">
          <Button className="bg-primary text-white">Novo Projeto</Button>
        </Link>
      </div>
      <Card className="border-2 border-secondary">
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Inscritos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((p) => (
                  <TableRow key={p._id} className="hover:bg-secondary/20">
                    <TableCell>{p.titulo}</TableCell>
                    <TableCell>{p.descricao}</TableCell>
                    <TableCell>{p.alunosInscritos.length}</TableCell>
                    <TableCell className="text-right flex justify-end space-x-3">
                      <Link to={`/contraturno/${p._id}`}>
                        <Eye className="w-4 h-4 text-gray-600 hover:text-gray-800" />
                      </Link>
                      <Link to={`/contraturno/${p._id}/edit`}>
                        <Edit className="w-4 h-4 text-gray-600 hover:text-gray-800" />
                      </Link>
                      <Trash2
                        className="w-4 h-4 text-gray-600 cursor-pointer hover:text-red-600"
                        onClick={() => setToDelete(p._id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {toDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirmar exclusão</h2>
            <p>Tem certeza que deseja excluir este projeto?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setToDelete(null)}>
                Cancelar
              </Button>
              <Button
                className="bg-red-600 text-white"
                onClick={() => {
                  deleteMutation.mutate(toDelete);
                  setToDelete(null);
                }}
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