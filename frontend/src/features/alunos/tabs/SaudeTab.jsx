import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Heart, PlusCircle, Save, Edit2, Trash2, XCircle } from "lucide-react";
import { getDadosSaudeAluno, criarDadosSaudeAluno, atualizarDadosSaudeAluno } from "../../../api/saude";

// Estrutura inicial para dados de saúde, espelhando SaudeDB/SaudeCreate
const initialSaudeData = {
  condicoesSaude: [],
  medicacoes: [],
  alergias: [],
  contatosEmergencia: [],
  documentosIds: [],
  // alunoId, criadoEm, atualizadoEm, id são gerenciados pelo backend ou estado
};

const initialCondicaoFormData = {
  nome: "",
  status: "monitorada", // Valor padrão
  descricao: "",
  dataDiagnostico: "",
  profissionalSaude: "",
  crm: "",
};

const initialMedicacaoFormData = {
  nome: "",
  dosagem: "",
  frequencia: "",
  observacoes: "",
  autorizadoPor: "",
};

export default function SaudeTab() {
  const { id: alunoId } = useParams();
  const [saudeData, setSaudeData] = useState(null); // Pode ser null se não carregado ou não existente
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false); // Para habilitar edição geral dos campos

  // Estados para o modal de Condição de Saúde
  const [isCondicaoModalOpen, setIsCondicaoModalOpen] = useState(false);
  const [condicaoModalMode, setCondicaoModalMode] = useState("add"); // "add" ou "edit"
  const [currentCondicaoIndex, setCurrentCondicaoIndex] = useState(null); // Índice para edição/deleção
  const [condicaoFormData, setCondicaoFormData] = useState(initialCondicaoFormData);
  const [modalError, setModalError] = useState(null);

  // Estados para o modal de Medicação
  const [isMedicacaoModalOpen, setIsMedicacaoModalOpen] = useState(false);
  const [medicacaoModalMode, setMedicacaoModalMode] = useState("add"); // "add" ou "edit"
  const [currentMedicacaoIndex, setCurrentMedicacaoIndex] = useState(null);
  const [medicacaoFormData, setMedicacaoFormData] = useState(initialMedicacaoFormData);
  const [medicacaoModalError, setMedicacaoModalError] = useState(null);

  // Estado para o input de nova alergia
  const [novaAlergia, setNovaAlergia] = useState("");

  // Estados para o modal de Contato de Emergência
  const initialContatoFormData = {
    nome: "",
    telefone: "",
    relacao: "",
  };
  const [isContatoModalOpen, setIsContatoModalOpen] = useState(false);
  const [contatoModalMode, setContatoModalMode] = useState("add");
  const [currentContatoIndex, setCurrentContatoIndex] = useState(null);
  const [contatoFormData, setContatoFormData] = useState(initialContatoFormData);
  const [contatoModalError, setContatoModalError] = useState(null);

  const carregarDadosSaude = async (enterEditModeIfNew = false) => {
    if (!alunoId) {
      console.error("[SaudeTab] alunoId é nulo, não buscando dados de saúde.");
      setIsLoading(false);
      return;
    }
    console.log("[SaudeTab] Iniciando carregarDadosSaude para alunoId:", alunoId);
    setIsLoading(true);
    setError(null);
    setSaudeData(null); // Resetar saudeData antes de buscar para evitar mostrar dados antigos em caso de erro

    try {
      const data = await getDadosSaudeAluno(alunoId);
      console.log("[SaudeTab] Dados de saúde recebidos da API:", data);
      if (data && typeof data === 'object') {
        setSaudeData(data);
        setEditMode(false); // Começa em modo visualização se dados foram carregados
        console.log("[SaudeTab] saudeData definido com sucesso:", data);
      } else {
        // Caso a API retorne algo inesperado (não um objeto, ou undefined)
        console.warn("[SaudeTab] API retornou dados em formato inesperado:", data);
        setSaudeData(initialSaudeData); 
        setError("Dados de saúde recebidos em formato inesperado. Iniciando com registro vazio.");
        setEditMode(enterEditModeIfNew || true);
      }
    } catch (err) {
      console.error("[SaudeTab] Erro ao buscar dados de saúde:", err);
      if (err.response && err.response.status === 404) {
        console.log("[SaudeTab] API retornou 404, dados de saúde não existem. Preparando para criação.");
        setSaudeData(initialSaudeData); 
        setError("Nenhum dado de saúde encontrado. Preencha os campos e clique em Salvar Alterações para criar um novo registro.");
        setEditMode(enterEditModeIfNew || true);
      } else {
        let errorMessage = "Falha ao carregar os dados de saúde. Tente novamente.";
        if (err.response && err.response.data && err.response.data.detail) {
          errorMessage = err.response.data.detail;
        }
        console.error("[SaudeTab] Erro não-404 da API:", errorMessage);
        setError(errorMessage);
        // Manter saudeData como null ou initialSaudeData para indicar falha no carregamento
        // Se for null, a UI pode mostrar "Não foi possível carregar..."
        // Se for initialSaudeData, a UI pode tentar renderizar campos vazios, o que pode ser confuso se houve erro.
        // Optar por null para forçar a mensagem de erro de carregamento.
        setSaudeData(null); 
      }
    } finally {
      setIsLoading(false);
      console.log("[SaudeTab] carregarDadosSaude finalizado. isLoading:", false);
    }
  };

  useEffect(() => {
    if (alunoId) { // Adicionada verificação para garantir que alunoId exista antes de chamar
      carregarDadosSaude();
    }
  }, [alunoId]);

  // --- Gerenciamento Modal Condições de Saúde ---
  const handleOpenCondicaoModal = (mode = "add", condicao = null, index = null) => {
    setModalError(null);
    setIsCondicaoModalOpen(true);
    setCondicaoModalMode(mode);
    if (mode === "edit" && condicao !== null && index !== null) {
      setCurrentCondicaoIndex(index);
      setCondicaoFormData({
        nome: condicao.nome || "",
        status: condicao.status || "monitorada",
        descricao: condicao.descricao || "",
        dataDiagnostico: condicao.dataDiagnostico ? new Date(condicao.dataDiagnostico).toISOString().split('T')[0] : "", // Formato YYYY-MM-DD
        profissionalSaude: condicao.profissionalSaude || "",
        crm: condicao.crm || "",
      });
    } else {
      setCurrentCondicaoIndex(null);
      setCondicaoFormData(initialCondicaoFormData);
    }
  };

  const handleCloseCondicaoModal = () => {
    setIsCondicaoModalOpen(false);
    setCondicaoFormData(initialCondicaoFormData);
    setCurrentCondicaoIndex(null);
    setModalError(null);
  };

  const handleChangeCondicaoForm = (e) => {
    const { name, value } = e.target;
    setCondicaoFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChangeCondicaoStatus = (value) => {
    setCondicaoFormData(prev => ({ ...prev, status: value }));
  };

  const handleSubmitCondicaoForm = (e) => {
    e.preventDefault();
    setModalError(null);
    if (!condicaoFormData.nome || !condicaoFormData.descricao || !condicaoFormData.status) {
        setModalError("Nome, Status e Descrição da condição são obrigatórios.");
        return;
    }

    const updatedCondicoes = [...(saudeData.condicoesSaude || [])];
    const dataDiagnosticoISO = condicaoFormData.dataDiagnostico ? new Date(condicaoFormData.dataDiagnostico).toISOString() : null;

    const newCondicao = {
        ...condicaoFormData,
        dataDiagnostico: dataDiagnosticoISO,
    };

    if (condicaoModalMode === "add") {
      updatedCondicoes.push(newCondicao);
    } else if (condicaoModalMode === "edit" && currentCondicaoIndex !== null) {
      updatedCondicoes[currentCondicaoIndex] = newCondicao;
    }
    setSaudeData(prev => ({ ...prev, condicoesSaude: updatedCondicoes }));
    handleCloseCondicaoModal();
  };

  const handleRemoveCondicao = (indexToRemove) => {
    if (window.confirm("Tem certeza que deseja remover esta condição de saúde?")) {
      const updatedCondicoes = (saudeData.condicoesSaude || []).filter((_, index) => index !== indexToRemove);
      setSaudeData(prev => ({ ...prev, condicoesSaude: updatedCondicoes }));
    }
  };
  // --- Fim Gerenciamento Modal Condições de Saúde ---

  // --- Gerenciamento Modal Medicações ---
  const handleOpenMedicacaoModal = (mode = "add", medicacao = null, index = null) => {
    setMedicacaoModalError(null);
    setIsMedicacaoModalOpen(true);
    setMedicacaoModalMode(mode);
    if (mode === "edit" && medicacao !== null && index !== null) {
      setCurrentMedicacaoIndex(index);
      setMedicacaoFormData({
        nome: medicacao.nome || "",
        dosagem: medicacao.dosagem || "",
        frequencia: medicacao.frequencia || "",
        observacoes: medicacao.observacoes || "",
        autorizadoPor: medicacao.autorizadoPor || "",
      });
    } else {
      setCurrentMedicacaoIndex(null);
      setMedicacaoFormData(initialMedicacaoFormData);
    }
  };

  const handleCloseMedicacaoModal = () => {
    setIsMedicacaoModalOpen(false);
    setMedicacaoFormData(initialMedicacaoFormData);
    setCurrentMedicacaoIndex(null);
    setMedicacaoModalError(null);
  };

  const handleChangeMedicacaoForm = (e) => {
    const { name, value } = e.target;
    setMedicacaoFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitMedicacaoForm = (e) => {
    e.preventDefault();
    setMedicacaoModalError(null);
    if (!medicacaoFormData.nome) {
        setMedicacaoModalError("O nome da medicação é obrigatório.");
        return;
    }

    const updatedMedicacoes = [...(saudeData.medicacoes || [])];
    const newMedicacao = { ...medicacaoFormData };

    if (medicacaoModalMode === "add") {
      updatedMedicacoes.push(newMedicacao);
    } else if (medicacaoModalMode === "edit" && currentMedicacaoIndex !== null) {
      updatedMedicacoes[currentMedicacaoIndex] = newMedicacao;
    }
    setSaudeData(prev => ({ ...prev, medicacoes: updatedMedicacoes }));
    handleCloseMedicacaoModal();
  };

  const handleRemoveMedicacao = (indexToRemove) => {
    if (window.confirm("Tem certeza que deseja remover esta medicação?")) {
      const updatedMedicacoes = (saudeData.medicacoes || []).filter((_, index) => index !== indexToRemove);
      setSaudeData(prev => ({ ...prev, medicacoes: updatedMedicacoes }));
    }
  };
  // --- Fim Gerenciamento Modal Medicações ---

  // --- Gerenciamento Alergias ---
  const handleAddAlergia = () => {
    if (novaAlergia.trim() === "") return;
    const updatedAlergias = [...(saudeData.alergias || []), novaAlergia.trim()];
    setSaudeData(prev => ({ ...prev, alergias: updatedAlergias }));
    setNovaAlergia(""); // Limpa o input
  };

  const handleRemoveAlergia = (indexToRemove) => {
    const updatedAlergias = (saudeData.alergias || []).filter((_, index) => index !== indexToRemove);
    setSaudeData(prev => ({ ...prev, alergias: updatedAlergias }));
  };
  // --- Fim Gerenciamento Alergias ---

  // --- Gerenciamento Modal Contatos de Emergência ---
  const handleOpenContatoModal = (mode = "add", contato = null, index = null) => {
    setContatoModalError(null);
    setIsContatoModalOpen(true);
    setContatoModalMode(mode);
    if (mode === "edit" && contato !== null && index !== null) {
      setCurrentContatoIndex(index);
      setContatoFormData({
        nome: contato.nome || "",
        telefone: contato.telefone || "",
        relacao: contato.relacao || "",
      });
    } else {
      setCurrentContatoIndex(null);
      setContatoFormData(initialContatoFormData);
    }
  };

  const handleCloseContatoModal = () => {
    setIsContatoModalOpen(false);
    setContatoFormData(initialContatoFormData);
    setCurrentContatoIndex(null);
    setContatoModalError(null);
  };

  const handleChangeContatoForm = (e) => {
    const { name, value } = e.target;
    setContatoFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitContatoForm = (e) => {
    e.preventDefault();
    setContatoModalError(null);
    if (!contatoFormData.nome || !contatoFormData.telefone) {
        setContatoModalError("Nome e Telefone do contato são obrigatórios.");
        return;
    }

    const updatedContatos = [...(saudeData.contatosEmergencia || [])];
    const newContato = { ...contatoFormData };

    if (contatoModalMode === "add") {
      updatedContatos.push(newContato);
    } else if (contatoModalMode === "edit" && currentContatoIndex !== null) {
      updatedContatos[currentContatoIndex] = newContato;
    }
    setSaudeData(prev => ({ ...prev, contatosEmergencia: updatedContatos }));
    handleCloseContatoModal();
  };

  const handleRemoveContato = (indexToRemove) => {
    if (window.confirm("Tem certeza que deseja remover este contato de emergência?")) {
      const updatedContatos = (saudeData.contatosEmergencia || []).filter((_, index) => index !== indexToRemove);
      setSaudeData(prev => ({ ...prev, contatosEmergencia: updatedContatos }));
    }
  };
  // --- Fim Gerenciamento Modal Contatos de Emergência ---

  const handleSalvarGeral = async () => {
    if (!alunoId || !saudeData) return;
    setIsSaving(true);
    setError(null);
    console.log("[SaudeTab] Tentando salvar dados de saúde. Payload:", saudeData);

    try {
      const payload = {
        condicoesSaude: saudeData.condicoesSaude.map(c => ({...c, dataDiagnostico: c.dataDiagnostico ? new Date(c.dataDiagnostico).toISOString() : null })),
        medicacoes: saudeData.medicacoes || [],
        alergias: saudeData.alergias || [],
        contatosEmergencia: saudeData.contatosEmergencia || [],
        documentosIds: saudeData.documentosIds || [],
      };
      console.log("[SaudeTab] Payload formatado para API:", payload);

      if (saudeData.id) { // Se tem ID, atualiza
        console.log("[SaudeTab] Atualizando dados de saúde existentes (PUT), ID:", saudeData.id);
        await atualizarDadosSaudeAluno(alunoId, payload);
      } else { // Senão, cria novo registro
        console.log("[SaudeTab] Criando novo registro de dados de saúde (POST)");
        const novoRegistro = await criarDadosSaudeAluno(alunoId, payload);
        console.log("[SaudeTab] Resposta da criação:", novoRegistro);
        setSaudeData(novoRegistro); // Atualiza estado com o ID e timestamps do backend
      }
      // alert("Dados de saúde salvos com sucesso!");
      setEditMode(false);
      await carregarDadosSaude(); // Recarrega para pegar timestamps atualizados
    } catch (err) {
      console.error("[SaudeTab] Erro detalhado ao salvar dados de saúde:", err);
      if (err.response) {
        console.error("[SaudeTab] Resposta do erro da API:", err.response);
        setError(err.response?.data?.detail || JSON.stringify(err.response?.data?.errors) || `Falha ao salvar. Status: ${err.response.status} - ${err.response.statusText}. Verifique o console do backend.`);
      } else if (err.request) {
        console.error("[SaudeTab] Erro na requisição (sem resposta):", err.request);
        setError("Erro de rede ou o servidor não respondeu. Verifique a conexão e o console do backend.");
      } else {
        console.error("[SaudeTab] Erro ao configurar a requisição:", err.message);
        setError(`Erro na configuração da requisição: ${err.message}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Placeholder para as seções de edição/visualização
  const renderCondicoesSaude = () => (
    <div className="p-3 border rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">Condições de Saúde</span>
        {editMode && <Button size="sm" variant="outline"><PlusCircle className="w-4 h-4 mr-2" />Adicionar</Button>}
      </div>
      {saudeData?.condicoesSaude?.length > 0 ? saudeData.condicoesSaude.map((cond, idx) => (
        <div key={idx} className="mb-2 p-2 bg-gray-50 rounded">
          <p><strong>{cond.nome}</strong> ({cond.status})</p>
          <p className="text-sm text-gray-600">{cond.descricao}</p>
          {/* Outros campos... */}
        </div>
      )) : <p className="text-sm text-gray-500">Nenhuma condição registrada.</p>}
    </div>
  );
  // ...  funções similares para renderMedicacoes, renderAlergias, renderContatosEmergencia

  if (isLoading) {
    return <div className="p-4 text-center">Carregando dados de saúde...</div>;
  }
  
  // Ajuste na condição de exibição de erro para ser mais clara
  const showError = error && !(editMode && saudeData === initialSaudeData && error.startsWith("Nenhum dado")); 

  return (
    <div className="space-y-6 pb-16">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white/95 z-10 py-4 px-6 border-b">
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Informações de Saúde
          </CardTitle>
          <div>
            {!editMode && saudeData && (
                <Button onClick={() => setEditMode(true)} variant="outline" size="sm" className="mr-2">
                    <Edit2 className="w-4 h-4 mr-2" /> Editar Dados
                </Button>
            )}
            {editMode && (
              <>
                <Button onClick={handleSalvarGeral} disabled={isSaving} size="sm" className="mr-2">
                    <Save className="w-4 h-4 mr-2" /> {isSaving ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button onClick={() => { setEditMode(false); carregarDadosSaude(); }} variant="ghost" size="sm">
                    <XCircle className="w-4 h-4 mr-2"/> Cancelar
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6 px-6">
          {showError && <p className="text-red-600 bg-red-50 p-3 rounded-md mb-4">{error}</p>}
          {!saudeData && !isLoading && !error && (
             <div className="text-center py-6">
                <p className="mb-4">Não foi possível carregar os dados de saúde.</p>
                <Button onClick={() => carregarDadosSaude(true)}>Tentar Novamente / Iniciar Registro</Button>
             </div>
          )}

          {saudeData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              {/* Condições de Saúde */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2 mb-3">
                    <h3 className="text-lg font-semibold text-gray-700">Condições de Saúde</h3>
                    {editMode && (
                        <Button onClick={() => handleOpenCondicaoModal("add")} variant="outline" size="sm">
                            <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Condição
                        </Button>
                    )}
                </div>
                {saudeData.condicoesSaude?.length > 0 ? saudeData.condicoesSaude.map((cond, idx) => (
                  <div key={idx} className="p-3 border rounded-lg shadow-sm bg-white relative group">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-gray-800">{cond.nome}</span>
                      <Badge variant={cond.status === 'confirmado' ? 'default' : (cond.status === 'controlada' ? 'secondary' : 'outline')} 
                             className={cond.status === 'confirmado' ? 'bg-blue-100 text-blue-800' : (cond.status === 'controlada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800') }>
                        {cond.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1 whitespace-pre-wrap">{cond.descricao}</p>
                    {cond.dataDiagnostico && <p className="text-xs text-gray-500">Diag: {new Date(cond.dataDiagnostico).toLocaleDateString()}</p>}
                    {cond.profissionalSaude && <p className="text-xs text-gray-500">Prof: {cond.profissionalSaude} {cond.crm ? `(CRM: ${cond.crm})` : ''}</p>}
                    {editMode && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                            <Button onClick={() => handleOpenCondicaoModal("edit", cond, idx)} variant="ghost" size="icon-sm" className="hover:bg-blue-100"><Edit2 className="w-4 h-4 text-blue-600" /></Button>
                            <Button onClick={() => handleRemoveCondicao(idx)} variant="ghost" size="icon-sm" className="hover:bg-red-100"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                        </div>
                    )}
                  </div>
                )) : <p className="text-sm text-gray-500 italic">Nenhuma condição registrada.</p>}
              </div>

              {/* Lado Direito: Medicações, Alergias, Contatos */}
              <div className="space-y-6">
                {/* Medicações */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-3 flex justify-between items-center">
                    Medicações
                    {editMode && (
                        <Button onClick={() => handleOpenMedicacaoModal("add")} variant="outline" size="sm">
                            <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Medicação
                        </Button>
                    )}
                  </h3>
                  {saudeData.medicacoes?.length > 0 ? saudeData.medicacoes.map((med, idx) => (
                    <div key={idx} className="p-3 border rounded-lg shadow-sm bg-white relative group">
                      <p className="font-medium text-gray-800">{med.nome}</p>
                      {med.dosagem && <p className="text-sm text-gray-600">Dose: {med.dosagem}</p>}
                      {med.frequencia && <p className="text-sm text-gray-600">Freq: {med.frequencia}</p>}
                      {med.observacoes && <p className="text-xs text-gray-500 mt-1 whitespace-pre-wrap">Obs: {med.observacoes}</p>}
                      {med.autorizadoPor && <p className="text-xs text-gray-500 mt-1">Autorizado por: {med.autorizadoPor}</p>}
                      {editMode && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                            <Button onClick={() => handleOpenMedicacaoModal("edit", med, idx)} variant="ghost" size="icon-sm" className="hover:bg-blue-100"><Edit2 className="w-4 h-4 text-blue-600" /></Button>
                            <Button onClick={() => handleRemoveMedicacao(idx)} variant="ghost" size="icon-sm" className="hover:bg-red-100"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                        </div>
                      )}
                    </div>
                  )) : <p className="text-sm text-gray-500 italic">Nenhuma medicação registrada.</p>}
                </div>

                {/* Alergias */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-3">Alergias</h3>
                  {editMode && (
                    <div className="flex items-center gap-2 mb-3">
                      <Input 
                        type="text" 
                        value={novaAlergia} 
                        onChange={(e) => setNovaAlergia(e.target.value)}
                        placeholder="Adicionar nova alergia"
                        className="flex-grow"
                      />
                      <Button onClick={handleAddAlergia} size="sm" variant="outline">
                        <PlusCircle className="w-4 h-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Adicionar</span>
                      </Button>
                    </div>
                  )}
                  {saudeData.alergias?.length > 0 ? (
                    <ul className="list-none pl-0 space-y-1">
                      {saudeData.alergias.map((alergia, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <span>{alergia}</span>
                          {editMode && (
                            <Button onClick={() => handleRemoveAlergia(idx)} variant="ghost" size="icon-xs" className="hover:bg-red-100">
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </Button>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-gray-500 italic">Nenhuma alergia registrada.</p>}
                </div>

                {/* Contatos de Emergência */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-3 flex justify-between items-center">
                    Contatos de Emergência
                    {editMode && (
                        <Button onClick={() => handleOpenContatoModal("add")} variant="outline" size="sm">
                            <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Contato
                        </Button>
                    )}
                  </h3>
                  {saudeData.contatosEmergencia?.length > 0 ? saudeData.contatosEmergencia.map((cont, idx) => (
                    <div key={idx} className="p-3 border rounded-lg shadow-sm bg-white relative group">
                      <p className="font-medium text-gray-800">{cont.nome} {cont.relacao ? <span className="text-sm text-gray-500">({cont.relacao})</span> : ''}</p>
                      <p className="text-sm text-gray-600">{cont.telefone}</p>
                      {editMode && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                            <Button onClick={() => handleOpenContatoModal("edit", cont, idx)} variant="ghost" size="icon-sm" className="hover:bg-blue-100"><Edit2 className="w-4 h-4 text-blue-600" /></Button>
                            <Button onClick={() => handleRemoveContato(idx)} variant="ghost" size="icon-sm" className="hover:bg-red-100"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                        </div>
                      )}
                    </div>
                  )) : <p className="text-sm text-gray-500 italic">Nenhum contato de emergência registrado.</p>}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para Adicionar/Editar Condição de Saúde */}
      <Dialog open={isCondicaoModalOpen} onOpenChange={handleCloseCondicaoModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{condicaoModalMode === 'add' ? 'Adicionar Nova' : 'Editar'} Condição de Saúde</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da condição de saúde do aluno.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitCondicaoForm} className="space-y-4 py-2 pb-4">
            <div className="space-y-1"><Label htmlFor="condicao-nome">Nome da Condição</Label><Input id="condicao-nome" name="nome" value={condicaoFormData.nome} onChange={handleChangeCondicaoForm} placeholder="Ex: Asma, Dislexia" /></div>
            <div className="space-y-1"><Label htmlFor="condicao-status">Status</Label>
                <Select name="status" value={condicaoFormData.status} onValueChange={handleSelectChangeCondicaoStatus}>
                    <SelectTrigger id="condicao-status"><SelectValue placeholder="Selecione o status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="confirmado">Confirmado</SelectItem>
                        <SelectItem value="controlada">Controlada</SelectItem>
                        <SelectItem value="monitorada">Monitorada</SelectItem>
                        <SelectItem value="suspeita">Suspeita</SelectItem> {/* Adicionado status conforme PRD poderia implicar */}
                        <SelectItem value="descartado">Descartado</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-1"><Label htmlFor="condicao-descricao">Descrição / Observações</Label><Textarea id="condicao-descricao" name="descricao" value={condicaoFormData.descricao} onChange={handleChangeCondicaoForm} placeholder="Detalhes sobre a condição, cuidados, etc." rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label htmlFor="condicao-dataDiagnostico">Data do Diagnóstico</Label><Input id="condicao-dataDiagnostico" name="dataDiagnostico" type="date" value={condicaoFormData.dataDiagnostico} onChange={handleChangeCondicaoForm} /></div>
                <div className="space-y-1"><Label htmlFor="condicao-profissionalSaude">Profissional de Saúde</Label><Input id="condicao-profissionalSaude" name="profissionalSaude" value={condicaoFormData.profissionalSaude} onChange={handleChangeCondicaoForm} placeholder="Nome do médico/especialista" /></div>
            </div>
            <div className="space-y-1"><Label htmlFor="condicao-crm">CRM/Registro Profissional</Label><Input id="condicao-crm" name="crm" value={condicaoFormData.crm} onChange={handleChangeCondicaoForm} placeholder="CRM 12345/SP" /></div>
            
            {modalError && <p className="text-sm text-red-600">{modalError}</p>}
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={handleCloseCondicaoModal}>Cancelar</Button>
              <Button type="submit">{condicaoModalMode === 'add' ? 'Adicionar Condição' : 'Salvar Alterações'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* TODO: Modais para Medicações, Contatos de Emergência */}
      {/* Modal para Adicionar/Editar Medicação */}
      <Dialog open={isMedicacaoModalOpen} onOpenChange={handleCloseMedicacaoModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{medicacaoModalMode === 'add' ? 'Adicionar Nova' : 'Editar'} Medicação</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da medicação do aluno.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitMedicacaoForm} className="space-y-4 py-2 pb-4">
            <div className="space-y-1"><Label htmlFor="medicacao-nome">Nome da Medicação</Label><Input id="medicacao-nome" name="nome" value={medicacaoFormData.nome} onChange={handleChangeMedicacaoForm} placeholder="Ex: Amoxicilina, Ritalina" /></div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label htmlFor="medicacao-dosagem">Dosagem</Label><Input id="medicacao-dosagem" name="dosagem" value={medicacaoFormData.dosagem} onChange={handleChangeMedicacaoForm} placeholder="Ex: 500mg, 10mg/ml" /></div>
                <div className="space-y-1"><Label htmlFor="medicacao-frequencia">Frequência</Label><Input id="medicacao-frequencia" name="frequencia" value={medicacaoFormData.frequencia} onChange={handleChangeMedicacaoForm} placeholder="Ex: 2x ao dia, A cada 8 horas" /></div>
            </div>
            <div className="space-y-1"><Label htmlFor="medicacao-observacoes">Observações</Label><Textarea id="medicacao-observacoes" name="observacoes" value={medicacaoFormData.observacoes} onChange={handleChangeMedicacaoForm} placeholder="Instruções adicionais, horários, etc." rows={3} /></div>
            <div className="space-y-1"><Label htmlFor="medicacao-autorizadoPor">Autorizado Por</Label><Input id="medicacao-autorizadoPor" name="autorizadoPor" value={medicacaoFormData.autorizadoPor} onChange={handleChangeMedicacaoForm} placeholder="Ex: Dr. Silva, Receita médica" /></div>
            
            {medicacaoModalError && <p className="text-sm text-red-600">{medicacaoModalError}</p>}
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={handleCloseMedicacaoModal}>Cancelar</Button>
              <Button type="submit">{medicacaoModalMode === 'add' ? 'Adicionar Medicação' : 'Salvar Alterações'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Modal para Adicionar/Editar Contato de Emergência */}
      <Dialog open={isContatoModalOpen} onOpenChange={handleCloseContatoModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{contatoModalMode === 'add' ? 'Adicionar Novo' : 'Editar'} Contato de Emergência</DialogTitle>
            <DialogDescription>
              Preencha os dados do contato.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitContatoForm} className="space-y-4 py-2 pb-4">
            <div className="space-y-1"><Label htmlFor="contato-nome">Nome Completo</Label><Input id="contato-nome" name="nome" value={contatoFormData.nome} onChange={handleChangeContatoForm} placeholder="Nome do Contato" /></div>
            <div className="space-y-1"><Label htmlFor="contato-telefone">Telefone</Label><Input id="contato-telefone" name="telefone" value={contatoFormData.telefone} onChange={handleChangeContatoForm} placeholder="(XX) XXXXX-XXXX" /></div>
            <div className="space-y-1"><Label htmlFor="contato-relacao">Relação/Parentesco</Label><Input id="contato-relacao" name="relacao" value={contatoFormData.relacao} onChange={handleChangeContatoForm} placeholder="Ex: Mãe, Pai, Responsável" /></div>
            
            {contatoModalError && <p className="text-sm text-red-600">{contatoModalError}</p>}
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={handleCloseContatoModal}>Cancelar</Button>
              <Button type="submit">{contatoModalMode === 'add' ? 'Adicionar Contato' : 'Salvar Alterações'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 