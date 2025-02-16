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
  Text
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaHome, FaBox, FaEnvelope, FaUserCircle, FaPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

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

  const handleClick = () => {
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent bg="white">
        <DrawerCloseButton color="brand.text" />
        <DrawerHeader borderBottomWidth="1px" color="brand.text">
          Menu
        </DrawerHeader>

        <DrawerBody>
          <VStack spacing={4} align="stretch" mt={4}>
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

            {/* Spacer pour pousser le bouton de profil vers le bas */}
            <VStack mt="auto" position="absolute" bottom={8} width="90%">
              <Button
                as={RouterLink}
                to={user ? "/profile" : "/auth"}
                variant="outline"
                width="full"
                leftIcon={<Icon as={FaUserCircle} />}
                color="brand.text"
                borderColor="brand.secondary"
                _hover={{
                  bg: 'brand.background'
                }}
                onClick={handleClick}
              >
                {user ? 'Mon compte' : 'Connexion / Inscription'}
              </Button>
            </VStack>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default Sidebar;
