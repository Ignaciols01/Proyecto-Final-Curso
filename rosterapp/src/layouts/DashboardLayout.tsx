import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function DashboardLayout() {
  const navigate = useNavigate();
  // Estado para controlar si el menú móvil está abierto o cerrado
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Fondo oscuro cuando el menú móvil está abierto */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" 
          onClick={closeMenu}
        ></div>
      )}

      {/* Menú Lateral (Sidebar) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo y Botón de cerrar (solo móvil) */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-slate-700 bg-blue-50/50 dark:bg-slate-800/50">
          <span className="text-xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight">RosterApp</span>
          <button onClick={closeMenu} className="md:hidden p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Enlaces de Navegación */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <p className="px-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 mt-2">Gestión</p>
          
          <NavLink onClick={closeMenu} to="/admin/dashboard" className={({isActive}) => `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-gray-100'}`}>
            <span>📅</span><span>Calendario</span>
          </NavLink>
          <NavLink onClick={closeMenu} to="/admin/empleados" className={({isActive}) => `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-gray-100'}`}>
            <span>👥</span><span>Empleados</span>
          </NavLink>
          <NavLink onClick={closeMenu} to="/admin/informes" className={({isActive}) => `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-gray-100'}`}>
            <span>📊</span><span>Informes</span>
          </NavLink>
          <div className="pt-2 mt-2 border-t border-gray-100 dark:border-slate-700">
            <NavLink onClick={closeMenu} to="/admin/configuracion" className={({isActive}) => `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-gray-100'}`}>
              <span>⚙️</span><span>Configuración</span>
            </NavLink>
          </div>
        </nav>

        {/* Perfil y Salir */}
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

      {/* Contenedor Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Barra superior visible SOLO en móviles */}
        <header className="md:hidden h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-4 flex-shrink-0 z-30 transition-colors duration-300">
          <span className="text-xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight">RosterApp</span>
          <button onClick={toggleMenu} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
            {/* Icono de Hamburguesa */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </header>

        {/* Las páginas hijas (Dashboard, Empleados, etc.) se renderizan aquí */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}