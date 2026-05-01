import React, { useState, useRef } from 'react';

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState<'perfil' | 'seguridad' | 'preferencias'>('perfil');
  
  // AHORA USA rosterapp_employee_avatar
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
          // GUARDAMOS COMO rosterapp_employee_avatar
          localStorage.setItem('rosterapp_employee_avatar', base64Image);
          window.dispatchEvent(new Event('employeeAvatarUpdated'));
        } catch (error) {
          console.warn("La imagen superó el límite de memoria, pero se muestra en la sesión actual.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-10 transition-colors duration-300">
      
      <header className="bg-blue-700 dark:bg-blue-900 text-white p-6 shadow-md rounded-b-3xl transition-colors duration-300">
        <div className="flex justify-between items-center mb-4 max-w-6xl mx-auto">
          <h1 className="text-2xl font-extrabold tracking-tight">RosterApp</h1>
          <button className="text-sm font-bold bg-blue-800 dark:bg-blue-950 hover:bg-blue-900 px-4 py-2 rounded-full transition-colors cursor-pointer">
            SALIR
          </button>
        </div>
        <div className="max-w-6xl mx-auto">
          <p className="text-blue-200 dark:text-blue-300 text-sm font-medium">Hola, bienvenido</p>
          <p className="text-xl font-bold">Configuración de Cuenta</p>
        </div>
      </header>

      <div className="p-6 max-w-6xl mx-auto mt-6">
        
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">Configuración de Cuenta</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Gestiona tu información personal y las preferencias del sistema</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row overflow-hidden min-h-[500px] transition-colors duration-300">
          
          <div className="w-full md:w-64 bg-gray-50 dark:bg-slate-800/50 border-r border-gray-100 dark:border-slate-700 p-6">
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('perfil')}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer ${activeTab === 'perfil' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-slate-600' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-gray-100'}`}
              >
                Mi Perfil
              </button>
              <button 
                onClick={() => setActiveTab('seguridad')}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer ${activeTab === 'seguridad' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-slate-600' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-gray-100'}`}
              >
                Seguridad
              </button>
              <button 
                onClick={() => setActiveTab('preferencias')}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer ${activeTab === 'preferencias' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-slate-600' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-gray-100'}`}
              >
                Preferencias
              </button>
            </nav>
          </div>

          <div className="flex-1 p-8">
            
            {activeTab === 'perfil' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Información Personal</h3>
                
                <div className="bg-blue-50/50 dark:bg-slate-700/50 rounded-xl p-6 flex items-center space-x-6 border border-blue-100 dark:border-slate-600 mb-8">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover shadow-sm border-2 border-blue-200 dark:border-slate-500" />
                  ) : (
                    <div className="w-20 h-20 bg-blue-600 dark:bg-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold shadow-sm">
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
                      className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 font-bold py-2 px-4 rounded-lg shadow-sm hover:border-blue-300 dark:hover:border-blue-500 transition-colors text-sm cursor-pointer mb-2"
                    >
                      Cambiar Avatar
                    </button>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">JPG o PNG. Máximo 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Nombre Completo</label>
                    <input 
                      type="text" 
                      defaultValue="Empleado RosterApp"
                      className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-3 text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Correo Electrónico</label>
                    <input 
                      type="email" 
                      defaultValue="empleado@rosterapp.com"
                      className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-3 text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm transition-all"
                    />
                  </div>
                </div>

                <button className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900">
                  Guardar Cambios
                </button>
              </div>
            )}

            {activeTab === 'seguridad' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Seguridad y Contraseña</h3>
                <div className="max-w-md space-y-5">
                  {/* ... campos de contraseña ... */}
                </div>
              </div>
            )}

            {activeTab === 'preferencias' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Preferencias del Sistema</h3>
                <div className="space-y-5 max-w-2xl">
                  {/* ... toggles de preferencias ... */}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}