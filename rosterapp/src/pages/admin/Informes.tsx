

export default function Informes() {
  return (
    <div className="p-8 w-full mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">Informes y Registros</h2>
          <p className="text-gray-500 mt-2 text-lg">Exporta los datos de jornadas y asistencia de la plantilla</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button className="btn-secondary px-6 py-3 text-sm font-bold">
            Exportar PDF
          </button>
          <button className="btn-primary px-6 py-3 text-sm font-bold">
            Exportar Excel
          </button>
        </div>
      </div>

      <div className="bento-card shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex gap-4 flex-wrap">
          <select className="px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm">
            <option>Mes Actual (Septiembre)</option>
            <option>Mes Anterior (Agosto)</option>
          </select>
          <select className="px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm">
            <option>Todos los empleados</option>
          </select>
        </div>

        <div className="p-16 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mb-4 mx-auto border-2 border-blue-100 shadow-md">
            <svg className="w-10 h-10 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-bold text-lg">No hay registros de fichajes en el sistema todavía</p>
          <p className="text-gray-400 text-sm mt-2">Los registros aparecerán una vez tus empleados comiencen a registrar sus jornadas</p>
        </div>
      </div>
    </div>
  );
}