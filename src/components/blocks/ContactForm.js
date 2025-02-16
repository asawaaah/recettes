import React from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Heading,
} from '@chakra-ui/react';

const ContactForm = () => {
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici vous pourrez ajouter la logique d'envoi du formulaire
    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box p={8} maxW="600px" mx="auto">
      <VStack spacing={8} as="form" onSubmit={handleSubmit}>
        <Heading color="brand.text">Contactez-nous</Heading>
        
        <FormControl isRequired>
          <FormLabel color="brand.text">Nom</FormLabel>
          <Input 
            type="text" 
            bg="white"
            borderColor="brand.secondary"
            _hover={{ borderColor: 'brand.primary' }}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel color="brand.text">Email</FormLabel>
          <Input 
            type="email" 
            bg="white"
            borderColor="brand.secondary"
            _hover={{ borderColor: 'brand.primary' }}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel color="brand.text">Message</FormLabel>
          <Textarea 
            bg="white"
            borderColor="brand.secondary"
            _hover={{ borderColor: 'brand.primary' }}
            rows={6}
          />
        </FormControl>

        <Button 
          type="submit"
          bg="brand.primary"
          color="white"
          _hover={{ bg: 'brand.accent' }}
          size="lg"
          w="full"
        >
          Envoyer
        </Button>
      </VStack>
    </Box>
  );
};

export default ContactForm;
