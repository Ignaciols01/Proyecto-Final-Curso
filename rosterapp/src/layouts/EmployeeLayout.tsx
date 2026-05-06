import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function EmployeeLayout() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [nombreUsuario, setNombreUsuario] = useState('Empleado');
  const [iniciales, setIniciales] = useState('EM');

  useEffect(() => {
    const cargarDatos = () => {
      const userDataString = localStorage.getItem('rosterapp_user');
      if (userDataString) {
        const user = JSON.parse(userDataString);
        const nombreReal = user.nombre || 'Empleado';
        setNombreUsuario(nombreReal);
        setIniciales(nombreReal.substring(0, 2).toUpperCase());
        
        // Buscamos el avatar vinculado a este ID de usuario específico
        const avatarKey = `rosterapp_avatar_${user.id}`;
        setAvatar(localStorage.getItem(avatarKey));
      }
    };

    cargarDatos();

    const handleAvatarUpdate = () => {
      const user = JSON.parse(localStorage.getItem('rosterapp_user') || '{}');
      if (user.id) {
        setAvatar(localStorage.getItem(`rosterapp_avatar_${user.id}`));
      }
    };

    const handleNameUpdate = () => {
      cargarDatos();
    };
    
    window.addEventListener('employeeAvatarUpdated', handleAvatarUpdate);
    window.addEventListener('employeeNameUpdated', handleNameUpdate);
    
    return () => {
      window.removeEventListener('employeeAvatarUpdated', handleAvatarUpdate);
      window.removeEventListener('employeeNameUpdated', handleNameUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('rosterapp_user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 flex flex-col font-sans text-gray-900 dark:text-gray-100">
      
      <header className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight hidden sm:block">RosterApp</span>
              </div>

              <nav className="hidden md:flex space-x-1">
                {/* RUTAS CORREGIDAS A ESPAÑOL SEGÚN TU APP.TSX */}
                <NavLink to="/empleado/turnos" className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                  Mis Turnos
                </NavLink>
                <NavLink to="/empleado/fichaje" className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                  Fichar
                </NavLink>
                <NavLink to="/empleado/configuracion" className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                  Configuración
                </NavLink>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Hola, {nombreUsuario}</span>
                {avatar ? (
                  <img src={avatar} alt="Perfil" className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-slate-600 shadow-sm" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {iniciales}
                  </div>
                )}
              </div>
              
              <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 hidden sm:block"></div>

              <button 
                onClick={handleLogout} 
                className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer" 
                title="Cerrar Sesión"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800">
          <nav className="flex justify-around p-2">
            <NavLink to="/empleado/turnos" className={({isActive}) => `flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${isActive ? 'bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>
              Turnos
            </NavLink>
            <NavLink to="/empleado/fichaje" className={({isActive}) => `flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${isActive ? 'bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>
              Fichar
            </NavLink>
            <NavLink to="/empleado/configuracion" className={({isActive}) => `flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${isActive ? 'bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>
              Ajustes
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
      
    </div>
  );
}