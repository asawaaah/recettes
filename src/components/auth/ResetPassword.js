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
  InputGroup,
  InputRightElement,
  IconButton,
  Heading,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { supabase } from '../../config/supabaseClient';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);
    try {
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (passwordError) throw passwordError;

      const { error: metadataError } = await supabase.auth.updateUser({
        data: { has_password: true }
      });

      if (metadataError) throw metadataError;

      toast({
        title: "Mot de passe mis à jour",
        description: "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe",
        status: "success",
        duration: 5000,
      });

      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={8} maxW="400px" mx="auto">
      <VStack spacing={6} as="form" onSubmit={handlePasswordReset}>
        <Heading size="lg" color="brand.text">
          Nouveau mot de passe
        </Heading>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <Text textAlign="center" color="gray.600">
          Choisissez votre nouveau mot de passe
        </Text>

        <FormControl isRequired>
          <FormLabel>Nouveau mot de passe</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
            />
            <InputRightElement>
              <IconButton
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                variant="ghost"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Masquer" : "Afficher"}
                size="sm"
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Confirmer le mot de passe</FormLabel>
          <InputGroup>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmer le mot de passe"
            />
            <InputRightElement>
              <IconButton
                icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                variant="ghost"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Masquer" : "Afficher"}
                size="sm"
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          type="submit"
          colorScheme="brand"
          bg="brand.primary"
          w="full"
          isLoading={loading}
        >
          Mettre à jour le mot de passe
        </Button>
      </VStack>
    </Box>
  );
};

export default ResetPassword; 