import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Calendar } from "lucide-react";

export default function FrequenciaTab() {
  const { id: alunoId } = useParams();

  console.log("FrequenciaTab renderizando com alunoId:", alunoId);

  // Teste simples primeiro
  if (!alunoId) {
    return <div className="p-4 text-red-600">Erro: ID do aluno não encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Frequência Escolar - 2024
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">92%</div>
              <div className="text-sm text-gray-600">Frequência Geral</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">160</div>
              <div className="text-sm text-gray-600">Total de Aulas</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">13</div>
              <div className="text-sm text-gray-600">Faltas</div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Detalhamento por Bimestre</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-3 text-left">Bimestre</th>
                    <th className="border border-gray-300 p-3 text-center">Aulas Previstas</th>
                    <th className="border border-gray-300 p-3 text-center">Faltas</th>
                    <th className="border border-gray-300 p-3 text-center">Frequência</th>
                    <th className="border border-gray-300 p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-3">1º Bimestre</td>
                    <td className="border border-gray-300 p-3 text-center">40</td>
                    <td className="border border-gray-300 p-3 text-center">2</td>
                    <td className="border border-gray-300 p-3 text-center">95%</td>
                    <td className="border border-gray-300 p-3 text-center">
                      <Badge className="bg-green-100 text-green-800">Adequada</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3">2º Bimestre</td>
                    <td className="border border-gray-300 p-3 text-center">40</td>
                    <td className="border border-gray-300 p-3 text-center">5</td>
                    <td className="border border-gray-300 p-3 text-center">87.5%</td>
                    <td className="border border-gray-300 p-3 text-center">
                      <Badge className="bg-yellow-100 text-yellow-800">Atenção</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3">3º Bimestre</td>
                    <td className="border border-gray-300 p-3 text-center">40</td>
                    <td className="border border-gray-300 p-3 text-center">3</td>
                    <td className="border border-gray-300 p-3 text-center">92.5%</td>
                    <td className="border border-gray-300 p-3 text-center">
                      <Badge className="bg-green-100 text-green-800">Adequada</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3">4º Bimestre</td>
                    <td className="border border-gray-300 p-3 text-center">40</td>
                    <td className="border border-gray-300 p-3 text-center">3</td>
                    <td className="border border-gray-300 p-3 text-center">92.5%</td>
                    <td className="border border-gray-300 p-3 text-center">
                      <Badge className="bg-green-100 text-green-800">Adequada</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Compensação de Ausências</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Atividade de recuperação - Matemática</span>
                <Badge className="bg-green-100 text-green-800">Realizada</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Projeto de leitura - Português</span>
                <Badge className="bg-green-100 text-green-800">Realizada</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 