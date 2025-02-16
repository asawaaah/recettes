import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      primary: '#D4A373',
      primaryDark: '#8F6A47',
      secondary: '#A78A7F',
      background: '#FFF9F2',
      text: '#5C4B43',
      accent: '#E6B8A2',
      success: '#8CAF88',
      warning: '#D4A373',
      error: '#C97A6D',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'brand.background',
        color: 'brand.text',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'brand.primary',
          color: 'white',
          _hover: {
            bg: 'brand.accent',
          },
        },
        outline: {
          border: '2px solid',
          borderColor: 'brand.secondary',
          color: 'brand.text',
        },
      },
    },
    Heading: {
      baseStyle: {
        color: 'brand.text',
      },
    },
    Card: {
      baseStyle: {
        container: {
          backgroundColor: 'white',
          borderRadius: 'lg',
          boxShadow: 'md',
          transition: 'all 0.3s',
          _hover: {
            boxShadow: 'xl',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    Toast: {
      baseStyle: {
        container: {
          bg: 'white',
          color: 'brand.text',
        },
      },
      variants: {
        success: {
          container: {
            bg: `whiten('brand.success', 30)`,
            color: 'white',
          },
        },
        error: {
          container: {
            bg: 'brand.error',
            color: 'white',
          },
        },
        warning: {
          container: {
            bg: 'brand.warning',
            color: 'white',
          },
        },
      },
    },
  },
});

export default theme; 