import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import Contact from './pages/Contact';
import AuthForm from './components/auth/AuthForm';
import ResetPassword from './components/auth/ResetPassword';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import RequestPasswordReset from './components/auth/RequestPasswordReset';
import AddRecipe from './pages/AddRecipe';

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
    <ChakraProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/request-password-reset" element={<RequestPasswordReset />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route 
              path="/auth" 
              element={
                <AuthRoute>
                  <AuthForm />
                </AuthRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/add-recipe" 
              element={
                <ProtectedRoute>
                  <AddRecipe />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Layout>
      </Router>
    </ChakraProvider>
  );
}

export default App;
