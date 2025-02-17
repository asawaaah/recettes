import React, { useEffect, useState } from 'react';
import { 
  SimpleGrid, 
  Box, 
  Heading, 
  Spinner, 
  Center, 
  Text,
  VStack,
  useMediaQuery,
  IconButton,
  Flex,
  Tooltip
} from '@chakra-ui/react';
import { BsGrid, BsListUl } from 'react-icons/bs';
import Card from '../components/common/Card';
import RecipeListItem from '../components/common/RecipeListItem';
import { supabase } from '../config/supabaseClient';
import { useAuth } from '../context/AuthContext';
import LockedContent from '../components/blocks/LockedContent';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const [viewMode, setViewMode] = useState(() => {
    // Par défaut : liste sur mobile, grille sur desktop
    const savedMode = localStorage.getItem('recipeViewMode');
    return savedMode || (isMobile ? 'list' : 'grid');
  });

  useEffect(() => {
    if (user) {
      fetchRecipes();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Sauvegarder la préférence d'affichage
  useEffect(() => {
    localStorage.setItem('recipeViewMode', viewMode);
  }, [viewMode]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      console.log('Fetching recipes...');

      // Première requête pour obtenir les recettes et leurs images
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_images (
            image_url,
            is_main
          )
        `)
        .order('created_at', { ascending: false });

      if (recipesError) throw recipesError;

      // Si nous avons des recettes, récupérons les profils correspondants
      if (recipesData && recipesData.length > 0) {
        // Récupérer tous les user_id uniques
        const userIds = [...new Set(recipesData.map(recipe => recipe.user_id))];
        
        // Deuxième requête pour obtenir les profils
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        // Combiner les données
        const combinedData = recipesData.map(recipe => ({
          ...recipe,
          profiles: profilesData?.find(profile => profile.id === recipe.user_id)
        }));

        console.log('Combined data:', combinedData);
        setRecipes(combinedData);
      } else {
        setRecipes([]);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  if (!user) return <LockedContent />;
  if (loading) return <Center h="200px"><Spinner size="xl" color="brand.primary" /></Center>;
  if (error) return <Center h="200px"><Text color="red.500">Erreur: {error}</Text></Center>;

  return (
    <Box p={4} maxW="1200px" mx="auto" className="fade-in">
      <Flex 
        justify="space-between" 
        align="center" 
        mb={8}
        direction={{ base: 'column', sm: 'row' }}
        gap={4}
      >
        <Heading 
          color="brand.text"
          fontSize={{ base: "2xl", md: "3xl" }}
        >
          Mes Recettes ({recipes.length})
        </Heading>

        <Tooltip 
          label={viewMode === 'grid' ? 'Voir en liste' : 'Voir en grille'}
          placement="left"
        >
          <IconButton
            icon={viewMode === 'grid' ? <BsListUl /> : <BsGrid />}
            onClick={toggleViewMode}
            variant="ghost"
            color="brand.primary"
            _hover={{ bg: 'brand.background' }}
            aria-label="Changer le mode d'affichage"
            size="lg"
          />
        </Tooltip>
      </Flex>
      
      {recipes.length === 0 ? (
        <Center>
          <Text fontSize="lg" color="gray.600">
            Aucune recette pour le moment. Commencez par en ajouter une !
          </Text>
        </Center>
      ) : viewMode === 'list' ? (
        <VStack 
          spacing={isMobile ? 0 : 4}
          w="100%"
          divider={isMobile ? null : <Box h="1px" bg="gray.200" />}
        >
          {recipes.map((recipe) => (
            <RecipeListItem
              key={recipe.id}
              {...recipe}
            />
          ))}
        </VStack>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {recipes.map((recipe) => (
            <Card
              key={recipe.id}
              {...recipe}
              profiles={recipe.profiles}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Recipes; 