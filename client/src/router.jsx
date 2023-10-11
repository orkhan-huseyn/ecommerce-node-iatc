import { createBrowserRouter } from "react-router-dom";

import LoginPage from "./pages/Login";
import RegistrationPage from "./pages/Registration";
import HomePage from "./pages/Home";
import AppLayout from "./layouts/AppLayout";
import CreateProductPage from "./pages/CreateProduct";
import ProfilePage from "./pages/ProfilePage";
import Checkout from "./pages/Checkout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "create-product",
        element: <CreateProductPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/registration",
    element: <RegistrationPage />,
  },
]);

export default router;
