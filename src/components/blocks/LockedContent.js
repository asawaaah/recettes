import React from 'react';
import { VStack, Icon, Text, Button, Box } from '@chakra-ui/react';
import { FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LockedContent = () => {
  const navigate = useNavigate();

  return (
    <Box 
      minH="50vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
    >
      <VStack spacing={6} p={8} textAlign="center">
        <Icon as={FaLock} w={12} h={12} color="brand.warning" />
        <Text fontSize="xl" fontWeight="bold" color="gray.700">
          Contenu Réservé
        </Text>
        <Text color="gray.600" maxW="md">
          Cette section est réservée aux membres connectés. 
          Connectez-vous pour accéder à tout le contenu.
        </Text>
        <Button
          colorScheme="brand"
          bg="brand.primary"
          size="lg"
          onClick={() => navigate('/auth')}
        >
          Se connecter
        </Button>
      </VStack>
    </Box>
  );
};

export default LockedContent; 