import React from 'react';
import { Box } from '@chakra-ui/react';
import NavBar from '../navigation/NavBar';

const Layout = ({ children }) => {
  return (
    <Box as="main" minH="100vh" bg="brand.background">
      <NavBar />
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