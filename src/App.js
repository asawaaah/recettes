import React from 'react';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';

function App() {
  return (
    <Layout>
      <Home />
      <Products />
    </Layout>
  );
}

export default App;
