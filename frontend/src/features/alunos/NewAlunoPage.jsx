import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../../api/http";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

// Schema de validação para novo aluno
const schema = z.object({
  nome: z.string().nonempty("Nome obrigatório"),
  sobrenome: z.string().nonempty("Sobrenome obrigatório"),
  dataNascimento: z.string().nonempty("Data de nascimento obrigatória"),
  anoEscolar: z.string().nonempty("Ano escolar obrigatório"),
  enderecoCompleto: z.string().optional(),
  contatosResponsaveis: z
    .array(
      z.object({
        nome: z.string().nonempty("Nome do responsável obrigatório"),
        fone: z.string().nonempty("Telefone obrigatório"),
        email: z.string().email("Email inválido").optional(),
      })
    )
    .default([]),
  tagsAtencao: z.string().optional(),
  matricula: z.string().optional(),
  ra: z.string().optional(),
  cpf: z.string().optional(),
});

export default function NewAlunoPage() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { contatosResponsaveis: [] },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "contatosResponsaveis",
  });

  // Envia dados para o backend
  const onSubmit = async (dados) => {
    try {
      // Monta payload compatível com backend
      const payload = {
        nome: dados.nome,
        sobrenome: dados.sobrenome,
        dataNascimento: dados.dataNascimento,
        anoEscolar: dados.anoEscolar,
        endereco: "",
        dadosPessoais: { enderecoCompleto: dados.enderecoCompleto || "" },
        contatosResponsaveis: dados.contatosResponsaveis,
        tagsAtencao: dados.tagsAtencao ? dados.tagsAtencao.split(",").map((t) => t.trim()) : [],
        matricula: dados.matricula,
        ra: dados.ra,
        cpf: dados.cpf,
      };
      await api.post("/alunos", payload);
      navigate("/alunos");
    } catch (err) {
      console.error("Erro ao criar aluno:", err);
      alert("Erro ao criar aluno: " + JSON.stringify(err));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Cadastrar Novo Aluno</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        {/* Dados Pessoais */}
        <div>
          <label className="block font-medium">Nome</label>
          <Input type="text" {...register("nome")} />
          {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
        </div>
        <div>
          <label className="block font-medium">Sobrenome</label>
          <Input type="text" {...register("sobrenome")} />
          {errors.sobrenome && <p className="text-red-500 text-sm">{errors.sobrenome.message}</p>}
        </div>
        <div>
          <label className="block font-medium">Data de Nascimento</label>
          <Input type="date" {...register("dataNascimento")} />
          {errors.dataNascimento && <p className="text-red-500 text-sm">{errors.dataNascimento.message}</p>}
        </div>
        <div>
          <label className="block font-medium">Ano Escolar</label>
          <Input type="text" {...register("anoEscolar")} />
          {errors.anoEscolar && <p className="text-red-500 text-sm">{errors.anoEscolar.message}</p>}
        </div>
        <div>
          <label className="block font-medium">Endereço Completo</label>
          <textarea
            {...register("enderecoCompleto")}
            className="border rounded w-full p-2"
          />
        </div>
        {/* Contatos dos Responsáveis */}
        <div className="border p-4 rounded">
          <label className="block font-medium mb-2">Contatos dos Responsáveis</label>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <Input
                placeholder="Nome"
                {...register(`contatosResponsaveis.${index}.nome`)}
              />
              <Input
                placeholder="Telefone"
                {...register(`contatosResponsaveis.${index}.fone`)}
              />
              <Input
                placeholder="E-mail"
                {...register(`contatosResponsaveis.${index}.email`)}
              />
              <button
                type="button"
                className="text-red-500"
                onClick={() => remove(index)}
              >
                Remover
              </button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            onClick={() => append({ nome: "", fone: "", email: "" })}
          >
            + Adicionar Contato
          </Button>
        </div>
        {/* Outros Dados */}
        <div>
          <label className="block font-medium">Matrícula</label>
          <Input type="text" {...register("matricula")} />
        </div>
        <div>
          <label className="block font-medium">RA</label>
          <Input type="text" {...register("ra")} />
        </div>
        <div>
          <label className="block font-medium">CPF</label>
          <Input type="text" {...register("cpf")} />
        </div>
        <div>
          <label className="block font-medium">Tags de Atenção (vírgula)</label>
          <Input type="text" {...register("tagsAtencao")} />
        </div>
        <div className="flex gap-2 justify-end pt-4">
          <Button type="button" variant="outline" onClick={() => navigate("/alunos")}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting} className="bg-primary text-white">
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </div>
      </form>
    </div>
  );
} 