import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ScopeProvider } from './context/ScopeContext';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Users from './pages/Users';
import Profile from './pages/Profile';
import Periods from './pages/Periods';
import Audit from './pages/Audit';
import CategoryTemplates from './pages/CategoryTemplates';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <ScopeProvider>
        <AuthProvider>
          <Toaster position="top-right" theme="light" richColors closeButton />
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/users" element={<Users />} />
              <Route path="/periods" element={<Periods />} />
              <Route path="/audit" element={<Audit />} />
              <Route path="/category-templates" element={<CategoryTemplates />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ScopeProvider>
    </BrowserRouter>
  );
}

