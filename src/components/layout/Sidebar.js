import React from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Button,
  Icon,
  Box,
  useToast
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaHome, FaBox, FaEnvelope, FaUserCircle, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabaseClient';

const MenuItem = ({ to, icon, children, onClick }) => (
  <Button
    as={RouterLink}
    to={to}
    variant="ghost"
    justifyContent="flex-start"
    width="full"
    leftIcon={<Icon as={icon} />}
    color="brand.text"
    _hover={{ bg: 'brand.background' }}
    onClick={onClick}
  >
    {children}
  </Button>
);

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Déconnexion réussie",
        status: "success",
        duration: 3000,
      });
      navigate('/');
      onClose();
    } catch (error) {
      toast({
        title: "Erreur lors de la déconnexion",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleClick = () => {
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent bg="white">
        <DrawerCloseButton color="brand.text" />
        <DrawerHeader color="brand.text">Menu</DrawerHeader>

        <DrawerBody display="flex" flexDirection="column" p={4}>
          <VStack spacing={4} align="stretch">
            <MenuItem to="/" icon={FaHome} onClick={handleClick}>
              Accueil
            </MenuItem>
            <MenuItem to="/products" icon={FaBox} onClick={handleClick}>
              Produits
            </MenuItem>
            <MenuItem to="/contact" icon={FaEnvelope} onClick={handleClick}>
              Contact
            </MenuItem>
            <MenuItem to="/add-recipe" icon={FaPlus} onClick={handleClick}>
              Ajouter une recette
            </MenuItem>
          </VStack>

          <Box mt="auto" mb={4} width="100%">
            <VStack spacing={2}>
              <Button
                as={RouterLink}
                to={user ? "/profile" : "/login"}
                variant="outline"
                width="full"
                leftIcon={<Icon as={FaUserCircle} />}
                onClick={handleClick}
              >
                {user ? 'Mon compte' : 'Connexion / Inscription'}
              </Button>

              {user && (
                <Button
                  width="full"
                  variant="solid"
                  colorScheme="red"
                  leftIcon={<Icon as={FaSignOutAlt} />}
                  onClick={handleLogout}
                >
                  Se déconnecter
                </Button>
              )}
            </VStack>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default Sidebar;
