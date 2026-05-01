import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/admin/dashboard');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Cuenta creada con éxito.');
    setView('login');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Enlace enviado.');
    setView('login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-slate-900 transition-colors duration-300">
      
      {/* Lado Izquierdo - Diseño Original */}
      <div className="md:w-1/2 bg-[#1d4ed8] flex flex-col items-center justify-center p-12 text-white">
        <div className="mb-6">
          {/* Icono de calendario original */}
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-extrabold mb-2">RosterApp</h1>
        <p className="text-sm opacity-90 text-center max-w-xs leading-relaxed">
          Gestión de cuadrantes inteligente para equipos modernos. Simplifica el día a día de tu empresa.
        </p>
      </div>

      {/* Lado Derecho - Formularios */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          
          {/* VISTA: INICIAR SESIÓN */}
          {view === 'login' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Iniciar Sesión</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-8 font-medium">Bienvenido de nuevo, por favor introduce tus credenciales.</p>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Correo Electrónico</label>
                  <input type="email" placeholder="ejemplo@empresa.com" required className="w-full border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Contraseña</label>
                  <input type="password" placeholder="••••••••" required className="w-full border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" />
                </div>

                <div className="flex items-center justify-between text-[11px] font-medium">
                  <label className="flex items-center text-slate-500 dark:text-slate-400 cursor-pointer">
                    <input type="checkbox" className="mr-2 rounded border-slate-200" /> Recordarme
                  </label>
                  <button type="button" onClick={() => setView('forgot')} className="text-blue-600 dark:text-blue-400 hover:underline">¿Olvidaste tu contraseña?</button>
                </div>

                <button type="submit" className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-xs shadow-lg shadow-blue-200 dark:shadow-none transition-all uppercase tracking-wide">
                  Acceder al panel
                </button>
              </form>

              <p className="mt-8 text-center text-[11px] text-slate-400">
                ¿No tienes una cuenta? <button onClick={() => setView('register')} className="text-blue-600 font-bold hover:underline">Regístrate aquí</button>
              </p>
            </div>
          )}

          {/* VISTA: CREAR CUENTA */}
          {view === 'register' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Crear Cuenta</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-8 font-medium">Únete a RosterApp y organiza tu equipo hoy mismo.</p>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Nombre Completo</label>
                  <input type="text" placeholder="Ej: Laura Martínez" required className="w-full border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Correo Electrónico</label>
                  <input type="email" placeholder="ejemplo@empresa.com" required className="w-full border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Contraseña</label>
                    <input type="password" placeholder="••••" required className="w-full border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Repetir</label>
                    <input type="password" placeholder="••••" required className="w-full border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#0f172a] hover:bg-black text-white font-bold py-3 rounded-lg text-xs mt-4 transition-all uppercase tracking-wide">
                  Crear Cuenta
                </button>
              </form>
              <p className="mt-6 text-center text-[11px] text-slate-400">
                ¿Ya tienes una cuenta? <button onClick={() => setView('login')} className="text-blue-600 font-bold hover:underline">Inicia sesión</button>
              </p>
            </div>
          )}

          {/* VISTA: OLVIDASTE CONTRASEÑA */}
          {view === 'forgot' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Recuperar Acceso</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-8 font-medium">Introduce tu email para restablecer la contraseña.</p>
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Correo Electrónico</label>
                  <input type="email" placeholder="ejemplo@empresa.com" required className="w-full border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" />
                </div>
                <button type="submit" className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-xs transition-all uppercase tracking-wide">
                  Enviar instrucciones
                </button>
              </form>
              <button onClick={() => setView('login')} className="mt-8 w-full text-center text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">
                ← Volver al login
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}