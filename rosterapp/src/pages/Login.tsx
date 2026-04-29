import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Intento de inicio de sesión con:', email);
    
    // Simulación temporal: al hacer clic, te lleva directo al panel de control
    navigate('/admin/dashboard');
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans">
      {/* Mitad Izquierda - Panel Corporativo Modernizado */}
      <div className="relative hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-[var(--color-brand-primary)] to-blue-900 text-white p-12 overflow-hidden">
        
        {/* Elementos decorativos abstractos (Blobs) */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[var(--color-brand-secondary)] opacity-30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 text-center flex flex-col items-center">
          {/* Falso Logo/Icono corporativo tipo Glassmorphism */}
          <div className="flex items-center justify-center w-24 h-24 mb-8 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">RosterApp</h1>
          <p className="text-blue-100 text-lg font-light max-w-md mx-auto leading-relaxed">
            Gestión de cuadrantes inteligente para equipos modernos. Simplifica el día a día de tu empresa.
          </p>
        </div>
      </div>

      {/* Mitad Derecha - Formulario de Acceso Refinado */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-white px-8 py-12 lg:px-16 relative">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              Iniciar Sesión
            </h2>
            <p className="text-gray-500 text-sm">Bienvenido de nuevo, por favor introduce tus credenciales.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider" htmlFor="email">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 shadow-sm"
                placeholder="ejemplo@empresa.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 shadow-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2 pb-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer font-medium">
                  Recordarme
                </label>
              </div>

              <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              ACCEDER AL PANEL
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}