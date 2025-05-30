import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAluno, updateAluno } from "../../../api/alunos";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { StudentProfile } from "@/components/StudentProfile";
import { Button } from "@/components/ui/button";

const contatoSchema = z.object({
  nome: z.string().nonempty("Obrigatório"),
  fone: z.string().nonempty("Obrigatório"),
  email: z.string().email().optional(),
});

const schema = z.object({
  nome: z.string().nonempty(),
  sobrenome: z.string().nonempty(),
  dataNascimento: z.string().nonempty(),
  anoEscolar: z.string().nonempty(),
  endereco: z.string().optional().default(""),
  matricula: z.string().optional(),
  ra: z.string().optional(),
  cpf: z.string().optional(),
  enderecoCompleto: z.string().optional().default(""),
  contatosResponsaveis: z.array(contatoSchema).default([]),
  tagsAtencao: z.string().optional().default(""),
});

export default function DadosGeraisTab() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = React.useState(false);
  const location = useLocation();

  const { data: aluno, isLoading, isError, error } = useQuery({
    queryKey: ["aluno", id],
    queryFn: () => getAluno(id),
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { mutateAsync, isPending: saving } = useMutation({
    mutationFn: (payload) => updateAluno(id, payload),
    onError: (error) => {
      const detail = error.response?.data?.detail;
      alert("Erro ao salvar:\n" + JSON.stringify(detail, null, 2));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aluno", id] });
      queryClient.invalidateQueries({ queryKey: ["alunos"] });
      setEditMode(false);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const { fields: respFields, append: appendResp, remove: removeResp } = useFieldArray({ name: "contatosResponsaveis", control });

  // carrega dados no form
  React.useEffect(() => {
    if (aluno) {
      const defaults = {
        nome: aluno.nome,
        sobrenome: aluno.sobrenome,
        dataNascimento: aluno.dataNascimento.slice(0, 10),
        anoEscolar: aluno.anoEscolar,
        endereco: aluno.endereco || "",
        matricula: aluno.matricula || "",
        ra: aluno.ra || "",
        cpf: aluno.cpf || "",
        enderecoCompleto: aluno.dadosPessoais?.enderecoCompleto || "",
        contatosResponsaveis: aluno.contatosResponsaveis || [],
        tagsAtencao: (aluno.tagsAtencao || []).join(", "),
      };
      reset(defaults);
    }
  }, [aluno, reset]);

  // Ativa modo de edição se navegado com state.edit
  React.useEffect(() => {
    if (location.state?.edit) {
      setEditMode(true);
    }
  }, [location.state]);

  const onSubmit = async (values) => {
    const payload = {};
    if (values.matricula) payload.matricula = values.matricula;
    if (values.ra) payload.ra = values.ra;
    if (values.cpf) payload.cpf = values.cpf;

    if (values.enderecoCompleto) {
      payload.dadosPessoais = { enderecoCompleto: values.enderecoCompleto };
    }
    const contatosRespLimpos = values.contatosResponsaveis
      .filter((c) => c.nome && c.fone)
      .map((c) => ({ ...c, email: c.email?.trim() || undefined }));
    if (contatosRespLimpos.length) {
      payload.contatosResponsaveis = contatosRespLimpos;
    }
    // Converte string de tags separadas por vírgula em array
    if (values.tagsAtencao !== undefined) {
      const tagsArray = values.tagsAtencao
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      payload.tagsAtencao = tagsArray;
    }

    await mutateAsync(payload);
    alert("Dados salvos com sucesso!");
    reset(values);
  };

  if (isLoading) return <p>Carregando dados...</p>;
  if (isError) return <p className="text-red-500">Erro ao buscar aluno: {error.message}</p>;
  if (!aluno) return <p className="text-red-500">Aluno não encontrado.</p>;

  return (
    <div>
      <StudentProfile student={aluno} onEdit={() => setEditMode(true)} />

      {editMode && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-bold">Editar Dados do Aluno</h2>

          {/* Dados básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Nome</label>
              <input {...register("nome")} className="border rounded w-full p-2" />
            </div>
            <div>
              <label className="block font-semibold">Sobrenome</label>
              <input {...register("sobrenome")} className="border rounded w-full p-2" />
            </div>
            <div>
              <label className="block font-semibold">Data de Nascimento</label>
              <input type="date" {...register("dataNascimento")} className="border rounded w-full p-2" />
            </div>
            <div>
              <label className="block font-semibold">Ano Escolar</label>
              <input {...register("anoEscolar")} className="border rounded w-full p-2" />
            </div>
          </div>

          {/* Acadêmicos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold">Matrícula</label>
              <input {...register("matricula")} className="border rounded w-full p-2" />
            </div>
            <div>
              <label className="block font-semibold">RA</label>
              <input {...register("ra")} className="border rounded w-full p-2" />
            </div>
            <div>
              <label className="block font-semibold">CPF</label>
              <input {...register("cpf")} className="border rounded w-full p-2" />
            </div>
          </div>

          {/* Dados pessoais */}
          <div>
            <label className="block font-semibold">Endereço completo (dados pessoais)</label>
            <textarea {...register("enderecoCompleto")} className="border rounded w-full p-2" />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold">Tags de Atenção (separadas por vírgula)</label>
            <input {...register("tagsAtencao")} className="border rounded w-full p-2" />
          </div>

          {/* Contatos Responsáveis (campo raiz) */}
          <div>
            <label className="block font-semibold mb-2">Contatos dos Responsáveis</label>
            {respFields.map((field, index) => (
              <div key={field.id} className="border p-3 mb-2 rounded relative">
                <button type="button" className="absolute top-1 right-1 text-red-500" onClick={() => removeResp(index)}>×</button>
                <input {...register(`contatosResponsaveis.${index}.nome`)} placeholder="Nome" className="border rounded w-full p-1 mb-1" />
                <input {...register(`contatosResponsaveis.${index}.fone`)} placeholder="Telefone" className="border rounded w-full p-1 mb-1" />
                <input {...register(`contatosResponsaveis.${index}.email`)} placeholder="E-mail" className="border rounded w-full p-1" />
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={() => appendResp({ nome: "", fone: "", email: "" })}>
              + Adicionar contato
            </Button>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" type="button" onClick={() => setEditMode(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
} 