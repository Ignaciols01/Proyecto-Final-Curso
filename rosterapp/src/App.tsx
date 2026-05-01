import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

import Login from './pages/Login';

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
  }
]);

function App() {
  // Este código se ejecuta nada más abrir la web para aplicar el tema a toda la app
  useEffect(() => {
    const theme = localStorage.getItem('rosterapp_theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      // Forzamos el guardado en claro si es la primera vez que entra
      localStorage.setItem('rosterapp_theme', 'light');
    }
  }, []);

  return <RouterProvider router={router} />;
}

export default App;