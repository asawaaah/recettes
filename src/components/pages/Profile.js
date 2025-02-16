import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Badge,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabaseClient';
import '../../styles/components/buttons.css';

const Profile = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUsername, setHasUsername] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isGoogleUser = user?.app_metadata?.provider === 'google';

  useEffect(() => {
    getProfile();
  }, [user]);

  const getProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      if (data?.username) {
        setUsername(data.username);
        setHasUsername(true);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          username: username.trim(),
          updated_at: new Date()
        });

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        status: "success",
        duration: 3000,
      });
      setHasUsername(true);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={8} maxW="600px" mx="auto" className="fade-in">
      <VStack spacing={6} align="stretch">
        <Heading color="brand.text">Mon Profil</Heading>
        
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
          <VStack spacing={4} align="stretch">
            <HStack>
              <Text fontWeight="bold" color="brand.text">
                Email:
              </Text>
              <Text>{user?.email}</Text>
              <Badge colorScheme={isGoogleUser ? "green" : "blue"}>
                {isGoogleUser ? "Google" : "Email"}
              </Badge>
            </HStack>
            
            <FormControl>
              <FormLabel color="brand.text">Pseudonyme</FormLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choisissez un pseudonyme"
                isDisabled={hasUsername}
                borderColor="brand.secondary"
                _hover={{ borderColor: 'brand.primary' }}
                _focus={{ borderColor: 'brand.primary' }}
              />
              {!hasUsername && (
                <FormHelperText>
                  Choisissez un pseudonyme unique. Cette action ne pourra pas être modifiée.
                </FormHelperText>
              )}
            </FormControl>

            {!hasUsername && (
              <Button
                onClick={handleUpdateProfile}
                isLoading={loading}
                className="custom-button-animation"
                variant="solid"
                colorScheme="brand"
              >
                Sauvegarder
              </Button>
            )}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default Profile; 