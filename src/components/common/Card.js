import React from 'react';
import { Box, Image, Text, VStack, Heading, Badge } from '@chakra-ui/react';
import '../../styles/components/buttons.css';

const Card = ({ title, description, image, badge, onClick }) => {
  return (
    <Box
      as="article"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      transition="all 0.3s"
      _hover={{ 
        transform: 'translateY(-2px)',
        boxShadow: 'lg'
      }}
      onClick={onClick}
      className={onClick ? 'custom-button-animation' : ''}
    >
      {image && (
        <Image
          src={image}
          alt={title}
          height="200px"
          width="100%"
          objectFit="cover"
        />
      )}

      <VStack p={5} align="start" spacing={3}>
        {badge && (
          <Badge colorScheme="brand" variant="subtle">
            {badge}
          </Badge>
        )}
        
        <Heading size="md" color="brand.text">
          {title}
        </Heading>

        <Text color="brand.text" fontSize="sm">
          {description}
        </Text>
      </VStack>
    </Box>
  );
};

export default Card;
