import React, { memo } from 'react';
import { HStack, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const RecipeActions = memo(({ 
  isOwner, 
  slug, 
  onDeleteClick 
}) => {
  const navigate = useNavigate();

  if (!isOwner) return null;

  return (
    <HStack spacing={4}>
      <Button
        colorScheme="brand"
        onClick={() => navigate(`/recipe/edit/${slug}`)}
      >
        Modifier
      </Button>
      <Button
        colorScheme="red"
        onClick={onDeleteClick}
      >
        Supprimer
      </Button>
    </HStack>
  );
});

RecipeActions.displayName = 'RecipeActions';

export default RecipeActions; 