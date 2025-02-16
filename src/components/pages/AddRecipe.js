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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DurationPicker from '../DurationPicker';
import RichTextEditor from '../RichTextEditor';
import '../../styles/components/buttons.css';

const AddRecipe = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    prepTime: 0,
    cookTime: 0,
    description: '',
    ingredients: '',
    instructions: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Logique de soumission...
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
        <Heading color="brand.text">Ajouter une Recette</Heading>

        <FormControl isRequired>
          <FormLabel color="brand.text">Titre</FormLabel>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            borderColor="brand.secondary"
            _hover={{ borderColor: 'brand.primary' }}
            _focus={{ borderColor: 'brand.primary' }}
          />
        </FormControl>

        <HStack spacing={4} width="100%">
          <DurationPicker
            label="Temps de préparation"
            value={formData.prepTime}
            onChange={(val) => setFormData({...formData, prepTime: val})}
            isRequired
          />
          <DurationPicker
            label="Temps de cuisson"
            value={formData.cookTime}
            onChange={(val) => setFormData({...formData, cookTime: val})}
            isRequired
          />
        </HStack>

        <RichTextEditor
          label="Description"
          value={formData.description}
          onChange={(val) => setFormData({...formData, description: val})}
          isRequired
        />

        <Button
          type="submit"
          isLoading={loading}
          loadingText="Envoi en cours..."
          className="custom-button-animation"
          variant="solid"
          colorScheme="brand"
          width="full"
        >
          Ajouter la recette
        </Button>
      </VStack>
    </Box>
  );
};

export default AddRecipe; 