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
import '../styles/components/buttons.css';

const DurationPicker = ({ label, value, onChange, isRequired = false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputValue, setInputValue] = useState('');
  const [displayValue, setDisplayValue] = useState({ hours: '00', minutes: '00' });
  const [activeField, setActiveField] = useState('hours');

  useEffect(() => {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    setDisplayValue({
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
    });
  }, [value]);

  const handleInputChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 2) {
      setInputValue(val);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue) {
      handleConfirm();
    }
  };

  const handleConfirm = () => {
    if (inputValue) {
      const numValue = parseInt(inputValue, 10);
      const isValid = activeField === 'hours' ? numValue <= 24 : numValue <= 59;
      
      if (isValid) {
        const newDisplayValue = {
          ...displayValue,
          [activeField]: inputValue.padStart(2, '0')
        };
        setDisplayValue(newDisplayValue);
        
        const totalMinutes = 
          parseInt(newDisplayValue.hours, 10) * 60 + 
          parseInt(newDisplayValue.minutes, 10);
        
        onChange(totalMinutes);
      }
    }
    setInputValue('');
  };

  const switchField = () => {
    setActiveField(activeField === 'hours' ? 'minutes' : 'hours');
    setInputValue('');
  };

  return (
    <FormControl isRequired={isRequired}>
      <FormLabel color="brand.text">{label}</FormLabel>
      <Button
        onClick={onOpen}
        variant="outline"
        width="full"
        borderColor="brand.secondary"
        color="brand.text"
        _hover={{ borderColor: 'brand.primary' }}
        className="custom-button-animation"
      >
        {displayValue.hours}h{displayValue.minutes}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="brand.text">
            Sélectionner la durée
          </ModalHeader>

          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Input
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={`Entrez les ${activeField === 'hours' ? 'heures' : 'minutes'}`}
                autoFocus
                type="tel"
                maxLength={2}
              />

              <HStack spacing={2} fontSize="2xl" fontWeight="bold">
                <Text
                  cursor="pointer"
                  onClick={() => setActiveField('hours')}
                  color={activeField === 'hours' ? 'brand.primary' : 'gray.400'}
                  borderBottom={activeField === 'hours' ? '2px solid' : 'none'}
                  borderColor="brand.accent"
                >
                  {displayValue.hours}
                </Text>
                <Text>:</Text>
                <Text
                  cursor="pointer"
                  onClick={() => setActiveField('minutes')}
                  color={activeField === 'minutes' ? 'brand.primary' : 'gray.400'}
                  borderBottom={activeField === 'minutes' ? '2px solid' : 'none'}
                  borderColor="brand.accent"
                >
                  {displayValue.minutes}
                </Text>
              </HStack>
              
              <Button
                onClick={switchField}
                variant="ghost"
                color="brand.primary"
              >
                Passer aux {activeField === 'hours' ? 'minutes' : 'heures'}
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </FormControl>
  );
};

export default DurationPicker; 