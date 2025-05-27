import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listarAlunos, Aluno, deleteAluno } from "../../api/alunos";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "../../components/ui/table";
import { User, Plus, Search, Eye, Edit, GraduationCap, Users, AlertTriangle, Star } from "lucide-react";

export default function AlunoListPage() {
  const { data: students = [], isLoading } = useQuery({ queryKey: ["alunos"], queryFn: listarAlunos });
  const [searchTerm, setSearchTerm] = useState("");
  const [studentToDelete, setStudentToDelete] = useState<Aluno | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAluno(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["alunos"]);
      setStudentToDelete(null);
      setDeleteConfirmationText("");
    },
    onError: (error: any) => {
      alert("Erro ao excluir aluno: " + error);
    },
  });

  const filteredStudents = students.filter(
    (student) =>
      student.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.sobrenome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricula.includes(searchTerm) ||
      student.anoEscolar.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const calculateAge = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  const getTagColor = (tag: string) => {
    if (tag.toLowerCase().includes("problema")) {
      return "bg-red-100 text-red-800 border-red-200";
    }
    switch (tag) {
      case "Necessita Atenção":
        return "bg-red-100 text-red-800 border-red-200";
      case "Destaque Acadêmico":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  const getTagIcon = (tag: string) => {
    if (tag.toLowerCase().includes("problema")) {
      return <AlertTriangle className="w-3 h-3" />;
    }
    switch (tag) {
      case "Necessita Atenção":
        return <AlertTriangle className="w-3 h-3" />;
      case "Destaque Acadêmico":
        return <Star className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark flex items-center gap-2">
            <GraduationCap className="w-8 h-8" /> Alunos
          </h1>
          <p className="text-gray-600 mt-1">Gerencie os alunos cadastrados no sistema</p>
        </div>
        <Link to="/alunos/novo">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="w-4 h-4 mr-2" /> Novo Aluno
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-secondary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Alunos</p>
                <p className="text-2xl font-bold text-primary-dark">{students.length}</p>
              </div>
              <Users className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-secondary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Com Atenção Especial</p>
                <p className="text-2xl font-bold text-primary-dark">
                  {students.filter((s) => s.tagsAtencao.length > 0).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-secondary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Destaques Acadêmicos</p>
                <p className="text-2xl font-bold text-primary-dark">
                  {students.filter((s) => s.tagsAtencao.includes("Destaque Acadêmico")).length}
                </p>
              </div>
              <Star className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-2 border-secondary">
        <CardContent className="p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome, sobrenome, matrícula ou ano escolar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-accent focus:ring-accent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="border-2 border-secondary">
        <CardHeader>
          <CardTitle className="text-primary-dark">Lista de Alunos ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Ano Escolar</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student._id} className="hover:bg-secondary/20">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-dark" />
                        </div>
                        <div>
                          <p className="font-medium text-primary-dark">
                            {student.nome} {student.sobrenome}
                          </p>
                          <p className="text-sm text-gray-500">{student.contatosResponsaveis[0]?.nome}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-primary hover:bg-primary/90 text-white">{student.anoEscolar}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{student.matricula}</TableCell>
                    <TableCell>{calculateAge(student.dataNascimento)} anos</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {student.tagsAtencao.length > 0 ? (
                          student.tagsAtencao.map((tag, index) => (
                            <Badge key={index} variant="outline" className={`text-xs ${getTagColor(tag)}`}>
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800 border-gray-200">Regular</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-3">
                        <Link to={`/alunos/${student._id}`}>
                          <Eye className="w-4 h-4 text-gray-600 hover:text-gray-800" />
                        </Link>
                        <Link to={`/alunos/${student._id}`} state={{ edit: true }}>
                          <Edit className="w-4 h-4 text-gray-600 hover:text-gray-800" />
                        </Link>
                        <AlertTriangle
                          className="w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800"
                          onClick={() => setStudentToDelete(student)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {studentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirmar exclusão</h2>
            <p>Digite o nome completo do aluno <strong>{studentToDelete.nome} {studentToDelete.sobrenome}</strong> para confirmar:</p>
            <input
              type="text"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              className="border rounded w-full p-2 my-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => {
                  setStudentToDelete(null);
                  setDeleteConfirmationText("");
                }}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
                onClick={() => deleteMutation.mutate(studentToDelete._id!)}
                disabled={deleteConfirmationText !== `${studentToDelete.nome} ${studentToDelete.sobrenome}`}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 