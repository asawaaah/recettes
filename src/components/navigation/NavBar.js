import React from 'react';
import { 
  Flex, 
  IconButton, 
  Button, 
  useDisclosure,
  Icon
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { AiOutlinePlus } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../layout/Sidebar';

const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddRecipe = () => {
    if (!user) {
      navigate('/locked-content');
    } else {
      navigate('/add-recipe');
    }
  };

  return (
    <>
      <Flex
        as="nav"
        bg="brand.primary"
        p={4}
        color="white"
        align="center"
        justify="space-between"
        position="fixed"
        top={0}
        width="100%"
        zIndex={1000}
      >
        <IconButton
          icon={<HamburgerIcon />}
          variant="ghost"
          color="white"
          onClick={onOpen}
          _hover={{ bg: 'brand.primaryDark' }}
          aria-label="Menu"
        />

        <Button
          leftIcon={<Icon as={AiOutlinePlus} />}
          variant="solid"
          bg="white"
          color="brand.primary"
          onClick={handleAddRecipe}
          _hover={{ bg: 'gray.100' }}
        >
          Ajouter une recette
        </Button>
      </Flex>

      <Sidebar isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default NavBar; 