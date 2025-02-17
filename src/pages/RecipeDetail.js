import React, { useState, useEffect, Suspense, lazy } from 'react';
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
  useToast,
  useMediaQuery,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Grid,
} from '@chakra-ui/react';
import { supabase } from '../config/supabaseClient';
import { useAuth } from '../context/AuthContext';
import RecipeActions from '../components/recipe/RecipeActions';
import { BsThreeDotsVertical, BsPencil, BsTrash } from 'react-icons/bs';

// Composants de layout
const DesktopLayout = lazy(() => import('../components/layouts/RecipeDetailDesktop'));
const MobileLayout = lazy(() => import('../components/layouts/RecipeDetailMobile'));
const DeleteConfirmationModal = lazy(() => import('../components/modals/DeleteConfirmationModal'));

// Composant de fallback pour les images
const ImageFallback = () => (
  <Box 
    width="100%" 
    height="300px" 
    bg="gray.100" 
    display="flex" 
    alignItems="center" 
    justifyContent="center"
  >
    <Spinner />
  </Box>
);

const RecipeDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const uuidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
        const match = slug.match(uuidRegex);
        
        if (!match) throw new Error('ID de recette invalide');
        const recipeId = match[0];

        const { data: recipe, error: recipeError } = await supabase
          .from('recipes')
          .select(`
            *,
            recipe_images (
              id,
              image_url,
              is_main
            )
          `)
          .eq('id', recipeId)
          .single();

        if (recipeError) throw recipeError;
        if (!recipe) throw new Error('Recette non trouvée');

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, username')
          .eq('id', recipe.user_id)
          .single();

        if (profileError) throw profileError;

        setRecipe({
          ...recipe,
          profile
        });

      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la recette",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate('/recipes');
      } finally {
        setLoading(false);
      }
    };

    if (slug && user) {
      fetchRecipe();
    }
  }, [slug, user, navigate, toast]);

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipe.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Recette supprimée avec succès",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate('/recipes');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la recette",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Center minH="50vh">
        <Spinner size="xl" color="brand.primary" thickness="4px" speed="0.65s" />
      </Center>
    );
  }

  if (!recipe) {
    return (
      <Center minH="50vh">
        <Text>Recette non trouvée</Text>
      </Center>
    );
  }

  const layoutProps = {
    recipe,
    isOwner: user?.id === recipe.user_id,
    recipeId: recipe.id,
    onDeleteClick: () => setIsDeleteModalOpen(true),
    navigate
  };

  return (
    <Box maxW="1200px" mx="auto" p={0}>
      <Suspense fallback={
        <Center minH="50vh">
          <Spinner size="xl" color="brand.primary" thickness="4px" speed="0.65s" />
        </Center>
      }>
        {isMobile ? (
          <MobileLayout {...layoutProps} />
        ) : (
          <DesktopLayout {...layoutProps} />
        )}
      </Suspense>

      <Suspense fallback={null}>
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          recipeName={recipe.title}
        />
      </Suspense>
    </Box>
  );
};

export default RecipeDetail; 