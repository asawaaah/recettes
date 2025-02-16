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
  FormHelperText
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUsername, setHasUsername] = useState(false);

  // Charger le pseudonyme existant
  useEffect(() => {
    const loadUsername = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (data?.username) {
          setUsername(data.username);
          setHasUsername(true);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du pseudonyme:', error);
      }
    };

    if (user) {
      loadUsername();
    }
  }, [user]);

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      toast({
        title: "Erreur",
        description: "Le pseudonyme ne peut pas être vide",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      // Vérifier si le pseudonyme est déjà pris
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.trim())
        .neq('id', user.id)
        .single();

      if (existingUser) {
        toast({
          title: "Erreur",
          description: "Ce pseudonyme est déjà pris",
          status: "error",
          duration: 3000,
        });
        return;
      }

      // Mettre à jour le pseudonyme
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          username: username.trim(),
          updated_at: new Date()
        });

      if (error) throw error;

      setHasUsername(true);
      toast({
        title: "Succès",
        description: "Votre pseudonyme a été mis à jour",
        status: "success",
        duration: 3000,
      });
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
            
            <FormControl>
              <FormLabel color="brand.text">Pseudonyme</FormLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choisissez un pseudonyme"
                isDisabled={hasUsername}
                bg="white"
                borderColor="brand.secondary"
                _hover={{ borderColor: 'brand.primary' }}
              />
              {!hasUsername && (
                <FormHelperText>
                  Choisissez un pseudonyme unique. Cette action ne pourra pas être modifiée.
                </FormHelperText>
              )}
            </FormControl>

            {!hasUsername && (
              <Button
                onClick={handleUpdateUsername}
                isLoading={loading}
                bg="brand.primary"
                color="white"
                _hover={{ bg: 'brand.accent' }}
              >
                Enregistrer le pseudonyme
              </Button>
            )}

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