import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // IMPORTACIÓN AÑADIDA

export default function Configuracion() {
  const navigate = useNavigate(); // HOOK AÑADIDO
  const [activeTab, setActiveTab] = useState<'perfil' | 'seguridad' | 'preferencias'>('perfil');
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('rosterapp_theme') === 'dark';
  });

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('rosterapp_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rosterapp_theme', 'light');
    }
  };

  return (
    <div className="bg-transparent transition-colors duration-300">
      
      {/* Cabecera Azul */}
      <header className="bg-blue-700 dark:bg-blue-900 text-white p-6 shadow-sm rounded-xl mb-6 mx-4 md:mx-8 mt-4 transition-colors duration-300">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-extrabold tracking-tight">RosterApp</h1>
          {/* FUNCIÓN ONCLICK AÑADIDA AL BOTÓN */}
          <button 
            onClick={() => navigate('/login')}
            className="text-xs font-bold bg-blue-800 dark:bg-blue-950 hover:bg-blue-900 px-4 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            SALIR
          </button>
        </div>
        <div>
          <p className="text-blue-200 dark:text-blue-300 text-xs font-medium">Hola, bienvenido</p>
          <p className="text-lg font-bold">Configuración de Cuenta</p>
        </div>
      </header>

      <div className="px-4 md:px-8 pb-8">
        
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-blue-700 dark:text-blue-400">Ajustes</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">Gestiona tu información personal y las preferencias del sistema</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row overflow-hidden min-h-[500px] transition-colors duration-300">
          
          {/* Menú Lateral */}
          <div className="w-full md:w-64 bg-gray-50 dark:bg-slate-800/50 border-r border-gray-100 dark:border-slate-700 p-4 md:p-6">
            <nav className="space-y-2 flex flex-row md:flex-col overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              <button 
                onClick={() => setActiveTab('perfil')}
                className={`flex-shrink-0 w-auto md:w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer ${activeTab === 'perfil' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-slate-600' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-gray-100'}`}
              >
                Mi Perfil
              </button>
              <button 
                onClick={() => setActiveTab('seguridad')}
                className={`flex-shrink-0 w-auto md:w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer ${activeTab === 'seguridad' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-slate-600' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-gray-100'}`}
              >
                Seguridad
              </button>
              <button 
                onClick={() => setActiveTab('preferencias')}
                className={`flex-shrink-0 w-auto md:w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer ${activeTab === 'preferencias' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-slate-600' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-gray-100'}`}
              >
                Preferencias
              </button>
            </nav>
          </div>

          {/* Contenido Principal */}
          <div className="flex-1 p-4 md:p-8">
            
            {activeTab === 'perfil' && (
              <div className="animate-fade-in">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6">Información Personal</h3>
                
                <div className="bg-blue-50/50 dark:bg-slate-700/50 rounded-xl p-5 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 border border-blue-100 dark:border-slate-600 mb-8 text-center sm:text-left">
                  <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-2xl flex items-center justify-center text-white text-xl font-extrabold shadow-sm flex-shrink-0">
                    AD
                  </div>
                  <div>
                    <button className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 font-bold py-2 px-4 rounded-lg shadow-sm hover:border-blue-300 dark:hover:border-blue-500 transition-colors text-xs cursor-pointer mb-2">
                      Cambiar Avatar
                    </button>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">JPG o PNG. Máximo 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Nombre Completo</label>
                    <input 
                      type="text" 
                      defaultValue="Admin Gerencia"
                      className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-3 py-2.5 text-sm text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Correo Electrónico</label>
                    <input 
                      type="email" 
                      defaultValue="admin@rosterapp.com"
                      className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-3 py-2.5 text-sm text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm transition-all"
                    />
                  </div>
                </div>

                <button className="w-full md:w-auto bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-colors cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 text-sm">
                  Guardar Cambios
                </button>
              </div>
            )}

            {activeTab === 'seguridad' && (
              <div className="animate-fade-in">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6">Seguridad y Contraseña</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Próximamente: Opciones para cambiar tu contraseña de acceso.</p>
              </div>
            )}

            {activeTab === 'preferencias' && (
              <div className="animate-fade-in">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6">Preferencias del Sistema</h3>
                
                <div className="space-y-4 max-w-2xl">
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm transition-colors duration-300 gap-4">
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">Notificaciones por Correo</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">Recibe un aviso cuando se te asigne o modifique un turno.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm transition-colors duration-300 gap-4">
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">Modo Oscuro</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">Cambia la interfaz a colores oscuros para descansar la vista.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                    </label>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}