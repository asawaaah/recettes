import React from 'react';
import { SimpleGrid, Box, Heading } from '@chakra-ui/react';
import Card from '../components/common/Card';
import SEO from '../components/common/SEO';
import { useAuth } from '../context/AuthContext';
import LockedContent from '../components/blocks/LockedContent';

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

const Products = () => {
  const { user } = useAuth();

  if (!user) {
    return <LockedContent />;
  }

  return (
    <>
      <SEO 
        title="Nos Produits"
        description="Explorez notre sélection de produits de qualité"
        keywords="produits, cuisine, qualité, shopping"
      />
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
    </>
  );
};

export default Products; 