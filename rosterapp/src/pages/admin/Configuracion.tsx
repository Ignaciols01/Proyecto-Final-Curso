import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminConfiguracion() {
  const [activeTab, setActiveTab] = useState<'perfil' | 'seguridad' | 'preferencias'>('perfil');
  
  // ================= PERFIL Y AVATAR =================
  const [avatarUrl, setAvatarUrl] = useState<string | null>(localStorage.getItem('rosterapp_admin_avatar'));
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [mensajePerfil, setMensajePerfil] = useState<{texto: string, tipo: 'error' | 'exito'} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Al cargar la página, leemos los datos actuales y aseguramos el Modo Oscuro si se pulsó F5
  useEffect(() => {
    // Restaurar modo oscuro si estaba activo
    if (localStorage.getItem('rosterapp_theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }

    // Cargar datos de usuario
    const user = JSON.parse(localStorage.getItem('rosterapp_user') || '{}');
    setNombre(user.nombre || 'Admin Gerencia');
    setCorreo(user.email || 'admin@rosterapp.com');
  }, []);

  // Lógica del Avatar (Previsualización antes de guardar)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 150;
        const MAX_HEIGHT = 150;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        setAvatarUrl(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleGuardarPerfil = async () => {
    setMensajePerfil(null);
    const user = JSON.parse(localStorage.getItem('rosterapp_user') || '{}');
    if (!user.id) return;

    const { error } = await supabase
      .from('usuarios')
      .update({ nombre: nombre })
      .eq('id_usuario', user.id);

    if (error) {
      setMensajePerfil({ texto: 'Error al guardar el perfil en la base de datos.', tipo: 'error' });
    } else {
      user.nombre = nombre;
      localStorage.setItem('rosterapp_user', JSON.stringify(user));
      
      if (avatarUrl) {
        localStorage.setItem('rosterapp_admin_avatar', avatarUrl);
        // Esto avisa al panel lateral para que actualice la foto
        window.dispatchEvent(new Event('adminAvatarUpdated')); 
      }

      setMensajePerfil({ texto: '¡Perfil actualizado correctamente!', tipo: 'exito' });
      window.dispatchEvent(new Event('adminNameUpdated'));
    }
  };

  // ================= SEGURIDAD =================
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [mensajeSeguridad, setMensajeSeguridad] = useState<{texto: string, tipo: 'error' | 'exito'} | null>(null);

  const handleActualizarPassword = async () => {
    setMensajeSeguridad(null);
    if (nuevaPassword !== repetirPassword) {
      setMensajeSeguridad({ texto: 'Las contraseñas nuevas no coinciden.', tipo: 'error' });
      return;
    }

    const user = JSON.parse(localStorage.getItem('rosterapp_user') || '{}');
    if (!user.id) return;

    const { data: usuarioData, error: errorBusqueda } = await supabase
      .from('usuarios')
      .select('password')
      .eq('id_usuario', user.id)
      .single();

    if (errorBusqueda || usuarioData?.password !== passwordActual) {
      setMensajeSeguridad({ texto: 'La contraseña actual es incorrecta.', tipo: 'error' });
      return;
    }

    const { error: errorUpdate } = await supabase
      .from('usuarios')
      .update({ password: nuevaPassword })
      .eq('id_usuario', user.id);

    if (errorUpdate) {
      setMensajeSeguridad({ texto: 'Error al conectar con la base de datos.', tipo: 'error' });
    } else {
      setMensajeSeguridad({ texto: '¡Contraseña actualizada con éxito!', tipo: 'exito' });
      setPasswordActual('');
      setNuevaPassword('');
      setRepetirPassword('');
    }
  };

  // ================= PREFERENCIAS =================
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
    <div className="p-6 md:p-8 transition-colors duration-300">
      
      {/* Cabecera idéntica a tu diseño */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">Ajustes</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Gestiona tu información personal y las preferencias del sistema</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 min-h-[500px]">
        
        {/* Menú Lateral de la Configuración */}
        <div className="w-full md:w-64 flex flex-row md:flex-col gap-2">
          <button onClick={() => setActiveTab('perfil')} className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'perfil' ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-slate-700' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50'}`}>Mi Perfil</button>
          <button onClick={() => setActiveTab('seguridad')} className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'seguridad' ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-slate-700' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50'}`}>Seguridad</button>
          <button onClick={() => setActiveTab('preferencias')} className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'preferencias' ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-slate-700' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50'}`}>Preferencias</button>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 md:p-8">
          
          {/* VISTA: MI PERFIL */}
          {activeTab === 'perfil' && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Información Personal</h3>
              
              {mensajePerfil && (
                <div className={`mb-6 p-3 rounded-lg text-sm font-bold border-l-4 ${mensajePerfil.tipo === 'error' ? 'bg-red-50 text-red-700 border-red-500' : 'bg-emerald-50 text-emerald-700 border-emerald-500'}`}>
                  {mensajePerfil.texto}
                </div>
              )}

              <div className="bg-blue-50/50 dark:bg-slate-700/50 rounded-xl p-5 flex items-center space-x-6 border border-blue-100 dark:border-slate-600 mb-8">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover shadow-sm border-2 border-blue-200 dark:border-slate-500" />
                ) : (
                  <div className="w-20 h-20 bg-blue-600 dark:bg-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold shadow-sm">
                    {nombre.substring(0,2).toUpperCase()}
                  </div>
                )}
                
                <div>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg shadow-sm hover:border-blue-300 transition-colors text-sm cursor-pointer mb-2">
                    Cambiar Avatar
                  </button>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">JPG o PNG. Máximo 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Correo Electrónico</label>
                  <input 
                    type="email" 
                    readOnly
                    value={correo}
                    className="w-full border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/50 rounded-lg px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <button 
                onClick={handleGuardarPerfil}
                className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-colors cursor-pointer text-sm"
              >
                Guardar Cambios
              </button>
            </div>
          )}

          {/* VISTA: SEGURIDAD */}
          {activeTab === 'seguridad' && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Seguridad y Contraseña</h3>
              
              <div className="max-w-md space-y-4">
                {mensajeSeguridad && (
                  <div className={`p-3 rounded-lg text-sm font-bold border-l-4 ${mensajeSeguridad.tipo === 'error' ? 'bg-red-50 text-red-700 border-red-500' : 'bg-emerald-50 text-emerald-700 border-emerald-500'}`}>
                    {mensajeSeguridad.texto}
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Contraseña Actual</label>
                  <input type="password" value={passwordActual} onChange={(e) => setPasswordActual(e.target.value)} placeholder="••••••••" className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Nueva Contraseña</label>
                  <input type="password" value={nuevaPassword} onChange={(e) => setNuevaPassword(e.target.value)} placeholder="••••••••" className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Repetir Nueva Contraseña</label>
                  <input type="password" value={repetirPassword} onChange={(e) => setRepetirPassword(e.target.value)} placeholder="••••••••" className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                
                <button onClick={handleActualizarPassword} className="mt-6 bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-colors cursor-pointer text-sm">
                  Actualizar Contraseña
                </button>
              </div>
            </div>
          )}

          {/* VISTA: PREFERENCIAS */}
          {activeTab === 'preferencias' && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Preferencias del Sistema</h3>
              
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl">
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">Notificaciones por Correo</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Recibe un aviso cuando se te asigne o modifique un turno.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl">
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">Modo Oscuro</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Cambia la interfaz a colores oscuros para descansar la vista.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isDarkMode} onChange={toggleDarkMode} />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
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