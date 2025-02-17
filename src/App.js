import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Layout from './components/layout/Layout';
import { useAuth } from './context/AuthContext';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const Contact = lazy(() => import('./pages/Contact'));
const AuthForm = lazy(() => import('./components/auth/AuthForm'));
const ResetPassword = lazy(() => import('./components/auth/ResetPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const RequestPasswordReset = lazy(() => import('./components/auth/RequestPasswordReset'));
const AddRecipe = lazy(() => import('./pages/AddRecipe'));
const Recipes = lazy(() => import('./pages/Recipes'));
const RecipeDetail = lazy(() => import('./pages/RecipeDetail'));
const EditRecipe = lazy(() => import('./pages/EditRecipe'));

// Loading fallback component
const LoadingComponent = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minH="200px"
  >
    Chargement...
  </Box>
);

// Composants de protection des routes optimisés
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
};

const AuthRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/recipes" replace /> : children;
};

function App() {
  return (
    <Router>
      <Layout>
        <Box>
          <Suspense fallback={<LoadingComponent />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={
                <AuthRoute>
                  <AuthForm />
                </AuthRoute>
              } />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/request-reset" element={<RequestPasswordReset />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/add-recipe" element={
                <ProtectedRoute>
                  <AddRecipe />
                </ProtectedRoute>
              } />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/recipe/edit/:slug" element={<EditRecipe />} />
              <Route path="/recipe/:slug" element={<RecipeDetail />} />
            </Routes>
          </Suspense>
        </Box>
      </Layout>
    </Router>
  );
}

export default App;
