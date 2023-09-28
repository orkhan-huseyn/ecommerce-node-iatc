import {
  Text,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Container,
  Card,
  CardBody,
  Alert,
  AlertIcon,
  AlertDescription,
  Link,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from '../axios';

function RegistrationPage() {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleFormSubmit(event) {
    event.preventDefault();

    const { email, password, fullName } = event.target.elements;

    try {
      setSubmitting(true);
      setError(null);
      const response = await axios.post('/auth/registration', {
        email: email.value,
        password: password.value,
        fullName: fullName.value,
      });

      localStorage.setItem('access_token', response.data.accessToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);

      navigate('/');
    } catch (error) {
      setError(error.response?.data ? error.response.data.error : error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container centerContent justifyContent="center" height="100vh">
      <Card width="360px">
        <CardBody>
          <form autoComplete="off" onSubmit={handleFormSubmit}>
            <Text fontSize="5xl" marginBottom="4">
              Register
            </Text>
            {error && (
              <Alert status="error" marginBottom="4">
                <AlertIcon />
                <AlertDescription>{error || error.message}</AlertDescription>
              </Alert>
            )}
            <FormControl marginBottom="4">
              <FormLabel>Full name</FormLabel>
              <Input id="fullName" type="fullName" />
            </FormControl>

            <FormControl marginBottom="4">
              <FormLabel>Email address</FormLabel>
              <Input id="email" type="email" />
              <FormHelperText>We'll never share your email.</FormHelperText>
            </FormControl>

            <FormControl marginBottom="4">
              <FormLabel>Password</FormLabel>
              <Input id="password" type="password" />
              <FormHelperText>Use strong password.</FormHelperText>
            </FormControl>

            <Text fontSize="sm" marginBottom="4">
              Already have an account?{' '}
              <Link as={RouterLink} color="teal.500" to="/login">
                log in
              </Link>
            </Text>

            <Button isLoading={submitting} type="submit" colorScheme="blue">
              Log In
            </Button>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
}

export default RegistrationPage;
