import React from 'react';
import { 
  Flex, 
  IconButton, 
  Button,
  useDisclosure,
  Icon,
  Container,
  Box
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

  return (
    <>
      <Box
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        height="80px"
        zIndex={1000}
        bg="brand.primary"
        boxShadow="0 2px 4px rgba(0,0,0,0.1)"
      >
        <Container maxW="1200px" height="100%">
          <Flex 
            height="100%" 
            justify="space-between" 
            align="center"
            px={4}
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
              onClick={() => navigate(user ? '/add-recipe' : '/locked-content')}
            >
              Ajouter une recette
            </Button>
          </Flex>
        </Container>
      </Box>

      <Sidebar isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default NavBar; 