import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  BadgeIcon as IdCard,
  FileText,
  Edit,
} from "lucide-react";

export const StudentProfile = ({ student, onEdit }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const calculateAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const dados = student.dadosPessoais ?? {
    enderecoCompleto: student.endereco || "",
  };

  const [showWhatsappPopup, setShowWhatsappPopup] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-gradient-to-r from-primary-dark to-primary text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {student.nome} {student.sobrenome}
                </CardTitle>
                <p className="text-white/90 text-lg">{student.anoEscolar || ""}</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações Acadêmicas */}
        <Card className="border-2 border-secondary">
          <CardHeader>
            <CardTitle className="text-primary-dark flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" /> Informações Acadêmicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Matrícula:</span>
              <Badge variant="outline" className="bg-secondary text-primary-dark border-accent">
                {student.matricula || "–"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">RA:</span>
              <Badge variant="outline" className="bg-secondary text-primary-dark border-accent">
                {student.ra || "–"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Ano Escolar:</span>
              <Badge className="bg-primary hover:bg-primary/90 text-white">
                {student.anoEscolar || ""}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Dados Pessoais */}
        <Card className="border-2 border-secondary">
          <CardHeader>
            <CardTitle className="text-primary-dark flex items-center">
              <IdCard className="w-5 h-5 mr-2" /> Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-accent" />
              <div>
                <p className="text-sm text-gray-600">Data de Nascimento</p>
                <p className="font-medium">
                  {formatDate(student.dataNascimento)} ({calculateAge(student.dataNascimento)} anos)
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center space-x-3">
              <FileText className="w-4 h-4 text-accent" />
              <div>
                <p className="text-sm text-gray-600">CPF</p>
                <p className="font-medium">{student.cpf || "–"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Endereço */}
      <Card className="border-2 border-secondary">
        <CardHeader>
          <CardTitle className="text-primary-dark flex items-center">
            <MapPin className="w-5 h-5 mr-2" /> Endereço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary/30 p-4 rounded-lg">
            <p className="text-gray-700 font-medium">{dados.enderecoCompleto}</p>
          </div>
        </CardContent>
      </Card>

      {/* Contatos dos Pais */}
      <Card className="border-2 border-secondary">
        <CardHeader>
          <CardTitle className="text-primary-dark flex items-center">
            <User className="w-5 h-5 mr-2" /> Contatos dos Responsáveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {student.contatosResponsaveis.length === 0 ? (
              <p className="text-gray-600">Nenhum contato informado.</p>
            ) : (
              student.contatosResponsaveis.map((contato, index) => (
                <div key={index} className="bg-secondary/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary-dark mb-3">{contato.nome}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-accent" />
                      <span className="text-gray-700">{contato.fone}</span>
                    </div>
                    {contato.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-accent" />
                      <span className="text-gray-700">{contato.email}</span>
                    </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <FileText className="w-4 h-4 mr-2" /> Gerar Relatório
        </Button>
        <Button variant="outline" onClick={() => setShowWhatsappPopup(true)}>
          <Mail className="w-4 h-4 mr-2" /> Enviar Comunicado
        </Button>
        <Button variant="outline">
          <GraduationCap className="w-4 h-4 mr-2" /> Histórico Escolar
        </Button>
      </div>

      {showWhatsappPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4">Escolha um Responsável</h3>
            <div className="space-y-3">
              {student.contatosResponsaveis && student.contatosResponsaveis.length > 0 ? (
                student.contatosResponsaveis.map((contato, index) => (
                  (contato.fone || contato.email) ? (
                    <div key={index} className="border-b pb-2 last:border-b-0">
                      <span className="font-semibold">{contato.nome}</span>
                      <div className="flex items-center space-x-3 mt-1">
                        {contato.fone ? (
                          <a
                            href={`https://wa.me/${contato.fone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 flex items-center"
                            onClick={() => setShowWhatsappPopup(false)}
                          >
                            <Phone className="w-4 h-4 mr-1" /> WhatsApp
                          </a>
                        ) : null}
                        {contato.email ? (
                          <a
                            href={`mailto:${contato.email}`}
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                            onClick={() => setShowWhatsappPopup(false)}
                          >
                            <Mail className="w-4 h-4 mr-1" /> E-mail
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ) : null
                ))
              ) : (
                <p>Nenhum contato de responsável com telefone ou e-mail encontrado.</p>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setShowWhatsappPopup(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 