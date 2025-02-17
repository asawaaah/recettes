import React from 'react';
import { Box, Image, Text, Heading, HStack, VStack, Flex, useMediaQuery } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const RecipeListItem = ({ title, subtitle, prep_time, cook_time, servings, recipe_images, profile, id }) => {
  const navigate = useNavigate();
  const mainImage = recipe_images?.find(img => img.is_main) || recipe_images?.[0];
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  const createSlug = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleClick = () => {
    const recipeSlug = `${createSlug(title)}-${id}`;
    navigate(`/recipe/${recipeSlug}`);
  };

  return (
    <Box
      as="article"
      bg="white"
      borderRadius={isMobile ? "none" : "lg"}
      overflow="hidden"
      boxShadow={isMobile ? "none" : "sm"}
      borderBottom={isMobile ? "1px solid" : "none"}
      borderColor="gray.200"
      transition="all 0.2s"
      _hover={{ transform: isMobile ? 'none' : 'translateY(-2px)', boxShadow: isMobile ? 'none' : 'md' }}
      onClick={handleClick}
      className="custom-button-animation"
      cursor="pointer"
      width={isMobile ? "100vw" : "100%"}
      mx={isMobile ? "-4" : "0"}
    >
      <Flex>
        <Image
          src={mainImage?.image_url || '/placeholder-recipe.jpg'}
          alt={title}
          objectFit="cover"
          w="120px"
          h="120px"
        />
        
        <Box p={4} flex="1">
          <VStack align="start" spacing={2}>
            <Heading 
              size="md" 
              color="brand.text"
              noOfLines={1}
            >
              {title}
            </Heading>
            
            <Text 
              color="gray.600" 
              fontSize="sm"
              noOfLines={2}
            >
              {subtitle}
            </Text>

            <HStack 
              spacing={4} 
              fontSize="sm" 
              color="brand.secondary"
              mt="auto"
            >
              {servings && <Text>🍽️ {servings}</Text>}
              {(prep_time || cook_time) && <Text>⏲️ {prep_time + cook_time} min</Text>}
            </HStack>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default RecipeListItem; 