import React, { useState, useRef } from 'react';

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState<'perfil' | 'seguridad' | 'preferencias'>('perfil');
  
  // Lógica del Avatar
  const [avatarUrl, setAvatarUrl] = useState<string | null>(localStorage.getItem('rosterapp_employee_avatar'));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setAvatarUrl(base64Image);
        try {
          localStorage.setItem('rosterapp_employee_avatar', base64Image);
          window.dispatchEvent(new Event('employeeAvatarUpdated'));
        } catch (error) {
          console.warn("La imagen superó el límite de memoria, pero se muestra en la sesión actual.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Lógica del Modo Oscuro
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
      <header className="bg-blue-700 dark:bg-blue-900 text-white p-5 md:p-6 shadow-sm rounded-xl mb-4 md:mb-6 transition-colors duration-300">
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight mb-1">Configuración de Cuenta</h1>
        <p className="text-blue-200 dark:text-blue-300 text-xs md:text-sm font-medium">Gestiona tu información personal y las preferencias del sistema</p>
      </header>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row overflow-hidden min-h-[500px] transition-colors duration-300">
        
        {/* Menú Lateral / Superior en móviles */}
        <div className="w-full md:w-64 bg-gray-50 dark:bg-slate-800/50 border-b md:border-b-0 md:border-r border-gray-100 dark:border-slate-700 p-4 md:p-6">
          {/* Scroll horizontal en móviles para que no ocupe toda la pantalla */}
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
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
        <div className="flex-1 p-5 md:p-8">
          
          {/* PESTAÑA 1: MI PERFIL */}
          {activeTab === 'perfil' && (
            <div className="animate-fade-in">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Información Personal</h3>
              
              <div className="bg-blue-50/50 dark:bg-slate-700/50 rounded-xl p-5 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 border border-blue-100 dark:border-slate-600 mb-8 text-center sm:text-left">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover shadow-sm border-2 border-blue-200 dark:border-slate-500 flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 dark:bg-blue-500 rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl font-extrabold shadow-sm flex-shrink-0">
                    EM
                  </div>
                )}
                
                <div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={handleAvatarChange} 
                    className="hidden" 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 font-bold py-2 px-4 rounded-lg shadow-sm hover:border-blue-300 dark:hover:border-blue-500 transition-colors text-xs md:text-sm cursor-pointer mb-2"
                  >
                    Cambiar Avatar
                  </button>
                  <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 font-medium">JPG o PNG. Máximo 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Nombre Completo</label>
                  <input 
                    type="text" 
                    defaultValue="Empleado RosterApp"
                    className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Correo Electrónico</label>
                  <input 
                    type="email" 
                    defaultValue="empleado@rosterapp.com"
                    className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm transition-all"
                  />
                </div>
              </div>

              <button className="w-full md:w-auto bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2.5 md:py-3 px-6 rounded-lg shadow-md transition-colors cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 text-sm">
                Guardar Cambios
              </button>
            </div>
          )}

          {/* PESTAÑA 2: SEGURIDAD (EL CÓDIGO PERDIDO) */}
          {activeTab === 'seguridad' && (
            <div className="animate-fade-in">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Seguridad y Contraseña</h3>
              
              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Contraseña Actual</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Nueva Contraseña</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Repetir Nueva Contraseña</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm transition-all"
                  />
                </div>
                
                <button className="mt-6 w-full md:w-auto bg-gray-800 dark:bg-slate-700 hover:bg-gray-900 dark:hover:bg-slate-600 text-white font-bold py-2.5 md:py-3 px-6 rounded-lg shadow-md transition-colors cursor-pointer text-sm">
                  Actualizar Contraseña
                </button>
              </div>
            </div>
          )}

          {/* PESTAÑA 3: PREFERENCIAS (EL OTRO CÓDIGO PERDIDO) */}
          {activeTab === 'preferencias' && (
            <div className="animate-fade-in">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Preferencias del Sistema</h3>
              
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
  );
}