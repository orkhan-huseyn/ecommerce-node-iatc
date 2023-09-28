import { Outlet } from 'react-router-dom';
import {
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
  Text,
  Heading,
} from '@chakra-ui/react';

function AppLayout() {
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
        <Menu>
          <MenuButton>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Avatar
                marginRight="3"
                name="Orkhan Huseynli"
                src="https://bit.ly/broken-link"
              />
              <Text fontWeight="bold">Orkhan Huseynli</Text>
            </Box>
          </MenuButton>
          <MenuList>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Purchase history</MenuItem>
            <MenuItem>Log out</MenuItem>
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
