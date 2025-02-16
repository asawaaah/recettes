import { extendTheme } from '@chakra-ui/react';

// Définition des couleurs de base
const colors = {
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
  }
};

// Styles globaux
const styles = {
  global: {
    body: {
      bg: 'brand.background',
      color: 'brand.text',
    }
  }
};

// Configuration des composants
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
    },
    variants: {
      solid: {
        bg: 'brand.primary',
        color: 'white',
        _hover: {
          bg: 'brand.primaryDark',
        },
        _active: {
          bg: 'brand.primaryDark',
        }
      },
      outline: {
        borderColor: 'brand.primary',
        color: 'brand.primary',
        _hover: {
          bg: 'brand.background'
        }
      }
    },
    defaultProps: {
      colorScheme: 'brand',
      variant: 'solid',
    }
  },
  Alert: {
    variants: {
      success: {
        container: {
          bg: 'brand.success',
          color: 'white',
        }
      },
      error: {
        container: {
          bg: 'brand.error',
          color: 'white',
        }
      },
      warning: {
        container: {
          bg: 'brand.warning',
          color: 'white',
        }
      }
    }
  },
  Input: {
    variants: {
      outline: {
        field: {
          bg: 'white',
          borderColor: 'brand.secondary',
          _hover: {
            borderColor: 'brand.primary',
          },
          _focus: {
            borderColor: 'brand.primary',
            boxShadow: '0 0 0 1px brand.primary',
          }
        }
      }
    },
    defaultProps: {
      variant: 'outline',
    }
  },
  NumberInput: {
    variants: {
      outline: {
        field: {
          bg: 'white',
          borderColor: 'brand.secondary',
          _hover: {
            borderColor: 'brand.primary',
          },
          _focus: {
            borderColor: 'brand.primary',
            boxShadow: '0 0 0 1px brand.primary',
          }
        }
      }
    },
    defaultProps: {
      variant: 'outline',
    }
  },
  FormLabel: {
    baseStyle: {
      color: 'brand.text',
      fontWeight: 'semibold',
    }
  }
};

// Configuration des breakpoints
const breakpoints = {
  sm: '320px',
  md: '768px',
  lg: '960px',
  xl: '1200px',
};

// Export du thème
const theme = extendTheme({
  colors,
  styles,
  components,
  breakpoints,
});

export default theme; 