import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Turno {
  id_turno: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  usuarios: { nombre: string }[];
}

interface Solicitud {
  id_solicitud: string;
  fecha_solicitada: string;
  estado: string;
  motivo_rechazo?: string | null;
  usuarios: { id_usuario: string, nombre: string };
}

export default function AdminDashboard() {
  const [totalEmpleados, setTotalEmpleados] = useState(0);
  const [turnosSemana, setTurnosSemana] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [empleados, setEmpleados] = useState<{id_usuario: string, nombre: string}[]>([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState('');
  const [tipoRepeticion, setTipoRepeticion] = useState('unico');
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [horaFin, setHoraFin] = useState('15:00');

  const [showModalBorrar, setShowModalBorrar] = useState(false);
  const [borrarEmpleado, setBorrarEmpleado] = useState('');
  const [borrarFechaInicio, setBorrarFechaInicio] = useState('');
  const [borrarFechaFin, setBorrarFechaFin] = useState('');

  const [fechaReferencia, setFechaReferencia] = useState(new Date());
  const [vistaCalendario, setVistaCalendario] = useState<'semana' | 'mes'>('semana');
  const [turnosCalendario, setTurnosCalendario] = useState<Turno[]>([]);
  const [solicitudesCalendario, setSolicitudesCalendario] = useState<Solicitud[]>([]);
  const [diaModalSeleccionado, setDiaModalSeleccionado] = useState<Date | null>(null);

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [showModalSolicitudes, setShowModalSolicitudes] = useState(false);
  
  const [solicitudARechazar, setSolicitudARechazar] = useState<string | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');

  const [elementoAEliminar, setElementoAEliminar] = useState<{ tipo: 'unico', idTurno: string } | { tipo: 'dia', fecha: Date } | null>(null);
  const [alerta, setAlerta] = useState<{titulo: string, texto: string, tipo: 'exito' | 'error'} | null>(null);

  const horasArray = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutosArray = ['00', '15', '30', '45'];

  useEffect(() => {
    fetchStats();
    fetchEmpleados();
    fetchSolicitudes();
  }, []);

  useEffect(() => {
    fetchTurnosCalendario();
  }, [fechaReferencia, vistaCalendario]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { count: countEmp } = await supabase.from('usuarios').select('*', { count: 'exact', head: true }).eq('rol', 'empleado');
      setTotalEmpleados(countEmp || 0);

      const hoy = new Date();
      const lunes = new Date(hoy.setDate(hoy.getDate() - hoy.getDay() + 1)).toISOString().split('T')[0];
      const domingo = new Date(hoy.setDate(hoy.getDate() - hoy.getDay() + 7)).toISOString().split('T')[0];

      const { count: countTurnos } = await supabase.from('turnos').select('*', { count: 'exact', head: true }).gte('fecha', lunes).lte('fecha', domingo);
      setTurnosSemana(countTurnos || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmpleados = async () => {
    const { data } = await supabase.from('usuarios').select('id_usuario, nombre').eq('rol', 'empleado');
    if (data) setEmpleados(data);
  };

  const fetchSolicitudes = async () => {
    const { data } = await supabase
      .from('solicitudes_libres')
      .select('id_solicitud, fecha_solicitada, estado, usuarios(id_usuario, nombre)')
      .eq('estado', 'pendiente');
    
    if (data) setSolicitudes(data as any);
  };

  const gestionarSolicitud = async (id_sol: string, id_user: string, fecha_sol: string, accion: 'aprobada' | 'rechazada') => {
    try {
      const updateData: any = { estado: accion };
      if (accion === 'rechazada') updateData.motivo_rechazo = motivoRechazo;

      await supabase.from('solicitudes_libres').update(updateData).eq('id_solicitud', id_sol);
      
      if (accion === 'aprobada') {
        const { data: userData } = await supabase.from('usuarios').select('dias_libres_disponibles').eq('id_usuario', id_user).single();
        if (userData && userData.dias_libres_disponibles > 0) {
          await supabase.from('usuarios').update({ dias_libres_disponibles: userData.dias_libres_disponibles - 1 }).eq('id_usuario', id_user);
        }
      }

      const fechaFormateada = new Date(fecha_sol).toLocaleDateString('es-ES');
      const tituloNotif = accion === 'aprobada' ? 'Día libre aprobado' : 'Día libre rechazado';
      const mensajeNotif = accion === 'aprobada' 
        ? `¡Enhorabuena! Tu solicitud para el día ${fechaFormateada} ha sido aprobada.`
        : `Tu solicitud para el día ${fechaFormateada} no ha podido ser aprobada. Motivo: ${motivoRechazo}`;

      await supabase.from('notificaciones').insert([{
        id_usuario: id_user,
        titulo: tituloNotif,
        mensaje: mensajeNotif,
        leida: false
      }]);
      
      setSolicitudARechazar(null);
      setMotivoRechazo('');
      
      await fetchSolicitudes(); 
      await fetchTurnosCalendario();
    } catch (error) {
      setAlerta({ titulo: 'Error', texto: 'No se pudo gestionar la solicitud ni enviar la notificación.', tipo: 'error' });
    }
  };

  const fetchTurnosCalendario = async () => {
    let fechaInicioStr = '';
    let fechaFinStr = '';

    if (vistaCalendario === 'semana') {
      const lunes = getLunes(fechaReferencia);
      const domingo = new Date(lunes);
      domingo.setDate(lunes.getDate() + 6);
      fechaInicioStr = lunes.toISOString().split('T')[0];
      fechaFinStr = domingo.toISOString().split('T')[0];
    } else {
      const primerDiaMes = new Date(fechaReferencia.getFullYear(), fechaReferencia.getMonth(), 1);
      const ultimoDiaMes = new Date(fechaReferencia.getFullYear(), fechaReferencia.getMonth() + 1, 0);
      fechaInicioStr = new Date(primerDiaMes.getTime() - (primerDiaMes.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      fechaFinStr = new Date(ultimoDiaMes.getTime() - (ultimoDiaMes.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    }

    try {
      const { data: dataTurnos } = await supabase
        .from('turnos')
        .select(`id_turno, fecha, hora_inicio, hora_fin, asignaciones (usuarios (nombre))`)
        .gte('fecha', fechaInicioStr)
        .lte('fecha', fechaFinStr);

      if (dataTurnos) {
        const formated = dataTurnos.map((t: any) => ({
          ...t,
          usuarios: t.asignaciones ? t.asignaciones.map((a: any) => a.usuarios).filter(Boolean) : []
        }));
        setTurnosCalendario(formated);
      }

      const { data: dataSols } = await supabase
        .from('solicitudes_libres')
        .select('id_solicitud, fecha_solicitada, estado, usuarios(id_usuario, nombre)')
        .gte('fecha_solicitada', fechaInicioStr)
        .lte('fecha_solicitada', fechaFinStr)
        .in('estado', ['pendiente', 'aprobada']);

      if (dataSols) {
        setSolicitudesCalendario(dataSols as any);
      }

    } catch (err) {
      console.error(err);
    }
  };

  const toggleDia = (dia: string) => {
    setDiasSeleccionados(prev => prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]);
  };

  const handleGuardarTurno = async () => {
    if (!selectedEmpleado || diasSeleccionados.length === 0) {
      setAlerta({ titulo: 'Aviso', texto: 'Por favor, selecciona un empleado y al menos un día.', tipo: 'error' });
      return;
    }

    setLoading(true);
    try {
      const lunesDeEstaSemana = getLunes(fechaReferencia);
      const mapaDias: { [key: string]: number } = { 'Lun': 0, 'Mar': 1, 'Mié': 2, 'Jue': 3, 'Vie': 4, 'Sáb': 5, 'Dom': 6 };

      let semanasAGenerar = 1;
      if (tipoRepeticion === 'semanal') semanasAGenerar = 12;
      if (tipoRepeticion === 'rotativo') semanasAGenerar = 12;

      let findesSumados = 0;

      for (let i = 0; i < semanasAGenerar; i++) {
        if (tipoRepeticion === 'rotativo' && i % 2 !== 0) continue;

        for (const diaNombre of diasSeleccionados) {
          const fechaTurno = new Date(lunesDeEstaSemana);
          fechaTurno.setDate(lunesDeEstaSemana.getDate() + mapaDias[diaNombre] + (i * 7));
          const fechaString = fechaTurno.toISOString().split('T')[0];

          if (diaNombre === 'Sáb' || diaNombre === 'Dom') findesSumados++;

          const { data: nuevoTurno, error: errorTurno } = await supabase
            .from('turnos')
            .insert([{ fecha: fechaString, hora_inicio: horaInicio, hora_fin: horaFin, tipo: tipoRepeticion }])
            .select().single();

          if (errorTurno) throw errorTurno;

          const { error: errorAsig } = await supabase
            .from('asignaciones')
            .insert([{ id_usuario: selectedEmpleado, id_turno: nuevoTurno.id_turno }]);

          if (errorAsig) throw errorAsig;
        }
      }

      if (findesSumados > 0) {
        const { data: uData } = await supabase.from('usuarios').select('findes_trabajados').eq('id_usuario', selectedEmpleado).single();
        if (uData) {
          const totalFindes = uData.findes_trabajados + findesSumados;
          const diasLibresNuevos = Math.floor(totalFindes / 3);
          
          await supabase.from('usuarios').update({ findes_trabajados: totalFindes }).eq('id_usuario', selectedEmpleado);
          
          if (diasLibresNuevos > 0) {
            const { data: dData } = await supabase.from('usuarios').select('dias_libres_disponibles').eq('id_usuario', selectedEmpleado).single();
            await supabase.from('usuarios').update({ dias_libres_disponibles: (dData?.dias_libres_disponibles || 0) + diasLibresNuevos }).eq('id_usuario', selectedEmpleado);
          }
        }
      }

      setAlerta({ titulo: '¡Éxito!', texto: 'Los turnos se han programado correctamente.', tipo: 'exito' });
      setShowModal(false);
      setDiasSeleccionados([]);
      fetchStats(); 
      fetchTurnosCalendario();
      
    } catch (err: any) {
      setAlerta({ titulo: 'Error al guardar', texto: err.message || 'Fallo de conexión.', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleBorrarMasivo = async () => {
    if (!borrarEmpleado || !borrarFechaInicio || !borrarFechaFin) {
      setAlerta({ titulo: 'Aviso', texto: 'Por favor, rellena todos los campos para continuar.', tipo: 'error' });
      return;
    }

    if (borrarFechaInicio > borrarFechaFin) {
      setAlerta({ titulo: 'Error en fechas', texto: 'La fecha de inicio no puede ser posterior a la fecha de fin.', tipo: 'error' });
      return;
    }

    setLoading(true);
    try {
      const { data: turnosEnRango, error: errTurnos } = await supabase
        .from('turnos')
        .select('id_turno')
        .gte('fecha', borrarFechaInicio)
        .lte('fecha', borrarFechaFin);

      if (errTurnos) throw errTurnos;
      const idsTurnosEnRango = turnosEnRango.map(t => t.id_turno);

      if (idsTurnosEnRango.length === 0) {
        setAlerta({ titulo: 'Sin resultados', texto: 'No hay turnos registrados en ese rango de fechas.', tipo: 'error' });
        setLoading(false);
        return;
      }

      const { data: asignaciones, error: errAsig } = await supabase
        .from('asignaciones')
        .select('id_turno')
        .eq('id_usuario', borrarEmpleado)
        .in('id_turno', idsTurnosEnRango);

      if (errAsig) throw errAsig;
      const idsTurnosABorrar = asignaciones.map(a => a.id_turno);

      if (idsTurnosABorrar.length > 0) {
        await supabase.from('asignaciones').delete().in('id_turno', idsTurnosABorrar);
        await supabase.from('turnos').delete().in('id_turno', idsTurnosABorrar);
        
        setAlerta({ titulo: '¡Limpieza completada!', texto: `Se han eliminado ${idsTurnosABorrar.length} turnos del empleado seleccionado.`, tipo: 'exito' });
        setShowModalBorrar(false);
        setBorrarEmpleado('');
        setBorrarFechaInicio('');
        setBorrarFechaFin('');
        fetchTurnosCalendario();
        fetchStats();
      } else {
        setAlerta({ titulo: 'Sin resultados', texto: 'El empleado no tiene turnos asignados en esas fechas.', tipo: 'error' });
      }

    } catch (error) {
      setAlerta({ titulo: 'Error', texto: 'Hubo un problema al intentar borrar los turnos.', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const confirmarEliminacion = async () => {
    if (!elementoAEliminar) return;
    setLoading(true);

    try {
      if (elementoAEliminar.tipo === 'unico') {
        await supabase.from('asignaciones').delete().eq('id_turno', elementoAEliminar.idTurno);
        await supabase.from('turnos').delete().eq('id_turno', elementoAEliminar.idTurno);
        setAlerta({ titulo: 'Eliminado', texto: 'El turno individual se ha borrado con éxito.', tipo: 'exito' });
      } 
      else if (elementoAEliminar.tipo === 'dia') {
        const turnosDelDia = getTurnosParaElDia(elementoAEliminar.fecha);
        const ids = turnosDelDia.map(t => t.id_turno);
        
        if (ids.length > 0) {
          await supabase.from('asignaciones').delete().in('id_turno', ids);
          await supabase.from('turnos').delete().in('id_turno', ids);
          setAlerta({ titulo: 'Día vaciado', texto: 'Todos los turnos de este día han sido eliminados.', tipo: 'exito' });
        }
        setDiaModalSeleccionado(null);
      }

      fetchTurnosCalendario();
      fetchStats();
      
    } catch (error) {
      setAlerta({ titulo: 'Error', texto: 'Hubo un error al intentar borrar en la base de datos.', tipo: 'error' });
    } finally {
      setElementoAEliminar(null);
      setLoading(false);
    }
  };

  const getLunes = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const lunesActual = getLunes(fechaReferencia);
  const diasSemana = Array.from({ length: 7 }).map((_, i) => {
    const dia = new Date(lunesActual);
    dia.setDate(lunesActual.getDate() + i);
    return dia;
  });

  const generarDiasMes = () => {
    const primerDia = new Date(fechaReferencia.getFullYear(), fechaReferencia.getMonth(), 1);
    const ultimoDia = new Date(fechaReferencia.getFullYear(), fechaReferencia.getMonth() + 1, 0);
    let diaInicioSemana = primerDia.getDay() - 1;
    if (diaInicioSemana === -1) diaInicioSemana = 6; 
    const dias = [];
    for (let i = 0; i < diaInicioSemana; i++) dias.push(null);
    for (let i = 1; i <= ultimoDia.getDate(); i++) dias.push(new Date(fechaReferencia.getFullYear(), fechaReferencia.getMonth(), i));
    return dias;
  };
  const diasMes = generarDiasMes();

  const irAnterior = () => {
    const nuevaFecha = new Date(fechaReferencia);
    vistaCalendario === 'semana' ? nuevaFecha.setDate(nuevaFecha.getDate() - 7) : nuevaFecha.setMonth(nuevaFecha.getMonth() - 1);
    setFechaReferencia(nuevaFecha);
  };

  const irSiguiente = () => {
    const nuevaFecha = new Date(fechaReferencia);
    vistaCalendario === 'semana' ? nuevaFecha.setDate(nuevaFecha.getDate() + 7) : nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
    setFechaReferencia(nuevaFecha);
  };

  const formatearFecha = (fecha: Date) => {
    const mes = fecha.toLocaleDateString('es-ES', { month: 'short' });
    const año = fecha.getFullYear();
    return `${mes.charAt(0).toUpperCase() + mes.slice(1)} De ${año}`;
  };

  const nombresDiasCortos = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getTurnosParaElDia = (fecha: Date) => {
    const offset = fecha.getTimezoneOffset();
    const fechaFormat = new Date(fecha.getTime() - (offset*60*1000)).toISOString().split('T')[0];
    return turnosCalendario.filter(t => t.fecha === fechaFormat);
  };

  const getSolicitudesParaElDia = (fecha: Date) => {
    const offset = fecha.getTimezoneOffset();
    const fechaFormat = new Date(fecha.getTime() - (offset*60*1000)).toISOString().split('T')[0];
    return solicitudesCalendario.filter(s => s.fecha_solicitada === fechaFormat);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-[#0f172a] min-h-screen transition-colors duration-300">
      
      {/* CABECERA Y BOTONES DEL DASHBOARD */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-500 transition-colors duration-300">Panel de Control</h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-slate-400 font-medium transition-colors duration-300">Gestión inteligente de tus turnos y equipo</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
          
          <button 
            onClick={() => setShowModalSolicitudes(true)}
            className={`flex-1 sm:flex-none justify-center font-bold py-3 px-5 rounded-lg shadow-sm transition-all duration-300 cursor-pointer flex items-center gap-2 border ${solicitudes.length > 0 ? 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-500 animate-pulse' : 'bg-white dark:bg-[#1e293b] border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300'}`}
          >
            <span>🛎️</span> Solicitudes ({solicitudes.length})
          </button>
          
          <button onClick={() => setShowModalBorrar(true)} className="flex-1 sm:flex-none justify-center bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 border border-transparent dark:border-red-500/30 font-bold py-3 px-4 rounded-lg shadow-sm transition-all duration-300 cursor-pointer">
            - BORRAR TURNOS
          </button>

          <button onClick={() => setShowModal(true)} className="flex-1 sm:flex-none justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-300 cursor-pointer">
            + CREAR TURNO
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center space-x-4 transition-colors duration-300">
          <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl text-blue-600 dark:text-blue-400 transition-colors duration-300"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest truncate transition-colors duration-300">Plantilla Total</p>
            <p className="text-xl font-bold text-gray-700 dark:text-white truncate transition-colors duration-300">{loading ? '...' : `${totalEmpleados} empleados`}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center space-x-4 transition-colors duration-300">
          <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-xl text-emerald-600 dark:text-emerald-400 transition-colors duration-300"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest truncate transition-colors duration-300">Turnos Asignados</p>
            <p className="text-xl font-bold text-gray-700 dark:text-white truncate transition-colors duration-300">{loading ? '...' : `${turnosSemana} esta semana`}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center space-x-4 sm:col-span-2 lg:col-span-1 transition-colors duration-300">
          <div className="bg-orange-50 dark:bg-orange-500/10 p-4 rounded-xl text-orange-600 dark:text-orange-400 transition-colors duration-300"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest truncate transition-colors duration-300">Incidencias</p>
            <p className="text-xl font-bold text-gray-700 dark:text-white truncate transition-colors duration-300">0 pendientes</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h2 className="text-lg md:text-xl font-bold text-gray-700 dark:text-white capitalize truncate w-full md:w-auto transition-colors duration-300">
          {vistaCalendario === 'semana' ? 'Semana Actual | ' : 'Mes Actual | '}
          <span className="text-blue-600 dark:text-blue-400">{formatearFecha(fechaReferencia)}</span>
        </h2>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex bg-gray-100 dark:bg-[#1e293b] p-1 rounded-lg transition-colors duration-300">
            <button onClick={() => setVistaCalendario('semana')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors duration-300 cursor-pointer ${vistaCalendario === 'semana' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-white'}`}>Semana</button>
            <button onClick={() => setVistaCalendario('mes')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors duration-300 cursor-pointer ${vistaCalendario === 'mes' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-white'}`}>Mes</button>
          </div>
          <div className="flex items-center space-x-1">
            <button onClick={irAnterior} className="p-2 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-800 rounded-lg text-xs font-bold text-gray-600 dark:text-slate-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-300">- Anterior</button>
            <button onClick={() => setFechaReferencia(new Date())} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold px-4 cursor-pointer transition-colors duration-300">Hoy</button>
            <button onClick={irSiguiente} className="p-2 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-800 rounded-lg text-xs font-bold text-gray-600 dark:text-slate-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-300">Siguiente -</button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 hide-scrollbar">
        {vistaCalendario === 'semana' ? (
          <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-sm min-w-[800px] transition-colors duration-300">
            {diasSemana.map((dia, i) => {
              const hoy = new Date();
              const esHoy = dia.getDate() === hoy.getDate() && dia.getMonth() === hoy.getMonth() && dia.getFullYear() === hoy.getFullYear();
              const turnosDelDia = getTurnosParaElDia(dia);
              const solsDelDia = getSolicitudesParaElDia(dia);

              return (
                <div key={i} onClick={() => setDiaModalSeleccionado(dia)} className={`min-h-[300px] flex flex-col transition-colors duration-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1e293b]/80 ${esHoy ? 'bg-blue-50/10 dark:bg-[#1e293b] ring-2 ring-inset ring-blue-500 z-10' : 'bg-white dark:bg-[#1e293b]'}`}>
                  <div className={`p-3 text-center border-b border-gray-100 dark:border-slate-800 font-bold text-sm transition-colors duration-300 ${esHoy ? 'text-blue-600 bg-blue-100/50 dark:bg-blue-900/30' : i >= 5 ? 'text-red-500 bg-red-50/10 dark:bg-red-900/10' : 'text-blue-600 dark:text-blue-400 bg-gray-50/50 dark:bg-slate-900/50'}`}>
                    {nombresDiasCortos[dia.getDay()]} {dia.getDate()}
                  </div>
                  <div className="flex-1 flex flex-col p-2 space-y-2 overflow-y-auto pointer-events-none">
                    
                    {solsDelDia.map(sol => (
                      <div key={sol.id_solicitud} className={`p-2 rounded-lg shadow-sm border transition-colors duration-300 ${sol.estado === 'pendiente' ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-500/10 dark:border-orange-500/30 dark:text-orange-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400'}`}>
                        <span className="text-[9px] font-extrabold uppercase tracking-widest block">{sol.estado === 'pendiente' ? 'Solicitado' : 'Libre'}</span>
                        <span className="text-xs font-bold block">{sol.usuarios.nombre}</span>
                      </div>
                    ))}

                    {turnosDelDia.length > 0 ? (
                      turnosDelDia.map(turno => (
                        <div key={turno.id_turno} className="bg-transparent border border-blue-500/30 dark:border-slate-700 p-2 rounded-lg shadow-sm transition-colors duration-300">
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block mb-1">{turno.hora_inicio.substring(0,5)} - {turno.hora_fin.substring(0,5)}</span>
                          {turno.usuarios.map((u, idx) => <p key={idx} className="text-xs font-bold text-gray-800 dark:text-white">{u.nombre}</p>)}
                        </div>
                      ))
                    ) : (
                      solsDelDia.length === 0 && <div className="h-full flex items-center justify-center"><span className="font-bold uppercase tracking-widest text-[10px] italic text-gray-300 dark:text-slate-600 transition-colors duration-300">Libre</span></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1e293b] rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-sm min-w-[800px] transition-colors duration-300">
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 transition-colors duration-300">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d, i) => (
                <div key={i} className={`p-3 text-center text-xs font-bold uppercase transition-colors duration-300 ${i >= 5 ? 'text-red-500' : 'text-gray-500 dark:text-slate-400'}`}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-slate-800/50 transition-colors duration-300">
              {diasMes.map((dia, i) => {
                if (!dia) return <div key={i} className="bg-gray-50 dark:bg-slate-900/30 min-h-[120px] transition-colors duration-300"></div>;
                const hoy = new Date();
                const esHoy = dia.getDate() === hoy.getDate() && dia.getMonth() === hoy.getMonth() && dia.getFullYear() === hoy.getFullYear();
                const turnosDelDia = getTurnosParaElDia(dia);
                const solsDelDia = getSolicitudesParaElDia(dia);

                return (
                  <div key={i} onClick={() => setDiaModalSeleccionado(dia)} className={`min-h-[120px] bg-white dark:bg-[#1e293b] p-1 flex flex-col cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-300 ${esHoy ? 'ring-2 ring-inset ring-blue-500 relative z-10' : ''}`}>
                    <span className={`text-xs font-bold p-1 w-6 h-6 flex items-center justify-center rounded-full mb-1 transition-colors duration-300 ${esHoy ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-slate-300'}`}>{dia.getDate()}</span>
                    <div className="flex-1 overflow-y-auto space-y-1 pointer-events-none p-0.5">
                      
                      {solsDelDia.map(sol => (
                        <div key={sol.id_solicitud} className={`px-1 py-0.5 rounded text-[9px] border truncate flex flex-col transition-colors duration-300 ${sol.estado === 'pendiente' ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-500/10 dark:border-orange-500/30 dark:text-orange-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400'}`}>
                          <span className="font-extrabold">{sol.usuarios.nombre.split(' ')[0]} (Libre)</span>
                        </div>
                      ))}

                      {turnosDelDia.map(turno => (
                        <div key={turno.id_turno} className="bg-blue-50/50 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px] border border-blue-200 dark:border-slate-700 truncate flex flex-col transition-colors duration-300">
                          <span className="font-bold text-blue-700 dark:text-blue-400">{turno.hora_inicio.substring(0,5)} - {turno.hora_fin.substring(0,5)}</span>
                          {turno.usuarios.map((u, idx) => <span key={idx} className="text-gray-700 dark:text-slate-300 truncate">{u.nombre.split(' ')[0]}</span>)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ================================================================================= */}
      {/* MODAL SOLICITUDES DE DÍAS LIBRES (CORREGIDO PARA MODO CLARO/OSCURO) */}
      {/* ================================================================================= */}
      {showModalSolicitudes && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-fade-in" onClick={() => setShowModalSolicitudes(false)}>
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-colors duration-300" onClick={e => e.stopPropagation()}>
            <div className="bg-orange-500 p-5 text-white flex justify-between items-center shadow-sm">
              <div>
                <h2 className="font-extrabold text-xl">Solicitudes de Días Libres</h2>
                <p className="text-orange-100 text-sm font-medium mt-0.5">{solicitudes.length} pendientes de revisión</p>
              </div>
              <button onClick={() => setShowModalSolicitudes(false)} className="text-white/80 hover:text-white cursor-pointer hover:bg-black/10 w-9 h-9 rounded-full flex items-center justify-center transition-colors">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300">
              {solicitudes.length > 0 ? (
                solicitudes.map(sol => (
                  <div key={sol.id_solicitud} className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl p-5 shadow-sm transition-colors duration-300">
                    <h3 className="font-bold text-gray-800 dark:text-white text-base transition-colors duration-300">{sol.usuarios.nombre}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 border-b border-gray-100 dark:border-slate-700 pb-4 transition-colors duration-300">
                      Desea el <span className="font-bold text-orange-600 dark:text-[#ff7b00]">{new Date(sol.fecha_solicitada).toLocaleDateString('es-ES')}</span> libre
                    </p>

                    {solicitudARechazar === sol.id_solicitud ? (
                      <div className="animate-fade-in">
                        <label className="block text-[10px] font-bold text-red-500 dark:text-red-400 uppercase tracking-widest mb-2 transition-colors duration-300">Motivo del rechazo</label>
                        <input 
                          type="text" 
                          placeholder="Ej: Necesitamos personal ese día..."
                          value={motivoRechazo}
                          onChange={(e) => setMotivoRechazo(e.target.value)}
                          className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-[#0f172a] p-3 rounded-lg text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-sm mb-4"
                        />
                        <div className="flex gap-3">
                          <button onClick={() => setSolicitudARechazar(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-white text-sm font-bold py-2.5 rounded-lg transition-colors cursor-pointer">Cancelar</button>
                          <button onClick={() => gestionarSolicitud(sol.id_solicitud, sol.usuarios.id_usuario, sol.fecha_solicitada, 'rechazada')} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm">Confirmar Rechazo</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <button onClick={() => gestionarSolicitud(sol.id_solicitud, sol.usuarios.id_usuario, sol.fecha_solicitada, 'aprobada')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-bold transition-colors cursor-pointer text-sm shadow-sm">
                          Aprobar
                        </button>
                        <button onClick={() => setSolicitudARechazar(sol.id_solicitud)} className="flex-1 bg-white dark:bg-transparent border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-2.5 rounded-lg font-bold transition-colors cursor-pointer text-sm shadow-sm dark:shadow-none">
                          Rechazar
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-slate-400 font-bold transition-colors duration-300">No hay solicitudes pendientes.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLES DEL DÍA */}
      {diaModalSeleccionado && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-fade-in" onClick={() => setDiaModalSeleccionado(null)}>
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-colors duration-300" onClick={e => e.stopPropagation()}>
            <div className="bg-blue-600 p-5 text-white flex justify-between items-center shadow-sm">
              <div>
                <h2 className="font-extrabold text-lg">Turnos del Día</h2>
                <p className="text-blue-100 text-sm">{diaModalSeleccionado.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <button onClick={() => setDiaModalSeleccionado(null)} className="text-white/80 hover:text-white cursor-pointer bg-blue-700/50 hover:bg-blue-700 p-2 rounded-full transition-colors">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {getTurnosParaElDia(diaModalSeleccionado).length > 0 ? (
                getTurnosParaElDia(diaModalSeleccionado).map(turno => (
                  <div key={turno.id_turno} className="bg-gray-50 dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded-xl p-4 shadow-sm relative group transition-colors duration-300">
                    <button 
                      onClick={() => setElementoAEliminar({ tipo: 'unico', idTurno: turno.id_turno })}
                      className="absolute top-4 right-4 bg-red-100 hover:bg-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 p-2 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar este turno"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-bold px-3 py-1 rounded-lg text-sm border border-blue-200 dark:border-blue-500/30 transition-colors duration-300">
                        {turno.hora_inicio.substring(0,5)} - {turno.hora_fin.substring(0,5)}
                      </span>
                    </div>
                    <div className="space-y-2 pr-10">
                      {turno.usuarios.map((u, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                            {u.nombre.substring(0,2).toUpperCase()}
                          </div>
                          <span className="font-bold text-gray-800 dark:text-white text-sm transition-colors duration-300">{u.nombre}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
                    <svg className="w-8 h-8 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4M8 16l-4-4 4-4"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12a8 8 0 018-8 8 8 0 01-8-8z"></path></svg>
                  </div>
                  <p className="text-gray-500 dark:text-slate-400 font-bold transition-colors duration-300">No hay nadie asignado este día</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 flex gap-3 transition-colors duration-300">
              <button onClick={() => setDiaModalSeleccionado(null)} className="flex-1 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 font-bold py-3 rounded-xl transition-colors cursor-pointer shadow-sm text-sm">
                Cerrar Detalles
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA BORRAR TURNOS MASIVAMENTE */}
      {showModalBorrar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in" onClick={() => setShowModalBorrar(false)}>
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col transition-colors duration-300" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center transition-colors duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400 transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-gray-800 dark:text-white transition-colors duration-300">Borrado Masivo</h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mt-0.5 transition-colors duration-300">Elimina turnos por rango de fechas</p>
                </div>
              </div>
              <button onClick={() => setShowModalBorrar(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">✕</button>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-4 flex gap-3 transition-colors duration-300">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p className="text-xs text-red-800 dark:text-red-300 font-medium transition-colors duration-300">Esta acción eliminará todos los turnos del empleado en el rango seleccionado. Esta acción no se puede deshacer.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2 transition-colors duration-300">Seleccionar Empleado</label>
                <select value={borrarEmpleado} onChange={(e) => setBorrarEmpleado(e.target.value)} className="w-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-[#0f172a] p-3 rounded-xl text-sm font-medium text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-sm">
                  <option value="" className="bg-white dark:bg-[#1e293b] text-gray-800 dark:text-white">Elegir de la plantilla...</option>
                  {empleados.map(emp => <option key={emp.id_usuario} value={emp.id_usuario} className="bg-white dark:bg-[#1e293b] text-gray-800 dark:text-white">{emp.nombre}</option>)}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2 transition-colors duration-300">Desde (Fecha de Inicio)</label>
                  <input type="date" value={borrarFechaInicio} onChange={(e) => setBorrarFechaInicio(e.target.value)} className="w-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-[#0f172a] p-3 rounded-xl text-sm font-medium text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-sm dark:[color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2 transition-colors duration-300">Hasta (Fecha de Fin)</label>
                  <input type="date" value={borrarFechaFin} onChange={(e) => setBorrarFechaFin(e.target.value)} className="w-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-[#0f172a] p-3 rounded-xl text-sm font-medium text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-sm dark:[color-scheme:dark]" />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 flex gap-3 transition-colors duration-300">
              <button onClick={() => setShowModalBorrar(false)} className="flex-1 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 font-bold py-3 rounded-xl transition-colors cursor-pointer shadow-sm text-sm">
                Cancelar
              </button>
              <button onClick={handleBorrarMasivo} disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer shadow-md text-sm disabled:opacity-50">
                {loading ? 'Borrando...' : 'Confirmar y Borrar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR TURNO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden transition-colors duration-300">
            <div className="bg-blue-600 p-5 text-white flex justify-between items-center shadow-sm">
              <h2 className="font-extrabold text-lg">Programar Turno Avanzado</h2>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white cursor-pointer hover:bg-black/10 w-8 h-8 rounded-full flex items-center justify-center transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2 transition-colors duration-300">Seleccionar Empleado</label>
                <select value={selectedEmpleado} onChange={(e) => setSelectedEmpleado(e.target.value)} className="w-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-[#0f172a] p-3 rounded-xl text-sm font-medium text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm">
                  <option value="" className="bg-white dark:bg-[#1e293b] text-gray-800 dark:text-white">Elegir de la plantilla...</option>
                  {empleados.map(emp => <option key={emp.id_usuario} value={emp.id_usuario} className="bg-white dark:bg-[#1e293b] text-gray-800 dark:text-white">{emp.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2 transition-colors duration-300">Asignar a días específicos</label>
                <div className="flex flex-wrap gap-2">
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(dia => (
                    <button key={dia} onClick={() => toggleDia(dia)} className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm border ${diasSeleccionados.includes(dia) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>{dia}</button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2 transition-colors duration-300">Tipo de Turno</label>
                <select value={tipoRepeticion} onChange={(e) => setTipoRepeticion(e.target.value)} className="w-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-[#0f172a] p-3 rounded-xl text-sm font-medium text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm">
                  <option value="unico" className="bg-white dark:bg-[#1e293b] text-gray-800 dark:text-white">Solo esta semana</option>
                  <option value="semanal" className="bg-white dark:bg-[#1e293b] text-gray-800 dark:text-white">Repetir cada semana (12 semanas)</option>
                  <option value="rotativo" className="bg-white dark:bg-[#1e293b] text-gray-800 dark:text-white">Findes Rotativos (Semanas alternas)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2 transition-colors duration-300">Horario</label>
                <div className="flex gap-2 mb-3">
                  <button type="button" onClick={() => {setHoraInicio('08:00'); setHoraFin('15:00');}} className="flex-1 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold py-2 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-blue-500/30 uppercase tracking-wide">Mañana</button>
                  <button type="button" onClick={() => {setHoraInicio('15:00'); setHoraFin('22:00');}} className="flex-1 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold py-2 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-emerald-200 dark:hover:border-emerald-500/30 uppercase tracking-wide">Tarde</button>
                  <button type="button" onClick={() => {setHoraInicio('22:00'); setHoraFin('06:00');}} className="flex-1 bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-bold py-2 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-purple-200 dark:hover:border-purple-500/30 uppercase tracking-wide">Noche</button>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center bg-gray-50 dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden flex-1 focus-within:ring-2 focus-within:ring-blue-500 transition-all shadow-sm">
                    <select value={horaInicio.split(':')[0]} onChange={(e) => setHoraInicio(`${e.target.value}:${horaInicio.split(':')[1]}`)} className="bg-transparent p-3 text-sm font-extrabold text-gray-800 dark:text-white outline-none cursor-pointer appearance-none text-center w-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                      {horasArray.map(h => <option key={`h-ini-${h}`} value={h} className="bg-white dark:bg-[#1e293b] text-gray-800 dark:text-white font-medium">{h}</option>)}
                    </select>
                    <span className="text-gray-400 font-bold">:</span>
                    <select value={horaInicio.split(':')[1]} onChange={(e) => setHoraInicio(`${horaInicio.split(':')[0]}:${e.target.value}`)} className="bg-transparent p-3 text-sm font-extrabold text-gray-800 dark:text-white outline-none cursor-pointer appearance-none text-center w-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                      {minutosArray.map(m => <option key={`m-ini-${m}`} value={m} className="bg-white dark:bg-[#1e293b] text-gray-800 dark:text-white font-medium">{m}</option>)}
                    </select>
                  </div>
                  
                  <span className="text-gray-400 font-bold">-</span>
                  
                  <div className="flex items-center bg-gray-50 dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden flex-1 focus-within:ring-2 focus-within:ring-blue-500 transition-all shadow-sm">
                    <select value={horaFin.split(':')[0]} onChange={(e) => setHoraFin(`${e.target.value}:${horaFin.split(':')[1]}`)} className="bg-transparent p-3 text-sm font-extrabold text-gray-800 dark:text-white outline-none cursor-pointer appearance-none text-center w-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                      {horasArray.map(h => <option key={`h-fin-${h}`} value={h} className="bg-white dark:bg-[#1e293b] text-gray-800 dark:text-white font-medium">{h}</option>)}
                    </select>
                    <span className="text-gray-400 font-bold">:</span>
                    <select value={horaFin.split(':')[1]} onChange={(e) => setHoraFin(`${horaFin.split(':')[0]}:${e.target.value}`)} className="bg-transparent p-3 text-sm font-extrabold text-gray-800 dark:text-white outline-none cursor-pointer appearance-none text-center w-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                      {minutosArray.map(m => <option key={`m-fin-${m}`} value={m} className="bg-white dark:bg-[#1e293b] text-gray-800 dark:text-white font-medium">{m}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex gap-3 transition-colors duration-300">
                <button onClick={() => setShowModal(false)} className="flex-1 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 font-bold py-3 rounded-xl transition-colors cursor-pointer shadow-sm text-sm">
                  Cancelar
                </button>
                <button onClick={handleGuardarTurno} disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm shadow-md cursor-pointer disabled:opacity-50 transition-colors">
                  {loading ? 'Guardando...' : 'Confirmar Turno'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMAR ELIMINACIÓN DE TURNOS */}
      {elementoAEliminar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[300] p-4 animate-fade-in" onClick={() => setElementoAEliminar(null)}>
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col p-6 text-center border border-gray-100 dark:border-slate-800 transition-colors duration-300" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-slate-800 shadow-sm transition-colors duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h2 className="text-xl font-extrabold text-gray-800 dark:text-white mb-2 transition-colors duration-300">¿Confirmar borrado?</h2>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-6 transition-colors duration-300">
              {elementoAEliminar.tipo === 'unico' 
                ? 'Esta acción no se puede deshacer y se eliminará de la agenda del empleado.' 
                : 'Esta acción borrará TODOS los turnos de este día para todos los empleados.'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setElementoAEliminar(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-bold py-3 rounded-xl transition-colors cursor-pointer text-sm">
                Cancelar
              </button>
              <button 
                onClick={confirmarEliminacion} 
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer shadow-md text-sm disabled:opacity-50"
              >
                {loading ? 'Borrando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALERTAS GLOBALES */}
      {alerta && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[400] p-4 animate-fade-in" onClick={() => setAlerta(null)}>
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col p-6 text-center border border-gray-100 dark:border-slate-800 transition-colors duration-300" onClick={e => e.stopPropagation()}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${alerta.tipo === 'exito' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
              {alerta.tipo === 'exito' ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              )}
            </div>
            <h2 className="text-xl font-extrabold text-gray-800 dark:text-white mb-2 transition-colors duration-300">{alerta.titulo}</h2>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-6 transition-colors duration-300">{alerta.texto}</p>
            <button onClick={() => setAlerta(null)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer shadow-md text-sm">
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}