import React from 'react';
import { Box } from '@chakra-ui/react';

const Layout = ({ children }) => {
  return (
    <Box maxWidth="1200px" mx="auto" px={4}>
      {children}
    </Box>
  );
};

export default Layout; 