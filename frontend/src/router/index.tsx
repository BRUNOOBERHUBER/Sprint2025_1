import React from "react";
import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import AlunoListPage from "../features/alunos/AlunoListPage";
import AlunoDetailPage from "../features/alunos/AlunoDetailPage";
import NewAlunoPage from "../features/alunos/NewAlunoPage";
import NotFoundPage from "../components/NotFoundPage";
import ContraturnoListPage from "../features/contraturno/ContraturnoListPage";
import ContraturnoFormPage from "../features/contraturno/ContraturnoFormPage";
import ContraturnoProjetos from "../features/contraturno/ContraturnoProjetos";
import ColaboradoresPage from "../features/colaboradores/ColaboradoresPage";
import ContraturnoDetailPage from "../features/contraturno/ContraturnoDetailPage";
import DashboardPage from "../features/dashboard/DashboardPage";

function useAuthToken() {
  const token = localStorage.getItem("token");
  return token;
}

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = useAuthToken();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

const AppRouter = () => {
  const location = useLocation();
  useEffect(() => {
    document.title = "Portfólio Escolar Digital";
  }, [location]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alunos"
        element={
          <ProtectedRoute>
            <AlunoListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alunos/novo"
        element={
          <ProtectedRoute>
            <NewAlunoPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alunos/:id/*"
        element={
          <ProtectedRoute>
            <AlunoDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contraturno"
        element={
          <ProtectedRoute>
            <ContraturnoProjetos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contraturno/novo"
        element={
          <ProtectedRoute>
            <ContraturnoFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contraturno/:id"
        element={
          <ProtectedRoute>
            <ContraturnoDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contraturno/:id/edit"
        element={
          <ProtectedRoute>
            <ContraturnoFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/colaboradores"
        element={
          <ProtectedRoute>
            <ColaboradoresPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter; 