import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Páginas Públicas
import Login from './pages/Login';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import EmployeeLayout from './layouts/EmployeeLayout';

// Páginas de Administrador
import Dashboard from './pages/admin/Dashboard';
import Empleados from './pages/admin/Empleados';
import Informes from './pages/admin/Informes';
import Configuracion from './pages/admin/Configuracion';

// Páginas de Empleado
import MisTurnos from './pages/employee/MisTurnos';
import Fichaje from './pages/employee/Fichaje';

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
      { path: 'configuracion', element: <Configuracion /> }
    ],
  },
  {
    path: '/empleado',
    element: <EmployeeLayout />,
    children: [
      { path: '', element: <Navigate to="turnos" replace /> },
      { path: 'turnos', element: <MisTurnos /> },
      { path: 'fichaje', element: <Fichaje /> }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;