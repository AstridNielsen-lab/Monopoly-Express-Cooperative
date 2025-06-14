import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages - Website
import Home from './pages/Home';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Membership from './pages/Membership';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

// Pages - Auth
import Login from './pages/Login';
import Register from './pages/Register';

// Pages - Apps
import UserApp from './pages/UserApp';
import MotoboyApp from './pages/MotoboyApp';
import Dashboard from './pages/Dashboard';

// Layout
import Layout from './components/layout/Layout';

// Protected Route Component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  allowedUserTypes?: ('user' | 'motoboy' | 'admin')[];
}> = ({ children, allowedUserTypes }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedUserTypes && !allowedUserTypes.includes(user.user_type)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Redirect based on user type
const AppRedirect: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  switch (user.user_type) {
    case 'admin':
      return <Navigate to="/dashboard" replace />;
    case 'motoboy':
      return <Navigate to="/motoboy" replace />;
    case 'user':
    default:
      return <Navigate to="/app" replace />;
  }
};

function AppContent() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="quem-somos" element={<About />} />
            <Route path="como-funciona" element={<HowItWorks />} />
            <Route path="seja-membro" element={<Membership />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<BlogPost />} />
          </Route>
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* App Redirect */}
          <Route path="/app-redirect" element={<AppRedirect />} />
          
          {/* Protected App Routes */}
          <Route 
            path="/app" 
            element={
              <ProtectedRoute allowedUserTypes={['user']}>
                <UserApp />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/motoboy" 
            element={
              <ProtectedRoute allowedUserTypes={['motoboy']}>
                <MotoboyApp />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedUserTypes={['admin']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
