import React from 'react';
import { 
  VStack,
  Box,
  Image,
  Heading,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { BsThreeDotsVertical, BsPencil, BsTrash } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const RecipeDetailMobile = ({ recipe, isOwner, recipeId }) => {
  const navigate = useNavigate();
  
  return (
    <Box position="relative">
      {/* Section Image avec overlay - Sans padding */}
      {recipe.recipe_images?.length > 0 && (
        <Box 
          position="relative" 
          height="200px"
          width="100vw"
          left="50%"
          right="50%"
          marginLeft="-50vw"
          marginRight="-50vw"
        >
          <Image
            src={recipe.recipe_images[0].image_url}
            alt={recipe.title}
            width="100%"
            height="100%"
            objectFit="cover"
            objectPosition="center 60%"
          />
          
          {/* Overlay dégradé */}
          <Box
            position="absolute"
            inset="0"
            background="linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)"
          />

          {/* Menu Options (3 points) - Maintenant en bas à droite */}
          {isOwner && (
            <Box position="absolute" bottom={6} right={6} zIndex={2}>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<BsThreeDotsVertical />}
                  variant="ghost"
                  color="white"
                  aria-label="Options"
                  _hover={{ bg: 'whiteAlpha.200' }}
                />
                <MenuList>
                  <MenuItem 
                    icon={<BsPencil />} 
                    onClick={() => {
                      console.log('Recipe ID for edit:', recipe.id);
                      navigate(`/recipe/edit/${recipe.id}`);
                    }}
                  >
                    Modifier
                  </MenuItem>
                  <MenuItem icon={<BsTrash />}>
                    Supprimer
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          )}

          {/* Titre et sous-titre */}
          <VStack
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            p={6}
            spacing={2}
            align="start"
          >
            <Heading color="white" textShadow="0 2px 4px rgba(0,0,0,0.3)">
              {recipe.title}
            </Heading>
            <Text fontSize="lg" color="whiteAlpha.900" textShadow="0 1px 2px rgba(0,0,0,0.3)">
              {recipe.subtitle}
            </Text>
          </VStack>
        </Box>
      )}

      {/* Contenu avec padding */}
      <Box px={4} py={6}>
        <Flex justify="space-between" mb={6}>
          <Flex align="center" gap={2}>
            <Text fontSize="xl">🍽️</Text>
            <Text>{recipe.servings} portions</Text>
          </Flex>
          <Flex align="center" gap={2}>
            <Text fontSize="xl">⏲️</Text>
            <Text>{recipe.prep_time + recipe.cook_time} min</Text>
          </Flex>
          <Flex align="center" gap={2}>
            <Text fontSize="xl">👩‍🍳</Text>
            <Text>Par {recipe.profile?.username}</Text>
          </Flex>
        </Flex>

        <Tabs isFitted variant="enclosed" colorScheme="brand">
          <TabList mb={4}>
            <Tab>Ingrédients</Tab>
            <Tab>Instructions</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <Box dangerouslySetInnerHTML={{ __html: recipe.ingredients }} />
            </TabPanel>
            <TabPanel px={0}>
              <Box dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default RecipeDetailMobile; 