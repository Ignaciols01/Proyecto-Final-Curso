import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function DashboardLayout() {
  const navigate = useNavigate();

  return (
    // CAMBIO CLAVE: h-screen y overflow-hidden
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col transition-colors duration-300">
        <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-700 bg-blue-50/50 dark:bg-slate-800/50">
          <span className="text-xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight">RosterApp</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <p className="px-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 mt-2">Gestión</p>
          
          <NavLink to="/admin/dashboard" className={({isActive}) => `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-gray-100'}`}>
            <span>📅</span><span>Calendario</span>
          </NavLink>
          <NavLink to="/admin/empleados" className={({isActive}) => `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-gray-100'}`}>
            <span>👥</span><span>Empleados</span>
          </NavLink>
          <NavLink to="/admin/informes" className={({isActive}) => `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-gray-100'}`}>
            <span>📊</span><span>Informes</span>
          </NavLink>
          <div className="pt-2 mt-2 border-t border-gray-100 dark:border-slate-700">
            <NavLink to="/admin/configuracion" className={({isActive}) => `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-gray-100'}`}>
              <span>⚙️</span><span>Configuración</span>
            </NavLink>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-3 mb-3 p-2 rounded-lg bg-white dark:bg-slate-700 shadow-sm border border-gray-100 dark:border-slate-600">
            <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-bold text-xs">AD</div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase leading-none">Conectado como</p>
              <p className="text-xs font-extrabold text-gray-800 dark:text-gray-100">Admin Gerencia</p>
            </div>
          </div>
          <button onClick={() => navigate('/login')} className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-800/50 cursor-pointer">
            <span>CERRAR SESIÓN</span>
          </button>
        </div>
      </aside>

      {/* CAMBIO CLAVE: overflow-y-auto solo en el contenido */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}