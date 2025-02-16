import React, { useCallback, useState } from 'react';
import { 
  Box, 
  Text, 
  VStack, 
  Image, 
  SimpleGrid, 
  IconButton,
  useToast,
  Center
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { MdDelete, MdStar, MdStarBorder } from 'react-icons/md';
import { supabase } from '../config/supabaseClient';

const BUCKET_NAME = 'recipe_images';

const ImageUpload = ({ images, setImages, userId }) => {
  const toast = useToast();
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    
    for (const file of acceptedFiles) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Type de fichier non supporté",
          description: "Seules les images sont acceptées",
          status: "error",
          duration: 3000,
        });
        continue;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(filePath);

        setImages(prev => [...prev, {
          url: publicUrl,
          path: filePath,
          isMain: prev.length === 0 // Premier upload = image principale
        }]);

      } catch (error) {
        toast({
          title: "Erreur lors de l'upload",
          description: error.message,
          status: "error",
          duration: 3000,
        });
      }
    }
    setUploading(false);
  }, [userId, setImages, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    }
  });

  const handleDelete = async (index) => {
    const imageToDelete = images[index];
    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([imageToDelete.path]);

      if (error) throw error;

      setImages(prev => prev.filter((_, i) => i !== index));

      toast({
        title: "Image supprimée",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Erreur lors de la suppression",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  const setMainImage = (index) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isMain: i === index
    })));
  };

  return (
    <VStack spacing={4} width="100%">
      <Box
        {...getRootProps()}
        w="100%"
        h="150px"
        border="2px dashed"
        borderColor={isDragActive ? "brand.primary" : "brand.secondary"}
        borderRadius="lg"
        p={4}
        transition="all 0.2s"
        _hover={{
          borderColor: "brand.primary",
          bg: "brand.background"
        }}
        cursor="pointer"
      >
        <input {...getInputProps()} />
        <Center h="100%">
          <VStack spacing={2}>
            <Text color="brand.text" textAlign="center">
              {isDragActive
                ? "Déposez les images ici..."
                : "Glissez-déposez vos images ici, ou cliquez pour sélectionner"}
            </Text>
            <Text fontSize="sm" color="gray.500">
              JPG, PNG, GIF acceptés
            </Text>
          </VStack>
        </Center>
      </Box>

      <SimpleGrid columns={[2, 3, 4]} spacing={4} w="100%">
        {images.map((image, index) => (
          <Box key={index} position="relative">
            <Image
              src={image.url}
              alt={`Upload ${index + 1}`}
              boxSize="150px"
              objectFit="cover"
              borderRadius="md"
              border={image.isMain ? "2px solid" : "none"}
              borderColor="brand.primary"
            />
            <IconButton
              icon={<MdDelete />}
              position="absolute"
              top={2}
              right={2}
              size="sm"
              colorScheme="red"
              onClick={() => handleDelete(index)}
            />
            <IconButton
              icon={image.isMain ? <MdStar /> : <MdStarBorder />}
              position="absolute"
              top={2}
              left={2}
              size="sm"
              colorScheme={image.isMain ? "yellow" : "gray"}
              onClick={() => setMainImage(index)}
            />
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default ImageUpload; 