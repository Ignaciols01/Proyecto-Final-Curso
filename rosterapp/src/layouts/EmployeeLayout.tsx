import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function EmployeeLayout() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState<string | null>(localStorage.getItem('rosterapp_employee_avatar'));

  useEffect(() => {
    const handleAvatarUpdate = () => setAvatar(localStorage.getItem('rosterapp_employee_avatar'));
    window.addEventListener('employeeAvatarUpdated', handleAvatarUpdate);
    return () => window.removeEventListener('employeeAvatarUpdated', handleAvatarUpdate);
  }, []);

  return (
    // CAMBIO CLAVE: h-screen y overflow-hidden
    <div className="h-screen overflow-hidden bg-gray-50 dark:bg-slate-900 flex flex-col transition-colors duration-300">
      
      <header className="flex-shrink-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-2 flex items-center justify-between z-50 transition-colors duration-300">
        <div className="flex items-center">
          <div className="flex items-center space-x-2 mr-4">
            <div className="w-7 h-7 bg-blue-600 dark:bg-blue-500 rounded-md flex items-center justify-center text-white shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <span className="text-lg font-extrabold text-blue-700 dark:text-blue-400 tracking-tight">RosterApp</span>
          </div>

          <div className="h-5 w-px bg-gray-200 dark:bg-slate-600 mx-2 hidden md:block"></div>

          <nav className="hidden md:flex items-center space-x-1 ml-2">
            <NavLink to="/empleado/turnos" className={({isActive}) => `px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${isActive ? 'bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-gray-100'}`}>Mis Turnos</NavLink>
            <NavLink to="/empleado/fichaje" className={({isActive}) => `px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${isActive ? 'bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-gray-100'}`}>Fichar</NavLink>
            <NavLink to="/empleado/configuracion" className={({isActive}) => `px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${isActive ? 'bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-gray-100'}`}>Configuración</NavLink>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-800 dark:text-gray-100 leading-tight">Hola, Empleado</p>
            </div>
            {avatar ? (
              <img src={avatar} alt="Perfil" className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-slate-600 shadow-sm" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-slate-600 shadow-sm text-xs">EM</div>
            )}
          </div>
          <div className="h-5 w-px bg-gray-200 dark:bg-slate-700 hidden sm:block"></div>
          <button onClick={() => navigate('/login')} className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-gray-200 dark:border-slate-600 shadow-sm cursor-pointer" title="Cerrar Sesión">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </div>
      </header>

      {/* CAMBIO CLAVE: overflow-y-auto solo en el contenido */}
      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}