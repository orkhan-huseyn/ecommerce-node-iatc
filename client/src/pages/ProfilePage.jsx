import {
  Button,
  Heading,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/react';
import axios from '../axios';

function ProfilePage() {
  function handleFormSubmit(event) {
    event.preventDefault();
    const { profileImage } = event.target.elements;

    const formData = new FormData();
    formData.append('profileImage', profileImage.files[0]);

    axios.put('/users/profile-image', formData);
  }

  return (
    <>
      <Heading>Profile page</Heading>
      <form onSubmit={handleFormSubmit}>
        <FormControl marginBottom="4">
          <FormLabel>Profile image</FormLabel>
          <Input accept="image/*" id="profileImage" type="file" />
          <FormHelperText>Look beautiful.</FormHelperText>
        </FormControl>

        <Button type="submit" color="blue">
          Submit
        </Button>
      </form>
    </>
  );
}

export default ProfilePage;
