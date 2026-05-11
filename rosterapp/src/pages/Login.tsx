import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; 

export default function Login() {
  // Cambiamos el booleano por un estado de 3 vistas
  const [view, setView] = useState<'login' | 'register' | 'lock'>('login'); 
  const [nombre, setNombre] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recordarme, setRecordarme] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Nuevos estados para la pantalla de bloqueo
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('rosterapp_theme') === 'dark' || document.documentElement.classList.contains('dark');
  });

  const navigate = useNavigate();

  useEffect(() => {
    const emailGuardado = localStorage.getItem('rosterapp_remembered_email');
    if (emailGuardado) {
      setEmail(emailGuardado);
      setRecordarme(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('rosterapp_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rosterapp_theme', 'light');
    }
  };

  const toggleMode = () => {
    setView(view === 'login' ? 'register' : 'login');
    setError(null);
    setPassword('');
    setShowPassword(false);
  };

  // Función para generar un código de 6 dígitos aleatorio
  const generarCodigo = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Función reutilizable para iniciar sesión una vez verificado
  const iniciarSesion = (usuario: any) => {
    if (recordarme) {
      localStorage.setItem('rosterapp_remembered_email', email);
    } else {
      localStorage.removeItem('rosterapp_remembered_email');
    }

    localStorage.setItem('rosterapp_user', JSON.stringify({
      id: usuario.id_usuario,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    }));

    if (usuario.rol === 'administrador' || usuario.rol === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/empleado/fichaje'); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (view === 'login') {
        const { data: usuario, error: errBaseDatos } = await supabase
          .from('usuarios')
          .select('*')
          .eq('email', email)
          .single();

        if (errBaseDatos || !usuario || usuario.password !== password) {
          throw new Error('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
        }

        // --- LÓGICA DE CANDADO EN EL LOGIN ---
        if (!usuario.email_verificado && usuario.rol !== 'administrador' && usuario.rol !== 'admin') {
          // Si no está verificado, generamos un código nuevo y lo mandamos a la pantalla lock
          const nuevoCodigo = generarCodigo();
          await supabase.from('usuarios').update({ codigo_verificacion: nuevoCodigo }).eq('id_usuario', usuario.id_usuario);
          setView('lock');
          setLoading(false);
          return;
        }

        // Si está verificado, entra normal
        iniciarSesion(usuario);

      } else if (view === 'register') {
        if (!nombre.trim()) throw new Error('Por favor, introduce tu nombre completo.');
        
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
        if (!passwordRegex.test(password)) {
          throw new Error('La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula y un número.');
        }

        const { data: existingUser } = await supabase
          .from('usuarios')
          .select('email')
          .eq('email', email)
          .maybeSingle();

        if (existingUser) {
          throw new Error('Este correo electrónico ya está registrado.');
        }

        // --- LÓGICA DE REGISTRO CON CANDADO ---
        const codigoSecreto = generarCodigo();

        const newUser = {
          nombre: nombre,
          email: email,
          password: password,
          rol: 'empleado', 
          dias_libres_disponibles: 0, 
          findes_trabajados: 0,
          email_verificado: false,
          codigo_verificacion: codigoSecreto
        };

        const { error: registerError } = await supabase
          .from('usuarios')
          .insert([newUser]);

        if (registerError) {
          throw new Error('Error al crear la cuenta. Inténtalo de nuevo.');
        }

        // En lugar de iniciar sesión, lo mandamos a la pantalla de bloqueo
        setView('lock');
      }

    } catch (err: any) {
      setError(err.message || 'Error en la operación');
    } finally {
      setLoading(false);
    }
  };

  const verificarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data: usuario, error: errBusqueda } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single();

      if (errBusqueda || !usuario) throw new Error('No se encontró el usuario.');

      if (usuario.codigo_verificacion === codigoIngresado) {
        // Código correcto: Verificamos en base de datos y limpiamos el código
        await supabase.from('usuarios').update({ email_verificado: true, codigo_verificacion: null }).eq('id_usuario', usuario.id_usuario);
        
        setMensajeExito('¡Correo verificado con éxito! Entrando...');
        
        // Esperamos un segundo para que el usuario lea el mensaje verde y entra
        setTimeout(() => {
          iniciarSesion(usuario);
        }, 1500);

      } else {
        throw new Error('El código ingresado es incorrecto.');
      }

    } catch (err: any) {
      setError(err.message || 'Error al verificar el código.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#0f172a] font-sans transition-colors duration-300">
      
      {/* MITAD IZQUIERDA - AZUL (Branding) */}
      <div className="hidden md:flex w-1/2 bg-blue-600 flex-col items-center justify-center p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        <div className="relative z-10 animate-fade-in">
          <div className="mb-6 bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/10 shadow-lg inline-flex transition-all">
            {view === 'lock' ? (
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            ) : (
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            )}
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">RosterApp</h1>
          <p className="text-blue-100 text-lg max-w-md font-medium mx-auto">
            {view === 'lock' 
              ? 'Seguridad primero. Verificamos tu identidad para proteger los datos de la empresa.' 
              : 'Gestión de cuadrantes inteligente para equipos modernos. Simplifica el día a día de tu empresa.'}
          </p>
        </div>
      </div>

      {/* MITAD DERECHA - FORMULARIO */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 bg-white dark:bg-[#0f172a] text-slate-800 dark:text-white relative transition-colors duration-300">
        
        {/* Botón de Modo Oscuro en la esquina */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="absolute top-6 right-6 md:top-8 md:right-8 p-2.5 rounded-full bg-gray-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          title="Alternar modo oscuro"
        >
          {isDarkMode ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          )}
        </button>

        {/* Header móvil */}
        <div className="md:hidden flex items-center gap-3 mb-10 w-full max-w-md mt-8">
          <div className="bg-blue-600 p-2 rounded-xl shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <span className="text-2xl font-extrabold text-blue-700 dark:text-blue-500 tracking-tight">RosterApp</span>
        </div>

        <div className="w-full max-w-md">
          
          {/* ================= PANTALLA DE BLOQUEO ================= */}
          {view === 'lock' ? (
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Verifica tu Correo</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">
                Hemos enviado un código de 6 dígitos a <span className="font-bold text-slate-700 dark:text-slate-200">{email}</span>. Introdúcelo abajo para desbloquear tu cuenta.
              </p>

              {error && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold flex items-center gap-3 mb-6 text-left">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <p>{error}</p>
                </div>
              )}

              {mensajeExito ? (
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/50 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-sm font-bold flex items-center gap-3 mb-6 text-left animate-fade-in">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <p>{mensajeExito}</p>
                </div>
              ) : (
                <form onSubmit={verificarCodigo} className="space-y-5">
                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={codigoIngresado}
                      onChange={(e) => setCodigoIngresado(e.target.value.replace(/\D/g, ''))} // Solo permite números
                      placeholder="000000"
                      className="w-full bg-gray-50 dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-4 text-center text-3xl tracking-[0.5em] text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all font-black placeholder:text-gray-300 dark:placeholder:text-slate-600"
                    />
                  </div>
                  <button type="submit" disabled={loading || codigoIngresado.length !== 6} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50 uppercase tracking-wider text-sm">
                    {loading ? 'Verificando...' : 'Desbloquear Cuenta'}
                  </button>
                </form>
              )}

              <button onClick={() => setView('login')} className="mt-8 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer">
                ← Volver al inicio de sesión
              </button>
            </div>
          ) : (

          /* ================= LOGIN Y REGISTRO NORMAL ================= */
          <>
            <div className="mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight transition-colors duration-300">
                {view === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors duration-300">
                {view === 'login' 
                  ? 'Bienvenido de nuevo, por favor introduce tus credenciales.' 
                  : 'Únete a RosterApp y comienza a gestionar tus turnos hoy mismo.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {error && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold flex items-start gap-3 animate-fade-in shadow-sm transition-colors duration-300">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <p>{error}</p>
                </div>
              )}

              {view === 'register' && (
                <div className="animate-fade-in">
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 transition-colors duration-300">Nombre Completo</label>
                  <input
                    type="text"
                    required={view === 'register'}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Ignacio Leo Sánchez"
                    className="w-full bg-gray-50 dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder:text-gray-400 dark:placeholder:text-slate-500 font-medium"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 transition-colors duration-300">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@empresa.com"
                  className="w-full bg-gray-50 dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder:text-gray-400 dark:placeholder:text-slate-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 transition-colors duration-300">Contraseña</label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3.5 pr-12 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder:text-gray-400 dark:placeholder:text-slate-500 font-medium tracking-widest"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors focus:outline-none cursor-pointer"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {view === 'login' && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={recordarme}
                        onChange={(e) => setRecordarme(e.target.checked)}
                        className="appearance-none w-4 h-4 border border-gray-300 dark:border-slate-600 rounded bg-gray-50 dark:bg-[#1e293b] checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer"
                      />
                      {recordarme && (
                        <svg className="w-3 h-3 text-white absolute pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Recordarme</span>
                  </label>

                  <button type="button" className="text-xs font-bold text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors cursor-pointer">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-blue-600/20 transition-all transform active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:transform-none uppercase tracking-wider text-sm mt-4"
              >
                {loading 
                  ? (view === 'login' ? 'ACCEDIENDO...' : 'CREANDO CUENTA...') 
                  : (view === 'login' ? 'ACCEDER AL PANEL' : 'CREAR CUENTA')}
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-8 font-medium transition-colors duration-300">
              {view === 'login' ? '¿No tienes una cuenta? ' : '¿Ya tienes una cuenta? '}
              <button 
                type="button" 
                onClick={toggleMode}
                className="text-blue-600 dark:text-blue-500 font-bold hover:text-blue-700 dark:hover:text-blue-400 transition-colors cursor-pointer border-b border-blue-600 dark:border-blue-500 hover:border-blue-700 dark:hover:border-blue-400 pb-0.5 ml-1"
              >
                {view === 'login' ? 'Regístrate aquí' : 'Inicia sesión aquí'}
              </button>
            </p>
          </>
          )}

        </div>
      </div>
    </div>
  );
}