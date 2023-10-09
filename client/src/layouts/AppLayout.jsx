import { Outlet, Link, Navigate, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import {
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
  Text,
  Heading,
  Button,
} from "@chakra-ui/react";
import axios from '../axios';

function AppLayout() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  const decoded = jwt_decode(accessToken);
  const imageURL = decoded.image ? "/api" + decoded.image : null;

  async function handleLogout() {
    await axios.post('/auth/logout');
    localStorage.clear();
    navigate('/login');
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        paddingX="4"
        paddingY="2"
        borderBottomWidth="1px"
      >
        <Heading>E-commerce IATC</Heading>
        <Button
          marginLeft="auto"
          marginRight="4"
          colorScheme="blue"
          as={Link}
          to="/create-product"
        >
          Create product
        </Button>
        <Menu>
          <MenuButton>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Avatar marginRight="3" name="Orkhan Huseynli" src={imageURL} />
              <Text fontWeight="bold">Orkhan Huseynli</Text>
            </Box>
          </MenuButton>
          <MenuList>
            <MenuItem as={Link} to="/profile">
              Profile
            </MenuItem>
            <MenuItem>Purchase history</MenuItem>
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Box paddingX="4" paddingY="4">
        <Outlet />
      </Box>
    </>
  );
}

export default AppLayout;
