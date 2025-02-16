import React, { Fragment } from 'react';
import { Box, Button, Text, Heading, VStack, HStack } from '@chakra-ui/react';
import SEO from '../components/common/SEO';

function Home(): JSX.Element {
  return (
    <Fragment>
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
              variant="solid"
              bg="brand.primary"
              color="white"
              _hover={{ 
                bg: 'brand.primaryDark'
              }}
              _active={{
                bg: 'brand.primary',
                transform: 'scale(0.98)'
              }}
            >
              Bouton Primary
            </Button>
            <Button 
              variant="outline"
              bg= 'brand.secondary'
              borderColor="brand.secondary"
              color="white"
              _hover={{ bg: 'brand.background', color: 'brand.secondary' }}
              _active={{
                bg: 'brand.primaryDark',
                transform: 'scale(0.98)'
              }}
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
    </Fragment>
  );
}

export default Home; 