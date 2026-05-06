import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; 

export default function Login() {
  const [isLogin, setIsLogin] = useState(true); // Estado para alternar entre Login y Registro
  const [nombre, setNombre] = useState(''); // Estado para el nombre en el registro
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recordarme, setRecordarme] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const emailGuardado = localStorage.getItem('rosterapp_remembered_email');
    if (emailGuardado) {
      setEmail(emailGuardado);
      setRecordarme(true);
    }
  }, []);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setPassword('');
    // No borramos el email por si el usuario lo escribió antes de cambiar de pestaña
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // ==========================
        // LÓGICA DE INICIO DE SESIÓN
        // ==========================
        const { data: usuario, error: errBaseDatos } = await supabase
          .from('usuarios')
          .select('*')
          .eq('email', email)
          .single();

        if (errBaseDatos || !usuario || usuario.password !== password) {
          throw new Error('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
        }

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
          navigate('/empleado/turnos'); 
        }

      } else {
        // ==========================
        // LÓGICA DE REGISTRO
        // ==========================
        if (!nombre.trim()) throw new Error('Por favor, introduce tu nombre completo.');
        if (password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');

        // 1. Comprobar si el correo ya existe
        const { data: existingUser } = await supabase
          .from('usuarios')
          .select('email')
          .eq('email', email)
          .maybeSingle();

        if (existingUser) {
          throw new Error('Este correo electrónico ya está registrado.');
        }

        // 2. Insertar el nuevo usuario (Iniciando con 0 días libres)
        const newUser = {
          nombre: nombre,
          email: email,
          password: password,
          rol: 'empleado', 
          dias_libres_disponibles: 0, // Modificado a 0
          findes_trabajados: 0
        };

        const { data, error: registerError } = await supabase
          .from('usuarios')
          .insert([newUser])
          .select()
          .single();

        if (registerError) {
          throw new Error('Error al crear la cuenta. Inténtalo de nuevo.');
        }

        // 3. Iniciar sesión automáticamente y redirigir
        localStorage.setItem('rosterapp_user', JSON.stringify({
            id: data.id_usuario,
            nombre: data.nombre,
            email: data.email,
            rol: data.rol
        }));
        
        navigate('/empleado/turnos');
      }

    } catch (err: any) {
      setError(err.message || 'Error en la operación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] font-sans">
      
      <div className="hidden md:flex w-1/2 bg-blue-600 flex-col items-center justify-center p-12 text-center">
        <div className="mb-6 bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/10 shadow-lg">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">RosterApp</h1>
        <p className="text-blue-100 text-lg max-w-md font-medium">
          Gestión de cuadrantes inteligente para equipos modernos. Simplifica el día a día de tu empresa.
        </p>
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            <p className="text-gray-400 text-sm font-medium">
              {isLogin 
                ? 'Bienvenido de nuevo, por favor introduce tus credenciales.' 
                : 'Únete a RosterApp y comienza a gestionar tus turnos hoy mismo.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm font-bold text-center animate-fade-in">
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Nombre Completo</label>
                <input
                  type="text"
                  required={!isLogin}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Ignacio Leo Sánchez"
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Correo Electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@empresa.com"
                className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={recordarme}
                      onChange={(e) => setRecordarme(e.target.checked)}
                      className="appearance-none w-5 h-5 border-2 border-slate-600 rounded bg-[#1e293b] checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer"
                    />
                    {recordarme && (
                      <svg className="w-3 h-3 text-white absolute pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-400 group-hover:text-gray-300 transition-colors">Recordarme</span>
                </label>

                <button type="button" className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors cursor-pointer">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:transform-none uppercase tracking-wider"
            >
              {loading 
                ? (isLogin ? 'ACCEDIENDO...' : 'CREANDO CUENTA...') 
                : (isLogin ? 'ACCEDER AL PANEL' : 'CREAR CUENTA')}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-8 font-medium">
            {isLogin ? '¿No tienes una cuenta? ' : '¿Ya tienes una cuenta? '}
            <button 
              type="button" 
              onClick={toggleMode}
              className="text-blue-500 font-bold hover:text-blue-400 transition-colors cursor-pointer border-b border-blue-500 hover:border-blue-400 pb-0.5 ml-1"
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}