import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Estados para Iniciar Sesión
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para Registro
  const [regNombre, setRegNombre] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRepetir, setRegRepetir] = useState('');

  const [errorMensaje, setErrorMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  // --- FUNCIÓN DE INICIAR SESIÓN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMensaje('');
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !data) {
        setErrorMensaje('Correo o contraseña incorrectos.');
        setLoading(false);
        return;
      }

      // Guardamos la sesión, ¡AÑADIENDO EL NOMBRE AHORA!
      localStorage.setItem('rosterapp_user', JSON.stringify({
        id: data.id_usuario,
        email: data.email,
        rol: data.rol,
        nombre: data.nombre || data.email.split('@')[0] // Por si el nombre está vacío, mostramos algo
      }));

      if (data.rol === 'administrador') {
        navigate('/admin/dashboard');
      } else {
        navigate('/empleado/turnos');
      }

    } catch (err) {
      setErrorMensaje('Error de conexión con la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  // --- FUNCIÓN DE REGISTRARSE ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMensaje('');

    if (regPassword !== regRepetir) {
      setErrorMensaje('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      // Guardamos al nuevo usuario en Supabase
      const { error } = await supabase
        .from('usuarios')
        .insert([{ 
          nombre: regNombre,
          email: regEmail, 
          password: regPassword,
          rol: 'empleado' // Todos nacen como empleados por seguridad
        }]);

      if (error) {
        setErrorMensaje('El correo ya existe o hubo un error.');
      } else {
        alert('¡Cuenta creada con éxito! Ya puedes iniciar sesión.');
        setView('login');
      }
    } catch (err) {
      setErrorMensaje('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Enlace enviado.');
    setView('login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-slate-900 transition-colors duration-300">
      
      <div className="md:w-1/2 bg-[#1d4ed8] flex flex-col items-center justify-center p-12 text-white">
        <div className="mb-6">
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

      <div className="md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          
          {errorMensaje && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r">
              {errorMensaje}
            </div>
          )}

          {/* VISTA: INICIAR SESIÓN */}
          {view === 'login' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Iniciar Sesión</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-8 font-medium">Bienvenido de nuevo, por favor introduce tus credenciales.</p>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Correo Electrónico</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ejemplo@empresa.com" required className="w-full border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Contraseña</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" />
                </div>

                <div className="flex items-center justify-between text-[11px] font-medium">
                  <label className="flex items-center text-slate-500 dark:text-slate-400 cursor-pointer">
                    <input type="checkbox" className="mr-2 rounded border-slate-200" /> Recordarme
                  </label>
                  <button type="button" onClick={() => {setView('forgot'); setErrorMensaje('');}} className="text-blue-600 dark:text-blue-400 hover:underline">¿Olvidaste tu contraseña?</button>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-xs shadow-lg shadow-blue-200 dark:shadow-none transition-all uppercase tracking-wide disabled:opacity-50">
                  {loading ? 'CONECTANDO...' : 'Acceder al panel'}
                </button>
              </form>

              <p className="mt-8 text-center text-[11px] text-slate-400">
                ¿No tienes una cuenta? <button onClick={() => {setView('register'); setErrorMensaje('');}} className="text-blue-600 font-bold hover:underline">Regístrate aquí</button>
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
                  <input type="text" value={regNombre} onChange={(e) => setRegNombre(e.target.value)} placeholder="Ej: Laura Martínez" required className="w-full border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Correo Electrónico</label>
                  <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="ejemplo@empresa.com" required className="w-full border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Contraseña</label>
                    <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="••••" required className="w-full border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Repetir</label>
                    <input type="password" value={regRepetir} onChange={(e) => setRegRepetir(e.target.value)} placeholder="••••" required className="w-full border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#0f172a] hover:bg-black text-white font-bold py-3 rounded-lg text-xs mt-4 transition-all uppercase tracking-wide disabled:opacity-50">
                  {loading ? 'CREANDO...' : 'Crear Cuenta'}
                </button>
              </form>
              <p className="mt-6 text-center text-[11px] text-slate-400">
                ¿Ya tienes una cuenta? <button onClick={() => {setView('login'); setErrorMensaje('');}} className="text-blue-600 font-bold hover:underline">Inicia sesión</button>
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
              <button onClick={() => {setView('login'); setErrorMensaje('');}} className="mt-8 w-full text-center text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">
                ← Volver al login
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}