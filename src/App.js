import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import Contact from './pages/Contact';
import AuthForm from './components/auth/AuthForm';
import AuthCallback from './components/auth/AuthCallback';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';

// Composant pour protéger les routes
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/auth" />;
  }
  return children;
};

// Composant pour rediriger les utilisateurs connectés
const AuthRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/profile" />;
  }
  return children;
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading app...</div>;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/products" 
            element={<Products />}
          />
          <Route path="/contact" element={<Contact />} />
          <Route 
            path="/auth" 
            element={
              <AuthRoute>
                <AuthForm />
              </AuthRoute>
            } 
          />
          <Route 
            path="/auth/callback" 
            element={<AuthCallback />} 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
