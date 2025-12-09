import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from '../components/PrivateRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { Usuarios } from '../pages/Usuarios';
import { Configuracoes } from '../pages/Configuracoes';
import { Prontuario } from '../pages/Prontuario';
import { Treinamentos } from '../pages/Treinamentos';
import { Ponto } from '../pages/Ponto';
import { Beneficios } from '../pages/Beneficios';
import { Comunicacao } from '../pages/Comunicacao';
import { Relatorios } from '../pages/Relatorios';
import { Seguranca } from '../pages/Seguranca';
import { Integracoes } from '../pages/Integracoes';
import { Regionais } from '../pages/Regionais';
import { Admissao } from '../pages/Admissao';
import { UserRole } from '../types';

// Componente de rotas da aplicação
export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* Rota pública - Login */}
        <Route path="/login" element={<Login />} />

        {/* Rota raiz redireciona para dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Rotas protegidas com layout */}
        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* Dashboard - acessível para todos os perfis autenticados */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Usuários - apenas Admin */}
          <Route
            path="/usuarios"
            element={
              <PrivateRoute allowedRoles={[UserRole.ADMINISTRADOR]}>
                <Usuarios />
              </PrivateRoute>
            }
          />

          {/* Prontuário - Admin e Gestor */}
          <Route
            path="/prontuario"
            element={
              <PrivateRoute allowedRoles={[UserRole.ADMINISTRADOR, UserRole.GESTOR]}>
                <Prontuario />
              </PrivateRoute>
            }
          />
          <Route
            path="/prontuario/:id"
            element={
              <PrivateRoute allowedRoles={[UserRole.ADMINISTRADOR, UserRole.GESTOR]}>
                <Prontuario />
              </PrivateRoute>
            }
          />

          {/* Admissão - Admin e Gestor */}
          <Route
            path="/admissao"
            element={
              <PrivateRoute allowedRoles={[UserRole.ADMINISTRADOR, UserRole.GESTOR]}>
                <Admissao />
              </PrivateRoute>
            }
          />

          {/* Treinamentos - Admin e Gestor */}
          <Route
            path="/treinamentos"
            element={
              <PrivateRoute allowedRoles={[UserRole.ADMINISTRADOR, UserRole.GESTOR]}>
                <Treinamentos />
              </PrivateRoute>
            }
          />

          {/* Ponto e Frequência - Admin e Gestor */}
          <Route
            path="/ponto"
            element={
              <PrivateRoute allowedRoles={[UserRole.ADMINISTRADOR, UserRole.GESTOR]}>
                <Ponto />
              </PrivateRoute>
            }
          />

          {/* Benefícios - Admin e Gestor */}
          <Route
            path="/beneficios"
            element={
              <PrivateRoute allowedRoles={[UserRole.ADMINISTRADOR, UserRole.GESTOR]}>
                <Beneficios />
              </PrivateRoute>
            }
          />

          {/* Comunicação - Admin e Gestor */}
          <Route
            path="/comunicacao"
            element={
              <PrivateRoute allowedRoles={[UserRole.ADMINISTRADOR, UserRole.GESTOR]}>
                <Comunicacao />
              </PrivateRoute>
            }
          />

          {/* Relatórios - Admin e Gestor */}
          <Route
            path="/relatorios"
            element={
              <PrivateRoute allowedRoles={[UserRole.ADMINISTRADOR, UserRole.GESTOR]}>
                <Relatorios />
              </PrivateRoute>
            }
          />

          {/* Regionais - Admin e Gestor */}
          <Route
            path="/regionais"
            element={
              <PrivateRoute allowedRoles={[UserRole.ADMINISTRADOR, UserRole.GESTOR]}>
                <Regionais />
              </PrivateRoute>
            }
          />

          {/* Segurança - apenas Admin */}
          <Route
            path="/seguranca"
            element={
              <PrivateRoute allowedRoles={[UserRole.ADMINISTRADOR]}>
                <Seguranca />
              </PrivateRoute>
            }
          />

          {/* Integrações - apenas Admin */}
          <Route
            path="/integracoes"
            element={
              <PrivateRoute allowedRoles={[UserRole.ADMINISTRADOR]}>
                <Integracoes />
              </PrivateRoute>
            }
          />

          {/* Configurações - apenas Admin */}
          <Route
            path="/configuracoes"
            element={
              <PrivateRoute allowedRoles={[UserRole.ADMINISTRADOR]}>
                <Configuracoes />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Rota 404 - redireciona para dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

