import { createBrowserRouter } from 'react-router-dom';

import LoginPage from './pages/Login';
import RegistrationPage from './pages/Registration';
import HomePage from './pages/Home';
import AppLayout from './layouts/AppLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/registration',
    element: <RegistrationPage />,
  },
]);

export default router;
