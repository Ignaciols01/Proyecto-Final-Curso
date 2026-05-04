import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [totalEmpleados, setTotalEmpleados] = useState(0);
  const [turnosSemana, setTurnosSemana] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // ESTADOS DEL MODAL
  const [showModal, setShowModal] = useState(false);
  const [empleados, setEmpleados] = useState<{id_usuario: string, nombre: string}[]>([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState('');
  const [tipoRepeticion, setTipoRepeticion] = useState('unico');
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [horaFin, setHoraFin] = useState('15:00');

  // ESTADO DEL CALENDARIO
  const [fechaReferencia, setFechaReferencia] = useState(new Date());

  useEffect(() => {
    fetchStats();
    fetchEmpleados();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { count: countEmp, error: errorEmp } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true })
        .eq('rol', 'empleado');

      if (!errorEmp) setTotalEmpleados(countEmp || 0);

      const hoy = new Date();
      const lunes = new Date(hoy.setDate(hoy.getDate() - hoy.getDay() + 1)).toISOString().split('T')[0];
      const domingo = new Date(hoy.setDate(hoy.getDate() - hoy.getDay() + 7)).toISOString().split('T')[0];

      const { count: countTurnos, error: errorTurnos } = await supabase
        .from('turnos')
        .select('*', { count: 'exact', head: true })
        .gte('fecha', lunes)
        .lte('fecha', domingo);

      if (!errorTurnos) setTurnosSemana(countTurnos || 0);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmpleados = async () => {
    const { data } = await supabase.from('usuarios').select('id_usuario, nombre').eq('rol', 'empleado');
    if (data) setEmpleados(data);
  };

  const toggleDia = (dia: string) => {
    setDiasSeleccionados(prev => 
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    );
  };

  const handleGuardarTurno = async () => {
    if (!selectedEmpleado || diasSeleccionados.length === 0) {
      alert("Por favor, selecciona un empleado y al menos un día.");
      return;
    }

    setLoading(true);
    try {
      const hoy = new Date();
      const lunesActual = new Date(hoy.setDate(hoy.getDate() - hoy.getDay() + (hoy.getDay() === 0 ? -6 : 1)));
      const mapaDias: { [key: string]: number } = { 'Lun': 0, 'Mar': 1, 'Mié': 2, 'Jue': 3, 'Vie': 4, 'Sáb': 5, 'Dom': 6 };

      for (const diaNombre of diasSeleccionados) {
        const fechaTurno = new Date(lunesActual);
        fechaTurno.setDate(lunesActual.getDate() + mapaDias[diaNombre]);
        const fechaString = fechaTurno.toISOString().split('T')[0];

        const { data: nuevoTurno, error: errorTurno } = await supabase
          .from('turnos')
          .insert([{ fecha: fechaString, hora_inicio: horaInicio, hora_fin: horaFin, tipo: tipoRepeticion }])
          .select()
          .single();

        if (errorTurno) throw errorTurno;

        const { error: errorAsig } = await supabase
          .from('asignaciones')
          .insert([{ id_usuario: selectedEmpleado, id_turno: nuevoTurno.id_turno }]);

        if (errorAsig) throw errorAsig;
      }

      alert("¡Turnos programados con éxito!");
      setShowModal(false);
      setDiasSeleccionados([]);
      fetchStats(); 
    } catch (err: any) {
      console.error(err);
      alert("Error al guardar: " + (err.message || "Fallo de conexión."));
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DEL CALENDARIO ---
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

  const formatearMesAno = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  const nombresDiasCortos = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="p-6 md:p-8 bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors duration-300">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">Panel de Control</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Gestión inteligente de tus turnos y equipo</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
        >
          + CREAR TURNO
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center space-x-4">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-blue-600 dark:text-blue-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Plantilla Total</p>
            <p className="text-xl font-bold text-gray-700 dark:text-white">{loading ? '...' : `${totalEmpleados} empleados`}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center space-x-4">
          <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-xl text-emerald-600 dark:text-emerald-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Turnos Asignados</p>
            <p className="text-xl font-bold text-gray-700 dark:text-white">{loading ? '...' : `${turnosSemana} esta semana`}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center space-x-4">
          <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-xl text-orange-600 dark:text-orange-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Incidencias</p>
            <p className="text-xl font-bold text-gray-700 dark:text-white">0 pendientes</p>
          </div>
        </div>
      </div>

      {/* Calendario Dinámico */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-700 dark:text-white capitalize">
          Semana Actual | <span className="text-blue-600 dark:text-blue-400">{formatearMesAno(lunesActual)}</span>
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
            <button className="px-4 py-1.5 text-xs font-bold bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-md shadow-sm">Semana</button>
            <button className="px-4 py-1.5 text-xs font-bold text-gray-500">Mes</button>
          </div>
          <div className="flex items-center space-x-1">
            <button onClick={irSemanaAnterior} className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">- Anterior</button>
            <button onClick={irAHoy} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold px-4 cursor-pointer transition-colors shadow-sm">Hoy</button>
            <button onClick={irSemanaSiguiente} className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">Siguiente -</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-px bg-gray-200 dark:bg-slate-700 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm">
        {diasSemana.map((dia, i) => {
          const hoy = new Date();
          const esHoy = dia.getDate() === hoy.getDate() && dia.getMonth() === hoy.getMonth() && dia.getFullYear() === hoy.getFullYear();
          const nombreDia = nombresDiasCortos[dia.getDay()];
          const esFinde = dia.getDay() === 0 || dia.getDay() === 6; // Domingo o Sábado

          return (
            <div 
              key={i} 
              className={`min-h-[300px] flex flex-col transition-all ${
                esHoy 
                  ? 'bg-blue-50/50 dark:bg-slate-800 ring-2 ring-inset ring-blue-500 dark:ring-blue-400 relative z-10' 
                  : 'bg-white dark:bg-slate-800/90'
              }`}
            >
              <div className={`p-3 text-center border-b border-gray-100 dark:border-slate-700/50 font-bold text-sm ${
                esHoy 
                  ? 'text-blue-700 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/30' 
                  : esFinde 
                    ? 'text-red-500 dark:text-red-400 bg-red-50/30 dark:bg-red-900/10' 
                    : 'text-blue-600 dark:text-blue-300 bg-gray-50/50 dark:bg-slate-800/50'
              }`}>
                {nombreDia} {dia.getDate()}
              </div>
              <div className="flex-1 flex items-center justify-center p-4">
                <span className={`font-bold uppercase tracking-widest text-[10px] italic ${esHoy ? 'text-blue-400 dark:text-blue-500/70' : 'text-gray-300 dark:text-slate-600'}`}>
                  Libre
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL AVANZADO (se mantiene igual) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <h2 className="font-bold">Programar Turno Avanzado</h2>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white cursor-pointer">✕</button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Seleccionar Empleado</label>
                <select 
                  value={selectedEmpleado} 
                  onChange={(e) => setSelectedEmpleado(e.target.value)}
                  className="w-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 p-2.5 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Elegir de la plantilla...</option>
                  {empleados.map(emp => <option key={emp.id_usuario} value={emp.id_usuario}>{emp.nombre}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Asignar a días específicos</label>
                <div className="flex flex-wrap gap-2">
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(dia => (
                    <button 
                      key={dia}
                      onClick={() => toggleDia(dia)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${diasSeleccionados.includes(dia) ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 dark:bg-slate-700 text-gray-500'}`}
                    >
                      {dia}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Tipo de Turno</label>
                  <select 
                    value={tipoRepeticion} 
                    onChange={(e) => setTipoRepeticion(e.target.value)}
                    className="w-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 p-2.5 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="unico">Solo esta semana</option>
                    <option value="semanal">Repetir cada semana</option>
                    <option value="rotativo">Findes Rotativos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Horario</label>
                  <div className="flex items-center space-x-2">
                    <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} className="w-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 p-2 rounded-lg text-xs dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                    <span className="text-gray-400">-</span>
                    <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} className="w-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 p-2 rounded-lg text-xs dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex gap-3">
                <button 
                  onClick={handleGuardarTurno}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Guardando...' : 'Confirmar y Guardar'}
                </button>
                <button onClick={() => setShowModal(false)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-500 dark:text-gray-300 font-bold rounded-xl text-sm transition-colors cursor-pointer">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}