import React from 'react';
import { SimpleGrid, Box, Heading } from '@chakra-ui/react';
import Card from '../components/common/Card';

const productsData = [
  {
    title: "Product 1",
    description: "This is a description for product 1. It's amazing!",
    image: "https://via.placeholder.com/300",
    badge: "New"
  },
  {
    title: "Product 2",
    description: "This is a description for product 2. It's fantastic!",
    image: "https://via.placeholder.com/300",
    badge: "Popular"
  },
  {
    title: "Product 3",
    description: "This is a description for product 3. You'll love it!",
    image: "https://via.placeholder.com/300",
    badge: "Sale"
  }
];

function Products() {
  return (
    <Box py={8}>
      <Heading mb={8} textAlign="center" color="brand.text">
        Our Products
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
        {productsData.map((product, index) => (
          <Card key={index} {...product} />
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default Products; 