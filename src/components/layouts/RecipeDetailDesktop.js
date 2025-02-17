import React from 'react';
import { 
  VStack, 
  Heading, 
  Text, 
  HStack, 
  Box, 
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Grid
} from '@chakra-ui/react';
import { BsThreeDotsVertical, BsPencil, BsTrash } from 'react-icons/bs';

const RecipeDetailDesktop = ({ recipe, isOwner, recipeId, onDeleteClick, navigate }) => (
  <VStack spacing={8} align="stretch">
    <Flex justify="space-between" align="center">
      <Heading size="xl" color="brand.text">
        {recipe.title}
      </Heading>
      {isOwner && (
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<BsThreeDotsVertical />}
            variant="ghost"
            aria-label="Options"
          />
          <MenuList>
            <MenuItem 
              icon={<BsPencil />} 
              onClick={() => navigate(`/recipe/edit/${recipeId}`)}
            >
              Modifier
            </MenuItem>
            <MenuItem 
              icon={<BsTrash />} 
              color="red.500"
              onClick={onDeleteClick}
            >
              Supprimer
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </Flex>

    {recipe.recipe_images?.length > 0 && (
      <Box position="relative" width="100%" height="500px" borderRadius="xl" overflow="hidden">
        <Image
          src={recipe.recipe_images[0].image_url}
          alt={recipe.title}
          width="100%"
          height="100%"
          objectFit="cover"
          loading="eager"
          crossOrigin="anonymous"
        />
      </Box>
    )}

    <Text fontSize="xl" color="gray.600">
      {recipe.subtitle}
    </Text>

    <HStack spacing={6} color="gray.600">
      <Flex align="center" gap={2}>
        <Text fontSize="2xl">🍽️</Text>
        <Text>{recipe.servings} portions</Text>
      </Flex>
      <Flex align="center" gap={2}>
        <Text fontSize="2xl">⏲️</Text>
        <Text>{recipe.prep_time + recipe.cook_time} min</Text>
      </Flex>
      <Flex align="center" gap={2}>
        <Text fontSize="2xl">👩‍🍳</Text>
        <Text>Par {recipe.profile?.username}</Text>
      </Flex>
    </HStack>

    <Grid templateColumns="repeat(2, 1fr)" gap={8} mt={4}>
      <Box>
        <Heading size="lg" mb={4} color="brand.text">
          Ingrédients
        </Heading>
        <Box dangerouslySetInnerHTML={{ __html: recipe.ingredients }} />
      </Box>
      <Box>
        <Heading size="lg" mb={4} color="brand.text">
          Instructions
        </Heading>
        <Box dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
      </Box>
    </Grid>
  </VStack>
);

export default RecipeDetailDesktop; 