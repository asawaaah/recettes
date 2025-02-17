import React, { useState, useEffect, useRef } from 'react';
import {
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Text,
  VStack,
  HStack,
  useDisclosure,
  Box,
} from '@chakra-ui/react';
import '../styles/components/buttons.css';

const DurationPicker = ({ label, value, onChange, isRequired = false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [displayValue, setDisplayValue] = useState({ hours: '00', minutes: '00' });
  const [activeField, setActiveField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    setDisplayValue({
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
    });
  }, [value]);

  const handleFieldClick = (field) => {
    setActiveField(field);
    setTempValue('');
  };

  const handleKeyPress = (e) => {
    if (!activeField) return;
    
    if (!/^\d$/.test(e.key)) return;

    const newTemp = (tempValue + e.key).slice(-2);
    setTempValue(newTemp);

    const numValue = parseInt(newTemp, 10);
    const maxValue = activeField === 'hours' ? 23 : 59;

    if (numValue <= maxValue) {
      const newDisplayValue = {
        ...displayValue,
        [activeField]: newTemp.padStart(2, '0')
      };
      setDisplayValue(newDisplayValue);

      // Mettre à jour la valeur totale
      const totalMinutes = 
        parseInt(newDisplayValue.hours, 10) * 60 + 
        parseInt(newDisplayValue.minutes, 10);
      onChange(totalMinutes);

      // Passer automatiquement aux minutes après avoir saisi les heures
      if (activeField === 'hours' && newTemp.length === 2) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setActiveField('minutes');
          setTempValue('');
        }, 300);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keypress', handleKeyPress);
    }
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isOpen, activeField, tempValue]);

  return (
    <FormControl isRequired={isRequired}>
      <FormLabel color="brand.text">{label}</FormLabel>
      <Button
        onClick={onOpen}
        variant="outline"
        width="full"
        borderColor="brand.secondary"
        color="brand.text"
        bg="white"
        _hover={{ 
          borderColor: 'brand.primary',
          bg: 'white'
        }}
        className="custom-button-animation"
      >
        {displayValue.hours}h{displayValue.minutes}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent bg="white" boxShadow="xl">
          <ModalHeader color="brand.text" textAlign="center">
            Sélectionner la durée
          </ModalHeader>

          <ModalBody pb={8}>
            <VStack spacing={6}>
              <Box
                bg="brand.background"
                p={6}
                borderRadius="xl"
                boxShadow="md"
                width="full"
              >
                <HStack 
                  spacing={2} 
                  justify="center" 
                  align="center"
                  bg="white"
                  p={4}
                  borderRadius="lg"
                  boxShadow="inner"
                >
                  <Box 
                    as="button"
                    fontSize="5xl"
                    fontWeight="600"
                    fontFamily="mono"
                    p={4}
                    borderRadius="xl"
                    color="brand.text"
                    bg={activeField === 'hours' ? 'brand.primary' : 'transparent'}
                    onClick={() => handleFieldClick('hours')}
                    transition="all 0.2s"
                    _hover={{ bg: activeField === 'hours' ? 'brand.primary' : 'brand.background' }}
                    width="120px"
                    height="100px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    sx={{
                      '&::after': activeField === 'hours' ? {
                        content: '""',
                        position: 'absolute',
                        bottom: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '40%',
                        height: '3px',
                        bg: 'brand.primaryDark',
                        borderRadius: 'full'
                      } : {}
                    }}
                  >
                    {displayValue.hours}
                  </Box>
                  <Text 
                    fontSize="4xl" 
                    fontWeight="bold" 
                    color="brand.primary"
                    mx={2}
                  >
                    :
                  </Text>
                  <Box 
                    as="button"
                    fontSize="5xl"
                    fontWeight="600"
                    fontFamily="mono"
                    p={4}
                    borderRadius="xl"
                    color="brand.text"
                    bg={activeField === 'minutes' ? 'brand.primary' : 'transparent'}
                    onClick={() => handleFieldClick('minutes')}
                    transition="all 0.2s"
                    _hover={{ bg: activeField === 'minutes' ? 'brand.primary' : 'brand.background' }}
                    width="120px"
                    height="100px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    sx={{
                      '&::after': activeField === 'minutes' ? {
                        content: '""',
                        position: 'absolute',
                        bottom: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '40%',
                        height: '3px',
                        bg: 'brand.primaryDark',
                        borderRadius: 'full'
                      } : {}
                    }}
                  >
                    {displayValue.minutes}
                  </Box>
                </HStack>
              </Box>

              <Text 
                fontSize="sm" 
                color="gray.500" 
                textAlign="center"
                px={4}
              >
                Cliquez sur les heures ou minutes puis utilisez votre clavier pour modifier la durée
              </Text>

              <Button
                onClick={onClose}
                bg="brand.primary"
                color="white"
                width="full"
                size="lg"
                _hover={{ bg: 'brand.primaryDark' }}
                borderRadius="lg"
                boxShadow="sm"
              >
                Confirmer
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </FormControl>
  );
};

export default DurationPicker; 