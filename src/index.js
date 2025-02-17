import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import theme from './theme';
import './styles/globals.css';

// Lazy load App component
const App = lazy(() => import('./App'));

// Loading fallback
const LoadingFallback = () => (
  <div style={{ 
    height: '100vh', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: theme.colors.brand.background 
  }}>
    Chargement...
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HelmetProvider>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <App />
        </Suspense>
      </AuthProvider>
    </ChakraProvider>
  </HelmetProvider>
);

// Charge reportWebVitals uniquement en développement
if (process.env.NODE_ENV === 'development') {
  import('./reportWebVitals').then(({ default: reportWebVitals }) => {
    reportWebVitals(console.log);
  });
}
