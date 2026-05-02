import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

import Login from './pages/Login';
import NotFound from './pages/NotFound'; // Importamos la nueva página de error

import DashboardLayout from './layouts/DashboardLayout';
import EmployeeLayout from './layouts/EmployeeLayout';

import Dashboard from './pages/admin/Dashboard';
import Empleados from './pages/admin/Empleados';
import Informes from './pages/admin/Informes';
import ConfiguracionAdmin from './pages/admin/Configuracion'; 

import MisTurnos from './pages/employee/MisTurnos';
import Fichaje from './pages/employee/Fichaje';
import ConfiguracionEmpleado from './pages/employee/Configuracion'; 

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: <DashboardLayout />, 
    children: [
      { path: '', element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'empleados', element: <Empleados /> },
      { path: 'informes', element: <Informes /> },
      { path: 'configuracion', element: <ConfiguracionAdmin /> }
    ],
  },
  {
    path: '/empleado',
    element: <EmployeeLayout />,
    children: [
      { path: '', element: <Navigate to="turnos" replace /> },
      { path: 'turnos', element: <MisTurnos /> },
      { path: 'fichaje', element: <Fichaje /> },
      { path: 'configuracion', element: <ConfiguracionEmpleado /> }
    ]
  },
  // RUTA COMODÍN: Si el usuario escribe algo que no existe, muestra el Error 404
  {
    path: '*',
    element: <NotFound />
  }
]);

function App() {
  useEffect(() => {
    const theme = localStorage.getItem('rosterapp_theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rosterapp_theme', 'light');
    }
  }, []);

  return <RouterProvider router={router} />;
}

export default App;