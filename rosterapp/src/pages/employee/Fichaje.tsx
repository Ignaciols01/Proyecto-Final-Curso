import React, { useState, useEffect } from 'react';

export default function Fichaje() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const [horaEntrada, setHoraEntrada] = useState<Date | null>(() => {
    const guardada = localStorage.getItem('rosterapp_entrada');
    return guardada ? new Date(guardada) : null;
  });

  const [horaSalida, setHoraSalida] = useState<Date | null>(() => {
    const guardada = localStorage.getItem('rosterapp_salida');
    return guardada ? new Date(guardada) : null;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeBig = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatTimeSmall = (date: Date | null) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const handleRegistrarEntrada = () => {
    const ahora = new Date();
    setHoraEntrada(ahora);
    localStorage.setItem('rosterapp_entrada', ahora.toISOString());
    
    setHoraSalida(null);
    localStorage.removeItem('rosterapp_salida');
  };

  const handleRegistrarSalida = () => {
    const ahora = new Date();
    setHoraSalida(ahora);
    localStorage.setItem('rosterapp_salida', ahora.toISOString());
  };

  let horasComputadas = '0h 0m 0s';
  if (horaEntrada) {
    const timeEnd = horaSalida ? horaSalida.getTime() : currentTime.getTime();
    const diffMs = Math.max(0, timeEnd - horaEntrada.getTime());
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);
    horasComputadas = `${diffHrs}h ${diffMins}m ${diffSecs}s`;
  }

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
          <p className="text-xl font-bold">Control Horario</p>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto mt-6">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">Control Horario</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Registra tu jornada laboral con precisión</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 flex flex-col items-center justify-center flex-1 transition-colors duration-300">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Hora Actual</p>
            <div className="text-5xl md:text-6xl font-extrabold text-blue-600 dark:text-blue-400 mb-10 tracking-tight font-mono">
              {formatTimeBig(currentTime)}
            </div>

            <div className="w-full max-w-xs flex flex-col gap-3">
              <button 
                onClick={handleRegistrarEntrada}
                disabled={horaEntrada !== null}
                className={`py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-sm ${
                  !horaEntrada 
                    ? 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white cursor-pointer hover:shadow-md transform hover:-translate-y-0.5' 
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                REGISTRAR ENTRADA
              </button>
              
              <button 
                onClick={handleRegistrarSalida}
                disabled={!horaEntrada || horaSalida !== null}
                className={`py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-sm ${
                  horaEntrada && !horaSalida 
                    ? 'bg-gray-800 hover:bg-gray-900 dark:bg-slate-600 dark:hover:bg-slate-500 text-white cursor-pointer hover:shadow-md transform hover:-translate-y-0.5' 
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                REGISTRAR SALIDA
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 flex-1 flex flex-col transition-colors duration-300">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-100 dark:border-slate-700 pb-4">Resumen de Hoy</h3>
            
            <div className="space-y-4 mb-auto">
              <div className="flex justify-between items-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50 transition-colors duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 dark:bg-emerald-400"></div>
                  <span className="font-bold text-gray-700 dark:text-gray-300">Entrada</span>
                </div>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400 font-mono text-lg">
                  {formatTimeSmall(horaEntrada)}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/50 transition-colors duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 dark:bg-red-400"></div>
                  <span className="font-bold text-gray-700 dark:text-gray-300">Salida</span>
                </div>
                <span className="font-extrabold text-red-700 dark:text-red-400 font-mono text-lg">
                  {formatTimeSmall(horaSalida)}
                </span>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 dark:bg-slate-700/50 p-5 rounded-xl border border-blue-100 dark:border-slate-600 transition-colors duration-300">
              <p className="text-xs font-bold text-blue-400 dark:text-blue-300 uppercase tracking-widest mb-1">Horas Computadas</p>
              <p className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 font-mono">
                {horasComputadas}
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}