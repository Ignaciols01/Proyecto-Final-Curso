import React, { useState, useRef } from 'react';

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState('perfil');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
    }
  };

  return (
    <div className="p-8 w-full mx-auto">
      <div className="mb-10">
        <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">Configuración de Cuenta</h2>
        <p className="text-gray-500 mt-2 text-lg">Gestiona tu información personal y las preferencias del sistema</p>
      </div>

      <div className="bento-card shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        <div className="w-full md:w-64 bg-gradient-to-b from-blue-50 to-indigo-50 border-b md:border-b-0 md:border-r border-gray-100 p-6 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('perfil')}
            className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'perfil' ? 'bg-white text-blue-700 shadow-md border border-blue-100' : 'text-gray-600 hover:bg-white/50'}`}
          >
            Mi Perfil
          </button>
          <button 
            onClick={() => setActiveTab('seguridad')}
            className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'seguridad' ? 'bg-white text-blue-700 shadow-md border border-blue-100' : 'text-gray-600 hover:bg-white/50'}`}
          >
            Seguridad
          </button>
          <button 
            onClick={() => setActiveTab('preferencias')}
            className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'preferencias' ? 'bg-white text-blue-700 shadow-md border border-blue-100' : 'text-gray-600 hover:bg-white/50'}`}
          >
            Preferencias
          </button>
        </div>

        <div className="flex-1 p-10">
          {activeTab === 'perfil' && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Información Personal</h3>
              
              <div className="flex items-center gap-6 mb-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-white border-4 border-white shadow-lg overflow-hidden relative">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar de perfil" className="w-full h-full object-cover" />
                  ) : (
                    "AD"
                  )}
                </div>
                <div>
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                  />
                  <button 
                    onClick={handleAvatarClick}
                    className="btn-secondary px-5 py-2.5 text-sm font-bold"
                  >
                    Cambiar Avatar
                  </button>
                  <p className="text-xs text-gray-500 mt-3 font-medium">JPG o PNG. Máximo 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Nombre Completo</label>
                  <input type="text" defaultValue="Admin Gerencia" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Correo Electrónico</label>
                  <input type="email" defaultValue="admin@rosterapp.com" disabled className="w-full px-4 py-3 border border-gray-200 bg-gray-50 text-gray-500 rounded-xl cursor-not-allowed" />
                </div>
              </div>
              <button className="mt-10 btn-primary px-8 py-3">
                Guardar Cambios
              </button>
            </div>
          )}

          {activeTab === 'seguridad' && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Cambiar Contraseña</h3>
              <div className="space-y-6 max-w-md">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Contraseña Actual</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Nueva Contraseña</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Confirmar Nueva Contraseña</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-sm" />
                </div>
                <button className="mt-4 btn-primary px-8 py-3">
                  Actualizar Contraseña
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferencias' && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Preferencias del Sistema</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                  <div>
                    <p className="font-bold text-gray-900">Notificaciones por Email</p>
                    <p className="text-sm text-gray-500">Recibe un aviso cuando un empleado solicite un cambio de turno.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                  <div>
                    <p className="font-bold text-gray-900">Modo Oscuro</p>
                    <p className="text-sm text-gray-500">Cambia la interfaz a tonos oscuros (Próximamente).</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-not-allowed opacity-50">
                    <input type="checkbox" className="sr-only peer" disabled />
                    <div className="w-11 h-6 bg-gray-200 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5"></div>
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