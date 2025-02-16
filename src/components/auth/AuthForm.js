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
  Divider,
  HStack,
  Icon,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { supabase } from '../../config/supabaseClient';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = isLogin 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ 
            email, 
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`
            }
          });

      if (error) throw error;

      if (!isLogin && data.user?.identities?.length === 0) {
        toast({
          title: "Email déjà utilisé",
          description: "Cet email est déjà associé à un compte.",
          status: "error",
          duration: 5000,
        });
        return;
      }
      
      toast({
        title: isLogin ? "Connexion réussie!" : "Vérifiez votre email!",
        description: isLogin ? "Bienvenue!" : "Un lien de confirmation vous a été envoyé.",
        status: "success",
        duration: 5000,
      });

      if (isLogin) {
        navigate('/profile');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      console.log('Starting Google auth...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      console.log('Auth response:', { data, error });

      if (error) {
        console.error('Google auth error:', error);
        throw error;
      }

      console.log('Google auth success:', data);
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Erreur d'authentification",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    }
  };

  return (
    <Box p={8} maxW="400px" mx="auto">
      <VStack spacing={4} as="form" onSubmit={handleEmailAuth}>
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Mot de passe</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="brand"
          bg="brand.primary"
          w="full"
          isLoading={loading}
        >
          {isLogin ? "Se connecter" : "S'inscrire"}
        </Button>

        <Text cursor="pointer" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
        </Text>

        <HStack w="full">
          <Divider />
          <Text fontSize="sm" color="gray.500">OU</Text>
          <Divider />
        </HStack>

        <Button
          w="full"
          variant="outline"
          leftIcon={<Icon as={FcGoogle} />}
          onClick={handleGoogleAuth}
          isDisabled={loading}
        >
          Continuer avec Google
        </Button>
      </VStack>
    </Box>
  );
};

export default AuthForm; 