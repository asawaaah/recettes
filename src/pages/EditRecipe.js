import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Center,
  Spinner,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';
import DurationPicker from '../components/DurationPicker';
import RichTextEditor from '../components/RichTextEditor';
import ImageUpload from '../components/ImageUpload';
import DOMPurify from 'dompurify';
import { 
  BsThreeDotsVertical, 
  BsPencil, 
  BsTrash, 
  BsArrowLeft,
  BsSave,
  BsImage,
  BsX
} from 'react-icons/bs';

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [originalRecipe, setOriginalRecipe] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    servings: 1,
    prep_time: 0,
    cook_time: 0,
    ingredients: '',
    instructions: ''
  });

  console.log('Current URL:', window.location.pathname);
  console.log('EditRecipe mounted, id:', id);
  console.log('Current user:', user);

  // Configurations des éditeurs (identiques à AddRecipe)
  const ingredientsEditorConfig = {
    toolbar: [['bold'], [{ 'list': 'bullet' }], ['clean']],
    formats: ['bold', 'list', 'bullet'],
    placeholder: 'Par exemple:\n• 200g de farine\n• 3 œufs\n• 1 pincée de sel'
  };

  const instructionsEditorConfig = {
    toolbar: [
      ['bold', 'italic'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
    formats: ['bold', 'italic', 'list', 'bullet', 'ordered'],
    placeholder: 'Par exemple:\n1. Préchauffer le four à 180°C\n2. Mélanger les ingrédients secs'
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      setIsLoading(true);
      try {
        const urlId = window.location.pathname.split('/').pop();
        const recipeId = id || urlId;

        console.log('Using recipe ID:', recipeId);

        if (!recipeId) {
          console.error('No recipe ID provided');
          navigate('/');
          return;
        }

        if (!user) {
          console.error('No user authenticated');
          navigate('/');
          return;
        }

        console.log('Fetching recipe with id:', recipeId);

        const { data: recipe, error } = await supabase
          .from('recipes')
          .select(`
            *,
            recipe_images (
              id,
              image_url,
              storage_path,
              is_main
            )
          `)
          .eq('id', recipeId)
          .single();

        console.log('Supabase response:', { recipe, error });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (!recipe) {
          console.log('No recipe found');
          navigate('/');
          return;
        }

        console.log('Recipe found:', recipe);

        if (recipe.user_id !== user.id) {
          console.log('User not authorized');
          navigate('/');
          return;
        }

        setOriginalRecipe(recipe);
        setFormData({
          title: recipe.title || '',
          subtitle: recipe.subtitle || '',
          servings: recipe.servings || 1,
          prep_time: recipe.prep_time || 0,
          cook_time: recipe.cook_time || 0,
          ingredients: recipe.ingredients || '',
          instructions: recipe.instructions || ''
        });
        
        if (recipe.recipe_images && recipe.recipe_images.length > 0) {
          const formattedImages = recipe.recipe_images.map(img => ({
            url: img.image_url,
            path: img.storage_path
          }));
          setImages(formattedImages);
        }

      } catch (error) {
        console.error('Error fetching recipe:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la recette",
          status: "error",
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id, user, navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const sanitizedIngredientsHtml = DOMPurify.sanitize(formData.ingredients, {
        ALLOWED_TAGS: ['p', 'br', 'ul', 'li', 'strong'],
        ALLOWED_ATTR: []
      });

      const sanitizedInstructionsHtml = DOMPurify.sanitize(formData.instructions, {
        ALLOWED_TAGS: ['p', 'br', 'ol', 'ul', 'li', 'strong', 'em'],
        ALLOWED_ATTR: []
      });

      const recipeData = {
        subtitle: formData.subtitle,
        servings: formData.servings,
        prep_time: formData.prep_time,
        cook_time: formData.cook_time,
        ingredients: sanitizedIngredientsHtml,
        instructions: [sanitizedInstructionsHtml]
      };

      const { error: updateError } = await supabase
        .from('recipes')
        .update(recipeData)
        .eq('id', originalRecipe.id);

      if (updateError) throw updateError;

      // Gérer les images
      if (images.length > 0) {
        // Supprimer les anciennes images
        await supabase
          .from('recipe_images')
          .delete()
          .eq('recipe_id', originalRecipe.id);

        // Ajouter les nouvelles images
        const imagePromises = images.map((img, index) => {
          return supabase
            .from('recipe_images')
            .insert({
              recipe_id: originalRecipe.id,
              image_url: img.url,
              storage_path: img.path,
              is_main: index === 0
            });
        });

        await Promise.all(imagePromises);
      }

      toast({
        title: "Recette mise à jour avec succès!",
        status: "success",
        duration: 3000,
      });
      navigate(`/recipe/${id}`);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box p={8} maxW="800px" mx="auto">
      <VStack spacing={6} as="form" onSubmit={handleSubmit}>
        <Flex w="100%" justify="space-between" align="center">
          <IconButton
            icon={<BsArrowLeft />}
            onClick={() => navigate(-1)}
            variant="ghost"
            aria-label="Retour"
          />
          <Heading color="brand.text">Modifier la recette</Heading>
          <IconButton
            type="submit"
            icon={<BsSave />}
            isLoading={isLoading}
            loadingText="Mise à jour..."
            colorScheme="blue"
            variant="solid"
            bg="brand.primary"
            color="white"
            aria-label="Sauvegarder"
          />
        </Flex>

        <FormControl>
          <FormLabel>Titre</FormLabel>
          <Input
            value={formData.title}
            isReadOnly
            bg="gray.100"
            _hover={{ cursor: 'not-allowed' }}
            _focus={{ borderColor: 'gray.300' }}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Sous-titre</FormLabel>
          <Input
            value={formData.subtitle}
            onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
            bg="white"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Nombre de portions</FormLabel>
          <NumberInput
            min={1}
            value={formData.servings}
            onChange={(value) => setFormData(prev => ({ ...prev, servings: parseInt(value) }))}
            bg="white"
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <HStack spacing={4} width="100%">
          <DurationPicker
            label="Temps de préparation"
            value={formData.prep_time}
            onChange={(value) => setFormData(prev => ({ ...prev, prep_time: value }))}
            isRequired
          />
          <DurationPicker
            label="Temps de cuisson"
            value={formData.cook_time}
            onChange={(value) => setFormData(prev => ({ ...prev, cook_time: value }))}
            isRequired
          />
        </HStack>

        <RichTextEditor
          label="Ingrédients"
          value={formData.ingredients}
          onChange={(content) => setFormData(prev => ({ ...prev, ingredients: content }))}
          isRequired
          config={ingredientsEditorConfig}
        />

        <RichTextEditor
          label="Instructions"
          value={formData.instructions}
          onChange={(content) => setFormData(prev => ({ ...prev, instructions: content }))}
          isRequired
          config={instructionsEditorConfig}
        />

        <FormControl>
          <FormLabel>Images</FormLabel>
          <ImageUpload 
            images={images}
            setImages={setImages}
            userId={user.id}
            addIcon={<BsImage />}
            removeIcon={<BsX />}
          />
        </FormControl>
      </VStack>
    </Box>
  );
};

const createSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export default EditRecipe; 