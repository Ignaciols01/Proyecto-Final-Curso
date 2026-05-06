import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Fichar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [turnoHoy, setTurnoHoy] = useState<any>(null);
  const [registroId, setRegistroId] = useState<string | null>(null);

  const [horaEntrada, setHoraEntrada] = useState<Date | null>(null);
  const [horaSalida, setHoraSalida] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [historialMilisegundos, setHistorialMilisegundos] = useState<number>(0);

  // Estados de Bloqueo
  const [puedeFicharEntrada, setPuedeFicharEntrada] = useState(false);
  const [puedeFicharSalida, setPuedeFicharSalida] = useState(false);
  const [mensajeBloqueo, setMensajeBloqueo] = useState('Buscando turnos asignados...');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    cargarDatosDeHoyYFichajes();
  }, []);

  useEffect(() => {
    verificarHorario();
  }, [currentTime, turnoHoy, horaEntrada, horaSalida]);

  const cargarDatosDeHoyYFichajes = async () => {
    setLoading(true);
    const userDataString = localStorage.getItem('rosterapp_user');
    if (!userDataString) return;
    const user = JSON.parse(userDataString);

    const offset = new Date().getTimezoneOffset();
    const hoyStr = new Date(new Date().getTime() - (offset*60*1000)).toISOString().split('T')[0];

    // 1. Obtener Turno de Hoy
    const { data: turnosData } = await supabase
      .from('asignaciones')
      .select(`turnos (id_turno, fecha, hora_inicio, hora_fin)`)
      .eq('id_usuario', user.id);

    if (turnosData) {
      const turnoDeHoy = turnosData.map((item: any) => item.turnos).find((t: any) => t && t.fecha === hoyStr);
      setTurnoHoy(turnoDeHoy || null);
    }

    // 2. Obtener Historial de Fichajes
    const { data: fichajesData } = await supabase
      .from('fichajes')
      .select('*')
      .eq('id_usuario', user.id)
      .order('hora_entrada', { ascending: false });

    if (fichajesData && fichajesData.length > 0) {
      let msAcumulados = 0;
      let turnoAbierto = null;

      fichajesData.forEach(fichaje => {
        if (fichaje.hora_salida) {
          msAcumulados += new Date(fichaje.hora_salida).getTime() - new Date(fichaje.hora_entrada).getTime();
        } else {
          turnoAbierto = fichaje; // Encontramos un turno sin salida
        }
      });

      setHistorialMilisegundos(msAcumulados);

      if (turnoAbierto) {
        setHoraEntrada(new Date(turnoAbierto.hora_entrada));
        setRegistroId(turnoAbierto.id_fichaje);
        setHoraSalida(null);
      } else {
        const ultimoTurno = fichajesData[0];
        const fechaUltimoTurno = new Date(ultimoTurno.hora_entrada).toISOString().split('T')[0];
        
        // Si el último turno cerrado es de hoy, lo mostramos en pantalla
        if (fechaUltimoTurno === hoyStr) {
            setHoraEntrada(new Date(ultimoTurno.hora_entrada));
            setHoraSalida(new Date(ultimoTurno.hora_salida));
            setRegistroId(ultimoTurno.id_fichaje);
        }
      }
    }
    setLoading(false);
  };

  const verificarHorario = () => {
    // REGLA 1 (PRIORIDAD MÁXIMA): Si hay una entrada SIN salida (no importa de qué día sea)
    if (horaEntrada && !horaSalida) {
      setPuedeFicharEntrada(false); // No puede volver a entrar
      setPuedeFicharSalida(true);   // DEBE registrar la salida
      setMensajeBloqueo('');        // Quitamos cualquier mensaje
      return;
    }

    // REGLA 2: Si ya hizo el ciclo completo de hoy (Entrada y Salida)
    if (horaEntrada && horaSalida) {
      setPuedeFicharEntrada(false);
      setPuedeFicharSalida(false);
      setMensajeBloqueo('Ya has completado tu jornada de hoy.');
      return;
    }

    // REGLA 3: Si no hay turno hoy
    if (!turnoHoy) {
      setPuedeFicharEntrada(false);
      setPuedeFicharSalida(false);
      setMensajeBloqueo('Hoy tienes el día libre. ¡Descansa!');
      return;
    }

    // REGLA 4: Evaluamos el horario del turno asignado hoy
    const now = currentTime;
    const [hI, mI] = turnoHoy.hora_inicio.split(':').map(Number);
    const [hF, mF] = turnoHoy.hora_fin.split(':').map(Number);

    const inicioTurno = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hI, mI, 0);
    const finTurno = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hF, mF, 0);

    const inicioPermitido = new Date(inicioTurno.getTime() - 15 * 60000); // 15 mins antes
    const finPermitido = new Date(finTurno.getTime() + 30 * 60000); // 30 mins después

    if (now < inicioPermitido) {
      setPuedeFicharEntrada(false);
      setPuedeFicharSalida(false);
      setMensajeBloqueo(`Tu turno empieza a las ${turnoHoy.hora_inicio.slice(0,5)}. Podrás fichar 15 minutos antes.`);
    } else if (now > finPermitido) {
      setPuedeFicharEntrada(false);
      setPuedeFicharSalida(false);
      setMensajeBloqueo('El horario para fichar en este turno ya ha cerrado.');
    } else {
      setPuedeFicharEntrada(true);
      setPuedeFicharSalida(false); // Solo se activa cuando ya hay entrada
      setMensajeBloqueo('');
    }
  };

  const handleRegistrarEntrada = async () => {
    if (!puedeFicharEntrada) return;
    const user = JSON.parse(localStorage.getItem('rosterapp_user') || '{}');
    const ahora = new Date();
    setLoading(true);

    const { data, error } = await supabase.from('fichajes').insert([{ id_usuario: user.id, hora_entrada: ahora.toISOString() }]).select().single();

    if (!error && data) {
      setHoraEntrada(ahora);
      setRegistroId(data.id_fichaje);
      setHoraSalida(null);
    }
    setLoading(false);
  };

  const handleRegistrarSalida = async () => {
    if (!puedeFicharSalida || !registroId) return;
    const ahora = new Date();
    setLoading(true);

    const { error } = await supabase.from('fichajes').update({ hora_salida: ahora.toISOString() }).eq('id_fichaje', registroId);

    if (!error) await cargarDatosDeHoyYFichajes();
    setLoading(false);
  };

  const formatTimeBig = (date: Date) => date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatTimeSmall = (date: Date | null) => date ? date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '--:--';

  const formatearMilisegundos = (ms: number) => {
    const diffHrs = Math.floor(ms / (1000 * 60 * 60));
    const diffMins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const diffSecs = Math.floor((ms % (1000 * 60)) / 1000);
    return `${diffHrs}h ${diffMins}m ${diffSecs}s`;
  };

  let turnoActualMs = 0;
  if (horaEntrada) {
    const timeEnd = horaSalida ? horaSalida.getTime() : currentTime.getTime();
    turnoActualMs = Math.max(0, timeEnd - horaEntrada.getTime());
  }

  const horasComputadasTurno = formatearMilisegundos(turnoActualMs);
  const totalMs = horaSalida ? historialMilisegundos : historialMilisegundos + turnoActualMs;
  const horasTotalesAcumuladas = formatearMilisegundos(totalMs);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto transition-colors duration-300">
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-blue-500 mb-2">Control Horario</h1>
        <p className="text-gray-400 font-medium">Registra tu jornada laboral con precisión</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* RELOJ Y BOTONES */}
        <div className="bg-[#1e293b] rounded-3xl p-8 flex flex-col items-center justify-center border border-slate-700 shadow-xl">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Hora Actual</p>
          <div className="text-5xl md:text-6xl font-black text-blue-400 mb-10 tracking-wider font-mono">
            {formatTimeBig(currentTime)}
          </div>

          <div className="w-full max-w-sm space-y-4">
            <button 
              onClick={handleRegistrarEntrada}
              disabled={!puedeFicharEntrada || horaEntrada !== null || loading}
              className="w-full bg-[#10b981] hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wide text-sm"
            >
              {horaEntrada ? 'Entrada Registrada' : 'Registrar Entrada'}
            </button>
            
            <button 
              onClick={handleRegistrarSalida}
              disabled={!puedeFicharSalida || loading}
              className="w-full bg-[#334155] hover:bg-slate-600 text-gray-300 font-bold py-4 rounded-xl shadow-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wide text-sm"
            >
              {horaSalida ? 'Salida Registrada' : 'Registrar Salida'}
            </button>
          </div>

          {/* El mensaje de bloqueo solo se muestra si NO hay una salida pendiente y aplica alguna restricción */}
          {(!puedeFicharEntrada && !puedeFicharSalida) && mensajeBloqueo && (
            <p className="mt-6 text-sm font-bold text-orange-400 bg-orange-400/10 px-4 py-2 rounded-lg text-center animate-fade-in">
              {mensajeBloqueo}
            </p>
          )}
        </div>

        {/* RESUMEN */}
        <div className="bg-[#1e293b] rounded-3xl p-8 border border-slate-700 shadow-xl flex flex-col">
          <h2 className="text-lg font-bold text-white mb-6">Resumen del Turno</h2>
          
          <div className="space-y-4 mb-8">
            <div className="bg-[#0f172a]/50 rounded-xl p-4 flex items-center justify-between border border-emerald-900/30">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="font-bold text-gray-200">Entrada</span>
              </div>
              <span className="font-mono font-bold text-emerald-400 text-lg">{formatTimeSmall(horaEntrada)}</span>
            </div>

            <div className="bg-[#0f172a]/50 rounded-xl p-4 flex items-center justify-between border border-red-900/30">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="font-bold text-gray-200">Salida</span>
              </div>
              <span className="font-mono font-bold text-red-400 text-lg">{formatTimeSmall(horaSalida)}</span>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <div className="bg-[#334155]/30 rounded-xl p-5 border border-slate-700/50">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Horas de este turno</p>
              <p className="text-2xl font-black text-blue-400/80 font-mono tracking-wide">{horasComputadasTurno}</p>
            </div>

            <div className="bg-purple-900/10 rounded-xl p-5 border border-purple-900/30">
              <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">Total Acumulado (Histórico)</p>
              <p className="text-2xl font-black text-purple-400/80 font-mono tracking-wide">{horasTotalesAcumuladas}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}