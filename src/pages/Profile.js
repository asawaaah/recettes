import React from 'react';
import { Box, VStack, Heading, Text, Button, useToast } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Déconnexion réussie",
        status: "success",
        duration: 3000,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Erreur lors de la déconnexion",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box p={8} maxW="600px" mx="auto">
      <VStack spacing={6} align="stretch">
        <Heading color="brand.text">Mon Profil</Heading>
        
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
          <VStack spacing={4} align="stretch">
            <Text>
              <strong>Email:</strong> {user?.email}
            </Text>
            <Text>
              <strong>ID:</strong> {user?.id}
            </Text>
            <Text>
              <strong>Dernière connexion:</strong>{' '}
              {new Date(user?.last_sign_in_at).toLocaleString()}
            </Text>
          </VStack>
        </Box>

        <Button
          colorScheme="red"
          onClick={handleSignOut}
        >
          Se déconnecter
        </Button>
      </VStack>
    </Box>
  );
};

export default Profile; 