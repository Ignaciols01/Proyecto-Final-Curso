import { useState } from 'react';

export default function Dashboard() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const turnos: any[] = [];

  const getWeekData = (offset: number) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diffToMonday));
    monday.setDate(monday.getDate() + offset * 7);

    const days = [];
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    let currentMonth = "";
    let currentYear = "";

    for (let i = 0; i < 5; i++) {
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + i);
      
      if (i === 0) {
        currentMonth = monthNames[currentDate.getMonth()];
        currentYear = currentDate.getFullYear().toString();
      }

      days.push({
        id: i,
        label: `${dayNames[currentDate.getDay()]} ${currentDate.getDate()}`,
        dateObj: currentDate
      });
    }
    return { days, currentMonth, currentYear };
  };

  const { days, currentMonth, currentYear } = getWeekData(weekOffset);
  const etiquetaSemana = weekOffset === 0 ? "Semana Actual" : weekOffset < 0 ? "Semana Anterior" : "Próxima Semana";

  return (
    <div className="p-8 w-full mx-auto relative">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Panel de Control</h2>
          <p className="text-gray-500 mt-2 text-lg">Gestión inteligente de tus turnos y equipo</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          CREAR TURNO
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bento-card group hover:shadow-2xl cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Plantilla Total</p>
              <p className="text-3xl font-black text-gray-900 mt-1">0 <span className="text-base font-medium text-gray-400">empleados</span></p>
            </div>
          </div>
        </div>
        
        <div className="bento-card group hover:shadow-2xl cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl text-green-600 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Turnos Asignados</p>
              <p className="text-3xl font-black text-gray-900 mt-1">0 <span className="text-base font-medium text-gray-400">esta semana</span></p>
            </div>
          </div>
        </div>

        <div className="bento-card group hover:shadow-2xl cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl text-amber-600 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Incidencias</p>
              <p className="text-3xl font-black text-gray-900 mt-1">0 <span className="text-base font-medium text-gray-400">pendientes</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="bento-card shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 border-b border-gray-100 pb-6 gap-4">
          <h3 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent capitalize">
            {etiquetaSemana} <span className="text-gray-400 font-bold text-base">| {currentMonth} {currentYear}</span>
          </h3>
          <div className="glass rounded-2xl p-2 flex gap-1">
            <button onClick={() => setWeekOffset(prev => prev - 1)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all">&larr; Anterior</button>
            <button onClick={() => setWeekOffset(0)} className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${weekOffset === 0 ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}`}>Hoy</button>
            <button onClick={() => setWeekOffset(prev => prev + 1)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all">Siguiente &rarr;</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {days.map((dia) => (
            <div key={dia.id} className="flex flex-col bg-gradient-to-b from-white/40 to-gray-50/60 rounded-2xl p-3 border border-gray-100 min-h-[420px] hover:shadow-lg transition-all backdrop-blur-sm group">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-3 text-center rounded-xl border border-blue-100 font-bold text-gray-800 text-sm mb-4 shadow-sm capitalize group-hover:from-blue-100 group-hover:to-indigo-100 transition-all">{dia.label}</div>
              <div className="flex flex-col gap-2 flex-1">
                {turnos.length > 0 ? (
                  turnos.map(turno => (<div key={turno.id}></div>))
                ) : (
                  <div className="flex items-center justify-center h-full w-full border-2 border-dashed border-gray-200 rounded-2xl bg-gradient-to-br from-slate-50/50 to-gray-50/75 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-50 transition-all">
                    <p className="text-sm text-gray-400 font-semibold">Libre</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900/50 to-black/40 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300 border border-gray-100">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-2xl font-bold text-gray-900">Asignar Nuevo Turno</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Fecha</label>
                <input type="date" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Hora Inicio</label>
                  <input type="time" defaultValue="08:00" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Hora Fin</label>
                  <input type="time" defaultValue="15:00" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Asignar a Empleado</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white transition-all shadow-sm">
                  <option value="">-- Selecciona un empleado --</option>
                </select>
              </div>
            </div>
            <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary px-6 py-2.5 text-sm font-bold">CANCELAR</button>
              <button onClick={() => setIsModalOpen(false)} className="btn-primary px-6 py-2.5 text-sm font-bold">GUARDAR TURNO</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}