import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Calendar, PlusCircle, Edit, Trash2 } from "lucide-react";
import { listarFrequencias, criarFrequencia, atualizarFrequencia, deletarFrequencia } from "../../../api/frequencias";

const initialFormData = {
  ano: new Date().getFullYear(),
  totalAulas: '',
  faltas: '',
};

export default function FrequenciaTab() {
  const { id: alunoId } = useParams();
  const [frequencias, setFrequencias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentFrequenciaId, setCurrentFrequenciaId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  async function carregarFrequencias() {
    if (!alunoId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await listarFrequencias(alunoId);
      setFrequencias(data || []);
    } catch (err) {
      console.error("Erro ao buscar frequências:", err);
      setError("Falha ao carregar os dados de frequência. Tente novamente mais tarde.");
      setFrequencias([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    carregarFrequencias();
  }, [alunoId]);

  const handleOpenModal = (mode = "add", frequencia = null) => {
    setIsModalOpen(true);
    setModalMode(mode);
    if (mode === "edit" && frequencia) {
      setCurrentFrequenciaId(frequencia.id);
      setFormData({
        ano: frequencia.ano,
        totalAulas: frequencia.totalAulas,
        faltas: frequencia.faltas,
      });
    } else {
      setCurrentFrequenciaId(null);
      setFormData(initialFormData);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormData);
    setCurrentFrequenciaId(null);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!alunoId) {
      setError("ID do aluno não encontrado para submeter o formulário.");
      return;
    }

    const { ano, totalAulas, faltas } = formData;
    if (!ano || !totalAulas || !faltas) {
        setError("Todos os campos (Ano, Total de Aulas, Faltas) são obrigatórios.");
        return;
    }
    
    const aulas = parseInt(totalAulas, 10);
    const numFaltas = parseInt(faltas, 10);
    const anoNum = parseInt(ano, 10);

    if (isNaN(aulas) || aulas <= 0 || isNaN(numFaltas) || numFaltas < 0 || isNaN(anoNum)) {
      setError("Valores inválidos para Ano, Total de Aulas ou Faltas.");
      return;
    }
    if (numFaltas > aulas) {
      setError("O número de faltas não pode ser maior que o total de aulas.");
      return;
    }

    const percentPresenca = ((aulas - numFaltas) / aulas) * 100;

    const frequenciaData = {
      ...formData,
      ano: anoNum,
      totalAulas: aulas,
      faltas: numFaltas,
      percentPresenca: parseFloat(percentPresenca.toFixed(2)),
    };
    
    delete frequenciaData.alunoId;

    setIsLoading(true);
    setError(null);

    try {
      if (modalMode === "add") {
        await criarFrequencia(alunoId, frequenciaData);
      } else if (modalMode === "edit" && currentFrequenciaId) {
        await atualizarFrequencia(alunoId, currentFrequenciaId, frequenciaData);
      }
      await carregarFrequencias();
      handleCloseModal();
    } catch (err) {
      console.error(`Erro ao ${modalMode === 'add' ? 'criar' : 'atualizar'} frequência:`, err);
      let errorMessage = `Falha ao salvar os dados. Verifique os campos e tente novamente.`;
      if (err.response && err.response.data) {
        if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
          // Formata erros específicos do Pydantic
          errorMessage = "Erro de validação: " + err.response.data.errors.map(error => `Campo '${error.loc.join('.')}' - ${error.msg}`).join("; ");
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail; // Mensagem de erro mais genérica do backend
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (frequenciaIdToDelete) => {
    if (!alunoId || !frequenciaIdToDelete) return;
    if (!window.confirm("Tem certeza que deseja excluir este registro de frequência?")) return;

    setIsLoading(true);
    setError(null);
    try {
      await deletarFrequencia(alunoId, frequenciaIdToDelete);
      await carregarFrequencias();
    } catch (err) {
      console.error("Erro ao deletar frequência:", err);
      setError(err.response?.data?.detail || "Falha ao deletar o registro.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!alunoId && !isLoading) {
    return <div className="p-4 text-red-600">Erro: ID do aluno não encontrado</div>;
  }

  const getStatusBadge = (percentual) => {
    if (percentual === null || typeof percentual === 'undefined') return <Badge variant="outline">N/D</Badge>;
    if (percentual >= 90) return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Adequada</Badge>;
    if (percentual >= 75) return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Atenção</Badge>;
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Crítica</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Frequência Escolar
          </CardTitle>
          <Button onClick={() => handleOpenModal("add")} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Registro
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-center py-4">Carregando frequências...</p>}
          {!isLoading && error && <p className="text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
          {!isLoading && !error && frequencias.length === 0 && (
            <p className="text-center py-4 text-gray-600">Nenhum registro de frequência encontrado para este aluno.</p>
          )}
          {!isLoading && !error && frequencias.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ano</TableHead>
                  <TableHead className="text-center">Total de Aulas</TableHead>
                  <TableHead className="text-center">Faltas</TableHead>
                  <TableHead className="text-center">Presença (%)</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {frequencias.map((freq) => (
                  <TableRow key={freq.id}>
                    <TableCell>{freq.ano}</TableCell>
                    <TableCell className="text-center">{freq.totalAulas}</TableCell>
                    <TableCell className="text-center">{freq.faltas}</TableCell>
                    <TableCell className="text-center">{freq.percentPresenca?.toFixed(1)}%</TableCell>
                    <TableCell className="text-center">{getStatusBadge(freq.percentPresenca)}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal("edit", freq)} className="hover:text-blue-600">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(freq.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{modalMode === 'add' ? 'Adicionar Novo Registro' : 'Editar Registro'} de Frequência</DialogTitle>
            <DialogDescription>
              {modalMode === 'add' ? 'Preencha os dados abaixo para adicionar um novo registro.' : 'Modifique os dados do registro de frequência.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="ano">Ano Letivo</Label>
              <Input
                id="ano"
                name="ano"
                type="number"
                placeholder="Ex: 2024"
                value={formData.ano}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalAulas">Total de Aulas no Ano</Label>
              <Input
                id="totalAulas"
                name="totalAulas"
                type="number"
                placeholder="Ex: 200"
                value={formData.totalAulas}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faltas">Número de Faltas</Label>
              <Input
                id="faltas"
                name="faltas"
                type="number"
                placeholder="Ex: 10"
                value={formData.faltas}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            {error && modalMode && <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md">{error}</p>}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (modalMode === 'add' ? 'Salvando...' : 'Atualizando...') : (modalMode === 'add' ? 'Salvar Registro' : 'Atualizar Registro')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 