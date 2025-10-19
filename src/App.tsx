import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthDialogs } from './components/AuthDialogs';
import ChatBot from './components/ChatBot';
import iotaLogo from './assets/logo.jpeg';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen flex items-center justify-center">
          <div className="space-y-8 text-center">
            <div className="flex justify-center mb-4">
              <img 
                src={iotaLogo} 
                alt="Iota Financial Solutions" 
                className="h-16 w-auto rounded-lg shadow-md"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome to Iota Financial Solutions
            </h1>
            <p className="text-xl text-gray-600">
              Sign in or create an account to explore personalized financing options
            </p>
            <div className="flex gap-4 justify-center">
              <AuthDialogs mode="signin" />
              <AuthDialogs mode="signup" />
            </div>
          </div>
        </div>
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