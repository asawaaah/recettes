import React from 'react';
import { Box, Flex, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <Box>
      <Flex 
        as="nav" 
        bg="brand.primary" 
        p={4} 
        color="white"
        mb={8}
      >
        <Link as={RouterLink} to="/" mx={2}>Accueil</Link>
        <Link as={RouterLink} to="/products" mx={2}>Produits</Link>
        <Link as={RouterLink} to="/contact" mx={2}>Contact</Link>
      </Flex>
      <Box maxWidth="1200px" mx="auto" px={4}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 