import React from 'react';
import { Box, FormControl, FormLabel } from '@chakra-ui/react';
import { Editor } from '@tinymce/tinymce-react';
import { richEditorStyles } from '../styles/editorStyles';

const TINYMCE_API_KEY = process.env.REACT_APP_TINYMCE_API_KEY; // Remplacez par votre clé API

const RichTextEditor = ({ 
  label, 
  value, 
  onChange, 
  placeholder = 'Entrez votre texte ici...',
  isRequired = false 
}) => {
  return (
    <FormControl isRequired={isRequired}>
      {label && (
        <FormLabel color="brand.text">{label}</FormLabel>
      )}
      <Box 
        border="1px" 
        borderColor="brand.secondary"
        borderRadius="md"
        _focusWithin={{
          borderColor: 'brand.primary',
          boxShadow: 'outline',
        }}
        overflow="hidden"
      >
        <Editor
          apiKey={TINYMCE_API_KEY}
          value={value}
          init={{
            height: 300,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: richEditorStyles,
            skin: 'oxide',
            content_css: 'default',
            body_class: 'mce-content-body',
            placeholder: placeholder,
          }}
          onEditorChange={onChange}
        />
      </Box>
    </FormControl>
  );
};

export default RichTextEditor; 