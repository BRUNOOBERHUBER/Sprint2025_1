import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listarColaboradores,
  criarColaborador,
  updateColaborador,
  deleteColaborador,
  Colaborador,
  ColaboradorCreate,
  ColaboradorUpdate,
} from "../../api/colaboradores";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
} from "lucide-react";

export default function ColaboradoresPage() {
  const queryClient = useQueryClient();
  const { data: colaboradores = [], isLoading } = useQuery<Colaborador[]>({
    queryKey: ["colaboradores"],
    queryFn: listarColaboradores,
  });

  const [filtered, setFiltered] = useState<Colaborador[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Colaborador | null>(null);
  const [formData, setFormData] = useState<ColaboradorCreate>({
    nome: "",
    cargoFuncao: "",
    email: "",
    celular: "",
  });
  // Estado para popup de exclusão de colaborador
  const [colabToDelete, setColabToDelete] = useState<Colaborador | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: ColaboradorCreate) => criarColaborador(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["colaboradores"]);
      setIsModalOpen(false);
    },
  });
  const updateMutation = useMutation({
    mutationFn: (data: { id: string; updates: ColaboradorUpdate }) =>
      updateColaborador(data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries(["colaboradores"]);
      setIsModalOpen(false);
      setEditing(null);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteColaborador(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["colaboradores"]);
      setColabToDelete(null);
      setDeleteConfirmationText("");
    },
  });

  useEffect(() => {
    setFiltered(
      colaboradores.filter((c) =>
        c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cargoFuncao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, colaboradores]);

  const openNew = () => {
    setEditing(null);
    setFormData({ nome: "", cargoFuncao: "", email: "", celular: "" });
    setIsModalOpen(true);
  };

  const openEdit = (col: Colaborador) => {
    setEditing(col);
    setFormData({
      nome: col.nome,
      cargoFuncao: col.cargoFuncao,
      email: col.email,
      celular: col.celular,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const col = colaboradores.find((c) => c._id === id);
    if (col) setColabToDelete(col);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ id: editing._id, updates: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) return <p>Carregando colaboradores...</p>;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-primary-dark">
          Colaboradores
        </h2>
        <Button variant="primary" onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Novo
        </Button>
      </div>
      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-gray-500" />
        <Input
          placeholder="Buscar por nome, cargo ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      {/* Table */}
      <Card className="border-secondary">
        <CardHeader>
          <CardTitle className="text-primary-dark">
            Lista de Colaboradores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cargo/Função</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Data Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((col) => (
                <TableRow key={col._id} className="hover:bg-secondary/20">
                  <TableCell>{col.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-accent text-primary-dk">
                      {col.cargoFuncao}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-700">
                        <Mail className="h-4 w-4 mr-1" />
                        {col.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <Phone className="h-4 w-4 mr-1" />
                        {col.celular}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {new Date(col.criadoEm).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(col)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(col._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editing ? "Editar Colaborador" : "Novo Colaborador"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nome</label>
                <Input
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Cargo/Função</label>
                <Input
                  required
                  value={formData.cargoFuncao}
                  onChange={(e) => setFormData({ ...formData, cargoFuncao: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medim">Email</label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Celular</label>
                <Input
                  required
                  value={formData.celular}
                  onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => { setIsModalOpen(false); setEditing(null); }}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit">
                  {editing ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Popup de exclusão de colaborador */}
      {colabToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Confirmar exclusão</h3>
            <p>Digite o nome do colaborador <strong>{colabToDelete.nome}</strong> para confirmar:</p>
            <Input
              className="my-4"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => { setColabToDelete(null); setDeleteConfirmationText(""); }}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                disabled={deleteConfirmationText !== colabToDelete.nome}
                onClick={() => deleteMutation.mutate(colabToDelete._id)}
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