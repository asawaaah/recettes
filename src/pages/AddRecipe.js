import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  useToast,
  Textarea,
  HStack,
  Image,
  IconButton,
  Tag,
  TagLabel,
  TagCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { MdAdd, MdDelete } from 'react-icons/md';
import { Editor } from '@tinymce/tinymce-react';
import RichTextEditor from '../components/RichTextEditor';
import DurationPicker from '../components/DurationPicker';
import ImageUpload from '../components/ImageUpload';

const AddRecipe = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [recipe, setRecipe] = useState({
    title: '',
    subtitle: '',
    servings: 4,
    prep_time: 30,
    cook_time: 30,
    ingredients: '',
    instructions: '',
    images: [],
    mainImageIndex: null,
  });

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  // Gestion des instructions
  const addInstruction = () => {
    setRecipe(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const updateInstruction = (index, value) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = value;
    setRecipe(prev => ({
      ...prev,
      instructions: newInstructions
    }));
  };

  // Gestion des images
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('recipe-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('recipe-images')
          .getPublicUrl(filePath);

        setRecipe(prev => ({
          ...prev,
          images: [...prev.images, { url: publicUrl, path: filePath }]
        }));
      } catch (error) {
        toast({
          title: "Erreur lors de l'upload",
          description: error.message,
          status: "error",
          duration: 5000,
        });
      }
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Insertion de la recette
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert([{
          user_id: user.id,
          title: recipe.title,
          subtitle: recipe.subtitle,
          servings: recipe.servings,
          prep_time: recipe.prep_time,
          cook_time: recipe.cook_time,
          instructions: recipe.instructions,
          ingredients: recipe.ingredients,
        }])
        .select()
        .single();

      if (recipeError) throw recipeError;

      // Insertion des images
      if (images.length > 0) {
        const imagePromises = images.map(img => {
          return supabase
            .from('recipe_images')
            .insert([{
              recipe_id: recipeData.id,
              image_url: img.url,
              storage_path: img.path,
              is_main: img.isMain
            }]);
        });

        await Promise.all(imagePromises);
      }

      toast({
        title: "Recette ajoutée avec succès!",
        status: "success",
        duration: 3000,
      });
      
      navigate('/recipes');
    } catch (error) {
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

        {/* Titre et sous-titre */}
        <FormControl isRequired>
          <FormLabel>Titre</FormLabel>
          <Input
            value={recipe.title}
            onChange={(e) => setRecipe(prev => ({ ...prev, title: e.target.value }))}
            bg="white"
            _hover={{ borderColor: 'brand.primary' }}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Sous-titre</FormLabel>
          <Input
            value={recipe.subtitle}
            onChange={(e) => setRecipe(prev => ({ ...prev, subtitle: e.target.value }))}
            bg="white"
            _hover={{ borderColor: 'brand.primary' }}
          />
        </FormControl>

        {/* Temps et portions */}
        <HStack w="full" spacing={4} align="flex-start">
          <FormControl isRequired>
            <FormLabel>Portions</FormLabel>
            <NumberInput
              min={1}
              value={recipe.servings}
              onChange={(value) => setRecipe(prev => ({ ...prev, servings: parseInt(value) }))}
              bg="white"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <DurationPicker
            label="Temps de préparation"
            value={recipe.prep_time}
            onChange={(value) => setRecipe(prev => ({ ...prev, prep_time: value }))}
            isRequired
          />

          <DurationPicker
            label="Temps de cuisson"
            value={recipe.cook_time}
            onChange={(value) => setRecipe(prev => ({ ...prev, cook_time: value }))}
            isRequired
            durations={[0, 5, 10, 15, 20, 30, 45, 60, 90, 120]} // Inclut 0 pour "pas de cuisson"
          />
        </HStack>

        <RichTextEditor
          label="Ingrédients"
          value={recipe.ingredients}
          onChange={(content) => setRecipe(prev => ({
            ...prev,
            ingredients: content
          }))}
          placeholder="Entrez vos ingrédients ici..."
          isRequired
        />

        <RichTextEditor
          label="Instructions"
          value={recipe.instructions}
          onChange={(content) => setRecipe(prev => ({
            ...prev,
            instructions: content
          }))}
          placeholder="Entrez vos instructions ici..."
          isRequired
        />

        <FormControl>
          <FormLabel color="brand.text">Images</FormLabel>
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
          variant="solid"
          bg="brand.primary"
          color="white"
          _hover={{ 
            bg: 'brand.primaryDark'
          }}
          _active={{
            bg: 'brand.primary',
            transform: 'scale(0.98)'
          }}
          width="full"
        >
          Ajouter la recette
        </Button>
      </VStack>
    </Box>
  );
};

export default AddRecipe; 