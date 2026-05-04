import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface TurnoData {
  id_turno: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
}

export default function MisTurnos() {
  const [misTurnos, setMisTurnos] = useState<TurnoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMensaje, setErrorMensaje] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  
  // Estado para controlar qué semana estamos viendo (basado en el Lunes de esa semana)
  const [fechaReferencia, setFechaReferencia] = useState(new Date());

  useEffect(() => {
    cargarMisTurnos();
  }, []);

  const cargarMisTurnos = async () => {
    setLoading(true);
    setErrorMensaje('');

    try {
      const userDataString = localStorage.getItem('rosterapp_user');
      if (!userDataString) throw new Error('No se ha encontrado la sesión del usuario.');

      const user = JSON.parse(userDataString);
      setNombreUsuario(user.nombre || user.email.split('@')[0]);

      // Buscamos todas las asignaciones del usuario
      const { data, error } = await supabase
        .from('asignaciones')
        .select(`
          id_asignacion,
          turnos (
            id_turno,
            fecha,
            hora_inicio,
            hora_fin
          )
        `)
        .eq('id_usuario', user.id);

      if (error) throw error;

      if (data) {
        // Limpiamos y guardamos los turnos en el estado
        const turnosExtraidos = data
          .map((item: any) => item.turnos)
          .filter((turno) => turno !== null);
        setMisTurnos(turnosExtraidos);
      }
    } catch (error: any) {
      console.error("Error al cargar mis turnos:", error);
      setErrorMensaje(error.message || 'Hubo un problema al conectar con la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DEL CALENDARIO SEMANAL ---

  // Obtener el Lunes de la semana de la fecha de referencia
  const getLunes = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const lunesActual = getLunes(fechaReferencia);

  // Generar los 7 días de la semana actual
  const diasSemana = Array.from({ length: 7 }).map((_, i) => {
    const dia = new Date(lunesActual);
    dia.setDate(lunesActual.getDate() + i);
    return dia;
  });

  // Funciones para navegar entre semanas
  const irSemanaAnterior = () => {
    const nuevaFecha = new Date(fechaReferencia);
    nuevaFecha.setDate(nuevaFecha.getDate() - 7);
    setFechaReferencia(nuevaFecha);
  };

  const irSemanaSiguiente = () => {
    const nuevaFecha = new Date(fechaReferencia);
    nuevaFecha.setDate(nuevaFecha.getDate() + 7);
    setFechaReferencia(nuevaFecha);
  };

  const irAHoy = () => {
    setFechaReferencia(new Date());
  };

  // Función para formatear el mes y año del encabezado (Ej: Mayo 2026)
  const formatearMesAno = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto transition-colors duration-300">
      
      {/* Cabecera y Saludo */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-400 capitalize">
            Hola, {nombreUsuario}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">
            Consulta tus horarios y días libres
          </p>
        </div>
      </div>

      {errorMensaje && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm font-bold rounded-r-lg">
          {errorMensaje}
        </div>
      )}

      {/* Controles del Calendario */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 capitalize">
          Semana del {lunesActual.getDate()} | <span className="text-blue-600 dark:text-blue-400">{formatearMesAno(lunesActual)}</span>
        </h2>
        
        <div className="flex items-center space-x-2">
          <button onClick={irSemanaAnterior} className="px-3 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 text-sm font-bold rounded-lg transition-colors cursor-pointer">
            &larr; Anterior
          </button>
          <button onClick={irAHoy} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer shadow-sm">
            Hoy
          </button>
          <button onClick={irSemanaSiguiente} className="px-3 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 text-sm font-bold rounded-lg transition-colors cursor-pointer">
            Siguiente &rarr;
          </button>
        </div>
      </div>

      {/* Cuadrícula del Calendario (7 días) */}
      {loading ? (
        <div className="p-12 text-center text-blue-600 font-bold italic animate-pulse bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
          Cargando tu cuadrante...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {diasSemana.map((dia, index) => {
            // Formateamos la fecha para buscarla en los turnos (YYYY-MM-DD)
            // Usamos un pequeño truco con el timezone para no tener desfases
            const offset = dia.getTimezoneOffset()
            const diaFormateado = new Date(dia.getTime() - (offset*60*1000)).toISOString().split('T')[0];
            
            // Buscamos si hay un turno para este día
            const turnoDelDia = misTurnos.find(t => t.fecha === diaFormateado);
            
            // Identificar si el día renderizado es "Hoy"
            const hoy = new Date();
            const esHoy = dia.getDate() === hoy.getDate() && dia.getMonth() === hoy.getMonth() && dia.getFullYear() === hoy.getFullYear();

            // Estilos dinámicos
            let estiloTarjeta = "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700";
            if (esHoy) estiloTarjeta = "bg-blue-50/50 dark:bg-slate-700/50 border-blue-200 dark:border-slate-500 ring-2 ring-blue-500 dark:ring-blue-400";

            return (
              <div key={index} className={`flex flex-col h-full min-h-[160px] rounded-2xl border shadow-sm transition-all duration-300 overflow-hidden ${estiloTarjeta}`}>
                
                {/* Cabecera del Día */}
                <div className="bg-gray-50 dark:bg-slate-800/80 p-3 border-b border-gray-100 dark:border-slate-700 text-center">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                    {dia.toLocaleDateString('es-ES', { weekday: 'short' })}
                  </p>
                  <p className={`text-xl font-extrabold ${esHoy ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-100'}`}>
                    {dia.getDate()}
                  </p>
                </div>

                {/* Contenido del Día (Turno o Libre) */}
                <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                  {turnoDelDia ? (
                    <div className="w-full animate-fade-in">
                      {/* Indicador de color según si es mañana o tarde */}
                      {parseInt(turnoDelDia.hora_inicio.split(':')[0]) < 14 ? (
                        <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider rounded-full mb-2">
                          Mañana
                        </div>
                      ) : (
                        <div className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider rounded-full mb-2">
                          Tarde
                        </div>
                      )}
                      
                      <p className="text-lg font-extrabold text-gray-800 dark:text-white">
                        {turnoDelDia.hora_inicio.substring(0, 5)}
                      </p>
                      <div className="w-1 h-4 bg-gray-200 dark:bg-slate-600 mx-auto my-0.5 rounded-full"></div>
                      <p className="text-lg font-extrabold text-gray-800 dark:text-white">
                        {turnoDelDia.hora_fin.substring(0, 5)}
                      </p>
                    </div>
                  ) : (
                    <div className="text-gray-300 dark:text-slate-600 flex flex-col items-center justify-center h-full">
                      <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4M8 16l-4-4 4-4"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12a8 8 0 018-8 8 8 0 018 8 8 8 0 01-8 8 8 8 0 01-8-8z"></path></svg>
                      <span className="text-sm font-bold uppercase tracking-widest">Libre</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}