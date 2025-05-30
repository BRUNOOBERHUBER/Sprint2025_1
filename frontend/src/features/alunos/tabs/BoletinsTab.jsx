import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { FileText } from "lucide-react";

export default function BoletinsTab() {
  const { id: alunoId } = useParams();

  console.log("BoletinsTab renderizando com alunoId:", alunoId);

  // Teste simples primeiro
  if (!alunoId) {
    return <div className="p-4 text-red-600">Erro: ID do aluno não encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Boletins Escolares - 2024
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1º Bimestre */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-4 text-blue-700">1º Bimestre</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Português</span>
                  <Badge className="bg-green-100 text-green-800">8.5</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Matemática</span>
                  <Badge className="bg-yellow-100 text-yellow-800">6.0</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>História</span>
                  <Badge className="bg-green-100 text-green-800">7.8</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Geografia</span>
                  <Badge className="bg-green-100 text-green-800">8.0</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ciências</span>
                  <Badge className="bg-green-100 text-green-800">7.5</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ed. Física</span>
                  <Badge className="bg-green-100 text-green-800">9.0</Badge>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center font-semibold">
                  <span>Média Geral</span>
                  <Badge className="bg-blue-100 text-blue-800">7.6</Badge>
                </div>
              </div>
            </div>

            {/* 2º Bimestre */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-4 text-blue-700">2º Bimestre</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Português</span>
                  <Badge className="bg-green-100 text-green-800">7.8</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Matemática</span>
                  <Badge className="bg-red-100 text-red-800">5.5</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>História</span>
                  <Badge className="bg-green-100 text-green-800">8.2</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Geografia</span>
                  <Badge className="bg-green-100 text-green-800">7.5</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ciências</span>
                  <Badge className="bg-green-100 text-green-800">7.0</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ed. Física</span>
                  <Badge className="bg-green-100 text-green-800">8.8</Badge>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center font-semibold">
                  <span>Média Geral</span>
                  <Badge className="bg-yellow-100 text-yellow-800">7.3</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Observações Pedagógicas</h4>
            <p className="text-sm text-gray-700">
              Aluno apresenta dificuldades em matemática. Recomenda-se reforço escolar e acompanhamento mais
              próximo. Excelente desempenho em português e participação ativa nas aulas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 