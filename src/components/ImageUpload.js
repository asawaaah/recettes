import React, { useCallback, useState, memo } from 'react';
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
import { BsImage, BsX } from 'react-icons/bs';

const BUCKET_NAME = 'recipe_images';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const TARGET_FORMAT = 'image/webp';

// Fonction optimisée pour convertir en WebP
const convertToWebP = async (file) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Calcul des dimensions optimales
      let width = img.width;
      let height = img.height;
      const maxDim = 1200;

      if (width > height && width > maxDim) {
        height *= maxDim / width;
        width = maxDim;
      } else if (height > maxDim) {
        width *= maxDim / height;
        height = maxDim;
      }

      canvas.width = width;
      canvas.height = height;
      
      // Optimisation de la qualité du rendu
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Conversion en WebP avec qualité optimale
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Échec de la conversion en WebP'));
          return;
        }
        // Changement de l'extension en .webp
        const fileName = file.name.replace(/\.[^/.]+$/, '.webp');
        resolve(new File([blob], fileName, { type: TARGET_FORMAT }));
      }, TARGET_FORMAT, 0.85); // Qualité 0.85 pour un bon compromis qualité/taille
    };

    img.onerror = () => {
      reject(new Error("Erreur lors du chargement de l'image"));
    };

    img.src = URL.createObjectURL(file);
  });
};

const ImageUpload = memo(({ images, setImages, userId, addIcon, removeIcon, accept }) => {
  const toast = useToast();
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    
    for (const file of acceptedFiles) {
      try {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          throw new Error('Type de fichier non supporté');
        }

        if (file.size > MAX_FILE_SIZE) {
          throw new Error('Fichier trop volumineux');
        }

        // Conversion en WebP
        const optimizedFile = await convertToWebP(file);
        
        const filePath = `${userId}/${Date.now()}-${optimizedFile.name}`;
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, optimizedFile, {
            cacheControl: '31536000', // Cache d'un an
            contentType: TARGET_FORMAT
          });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(filePath);

        setImages(prev => [...prev, {
          url: urlData.publicUrl,
          path: filePath,
          isMain: prev.length === 0,
          format: TARGET_FORMAT
        }]);

        toast({
          title: "Image optimisée et uploadée",
          status: "success",
          duration: 2000,
        });
      } catch (error) {
        toast({
          title: "Erreur lors de l'upload",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
    setUploading(false);
  }, [userId, setImages, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept,
    maxSize: MAX_FILE_SIZE
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
        cursor={uploading ? "wait" : "pointer"}
      >
        <input {...getInputProps()} disabled={uploading} />
        <Center h="100%">
          <VStack spacing={2}>
            <Text color="brand.text" textAlign="center">
              {uploading 
                ? "Optimisation et upload en cours..."
                : isDragActive
                  ? "Déposez les images ici..."
                  : "Glissez-déposez vos images ici, ou cliquez pour sélectionner"}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Conversion automatique en WebP pour une meilleure performance
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
});

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload; 