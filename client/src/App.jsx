import {
  Text,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Container,
} from '@chakra-ui/react';
import { useState } from 'react';
import axios from './axios';

function App() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleFormSubmit(event) {
    event.preventDefault();

    const { email, password } = event.target.elements;

    try {
      setSubmitting(true);
      const response = await axios.post('/auth/login', {
        email: email.value,
        password: password.value,
      });

      localStorage.setItem('access_token', response.data.accessToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);
      // TODO: redirect to home page
    } catch (error) {
      setError(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container>
      <form onSubmit={handleFormSubmit}>
        <Text fontSize="6xl">Log In</Text>
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

        <Button isLoading={submitting} type="submit" colorScheme="blue">
          Log In
        </Button>
      </form>
    </Container>
  );
}

export default App;
