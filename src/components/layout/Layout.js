import React, { lazy, Suspense } from 'react';
import { Box } from '@chakra-ui/react';

// Lazy load NavBar car il n'est pas critique pour le FCP
const NavBar = lazy(() => import('../navigation/NavBar'));

const NavBarFallback = () => (
  <Box 
    height="64px" 
    width="100%" 
    position="fixed" 
    top="0" 
    zIndex="1000"
    bg="white"
  />
);

const Layout = ({ children }) => {
  return (
    <Box as="main" minH="100vh" bg="brand.background">
      <Suspense fallback={<NavBarFallback />}>
        <NavBar />
      </Suspense>
      <Box 
        as="div"
        pt="80px"
        px={4}
        maxW="1200px"
        mx="auto"
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 