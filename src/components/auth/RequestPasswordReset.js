import React, { useState } from 'react';
import {
  Box,
  VStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
  Alert,
  AlertIcon,
  Heading,
} from '@chakra-ui/react';
import { supabase } from '../../config/supabaseClient';
import { useNavigate } from 'react-router-dom';

const RequestPasswordReset = () => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let email = identifier;
      
      // Si l'identifiant n'est pas un email, chercher l'email associé au pseudo
      if (!identifier.includes('@')) {
        const { data, error } = await supabase
          .rpc('get_email_by_username', { username_param: identifier });

        if (error || !data) {
          throw new Error("Username not found");
        }
        email = data;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email envoyé !",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe",
        status: "success",
        duration: 5000,
        position: "top",
        isClosable: true,
      });

      navigate('/auth');
    } catch (error) {
      setError(error.message);
      toast({
        title: "Erreur",
        description: error.message,
        status: "error",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={8} maxW={{ base: "400px", md: "600px" }} mx="auto">
      <VStack spacing={6} as="form" onSubmit={handlePasswordResetRequest}>
        <Heading size="lg" color="brand.text">
          Réinitialiser le mot de passe
        </Heading>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <Text textAlign="center" color="gray.600" maxW="500px">
          Entrez votre email ou votre nom d'utilisateur pour recevoir un lien de réinitialisation
        </Text>

        <FormControl isRequired>
          <FormLabel>Email ou nom d'utilisateur</FormLabel>
          <Input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Votre email ou nom d'utilisateur"
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="brand"
          bg="brand.primary"
          w="full"
          isLoading={loading}
        >
          Envoyer le lien
        </Button>

        <Button
          variant="link"
          onClick={() => navigate('/auth')}
        >
          Retour à la connexion
        </Button>
      </VStack>
    </Box>
  );
};

export default RequestPasswordReset; 