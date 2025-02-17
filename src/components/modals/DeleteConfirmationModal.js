import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text
} from '@chakra-ui/react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, recipeName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirmer la suppression</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Êtes-vous sûr de vouloir supprimer la recette "{recipeName}" ?
            Cette action est irréversible.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Annuler
          </Button>
          <Button colorScheme="red" onClick={onConfirm}>
            Supprimer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal; 