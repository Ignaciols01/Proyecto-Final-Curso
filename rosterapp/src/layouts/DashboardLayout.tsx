import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function DashboardLayout() {
  const navigate = useNavigate();
  
  // Estados para la foto y el nombre
  const [avatar, setAvatar] = useState<string | null>(localStorage.getItem('rosterapp_admin_avatar'));
  const [nombreUsuario, setNombreUsuario] = useState('Admin Gerencia');
  const [iniciales, setIniciales] = useState('AD');

  useEffect(() => {
    // 1. Cargar los datos nada más abrir la app
    cargarDatosAdmin();
    
    // 2. Crear las funciones que escucharán los avisos de la página de Configuración
    const handleAvatarUpdate = () => setAvatar(localStorage.getItem('rosterapp_admin_avatar'));
    const handleNameUpdate = () => cargarDatosAdmin();

    // 3. Poner la antena para escuchar los eventos
    window.addEventListener('adminAvatarUpdated', handleAvatarUpdate);
    window.addEventListener('adminNameUpdated', handleNameUpdate);

    return () => {
      window.removeEventListener('adminAvatarUpdated', handleAvatarUpdate);
      window.removeEventListener('adminNameUpdated', handleNameUpdate);
    };
  }, []);

  const cargarDatosAdmin = () => {
    const userDataString = localStorage.getItem('rosterapp_user');
    if (userDataString) {
      const user = JSON.parse(userDataString);
      const nombreReal = user.nombre || 'Admin Gerencia';
      setNombreUsuario(nombreReal);
      setIniciales(nombreReal.substring(0, 2).toUpperCase());
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('rosterapp_user');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* =========================================================
          BARRA LATERAL (SIDEBAR)
          ========================================================= */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700 flex flex-col justify-between transition-colors duration-300 z-50 shadow-sm hidden md:flex">
        
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-700">
            <span className="text-xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight">RosterApp</span>
          </div>

          {/* Menú de Navegación */}
          <div className="p-4 space-y-1">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2 mb-2 mt-2">Gestión</p>
            
            <NavLink to="/admin/dashboard" className={({isActive}) => `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>
              <span>📅</span><span>Calendario</span>
            </NavLink>
            
            <NavLink to="/admin/empleados" className={({isActive}) => `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>
              <span>👥</span><span>Empleados</span>
            </NavLink>
            
            <NavLink to="/admin/informes" className={({isActive}) => `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>
              <span>📊</span><span>Informes</span>
            </NavLink>
            
            <div className="h-4"></div>
            
            <NavLink to="/admin/configuracion" className={({isActive}) => `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>
              <span>⚙️</span><span>Configuración</span>
            </NavLink>
          </div>
        </div>

        {/* Perfil del Admin */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-700">
          <div className="bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl p-3 flex items-center space-x-3 mb-3 transition-colors">
            
            {/* COMPROBACIÓN DEL AVATAR */}
            {avatar ? (
              <img src={avatar} alt="Perfil" className="w-9 h-9 rounded-full object-cover shadow-sm border border-gray-200 dark:border-slate-500 flex-shrink-0" />
            ) : (
              <div className="w-9 h-9 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
                {iniciales}
              </div>
            )}
            
            <div className="flex-1 overflow-hidden">
              <p className="text-[9px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest leading-none mb-1">Conectado como</p>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate leading-none">{nombreUsuario}</p>
            </div>
          </div>
          
          <button onClick={handleLogout} className="w-full text-center text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition-colors uppercase tracking-widest cursor-pointer">
            Cerrar Sesión
          </button>
        </div>
        
      </aside>

      {/* =========================================================
          CONTENIDO PRINCIPAL
          ========================================================= */}
      <main className="flex-1 overflow-y-auto">
        {/* Cabecera para móviles si reduces la pantalla */}
        <div className="md:hidden bg-white dark:bg-slate-800 h-14 border-b border-gray-100 dark:border-slate-700 flex items-center px-4">
           <span className="text-lg font-extrabold text-blue-700 dark:text-blue-400">RosterApp</span>
        </div>
        
        {/* Aquí se cargan las páginas (Dashboard, Configuracion, etc) */}
        <Outlet />
      </main>

    </div>
  );
}