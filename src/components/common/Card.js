import React from 'react';
import { Box, Image, Text, VStack, Heading, HStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import '../../styles/components/buttons.css';

const Card = ({ title, subtitle, servings, prep_time, cook_time, recipe_images, profiles }) => {
  // Trouver l'image principale
  const mainImage = recipe_images?.find(img => img.is_main) || recipe_images?.[0];

  // Fonction pour créer un slug simple (pour l'instant sans le nom d'utilisateur)
  const createSlug = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Créer l'URL complète avec le titre et le nom d'utilisateur
  const recipeSlug = `${createSlug(title)}-par-${createSlug(profiles?.username || 'anonyme')}`;

  return (
    <Box
      as={RouterLink}
      to={`/recipe/${recipeSlug}`}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      transition="all 0.3s"
      _hover={{ 
        transform: 'translateY(-2px)',
        boxShadow: 'lg'
      }}
      w="100%"
    >
      {mainImage && (
        <Box h="200px" overflow="hidden">
          <Image
            src={mainImage.image_url}
            alt={title}
            w="100%"
            h="100%"
            objectFit="cover"
            fallback={
              <Box w="100%" h="100%" bg="gray.100" display="flex" alignItems="center" justifyContent="center">
                <Text color="gray.400">Image non disponible</Text>
              </Box>
            }
          />
        </Box>
      )}
      
      <VStack p={5} align="start" spacing={3}>
        <Heading size="md" color="brand.text" noOfLines={2}>
          {title}
        </Heading>
        
        {subtitle && (
          <Text color="gray.600" noOfLines={2}>
            {subtitle}
          </Text>
        )}
        
        <HStack spacing={4} color="gray.600" mt="auto">
          {prep_time && (
            <HStack spacing={1}>
              <Text>⏲️</Text>
              <Text>{prep_time}min</Text>
            </HStack>
          )}
          
          {cook_time && (
            <HStack spacing={1}>
              <Text>🔥</Text>
              <Text>{cook_time}min</Text>
            </HStack>
          )}
          
          {servings && (
            <HStack spacing={1}>
              <Text>🍽️</Text>
              <Text>{servings}</Text>
            </HStack>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default Card;
