import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 transition-colors duration-300 p-6 text-center">
      
      {/* Icono de Error */}
      <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8 shadow-sm">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>

      {/* Texto */}
      <h1 className="text-6xl font-extrabold text-blue-700 dark:text-blue-400 mb-4 tracking-tight">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">Página no encontrada</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md font-medium mb-10">
        Parece que te has perdido. La ruta que estás buscando no existe o ha sido movida a otro lugar.
      </p>

      {/* Botón de regreso */}
      <button 
        onClick={() => navigate('/login')}
        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-colors cursor-pointer flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        <span>Volver al inicio</span>
      </button>

    </div>
  );
}