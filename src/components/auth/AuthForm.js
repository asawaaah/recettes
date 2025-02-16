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
  const [identifier, setIdentifier] = useState(''); // email ou username
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
      if (isLogin) {
        // Si c'est un email, on l'utilise directement
        if (identifier.includes('@')) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: identifier,
            password
          });
          if (error) throw error;
        } else {
          // Si c'est un pseudonyme, on cherche l'email correspondant
          const { data, error } = await supabase
            .rpc('get_email_by_username', { username_param: identifier });

          if (error || !data) {
            throw new Error("Pseudonyme non trouvé");
          }

          // Connexion avec l'email récupéré
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: data,
            password
          });
          
          if (authError) throw authError;
        }

        toast({
          title: "Connexion réussie!",
          description: "Bienvenue!",
          status: "success",
          duration: 5000,
        });

        navigate('/profile');
      } else {
        // Pour l'inscription, on utilise toujours l'email
        if (!identifier.includes('@')) {
          throw new Error("Veuillez utiliser une adresse email valide pour l'inscription");
        }

        const { data, error } = await supabase.auth.signUp({
          email: identifier,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });

        if (error) throw error;

        if (data.user?.identities?.length === 0) {
          toast({
            title: "Email déjà utilisé",
            description: "Cet email est déjà associé à un compte.",
            status: "error",
            duration: 5000,
          });
          return;
        }

        toast({
          title: "Vérifiez votre email!",
          description: "Un lien de confirmation vous a été envoyé.",
          status: "success",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message);
      toast({
        title: "Erreur",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
    } catch (error) {
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
      <VStack spacing={6} as="form" onSubmit={handleEmailAuth}>
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <FormControl isRequired>
          <FormLabel>{isLogin ? "Email ou Pseudonyme" : "Email"}</FormLabel>
          <Input
            type={isLogin ? "text" : "email"}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={isLogin ? "Votre email ou pseudonyme" : "Votre email"}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Mot de passe</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
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

        <HStack w="full">
          <Divider />
          <Text fontSize="sm" whiteSpace="nowrap" color="gray.500">
            ou
          </Text>
          <Divider />
        </HStack>

        <Button
          w="full"
          variant="outline"
          leftIcon={<Icon as={FcGoogle} />}
          onClick={handleGoogleAuth}
        >
          Continuer avec Google
        </Button>

        <Text>
          {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
          <Button
            variant="link"
            color="brand.primary"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "S'inscrire" : "Se connecter"}
          </Button>
        </Text>
      </VStack>
    </Box>
  );
};

export default AuthForm; 