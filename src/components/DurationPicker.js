import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
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
} from '@chakra-ui/react';

const DurationPicker = ({ label, value, onChange, isRequired = false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputValue, setInputValue] = useState('');
  const [displayValue, setDisplayValue] = useState({ hours: '00', minutes: '00' });
  const [activeField, setActiveField] = useState('minutes'); // 'minutes' ou 'hours'

  // Convertit les minutes en format lisible pour le bouton
  const formatDuration = (minutes) => {
    if (!minutes) return '0 min';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes 
      ? `${hours}h ${remainingMinutes}min`
      : `${hours}h`;
  };

  // Met à jour l'affichage digital
  const updateDisplayValue = (val) => {
    const numVal = parseInt(val) || 0;
    
    if (activeField === 'minutes') {
      if (numVal > 59) return; // Limite à 59 minutes
      setDisplayValue(prev => ({
        ...prev,
        minutes: numVal.toString().padStart(2, '0')
      }));
    } else {
      if (numVal > 24) return; // Limite à 24 heures au lieu de 12
      setDisplayValue(prev => ({
        ...prev,
        hours: numVal.toString().padStart(2, '0')
      }));
    }
  };

  // Gère la saisie des chiffres
  const handleInputChange = (e) => {
    const val = e.target.value.replace(/\D/g, ''); // Ne garde que les chiffres
    if (val.length > 2) return; // Limite à 2 chiffres
    setInputValue(val);
    updateDisplayValue(val);

    // Convertit en minutes pour la valeur réelle
    const numVal = parseInt(val) || 0;
    if (activeField === 'minutes') {
      if (numVal <= 59) {
        onChange(parseInt(displayValue.hours) * 60 + numVal);
      }
    } else {
      if (numVal <= 24) { // Limite à 24 heures au lieu de 12
        onChange(numVal * 60 + parseInt(displayValue.minutes));
      }
    }
  };

  // Réinitialise l'input et ferme la modale
  const handleClose = () => {
    setInputValue('');
    setActiveField('minutes');
    onClose();
  };

  // Met à jour l'affichage initial à l'ouverture
  useEffect(() => {
    if (isOpen && value) {
      const hours = Math.floor(value / 60);
      const minutes = value % 60;
      setDisplayValue({
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0')
      });
    }
  }, [isOpen, value]);

  // Reset input quand on change de champ
  useEffect(() => {
    setInputValue('');
  }, [activeField]);

  return (
    <FormControl isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      <Button
        onClick={onOpen}
        variant="outline"
        w="full"
        justifyContent="flex-start"
        h="40px"
      >
        {formatDuration(value)}
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Durée</ModalHeader>
          <ModalBody pb={6}>
            <VStack spacing={6}>
              <HStack 
                spacing={2} 
                fontSize="4xl" 
                fontFamily="mono"
                bg="gray.100"
                p={4}
                borderRadius="md"
                w="full"
                justifyContent="center"
                position="relative"
              >
                <Input
                  type="tel"
                  value={inputValue}
                  onChange={handleInputChange}
                  size="lg"
                  textAlign="center"
                  fontSize="4xl"
                  fontFamily="mono"
                  border="none"
                  p={0}
                  h="auto"
                  bg="transparent"
                  position="absolute"
                  w="full"
                  autoFocus
                  pattern="\d*"
                  inputMode="numeric"
                  sx={{
                    caretColor: 'brand.accent',
                    opacity: 0,
                    pointerEvents: 'none',
                    '&:focus': {
                      boxShadow: 'none'
                    }
                  }}
                />
                <Text 
                  onClick={() => {
                    setActiveField('hours');
                    const input = document.querySelector('input[type="tel"]');
                    if (input) input.focus();
                  }}
                  cursor="pointer"
                  color={activeField === 'hours' ? 'brand.secondary' : 'black'}
                  borderBottom={activeField === 'hours' ? '2px solid' : 'none'}
                  borderColor="brand.accent"
                  zIndex="1"
                >
                  {displayValue.hours}
                </Text>
                <Text>:</Text>
                <Text 
                  onClick={() => {
                    setActiveField('minutes');
                    const input = document.querySelector('input[type="tel"]');
                    if (input) input.focus();
                  }}
                  cursor="pointer"
                  color={activeField === 'minutes' ? 'brand.secondary' : 'black'}
                  borderBottom={activeField === 'minutes' ? '2px solid' : 'none'}
                  borderColor="brand.accent"
                  zIndex="1"
                >
                  {displayValue.minutes}
                </Text>
              </HStack>
              <Text fontSize="sm" color="gray.500">
                {activeField === 'minutes' 
                  ? 'Entrez les minutes (0-59)'
                  : 'Entrez les heures (0-24)'}
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </FormControl>
  );
};

export default DurationPicker; 