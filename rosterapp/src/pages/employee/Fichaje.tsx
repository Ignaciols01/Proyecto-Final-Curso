import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Fichaje() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [registroId, setRegistroId] = useState<string | null>(null);

  const [horaEntrada, setHoraEntrada] = useState<Date | null>(null);
  const [horaSalida, setHoraSalida] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  // NUEVO ESTADO: Para guardar la suma de todas las horas históricas (en milisegundos)
  const [historialMilisegundos, setHistorialMilisegundos] = useState<number>(0);

  // Reloj en tiempo real
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Al entrar a la página, cargamos TODOS los fichajes del empleado
  useEffect(() => {
    cargarDatosFichajes();
  }, []);

  const cargarDatosFichajes = async () => {
    setLoading(true);
    const userDataString = localStorage.getItem('rosterapp_user');
    if (!userDataString) return;
    const user = JSON.parse(userDataString);

    // Pedimos a Supabase TODOS los fichajes de este usuario ordenados por fecha
    const { data, error } = await supabase
      .from('fichajes')
      .select('*')
      .eq('id_usuario', user.id)
      .order('hora_entrada', { ascending: false });

    if (data && data.length > 0) {
      let msAcumulados = 0;
      let turnoAbierto = null;

      // Recorremos todos los turnos para sumarlos
      data.forEach(fichaje => {
        if (fichaje.hora_salida) {
          // Si el turno está cerrado, sumamos la diferencia al total histórico
          msAcumulados += new Date(fichaje.hora_salida).getTime() - new Date(fichaje.hora_entrada).getTime();
        } else {
          // Si no tiene salida, es el turno que está corriendo ahora mismo
          turnoAbierto = fichaje;
        }
      });

      setHistorialMilisegundos(msAcumulados);

      // Si hay un turno corriendo, lo mostramos en pantalla
      if (turnoAbierto) {
        setHoraEntrada(new Date(turnoAbierto.hora_entrada));
        setRegistroId(turnoAbierto.id_fichaje);
        setHoraSalida(null);
      } else {
        // Si no hay turno corriendo, dejamos en pantalla el último turno que completaste
        const ultimoTurno = data[0];
        setHoraEntrada(new Date(ultimoTurno.hora_entrada));
        setHoraSalida(new Date(ultimoTurno.hora_salida));
        setRegistroId(ultimoTurno.id_fichaje);
      }
    } else {
      // Si no hay historial de nada
      setHoraEntrada(null);
      setHoraSalida(null);
    }
    
    setLoading(false);
  };

  const formatTimeBig = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatTimeSmall = (date: Date | null) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatearMilisegundos = (ms: number) => {
    const diffHrs = Math.floor(ms / (1000 * 60 * 60));
    const diffMins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const diffSecs = Math.floor((ms % (1000 * 60)) / 1000);
    return `${diffHrs}h ${diffMins}m ${diffSecs}s`;
  };

  const handleRegistrarEntrada = async () => {
    const userDataString = localStorage.getItem('rosterapp_user');
    if (!userDataString) return;
    const user = JSON.parse(userDataString);
    const ahora = new Date();
    setLoading(true);

    const { data, error } = await supabase
      .from('fichajes')
      .insert([{ id_usuario: user.id, hora_entrada: ahora.toISOString() }])
      .select()
      .single();

    if (!error && data) {
      setHoraEntrada(ahora);
      setRegistroId(data.id_fichaje);
      setHoraSalida(null);
    } else {
      alert("Error al registrar entrada: " + error?.message);
    }
    setLoading(false);
  };

  const handleRegistrarSalida = async () => {
    if (!registroId) return;
    const ahora = new Date();
    setLoading(true);

    const { error } = await supabase
      .from('fichajes')
      .update({ hora_salida: ahora.toISOString() })
      .eq('id_fichaje', registroId);

    if (!error) {
      // Al salir, volvemos a descargar todo de Supabase para que las matemáticas
      // del total histórico sean 100% exactas y no haya fallos visuales.
      await cargarDatosFichajes();
    } else {
      alert("Error al registrar salida: " + error.message);
    }
    setLoading(false);
  };

  // --- MATEMÁTICAS DE LOS CONTADORES ---
  let turnoActualMs = 0;
  if (horaEntrada) {
    const timeEnd = horaSalida ? horaSalida.getTime() : currentTime.getTime();
    turnoActualMs = Math.max(0, timeEnd - horaEntrada.getTime());
  }

  // 1. Horas de la tarjeta azul (El turno que estás viendo)
  const horasComputadasTurno = formatearMilisegundos(turnoActualMs);
  
  // 2. Horas de la tarjeta morada (El total histórico de tu vida en la empresa)
  // Si estás trabajando (horaSalida es null), le sumamos en tiempo real el turno actual al histórico.
  const totalMs = horaSalida ? historialMilisegundos : historialMilisegundos + turnoActualMs;
  const horasTotalesAcumuladas = formatearMilisegundos(totalMs);

  const hayTurnoActivo = horaEntrada !== null && horaSalida === null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-10 transition-colors duration-300">
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
                disabled={hayTurnoActivo || loading}
                className={`py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-sm ${
                  !hayTurnoActivo && !loading
                    ? 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white cursor-pointer hover:shadow-md transform hover:-translate-y-0.5' 
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                REGISTRAR ENTRADA
              </button>
              
              <button 
                onClick={handleRegistrarSalida}
                disabled={!hayTurnoActivo || loading}
                className={`py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-sm ${
                  hayTurnoActivo && !loading
                    ? 'bg-gray-800 hover:bg-gray-900 dark:bg-slate-600 dark:hover:bg-slate-500 text-white cursor-pointer hover:shadow-md transform hover:-translate-y-0.5' 
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                REGISTRAR SALIDA
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 flex-1 flex flex-col transition-colors duration-300">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-100 dark:border-slate-700 pb-4">Resumen del Turno</h3>
            
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

            {/* CONTADOR 1: HORAS DEL TURNO EN PANTALLA */}
            <div className="mt-8 bg-blue-50 dark:bg-slate-700/50 p-5 rounded-xl border border-blue-100 dark:border-slate-600 transition-colors duration-300">
              <p className="text-xs font-bold text-blue-400 dark:text-blue-300 uppercase tracking-widest mb-1">Horas de este turno</p>
              <p className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 font-mono">
                {horasComputadasTurno}
              </p>
            </div>

            {/* CONTADOR 2: TOTAL HISTÓRICO DE TODAS LAS HORAS */}
            <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl border border-purple-100 dark:border-purple-800/50 transition-colors duration-300">
              <p className="text-xs font-bold text-purple-500 dark:text-purple-400 uppercase tracking-widest mb-1">Total Acumulado (Histórico)</p>
              <p className="text-3xl font-extrabold text-purple-700 dark:text-purple-400 font-mono">
                {horasTotalesAcumuladas}
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}