import React, { useState } from 'react';
import {
  Box,
  VStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
  Divider,
  HStack,
  Icon,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  IconButton,
  Progress,
  Fade,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, CheckIcon, WarningIcon } from '@chakra-ui/icons';
import { FcGoogle } from 'react-icons/fc';
import { supabase } from '../../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/buttons.css';

const AuthForm = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [username, setUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  
  const toast = useToast();
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/recipes`
        }
      });
      if (error) throw error;
      
      // La redirection sera gérée automatiquement par Supabase OAuth
    } catch (error) {
      toast({
        title: "Error with Google Auth",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    }
  };

  const checkUsername = async (value) => {
    if (value.length < 3) return;
    setCheckingUsername(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', value.trim())
        .single();

      if (error && error.code === 'PGRST116') {
        setUsernameAvailable(true);
      } else {
        setUsernameAvailable(false);
      }

    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameAvailable(false);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (value.length >= 3) {
      checkUsername(value);
    } else {
      setUsernameAvailable(null);
    }
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (usernameAvailable && username.length >= 3) {
      setRegistrationStep(2);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let authResult;
      
      if (identifier.includes('@')) {
        authResult = await supabase.auth.signInWithPassword({
          email: identifier,
          password
        });
        if (authResult.error) throw authResult.error;
      } else {
        const { data, error } = await supabase
          .rpc('get_email_by_username', { username_param: identifier });

        if (error || !data) {
          throw new Error("Username not found");
        }

        authResult = await supabase.auth.signInWithPassword({
          email: data,
          password
        });
        
        if (authResult.error) throw authResult.error;
      }

      toast({
        title: "Successfully logged in!",
        status: "success",
        duration: 5000,
        position: "top",
        isClosable: true,
        containerStyle: {
          maxWidth: '400px'
        }
      });

      navigate('/recipes');
      
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        position: "top",
        isClosable: true,
        containerStyle: {
          maxWidth: '400px'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Login logic
        if (identifier.includes('@')) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: identifier,
            password
          });
          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .rpc('get_email_by_username', { username_param: identifier });

          if (error || !data) {
            throw new Error("Username not found");
          }

          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: data,
            password
          });
          
          if (authError) throw authError;
        }

        toast({
          title: "Successfully logged in!",
          status: "success",
          duration: 5000,
          position: "top",
          isClosable: true,
          containerStyle: {
            maxWidth: '400px'
          }
        });

        navigate('/recipes');
      } else {
        if (!identifier.includes('@')) {
          throw new Error("Please use a valid email address");
        }

        if (password !== confirmPassword) {
          throw new Error("Passwords don't match");
        }

        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }

        const { data, error } = await supabase.auth.signUp({
          email: identifier,
          password,
          options: {
            data: {
              username: username
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });

        if (error) throw error;

        if (data.user?.identities?.length === 0) {
          toast({
            title: "Email already in use",
            description: "This email is already associated with an account.",
            status: "error",
            duration: 5000,
          });
          return;
        }

        toast({
          title: "Check your email!",
          description: "We've sent you a confirmation link.",
          status: "success",
          duration: 5000,
          position: "top",
          isClosable: true,
          containerStyle: {
            maxWidth: '400px'
          }
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        position: "top",
        isClosable: true,
        containerStyle: {
          maxWidth: '400px'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isLogin) {
    return (
      <Box p={8} maxW="400px" mx="auto" bg="white" borderRadius="lg" boxShadow="md" className="fade-in" mt={8}>
        <VStack spacing={6}>
          <Progress 
            value={registrationStep === 1 ? 33 : 66} 
            w="full" 
            colorScheme="brand" 
            borderRadius="full"
          />
          
          {registrationStep === 1 ? (
            <VStack spacing={6} as="form" onSubmit={handleUsernameSubmit}>
              <FormControl isRequired>
                <FormLabel>Choose your username</FormLabel>
                <InputGroup>
                  <Input
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="Enter username"
                    isInvalid={usernameAvailable === false}
                  />
                  <InputRightElement>
                    {checkingUsername ? (
                      <Progress size="xs" isIndeterminate />
                    ) : usernameAvailable ? (
                      <CheckIcon color="green.500" />
                    ) : usernameAvailable === false ? (
                      <WarningIcon color="red.500" />
                    ) : null}
                  </InputRightElement>
                </InputGroup>
                {username && (
                  <Text 
                    fontSize="sm" 
                    mt={1}
                    color={
                      username.length < 3 ? "yellow.500" :
                      usernameAvailable ? "green.500" : 
                      usernameAvailable === false ? "red.500" :
                      "gray.500"
                    }
                  >
                    {username.length < 3 ? "Username must be at least 3 characters" :
                     usernameAvailable ? "Username is available" :
                     usernameAvailable === false ? "Username is already taken" :
                     "Checking username availability..."}
                  </Text>
                )}
              </FormControl>

              <Button
                type="submit"
                colorScheme="brand"
                bg="brand.primary"
                w="full"
                isDisabled={!usernameAvailable || username.length < 3}
              >
                Continue
              </Button>

              <Button variant="link" onClick={() => setIsLogin(true)}>
                Already have an account? Sign In
              </Button>
            </VStack>
          ) : (
            <VStack spacing={6} as="form" onSubmit={handleEmailAuth}>
              <Text>
                Signing up with username: <strong>{username}</strong>
              </Text>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your email"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                  />
                  <InputRightElement>
                    <IconButton
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      size="sm"
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                  />
                  <InputRightElement>
                    <IconButton
                      icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                      variant="ghost"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      size="sm"
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="brand"
                bg="brand.primary"
                w="full"
                isLoading={loading}
              >
                Sign Up with Email
              </Button>

              <HStack w="full">
                <Divider />
                <Text fontSize="sm" whiteSpace="nowrap" color="gray.500">
                  or
                </Text>
                <Divider />
              </HStack>

              <Button
                w="full"
                variant="outline"
                leftIcon={<Icon as={FcGoogle} />}
                onClick={handleGoogleAuth}
              >
                Continue with Google
              </Button>

              <Button 
                variant="link" 
                onClick={() => setRegistrationStep(1)}
              >
                Back to username selection
              </Button>
            </VStack>
          )}
        </VStack>
      </Box>
    );
  }

  return (
    <Box 
      p={8} 
      maxW="400px" 
      mx="auto" 
      bg="white" 
      borderRadius="lg" 
      boxShadow="md"
      mt={8}
    >
      <VStack spacing={6} as="form" onSubmit={handleLogin}>
        <FormControl isRequired>
          <FormLabel>Email ou Pseudonyme</FormLabel>
          <Input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Entrez votre email ou pseudonyme"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
            />
            <InputRightElement>
              <IconButton
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                variant="ghost"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                size="sm"
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {isLogin && (
          <Button
            variant="link"
            color="brand.primary"
            alignSelf="flex-end"
            onClick={() => navigate('/request-password-reset')}
            size="sm"
          >
            Forgot Password?
          </Button>
        )}

        <Button
          type="submit"
          variant="solid"
          width="full"
          className="custom-button-animation"
          isLoading={loading}
        >
          {isLogin ? "Se connecter" : "S'inscrire"}
        </Button>

        <HStack w="100%">
          <Divider />
          <Text color="gray.500">ou</Text>
          <Divider />
        </HStack>

        <Button
          width="full"
          variant="outline"
          leftIcon={<Icon as={FcGoogle} />}
          onClick={handleGoogleAuth}
          className="custom-button-animation"
        >
          Continuer avec Google
        </Button>

        <Text>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Button
            variant="link"
            color="brand.primary"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setUsername('');
              setIdentifier('');
              setPassword('');
            }}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </Button>
        </Text>
      </VStack>
    </Box>
  );
};

export default AuthForm; 