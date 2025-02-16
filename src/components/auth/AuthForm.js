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
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { supabase } from '../../config/supabaseClient';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const toast = useToast();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = isLogin 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;
      
      toast({
        title: isLogin ? "Connexion réussie!" : "Inscription réussie!",
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

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box p={8} maxW="400px" mx="auto">
      <VStack spacing={4} as="form" onSubmit={handleEmailAuth}>
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
        >
          Continuer avec Google
        </Button>
      </VStack>
    </Box>
  );
};

export default AuthForm; 