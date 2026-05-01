import React, { useState } from 'react';

export default function MisTurnos() {
  const [viewMode, setViewMode] = useState<'semana' | 'mes'>('semana');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'semana') newDate.setDate(newDate.getDate() - 7);
    else newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'semana') newDate.setDate(newDate.getDate() + 7);
    else newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
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
    // ¡Ojo! Ya no usamos min-h-screen aquí, el Layout ya controla el alto
    <div className="bg-transparent transition-colors duration-300">
      
      <header className="bg-blue-700 dark:bg-blue-900 text-white p-4 shadow-sm rounded-xl mb-4 transition-colors duration-300">
        <h1 className="text-xl font-extrabold tracking-tight">Mi Calendario de Turnos</h1>
        <p className="text-blue-200 dark:text-blue-300 text-xs font-medium">Revisa tus horarios asignados</p>
      </header>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-300">
          <div className="flex flex-col md:flex-row items-center md:space-x-4 mb-2 md:mb-0 w-full md:w-auto">
            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {viewMode === 'semana' ? 'Semana' : 'Mes'} 
              <span className="text-gray-400 dark:text-gray-500 font-medium ml-1">| {capitalizedMonthYear}</span>
            </h2>
            <div className="bg-gray-100 dark:bg-slate-700 p-1 rounded-lg flex space-x-1 border border-gray-200 dark:border-slate-600 justify-center">
              <button onClick={() => setViewMode('semana')} className={`px-4 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${viewMode === 'semana' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>Semana</button>
              <button onClick={() => setViewMode('mes')} className={`px-4 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${viewMode === 'mes' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>Mes</button>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
            <button onClick={handlePrev} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-1.5 bg-gray-50 dark:bg-slate-700 rounded-md cursor-pointer">&lt; Ant</button>
            <button onClick={() => setCurrentDate(new Date())} className="bg-blue-600 dark:bg-blue-500 text-white px-3 py-1.5 rounded-md shadow-sm hover:bg-blue-700 cursor-pointer">Hoy</button>
            <button onClick={handleNext} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-1.5 bg-gray-50 dark:bg-slate-700 rounded-md cursor-pointer">Sig &gt;</button>
          </div>
        </div>

        {viewMode === 'semana' && (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {weekDays.map((dia, index) => (
              // Altura reducida de 400px a 280px
              <div key={index} className="flex flex-col h-auto md:h-[280px]">
                <div className={`text-center py-2 rounded-t-lg font-bold text-xs border transition-colors duration-300 ${dia.isWeekend ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800/50' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-100 dark:border-blue-800/50'}`}>
                  {dia.name} {dia.num}
                </div>
                <div className="flex-1 border-x border-b border-gray-200 dark:border-slate-700 border-dashed rounded-b-lg bg-white dark:bg-slate-800 p-2 flex items-center justify-center min-h-[80px]">
                  <span className="text-gray-300 dark:text-slate-600 font-bold text-xs">Libre</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'mes' && (
          <div className="grid grid-cols-7 gap-2 bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-x-auto min-w-[700px]">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d, i) => (
              <div key={i} className={`text-center font-bold text-[10px] uppercase mb-2 ${i >= 5 ? 'text-red-400 dark:text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>{d}</div>
            ))}
            {monthDays.map((dia, i) => (
              // Altura de celda reducida de h-28 a h-20 (80px)
              <div key={i} className={`h-20 border border-gray-100 dark:border-slate-700 rounded-md p-2 flex flex-col transition-colors duration-300 ${dia.isCurrentMonth ? 'bg-white dark:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500' : 'bg-gray-50 dark:bg-slate-800/50 opacity-60'}`}>
                <span className={`text-right text-xs font-bold ${dia.isCurrentMonth ? (dia.isWeekend ? 'text-red-500 dark:text-red-400' : 'text-gray-800 dark:text-gray-200') : 'text-gray-400 dark:text-slate-500'}`}>{dia.num}</span>
                <div className="flex-1 flex items-center justify-center">
                  {dia.isCurrentMonth && <span className="text-gray-200 dark:text-slate-600 text-[10px] font-semibold">Libre</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}