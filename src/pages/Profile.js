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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Alert,
  AlertIcon,
  Badge,
  HStack,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { LockIcon } from '@chakra-ui/icons';

const Profile = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUsername, setHasUsername] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // États pour le changement de mot de passe
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Vérifier si l'utilisateur utilise Google
  const isGoogleUser = user?.app_metadata?.provider === 'google';

  // Ajoutez cet état
  const [hasPassword, setHasPassword] = useState(false);

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

  // Dans votre useEffect ou là où vous chargez les données utilisateur
  useEffect(() => {
    const checkUserPassword = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // Un utilisateur a un mot de passe si c'est marqué dans ses métadonnées
        const hasDefinedPassword = user.user_metadata?.has_password === true;

        console.log('Password status:', {
          user_metadata: user.user_metadata,
          hasDefinedPassword
        });

        setHasPassword(hasDefinedPassword);
      } catch (error) {
        console.error('Erreur lors de la vérification du mot de passe:', error);
      }
    };

    if (user) {
      checkUserPassword();
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

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      if (isGoogleUser) {
        // Pour les utilisateurs Google, on ajoute simplement un mot de passe
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });
        if (error) throw error;
      } else {
        // Pour les utilisateurs email, on vérifie d'abord l'ancien mot de passe
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        });

        if (signInError) {
          throw new Error("Mot de passe actuel incorrect");
        }

        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });
        if (error) throw error;
      }

      toast({
        title: isGoogleUser ? "Mot de passe créé" : "Mot de passe mis à jour",
        status: "success",
        duration: 3000,
      });
      onClose();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
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
            <HStack>
              <Text>
                <strong>Email:</strong> {user?.email}
              </Text>
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

            <VStack align="start" spacing={4} w="full">
              <Heading size="md">Mot de passe</Heading>
              {hasPassword ? (
                <Button
                  leftIcon={<LockIcon />}
                  onClick={() => navigate('/request-password-reset')}
                  variant="outline"
                >
                  Réinitialiser le mot de passe
                </Button>
              ) : (
                <Button
                  leftIcon={<LockIcon />}
                  onClick={() => navigate('/reset-password')}
                  variant="outline"
                >
                  Créer un mot de passe
                </Button>
              )}
            </VStack>

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

        {/* Modal pour le changement de mot de passe */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {isGoogleUser && !user?.user_metadata?.has_password 
                ? "Créer un mot de passe" 
                : "Changer le mot de passe"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                {!isGoogleUser && (
                  <FormControl>
                    <FormLabel>Mot de passe actuel</FormLabel>
                    <InputGroup>
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <InputRightElement>
                        <IconButton
                          icon={showCurrentPassword ? <ViewOffIcon /> : <ViewIcon />}
                          variant="ghost"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          aria-label={showCurrentPassword ? "Masquer" : "Afficher"}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                )}

                <FormControl>
                  <FormLabel>Nouveau mot de passe</FormLabel>
                  <InputGroup>
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <InputRightElement>
                      <IconButton
                        icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                        variant="ghost"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-label={showNewPassword ? "Masquer" : "Afficher"}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormHelperText>
                    Au moins 6 caractères
                  </FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <InputGroup>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement>
                      <IconButton
                        icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                        variant="ghost"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Masquer" : "Afficher"}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  colorScheme="brand"
                  onClick={handlePasswordUpdate}
                  isLoading={loading}
                  w="full"
                >
                  {isGoogleUser && !user?.user_metadata?.has_password 
                    ? "Créer" 
                    : "Mettre à jour"}
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default Profile; 