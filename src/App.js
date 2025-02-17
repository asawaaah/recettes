import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
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
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import EditRecipe from './pages/EditRecipe';

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
    return <Navigate to="/recipes" />;
  }
  return children;
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Box 
        height="100vh" 
        width="100vw" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
      >
        Loading app...
      </Box>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Layout>
          <Box width="100%" maxWidth="1200px" mx="auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/request-password-reset" element={<RequestPasswordReset />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route 
                path="/login" 
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
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/recipe/edit/:slug" element={<EditRecipe />} />
              <Route path="/recipe/:slug" element={<RecipeDetail />} />
            </Routes>
          </Box>
        </Layout>
      </Router>
    </ChakraProvider>
  );
}

export default App;
