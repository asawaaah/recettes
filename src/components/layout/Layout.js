import React from 'react';
import { Box } from '@chakra-ui/react';
import NavBar from '../navigation/NavBar';

const Layout = ({ children }) => {
  return (
    <Box>
      <NavBar />
      <Box 
        maxWidth="1200px" 
        mx="auto" 
        px={4} 
        pt="80px" // Pour compenser la navbar fixe
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 