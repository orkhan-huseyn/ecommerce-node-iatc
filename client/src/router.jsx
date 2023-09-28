import { createBrowserRouter } from 'react-router-dom';

import LoginPage from './pages/Login';
import RegistrationPage from './pages/Registration';
import HomePage from './pages/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
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
