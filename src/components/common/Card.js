import React, { memo } from 'react';
import { Box, Image, Text, VStack, Heading, HStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import '../../styles/components/buttons.css';

// Fonction utilitaire déplacée hors du composant
const createSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const Card = memo(({ title, subtitle, servings, prep_time, cook_time, recipe_images, profile, id }) => {
  const mainImage = recipe_images?.find(img => img.is_main) || recipe_images?.[0];
  const recipeSlug = `${createSlug(title)}-${id}`;

  return (
    <Box
      as={RouterLink}
      to={`/recipe/${recipeSlug}`}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-4px)' }}
      role="group"
    >
      {mainImage && (
        <Image
          src={mainImage.image_url}
          alt={title}
          height="200px"
          width="100%"
          objectFit="cover"
          loading="lazy"
          decoding="async"
        />
      )}

      <VStack p={4} align="start" height="calc(100% - 200px)">
        <Heading 
          size="md" 
          color="brand.text"
          noOfLines={2}
        >
          {title}
        </Heading>
        
        {subtitle && (
          <Text 
            color="gray.600" 
            fontSize="sm"
            noOfLines={2}
          >
            {subtitle}
          </Text>
        )}
        
        <HStack spacing={4} color="gray.600" mt="auto">
          {servings && (
            <Text>🍽️ {servings}</Text>
          )}
          
          {(prep_time || cook_time) && (
            <Text>⏲️ {prep_time + cook_time}min</Text>
          )}
        </HStack>
      </VStack>
    </Box>
  );
});

Card.displayName = 'Card';

export default Card;
