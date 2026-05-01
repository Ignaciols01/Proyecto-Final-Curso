import React, { useState } from 'react';

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<'semana' | 'mes'>('semana');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const daysOfWeek = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-700">Panel de Control</h1>
          <p className="text-gray-500 mt-1 font-medium">Gestión inteligente de tus turnos y equipo</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-all cursor-pointer"
        >
          + CREAR TURNO
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg text-2xl">👥</div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Plantilla Total</p>
            <p className="text-xl font-bold text-gray-800">0 <span className="text-sm font-medium text-gray-500">empleados</span></p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg text-2xl">📅</div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Turnos Asignados</p>
            <p className="text-xl font-bold text-gray-800">0 <span className="text-sm font-medium text-gray-500">esta semana</span></p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg text-2xl">⚠️</div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Incidencias</p>
            <p className="text-xl font-bold text-gray-800">0 <span className="text-sm font-medium text-gray-500">pendientes</span></p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center space-x-6 mb-4 md:mb-0">
          <h2 className="text-2xl font-bold text-blue-600">
            {viewMode === 'semana' ? 'Semana Actual' : 'Mes Actual'} 
            <span className="text-gray-400 font-medium text-lg"> | Abr 2026</span>
          </h2>
          
          <div className="bg-gray-200 p-1 rounded-lg flex space-x-1 border border-gray-300">
            <button 
              onClick={() => setViewMode('semana')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all cursor-pointer ${viewMode === 'semana' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-300'}`}
            >
              Semana
            </button>
            <button 
              onClick={() => setViewMode('mes')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all cursor-pointer ${viewMode === 'mes' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-300'}`}
            >
              Mes
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm font-semibold text-gray-600">
          <button className="hover:text-blue-600 transition-colors px-2 cursor-pointer">- Anterior</button>
          <button className="bg-blue-600 text-white px-4 py-1.5 rounded-md shadow-sm hover:bg-blue-700 transition-colors cursor-pointer">Hoy</button>
          <button className="hover:text-blue-600 transition-colors px-2 cursor-pointer">Siguiente -</button>
        </div>
      </div>

      {viewMode === 'semana' && (
        <div className="grid grid-cols-5 gap-4">
          {['Lun 27', 'Mar 28', 'Mié 29', 'Jue 30', 'Vie 1'].map((dia, index) => (
            <div key={index} className="flex flex-col h-[500px]">
              <div className="bg-blue-50 text-blue-800 text-center py-3 rounded-t-xl font-bold text-sm border border-blue-100">
                {dia}
              </div>
              <div className="flex-1 border-x border-b border-gray-200 border-dashed rounded-b-xl bg-white p-2 flex items-center justify-center">
                <span className="text-gray-300 font-bold text-sm">Libre</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'mes' && (
        <div className="grid grid-cols-7 gap-2 bg-white p-4 rounded-xl border border-gray-200 shadow-sm mt-4">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d, i) => (
            <div key={i} className={`text-center font-bold text-xs uppercase mb-2 ${i >= 5 ? 'text-red-400' : 'text-gray-400'}`}>
              {d}
            </div>
          ))}
          {Array.from({ length: 35 }).map((_, i) => {
            const dayNum = i - 1; 
            const isCurrentMonth = dayNum > 0 && dayNum <= 30;
            const isWeekend = (i % 7 === 5) || (i % 7 === 6);
            
            return (
              <div 
                key={i} 
                className={`h-24 border border-gray-100 rounded-lg p-2 text-right text-sm cursor-pointer transition-colors ${isCurrentMonth ? 'bg-white hover:border-blue-400 font-bold text-gray-800' : 'bg-gray-50 text-gray-400'} ${isCurrentMonth && isWeekend ? 'text-red-500' : ''}`}
              >
                {dayNum > 0 && dayNum <= 30 ? dayNum : (dayNum <= 0 ? 29 + i : dayNum - 30)}
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col transform transition-all">
            
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
              <h2 className="text-xl font-extrabold text-blue-700">Asignar Nuevo Turno</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-800 transition-colors bg-white rounded-full p-1 shadow-sm border border-gray-200 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Días de aplicación</label>
                <div className="flex justify-between space-x-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`w-10 h-10 rounded-full font-bold shadow-sm transition-colors cursor-pointer ${
                        selectedDays.includes(day)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 border border-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-4 shadow-inner">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Repetición</label>
                    <select className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-blue-300 transition-colors cursor-pointer">
                      <option>Solo esta semana</option>
                      <option>Semanalmente</option>
                      <option>Mensualmente</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Fines de Semana</label>
                    <select className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-blue-300 transition-colors cursor-pointer">
                      <option>No trabaja findes</option>
                      <option>Trabaja todos los findes</option>
                      <option>Trabaja 1 de cada 2</option>
                      <option>Trabaja 1 de cada 3</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Hora Inicio</label>
                  <input type="time" defaultValue="08:00" className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-gray-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-sm transition-all" />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Hora Fin</label>
                  <input type="time" defaultValue="15:00" className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-gray-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-sm transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Asignar a Empleado</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-3.5 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:border-blue-300 transition-colors bg-white cursor-pointer disabled:bg-gray-100 disabled:text-gray-400">
                  <option value="">-- Selecciona un empleado --</option>
                  <option disabled>No hay empleados registrados</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-5 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-colors focus:outline-none cursor-pointer"
              >
                CANCELAR
              </button>
              <button 
                type="button" 
                onClick={() => {
                  console.log("Turno guardado", { selectedDays });
                  setIsModalOpen(false);
                }}
                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-md transition-colors focus:outline-none focus:ring-4 focus:ring-blue-200 cursor-pointer"
              >
                GUARDAR TURNO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}