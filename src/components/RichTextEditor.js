import React, { memo, useState, useEffect } from 'react';
import { Box, FormControl, FormLabel } from '@chakra-ui/react';
import { Editor } from '@tinymce/tinymce-react';
import { richEditorStyles } from '../styles/editorStyles';

const TINYMCE_API_KEY = process.env.REACT_APP_TINYMCE_API_KEY;

// Configuration de base de l'éditeur extraite pour éviter les recalculs
const baseEditorConfig = {
  menubar: false,
  plugins: [
    'lists', 'link', 'table', 'help', 'wordcount'
  ],
  toolbar: 'undo redo | blocks | ' +
    'bold italic | alignleft aligncenter ' +
    'alignright | bullist numlist | ' +
    'removeformat | help',
  skin: 'oxide',
  content_css: 'default',
  height: 300,
  branding: false,
  resize: false,
};

const RichTextEditor = memo(({ 
  label, 
  value, 
  onChange, 
  placeholder = 'Entrez votre texte ici...',
  isRequired = false 
}) => {
  const [editorReady, setEditorReady] = useState(false);

  useEffect(() => {
    // Préchargement des ressources TinyMCE
    const preloadTinyMCE = async () => {
      try {
        await import('@tinymce/tinymce-react');
        setEditorReady(true);
      } catch (error) {
        console.error('Erreur de chargement de TinyMCE:', error);
      }
    };

    preloadTinyMCE();
  }, []);

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
          boxShadow: '0 0 0 1px var(--chakra-colors-brand-primary)'
        }}
      >
        {editorReady && (
          <Editor
            apiKey={TINYMCE_API_KEY}
            value={value}
            init={{
              ...baseEditorConfig,
              content_style: richEditorStyles,
              body_class: 'mce-content-body',
              placeholder: placeholder,
            }}
            onEditorChange={onChange}
          />
        )}
      </Box>
    </FormControl>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor; 