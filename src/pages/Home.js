import React from 'react';
import { Box, Button, Text, Heading, VStack, HStack } from '@chakra-ui/react';
import SEO from '../components/common/SEO';

function Home() {
  return (
    <>
      <SEO 
        title="Accueil"
        description="Découvrez nos meilleures recettes de cuisine"
        keywords="recettes, cuisine, fait maison, cooking"
      />
      <Box p={8}>
        <VStack spacing={6} align="center">
          <Heading size="2xl" color="brand.text">Bienvenue</Heading>
          <Text fontSize="xl" color="brand.text">Voici notre thème personnalisé</Text>
          
          <HStack spacing={4}>
            <Button 
              colorScheme="brand"
              bg="brand.primary"
              color="white"
              _hover={{ bg: 'brand.accent' }}
            >
              Bouton Primary
            </Button>
            <Button 
              variant="outline"
              borderColor="brand.secondary"
              color="brand.text"
              _hover={{ bg: 'brand.accent', color: 'white' }}
            >
              Bouton Secondary
            </Button>
          </HStack>

          <Box p={4} bg="brand.accent" borderRadius="md">
            <Text color="brand.text">Exemple de box avec couleur d'accent</Text>
          </Box>

          <Box p={4} bg="brand.success" borderRadius="md" color="white">
            <Text>Message de succès</Text>
          </Box>
        </VStack>
      </Box>
    </>
  );
}

export default Home; 