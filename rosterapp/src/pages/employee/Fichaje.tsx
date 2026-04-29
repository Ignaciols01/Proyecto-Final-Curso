

export default function Fichaje() {
  return (
    <div className="w-full p-8">
      <div className="mb-10">
        <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">Control Horario</h2>
        <p className="text-gray-500 mt-2 text-lg">Registra tu jornada laboral con precisión</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bento-card shadow-xl flex flex-col items-center justify-center min-h-[500px] p-8 hover:shadow-2xl transition-all">
          <div className="text-center mb-12">
            <p className="text-gray-500 font-bold mb-3 uppercase tracking-widest text-sm">Hora Actual</p>
            <p className="text-7xl font-black text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text tabular-nums tracking-tight">
              08:00
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-xs">
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all text-lg transform hover:-translate-y-1">
              REGISTRAR ENTRADA
            </button>
            <button disabled className="w-full bg-gradient-to-r from-gray-200 to-gray-300 text-gray-500 font-bold py-4 px-6 rounded-2xl cursor-not-allowed text-lg opacity-50">
              REGISTRAR SALIDA
            </button>
          </div>
        </div>

        <div className="bento-card shadow-xl hover:shadow-2xl transition-all">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-6">
            Resumen de Hoy
          </h3>
          
          <div className="space-y-6 mb-8">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:from-green-100 hover:to-emerald-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg"></div>
                <p className="font-bold text-gray-700 text-lg">Entrada</p>
              </div>
              <p className="text-gray-600 font-semibold">--:--</p>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl border border-red-100 hover:from-red-100 hover:to-rose-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-400 to-rose-500 shadow-lg"></div>
                <p className="font-bold text-gray-700 text-lg">Salida</p>
              </div>
              <p className="text-gray-600 font-semibold">--:--</p>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <p className="text-sm font-bold text-gray-500 uppercase mb-2 tracking-wider">Horas Computadas</p>
            <p className="text-4xl font-black text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">0h 0m</p>
          </div>
        </div>
      </div>
    </div>
  );
}