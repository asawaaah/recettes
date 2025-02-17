import React, { useEffect, useState, useCallback, memo, Suspense } from 'react';
import { 
  Box, 
  Heading, 
  Text,
  VStack,
  useMediaQuery,
  IconButton,
  Flex,
  Tooltip,
  SimpleGrid,
  Image,
  Center
} from '@chakra-ui/react';
// Import sélectif des icônes
import { BsGrid3X3GapFill, BsListUl } from 'react-icons/bs';
import { supabase } from '../config/supabaseClient';

// Lazy load avec les bons chemins
const Card = memo(React.lazy(() => 
  import('../components/common/Card')
));

const RecipeListItem = memo(React.lazy(() => 
  import('../components/common/RecipeListItem')
));

// Composant optimisé pour les images avec loading intelligent
const RecipeImage = memo(({ image, title, priority = false }) => (
  <Image
    src={image.url}
    alt={title}
    width="100%"
    height="200px"
    objectFit="cover"
    loading={priority ? "eager" : "lazy"}
    decoding={priority ? "sync" : "async"}
    fetchPriority={priority ? "high" : "auto"}
  />
));

// Optimisation du skeleton loader
const CardSkeleton = memo(() => (
  <Box 
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    bg="white"
    height="350px"
  >
    <Box bg="gray.200" height="200px" />
    <VStack p={4} align="start" spacing={2}>
      <Box bg="gray.200" height="24px" width="80%" />
      <Box bg="gray.200" height="20px" width="60%" />
    </VStack>
  </Box>
));

// Fonction utilitaire optimisée pour le slug
const createSlug = (text, id) => {
  if (!text) return id;
  return `${text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}-${id}`;
};

// Hook personnalisé pour la gestion des recettes
const useRecipes = () => {
  const [state, setState] = useState({
    recipes: [],
    loading: true,
    error: null
  });

  const fetchRecipes = useCallback(async () => {
    try {
      // Première requête pour obtenir les recettes avec leurs images
      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          id,
          title,
          subtitle,
          user_id,
          servings,
          prep_time,
          cook_time,
          recipe_images (
            id,
            image_url,
            is_main
          )
        `)
        .order('created_at', { ascending: false });

      if (recipesError) throw recipesError;

      // Deuxième requête pour obtenir les profils des utilisateurs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', recipes.map(recipe => recipe.user_id));

      if (profilesError) throw profilesError;

      // Combiner les données
      const recipesWithProfiles = recipes.map(recipe => ({
        ...recipe,
        slug: `${createSlug(recipe.title)}-${recipe.id}`,
        profile: profiles.find(profile => profile.id === recipe.user_id)
      }));

      setState({ 
        recipes: recipesWithProfiles,
        loading: false, 
        error: null 
      });
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setState(prev => ({ ...prev, loading: false, error: err.message }));
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return state;
};

// Composant principal optimisé
const Recipes = () => {
  const { recipes, loading, error } = useRecipes();
  const [isGridView, setIsGridView] = useState(() => 
    localStorage.getItem('recipeViewMode') !== 'list'
  );
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  const toggleView = useCallback(() => {
    setIsGridView(prev => {
      const newValue = !prev;
      localStorage.setItem('recipeViewMode', newValue ? 'grid' : 'list');
      return newValue;
    });
  }, []);

  if (error) {
    return (
      <Center minH="50vh">
        <Text color="red.500">Erreur: {error}</Text>
      </Center>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color="brand.text">Recettes</Heading>
        <Tooltip label={isGridView ? "Vue liste" : "Vue grille"}>
          <IconButton
            icon={isGridView ? <BsListUl /> : <BsGrid3X3GapFill />}
            onClick={toggleView}
            variant="ghost"
            aria-label="Changer la vue"
          />
        </Tooltip>
      </Flex>

      <SimpleGrid 
        columns={{ base: 1, md: isGridView ? 2 : 1, lg: isGridView ? 3 : 1 }} 
        spacing={6}
      >
        {loading ? (
          [...Array(6)].map((_, i) => <CardSkeleton key={i} />)
        ) : (
          recipes.map((recipe, index) => {
            const isAboveTheFold = index < (isGridView ? 6 : 3);
            return (
              <Suspense key={recipe.id} fallback={<CardSkeleton />}>
                {isGridView ? (
                  <Card 
                    title={recipe.title}
                    subtitle={recipe.subtitle}
                    servings={recipe.servings}
                    prep_time={recipe.prep_time}
                    cook_time={recipe.cook_time}
                    recipe_images={recipe.recipe_images}
                    profiles={recipe.profiles}
                    id={recipe.id}
                    priority={isAboveTheFold}
                  />
                ) : (
                  <RecipeListItem 
                    title={recipe.title}
                    subtitle={recipe.subtitle}
                    servings={recipe.servings}
                    prep_time={recipe.prep_time}
                    cook_time={recipe.cook_time}
                    recipe_images={recipe.recipe_images}
                    profile={recipe.profile}
                    id={recipe.id}
                    priority={isAboveTheFold}
                  />
                )}
              </Suspense>
            );
          })
        )}
      </SimpleGrid>
    </Box>
  );
};

export default memo(Recipes); 