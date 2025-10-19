import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthDialogs } from './components/AuthDialogs';
import ChatBot from './components/ChatBot';
import { TexasMap } from './components/TexasMap';
import iotaLogo from './assets/logo.jpeg';

function LandingPage() {
  return (
    <div className="min-h-screen flex" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Left Side - Auth Forms (1/4 width) */}
      <div className="flex-shrink-0 flex items-center justify-center p-8 bg-white shadow-2xl z-10" style={{ width: '25%', height: '100vh' }}>
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-center mb-4">
            <img 
              src={iotaLogo} 
              alt="Iota Financial Solutions" 
              className="h-16 w-auto rounded-lg shadow-md"
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 text-center">
              Welcome to Iota
            </h1>
            <p className="text-base text-gray-600 text-center">
              Sign in or create an account to explore personalized financing options
            </p>
            <div className="flex flex-col gap-3 pt-4">
              <AuthDialogs mode="signin" />
              <AuthDialogs mode="signup" />
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="pt-8 border-t border-gray-200 space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">17,230+</div>
              <div className="text-sm text-gray-500">Vehicles Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">$0 Down</div>
              <div className="text-sm text-gray-500">Financing Options</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-500">Customer Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Texas Map (3/4 width) */}
      <div className="flex-grow" style={{ width: '75%', height: '100vh' }}>
        <TexasMap />
      </div>

      {/* ChatBot available on landing page */}
      <ChatBot />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}