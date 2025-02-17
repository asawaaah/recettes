import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Image, 
  Spinner, 
  Center, 
  Button, 
  useToast,
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useMediaQuery,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaEllipsisV } from 'react-icons/fa';
import DOMPurify from 'dompurify';
import { useDisclosure } from '@chakra-ui/react';
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';

const RecipeDetail = () => {
  const { slug } = useParams(); // Maintenant on récupère le slug au lieu de l'id
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        // Première requête pour obtenir les recettes et leurs images
        const { data: recipes, error: recipesError } = await supabase
          .from('recipes')
          .select(`
            *,
            recipe_images (
              image_url,
              is_main
            )
          `);

        if (recipesError) throw recipesError;

        if (recipes && recipes.length > 0) {
          // Récupérer tous les user_id uniques
          const userIds = [...new Set(recipes.map(recipe => recipe.user_id))];
          
          // Deuxième requête pour obtenir les profils
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', userIds);

          if (profilesError) throw profilesError;

          // Combiner les données
          const recipesWithProfiles = recipes.map(recipe => ({
            ...recipe,
            profiles: profilesData?.find(profile => profile.id === recipe.user_id)
          }));

          // Trouver la recette qui correspond au slug
          const matchingRecipe = recipesWithProfiles.find(recipe => {
            const recipeSlug = `${createSlug(recipe.title)}-par-${createSlug(recipe.profiles?.username)}`;
            return recipeSlug === slug;
          });

          if (!matchingRecipe) {
            navigate('/404');
            return;
          }

          setRecipe(matchingRecipe);
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [slug, navigate]);

  // Fonction pour créer un slug (identique à celle dans Card.js)
  const createSlug = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Ajouter cette fonction pour la suppression
  const handleDelete = async () => {
    try {
      // Supprimer les images associées
      const { error: imagesError } = await supabase
        .from('recipe_images')
        .delete()
        .eq('recipe_id', recipe.id);

      if (imagesError) throw imagesError;

      // Supprimer la recette
      const { error: recipeError } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipe.id);

      if (recipeError) throw recipeError;

      toast({
        title: "Recette supprimée avec succès",
        status: "success",
        duration: 3000,
      });

      navigate('/recipes');
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur lors de la suppression",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="brand.primary" />
      </Center>
    );
  }

  if (!recipe) {
    return (
      <Center h="200px">
        <Text>Recette non trouvée</Text>
      </Center>
    );
  }

  const mainImage = recipe.recipe_images?.find(img => img.is_main) || recipe.recipe_images?.[0];

  const DesktopLayout = () => (
    <Box maxW="1200px" mx="auto" p={4}>
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center">
          <Box>
            <Heading as="h1" color="brand.text">{recipe.title}</Heading>
            <Text fontSize="lg" color="gray.600" mt={2}>{recipe.subtitle}</Text>
          </Box>
          
          {user && user.id === recipe.user_id && (
            <HStack spacing={2}>
              <IconButton
                icon={<FaEdit />}
                colorScheme="blue"
                onClick={() => navigate(`/recipe/edit/${slug}`)}
                aria-label="Modifier la recette"
              />
              <IconButton
                icon={<FaTrash />}
                colorScheme="red"
                onClick={onOpen}
                aria-label="Supprimer la recette"
              />
            </HStack>
          )}
        </Flex>

        {mainImage && (
          <Image
            src={mainImage.image_url}
            alt={recipe.title}
            borderRadius="lg"
            objectFit="cover"
            maxH="400px"
            w="100%"
          />
        )}

        <HStack spacing={4} py={4}>
          <Text>🍽️ {recipe.servings} portions</Text>
          <Text>⏲️ Préparation: {recipe.prep_time} min</Text>
          <Text>🔥 Cuisson: {recipe.cook_time} min</Text>
        </HStack>

        <Grid templateColumns="1fr 2fr" gap={8}>
          <Box position="sticky" top="20px" alignSelf="start">
            <Heading as="h2" size="lg" mb={4} color="brand.text">Ingrédients</Heading>
            <Box 
              className="recipe-ingredients"
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(recipe.ingredients) 
              }}
              sx={{
                'ul': {
                  paddingLeft: '1.2em',
                  margin: '0'
                },
                'li': {
                  marginTop: '0.8em',
                  lineHeight: '1.5',
                  fontSize: '1rem',
                  color: 'gray.700',
                  '&:first-of-type': {
                    marginTop: '0'
                  }
                }
              }}
            />
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={4} color="brand.text">Instructions</Heading>
            <Box 
              className="recipe-instructions"
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(recipe.instructions[0]) 
              }}
              sx={{
                'ol': {
                  paddingLeft: '1.5em',
                  margin: '0'
                },
                'li': {
                  marginBottom: '0.6em',
                  paddingLeft: '0.5em',
                  lineHeight: '1.6',
                  fontSize: '1rem',
                  color: 'gray.700'
                }
              }}
            />
          </Box>
        </Grid>
      </VStack>
    </Box>
  );

  const MobileLayout = () => (
    <Box mx="-4">
      <Box position="relative">
        {mainImage && (
          <>
            <Image
              src={mainImage.image_url}
              alt={recipe.title}
              w="100vw"
              h="195px"
              objectFit="cover"
              objectPosition="center 65%"
            />
            <Box
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              bg="linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
              p={4}
              color="white"
            >
              <Flex justify="space-between" align="center">
                <Box>
                  <Heading as="h1" size="xl">{recipe.title}</Heading>
                  <Text fontSize="lg" mt={2}>{recipe.subtitle}</Text>
                </Box>
                
                {user && user.id === recipe.user_id && (
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FaEllipsisV />}
                      variant="ghost"
                      color="white"
                      _hover={{ bg: 'whiteAlpha.200' }}
                      _active={{ bg: 'whiteAlpha.300' }}
                      aria-label="Options"
                    />
                    <MenuList bg="white" borderColor="gray.200">
                      <MenuItem 
                        icon={<FaEdit />}
                        onClick={() => navigate(`/recipe/edit/${slug}`)}
                        color="gray.700"
                        _hover={{ bg: 'gray.100' }}
                      >
                        Modifier
                      </MenuItem>
                      <MenuItem 
                        icon={<FaTrash />}
                        onClick={onOpen}
                        color="red.500"
                        _hover={{ bg: 'red.50' }}
                      >
                        Supprimer
                      </MenuItem>
                    </MenuList>
                  </Menu>
                )}
              </Flex>
            </Box>
          </>
        )}
      </Box>

      <Box px={4}>
        <HStack spacing={4} py={4}>
          <Text>🍽️ {recipe.servings} portions</Text>
          <Text>⏲️ {recipe.prep_time} min</Text>
          <Text>🔥 {recipe.cook_time} min</Text>
        </HStack>

        <Tabs 
          isFitted 
          variant="unstyled"
        >
          <TabList 
            bg="white" 
            borderRadius="full" 
            p={1}
            mb={4}
            border="1px solid"
            borderColor="brand.secondary"
          >
            <Tab
              borderRadius="full"
              _selected={{
                color: 'white',
                bg: 'brand.primary',
              }}
              _hover={{
                bg: 'brand.background',
                color: 'brand.primary'
              }}
              fontWeight="medium"
              color="brand.text"
              transition="all 0.2s"
            >
              Ingrédients
            </Tab>
            <Tab
              borderRadius="full"
              _selected={{
                color: 'white',
                bg: 'brand.primary',
              }}
              _hover={{
                bg: 'brand.background',
                color: 'brand.primary'
              }}
              fontWeight="medium"
              color="brand.text"
              transition="all 0.2s"
            >
              Instructions
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box 
                className="recipe-ingredients"
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(recipe.ingredients) 
                }}
                sx={{
                  'ul': {
                    paddingLeft: '1.2em',
                    margin: '0'
                  },
                  'li': {
                    marginTop: '0.8em',
                    lineHeight: '1.5',
                    fontSize: '1rem',
                    color: 'gray.700',
                    '&:first-of-type': {
                      marginTop: '0'
                    }
                  }
                }}
              />
            </TabPanel>
            <TabPanel>
              <Box 
                className="recipe-instructions"
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(recipe.instructions[0]) 
                }}
                sx={{
                  'ol': {
                    paddingLeft: '1.5em',
                    margin: '0'
                  },
                  'li': {
                    marginBottom: '0.6em',
                    paddingLeft: '0.5em',
                    lineHeight: '1.6',
                    fontSize: '1rem',
                    color: 'gray.700'
                  }
                }}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );

  return (
    <>
      {isLargerThan768 ? <DesktopLayout /> : <MobileLayout />}
      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleDelete}
        recipeName={recipe.title}
      />
    </>
  );
};

export default RecipeDetail; 