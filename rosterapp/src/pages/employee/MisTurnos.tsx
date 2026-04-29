import { useState } from 'react';

export default function MisTurnos() {
  const [weekOffset, setWeekOffset] = useState(0);

  // Array vacío: aquí es donde guardaremos los turnos personales del empleado desde la BD
  const misTurnos: any[] = [];

  // Lógica para calcular las fechas dinámicas de la semana
  const getWeekData = (offset: number) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    
    const monday = new Date(today.setDate(diffToMonday));
    monday.setDate(monday.getDate() + offset * 7);

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    // Devolvemos el mes y año del Lunes de esa semana
    return {
      currentMonth: monthNames[monday.getMonth()],
      currentYear: monday.getFullYear().toString()
    };
  };

  const { currentMonth, currentYear } = getWeekData(weekOffset);
  const etiquetaSemana = weekOffset === 0 ? "Esta Semana" : weekOffset < 0 ? "Semana Anterior" : "Próxima Semana";

  return (
    <div className="w-full p-8">
      <div className="mb-10">
        <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">Mis Próximos Turnos</h2>
        <p className="text-gray-500 mt-2 text-lg">Consulta tus horarios asignados de forma rápida</p>
      </div>

      <div className="bento-card shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent capitalize">
            {etiquetaSemana} <span className="text-gray-400 font-bold text-base">| {currentMonth} {currentYear}</span>
          </h3>
          <div className="glass rounded-2xl p-2 flex gap-1 w-full sm:w-auto justify-between">
            <button 
              onClick={() => setWeekOffset(prev => prev - 1)}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all"
            >
              &larr; Anterior
            </button>
            <button 
              onClick={() => setWeekOffset(0)}
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                weekOffset === 0 ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Hoy
            </button>
            <button 
              onClick={() => setWeekOffset(prev => prev + 1)}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all"
            >
              Siguiente &rarr;
            </button>
          </div>
        </div>

        <div className="p-8">
          {misTurnos.length > 0 ? (
            <div className="space-y-4">
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mb-6 border-2 border-blue-100 shadow-lg">
                <svg className="w-12 h-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">No tienes turnos asignados</h4>
              <p className="text-base text-gray-500 max-w-sm">
                Disfruta de tu tiempo libre. Cuando el administrador te asigne un nuevo horario para esta semana, aparecerá aquí.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}