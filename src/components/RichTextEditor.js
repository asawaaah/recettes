import React from 'react';
import { Box, FormControl, FormLabel } from '@chakra-ui/react';
import { Editor } from '@tinymce/tinymce-react';
import { richEditorStyles } from '../styles/editorStyles';

const RichTextEditor = ({ 
  label, 
  value, 
  onChange, 
  placeholder = 'Entrez votre texte ici...',
  isRequired = false 
}) => {
  return (
    <FormControl isRequired={isRequired}>
      {label && <FormLabel>{label}</FormLabel>}
      <Box 
        border="1px" 
        borderColor="gray.200" 
        borderRadius="md"
        _focusWithin={{
          borderColor: 'brand.accent',
          boxShadow: `0 0 0 1px var(--chakra-colors-brand-accent)`
        }}
      >
        <Editor
          apiKey="t4i6kc35z9tcpyrgnxobava0pmtiy2o8d4y9cmjnf3m1tirw"
          value={value}
          init={{
            height: 300,
            menubar: false,
            mobile: {
              menubar: false,
              toolbar_mode: 'scrolling',
              toolbar: [
                'bold bullist numlist'
              ]
            },
            plugins: [
              'lists',
              'paste'
            ],
            toolbar: 'bold | bullist numlist',
            toolbar_mode: 'wrap',
            statusbar: false,
            content_style: richEditorStyles,
            paste_as_text: true,
            browser_spellcheck: true,
            min_height: 200,
            max_height: 500,
            autoresize_bottom_margin: 16,
            placeholder,
            skin: 'oxide',
            resize: false,
            lists_indent_on_tab: false,
            default_link_target: '_blank',
            lists_list_styles: false,
          }}
          onEditorChange={onChange}
        />
      </Box>
    </FormControl>
  );
};

export default RichTextEditor; 