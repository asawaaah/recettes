import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';
import DurationPicker from '../components/DurationPicker';
import RichTextEditor from '../components/RichTextEditor';
import ImageUpload from '../components/ImageUpload';
import '../styles/components/buttons.css';
import DOMPurify from 'dompurify';

const AddRecipe = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    servings: 1,
    prep_time: 0,
    cook_time: 0,
    ingredients: '',
    instructions: ''
  });

  // Configuration de l'éditeur pour les ingrédients
  const ingredientsEditorConfig = {
    toolbar: [
      ['bold'],
      [{ 'list': 'bullet' }],
      ['clean']
    ],
    formats: ['bold', 'list', 'bullet'],
    placeholder: 'Par exemple:\n• 200g de farine\n• 3 œufs\n• 1 pincée de sel'
  };

  // Configuration de l'éditeur pour les instructions
  const instructionsEditorConfig = {
    toolbar: [
      ['bold', 'italic'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
    formats: ['bold', 'italic', 'list', 'bullet', 'ordered'],
    placeholder: 'Par exemple:\n1. Préchauffer le four à 180°C\n2. Mélanger les ingrédients secs\n3. Ajouter les œufs un à un'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Nettoyer et structurer le HTML
      const sanitizedIngredientsHtml = DOMPurify.sanitize(formData.ingredients, {
        ALLOWED_TAGS: ['p', 'br', 'ul', 'li', 'strong'],
        ALLOWED_ATTR: []
      });

      const sanitizedInstructionsHtml = DOMPurify.sanitize(formData.instructions, {
        ALLOWED_TAGS: ['p', 'br', 'ol', 'ul', 'li', 'strong', 'em'],
        ALLOWED_ATTR: []
      });

      const recipeData = {
        user_id: user.id,
        title: formData.title,
        subtitle: formData.subtitle,
        servings: formData.servings,
        prep_time: formData.prep_time,
        cook_time: formData.cook_time,
        ingredients: sanitizedIngredientsHtml,
        instructions: [sanitizedInstructionsHtml]
      };

      console.log('Données à envoyer:', recipeData);

      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert([recipeData])
        .select()
        .single();

      if (recipeError) throw recipeError;

      // 2. Si des images ont été uploadées, les associer à la recette
      if (images.length > 0) {
        const imagePromises = images.map((img, index) => {
          return supabase
            .from('recipe_images')
            .insert({
              recipe_id: recipe.id,
              image_url: img.url,
              storage_path: img.path,
              is_main: index === 0 // La première image est l'image principale
            });
        });

        await Promise.all(imagePromises);

        // 3. Mettre à jour main_image_id dans la recette avec l'ID de la première image
        const { data: mainImage } = await supabase
          .from('recipe_images')
          .select('id')
          .eq('recipe_id', recipe.id)
          .eq('is_main', true)
          .single();

        if (mainImage) {
          await supabase
            .from('recipes')
            .update({ main_image_id: mainImage.id })
            .eq('id', recipe.id);
        }
      }

      toast({
        title: "Recette ajoutée avec succès!",
        status: "success",
        duration: 3000,
      });
      navigate('/recipes');
    } catch (error) {
      console.error('Erreur détaillée:', error);
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

  return (
    <Box p={8} maxW="800px" mx="auto" className="fade-in">
      <VStack spacing={6} as="form" onSubmit={handleSubmit}>
        <Heading color="brand.text">Ajouter une nouvelle recette</Heading>

        <FormControl isRequired>
          <FormLabel>Titre</FormLabel>
          <Input
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            bg="white"
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
          loadingText="Envoi en cours..."
          className="custom-button-animation"
          variant="solid"
          bg="brand.primary"
          color="white"
          width="full"
        >
          Ajouter la recette
        </Button>
      </VStack>
    </Box>
  );
};

// Fonctions utilitaires pour extraire les données structurées
const extractIngredientsList = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const items = doc.querySelectorAll('li');
  return Array.from(items).map(item => item.textContent.trim());
};

const extractInstructionsList = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const items = doc.querySelectorAll('li');
  return Array.from(items).map(item => ({
    "@type": "HowToStep",
    "text": item.textContent.trim()
  }));
};

export default AddRecipe; 