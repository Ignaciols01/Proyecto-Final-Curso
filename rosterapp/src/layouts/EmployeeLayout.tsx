import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function EmployeeLayout() {
  const navigate = useNavigate();
  
  const [avatar, setAvatar] = useState<string | null>(localStorage.getItem('rosterapp_employee_avatar'));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('Empleado');
  const [iniciales, setIniciales] = useState('EM');

  // EFECTO DE ARRANQUE: Modo Oscuro y Carga de Datos
  useEffect(() => {
    // 1. Aplicar modo oscuro si estaba guardado (Evita que se quite con F5)
    if (localStorage.getItem('rosterapp_theme') === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 2. Cargar los datos del usuario
    cargarDatosUsuario();

    // 3. Escuchar si desde "Configuración" cambian el avatar o el nombre
    const handleAvatarUpdate = () => setAvatar(localStorage.getItem('rosterapp_employee_avatar'));
    const handleNameUpdate = () => cargarDatosUsuario();

    window.addEventListener('employeeAvatarUpdated', handleAvatarUpdate);
    window.addEventListener('employeeNameUpdated', handleNameUpdate);

    return () => {
      window.removeEventListener('employeeAvatarUpdated', handleAvatarUpdate);
      window.removeEventListener('employeeNameUpdated', handleNameUpdate);
    };
  }, []);

  const cargarDatosUsuario = () => {
    const userDataString = localStorage.getItem('rosterapp_user');
    if (userDataString) {
      const user = JSON.parse(userDataString);
      const nombreReal = user.nombre || user.email.split('@')[0];
      setNombreUsuario(nombreReal);
      setIniciales(nombreReal.substring(0, 2).toUpperCase());
    }
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('rosterapp_user');
    localStorage.removeItem('rosterapp_employee_avatar'); // Opcional: borrar avatar al salir
    navigate('/');
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-50 dark:bg-slate-900 flex flex-col transition-colors duration-300">
      
      {/* MENÚ MÓVIL */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] md:hidden transition-opacity" onClick={closeMenu}></div>
      )}

      <div className={`fixed inset-y-0 left-0 z-[70] w-64 bg-white dark:bg-slate-800 shadow-2xl transform transition-transform duration-300 md:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 px-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
          <span className="text-lg font-extrabold text-blue-700 dark:text-blue-400">Menú</span>
          <button onClick={closeMenu} className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavLink onClick={closeMenu} to="/empleado/turnos" className={({isActive}) => `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}>
            <span>📅</span><span>Mis Turnos</span>
          </NavLink>
          <NavLink onClick={closeMenu} to="/empleado/fichaje" className={({isActive}) => `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}>
            <span>⏱️</span><span>Fichar</span>
          </NavLink>
          <NavLink onClick={closeMenu} to="/empleado/configuracion" className={({isActive}) => `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}>
            <span>⚙️</span><span>Configuración</span>
          </NavLink>
        </nav>
      </div>

      {/* CABECERA PRINCIPAL */}
      <header className="flex-shrink-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-2 flex items-center justify-between z-50 transition-colors duration-300">
        <div className="flex items-center">
          
          <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden mr-3 p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>

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
              <p className="text-xs font-bold text-gray-800 dark:text-gray-100 leading-tight">Hola, {nombreUsuario}</p>
            </div>
            {avatar ? (
              <img src={avatar} alt="Perfil" className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-slate-600 shadow-sm" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-slate-600 shadow-sm text-xs">
                {iniciales}
              </div>
            )}
          </div>
          <div className="h-5 w-px bg-gray-200 dark:bg-slate-700 hidden sm:block"></div>
          
          <button onClick={handleLogout} className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-gray-200 dark:border-slate-600 shadow-sm cursor-pointer" title="Cerrar Sesión">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}