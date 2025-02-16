import React from 'react';
import { Box, Image, Text, VStack, Heading, Badge } from '@chakra-ui/react';

const Card = ({ title, description, image, badge }) => {
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      boxShadow="md"
      transition="all 0.3s"
      _hover={{ boxShadow: 'xl', transform: 'translateY(-2px)' }}
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
          <Badge colorScheme="brand" bg="brand.accent" color="brand.text">
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
