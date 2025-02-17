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
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';
import DurationPicker from '../components/DurationPicker';
import RichTextEditor from '../components/RichTextEditor';
import ImageUpload from '../components/ImageUpload';
import DOMPurify from 'dompurify';

const EditRecipe = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
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
      try {
        // Première requête pour obtenir les recettes et leurs images
        const { data: recipes, error: recipesError } = await supabase
          .from('recipes')
          .select(`
            *,
            recipe_images (
              image_url,
              storage_path,
              is_main
            )
          `);

        if (recipesError) throw recipesError;

        if (recipes) {
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

          // Vérification du propriétaire
          if (matchingRecipe.user_id !== user.id) {
            toast({
              title: "Accès non autorisé",
              description: "Vous ne pouvez pas modifier cette recette",
              status: "error",
              duration: 3000,
            });
            navigate('/recipes');
            return;
          }

          setOriginalRecipe(matchingRecipe);
          setFormData({
            title: matchingRecipe.title,
            subtitle: matchingRecipe.subtitle || '',
            servings: matchingRecipe.servings,
            prep_time: matchingRecipe.prep_time,
            cook_time: matchingRecipe.cook_time,
            ingredients: matchingRecipe.ingredients || '',
            instructions: matchingRecipe.instructions[0] || ''
          });

          if (matchingRecipe.recipe_images) {
            setImages(matchingRecipe.recipe_images.map(img => ({
              url: img.image_url,
              path: img.storage_path
            })));
          }
        }
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la recette",
          status: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [slug, navigate, user.id, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
      navigate(`/recipe/${slug}`);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="brand.primary" />
      </Center>
    );
  }

  return (
    <Box p={8} maxW="800px" mx="auto">
      <VStack spacing={6} as="form" onSubmit={handleSubmit}>
        <Heading color="brand.text">Modifier la recette</Heading>

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
          />
        </FormControl>

        <Button
          type="submit"
          isLoading={loading}
          loadingText="Mise à jour..."
          colorScheme="blue"
          width="full"
          className="custom-button-animation"
          variant="solid"
          bg="brand.primary"
          color="white"
        >
          Mettre à jour la recette
        </Button>
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