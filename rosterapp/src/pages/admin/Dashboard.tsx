import React, { useState } from 'react';

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<'semana' | 'mes'>('semana');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Lógica de fechas a prueba de balas
  const handlePrev = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'semana') {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(1); // Seguro contra bugs de meses cortos
        newDate.setMonth(newDate.getMonth() - 1);
      }
      return newDate;
    });
  };

  const handleNext = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'semana') {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setDate(1); // Seguro contra bugs de meses cortos
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const monthYearString = currentDate.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }).replace('.', '');
  const capitalizedMonthYear = monthYearString.charAt(0).toUpperCase() + monthYearString.slice(1);

  const getWeekDays = () => {
    const curr = new Date(currentDate);
    const first = curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1);
    const monday = new Date(curr.setDate(first));
    const days = [];
    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(monday);
      nextDate.setDate(monday.getDate() + i);
      days.push({ name: dayNames[i], num: nextDate.getDate(), isWeekend: i >= 5 });
    }
    return days;
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; 
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const days = [];

    for (let i = 0; i < startingDay; i++) {
      days.push({ num: prevMonthLastDay - startingDay + i + 1, isCurrentMonth: false, isWeekend: (i === 5 || i === 6) });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dayOfWeek = (startingDay + i - 1) % 7;
      days.push({ num: i, isCurrentMonth: true, isWeekend: (dayOfWeek === 5 || dayOfWeek === 6) });
    }
    const extraCells = (days.length <= 35 ? 35 : 42) - days.length;
    for (let i = 1; i <= extraCells; i++) {
      const dayOfWeek = (days.length) % 7;
      days.push({ num: i, isCurrentMonth: false, isWeekend: (dayOfWeek === 5 || dayOfWeek === 6) });
    }
    return days;
  };

  const weekDays = getWeekDays();
  const monthDays = getMonthDays();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto transition-colors duration-300">
      
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-400">Panel de Control</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">Gestión inteligente de tus turnos y equipo</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors w-full md:w-auto cursor-pointer">
          + CREAR TURNO
        </button>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-500 dark:text-indigo-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Plantilla Total</p>
            <p className="text-xl font-extrabold text-gray-800 dark:text-gray-100">0 <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">empleados</span></p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-500 dark:text-emerald-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Turnos Asignados</p>
            <p className="text-xl font-extrabold text-gray-800 dark:text-gray-100">0 <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">esta semana</span></p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center space-x-4">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-500 dark:text-amber-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Incidencias</p>
            <p className="text-xl font-extrabold text-gray-800 dark:text-gray-100">0 <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">pendientes</span></p>
          </div>
        </div>
      </div>

      {/* Controles del Calendario */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex flex-col md:flex-row items-center md:space-x-4 w-full md:w-auto">
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {viewMode === 'semana' ? 'Semana Actual' : 'Mes Actual'} 
            <span className="text-gray-400 dark:text-gray-500 font-medium ml-2">| {capitalizedMonthYear}</span>
          </h2>
          <div className="bg-gray-100 dark:bg-slate-700 p-1 rounded-lg flex space-x-1 border border-gray-200 dark:border-slate-600 justify-center mt-2 md:mt-0">
            <button onClick={() => setViewMode('semana')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all cursor-pointer ${viewMode === 'semana' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>Semana</button>
            <button onClick={() => setViewMode('mes')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all cursor-pointer ${viewMode === 'mes' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>Mes</button>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
          <button onClick={handlePrev} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer shadow-sm">- Anterior</button>
          <button onClick={handleToday} className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 cursor-pointer">Hoy</button>
          <button onClick={handleNext} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer shadow-sm">Siguiente -</button>
        </div>
      </div>

      {/* VISTA SEMANA */}
      {viewMode === 'semana' && (
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-cols-7 gap-3 min-w-[800px]">
            {weekDays.map((dia, index) => (
              <div key={index} className="flex flex-col h-[280px]">
                <div className={`text-center py-2.5 rounded-t-xl font-bold text-sm border transition-colors duration-300 ${dia.isWeekend ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800/50' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-100 dark:border-blue-800/50'}`}>
                  {dia.name} {dia.num}
                </div>
                <div className="flex-1 border-x border-b border-gray-200 dark:border-slate-700 border-dashed rounded-b-xl bg-white dark:bg-slate-800 p-2 flex items-center justify-center">
                  <span className="text-gray-300 dark:text-slate-600 font-bold text-sm">Libre</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA MES */}
      {viewMode === 'mes' && (
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-cols-7 gap-2 bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm min-w-[800px]">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d, i) => (
              <div key={i} className={`text-center font-bold text-[10px] uppercase mb-2 ${i >= 5 ? 'text-red-400 dark:text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>{d}</div>
            ))}
            {monthDays.map((dia, i) => (
              <div key={i} className={`h-24 border border-gray-100 dark:border-slate-700 rounded-lg p-2 flex flex-col transition-colors duration-300 ${dia.isCurrentMonth ? 'bg-white dark:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500' : 'bg-gray-50 dark:bg-slate-800/50 opacity-60'}`}>
                <span className={`text-right text-sm font-bold ${dia.isCurrentMonth ? (dia.isWeekend ? 'text-red-500 dark:text-red-400' : 'text-gray-800 dark:text-gray-200') : 'text-gray-400 dark:text-slate-500'}`}>{dia.num}</span>
                <div className="flex-1 flex items-center justify-center">
                  {dia.isCurrentMonth && <span className="text-gray-200 dark:text-slate-600 text-xs font-semibold">Libre</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}