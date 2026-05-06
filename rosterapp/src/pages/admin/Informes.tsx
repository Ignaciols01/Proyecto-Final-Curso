import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Fichaje {
  id_fichaje: string;
  hora_entrada: string;
  hora_salida: string | null;
  usuarios: {
    id_usuario: string;
    nombre: string;
  };
}

export default function AdminInformes() {
  const [fichajes, setFichajes] = useState<Fichaje[]>([]);
  const [empleados, setEmpleados] = useState<{id_usuario: string, nombre: string}[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const mesActual = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const [filtroMes, setFiltroMes] = useState(mesActual);
  const [filtroEmpleado, setFiltroEmpleado] = useState('todos');

  useEffect(() => {
    cargarFichajes();
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    const { data } = await supabase.from('usuarios').select('id_usuario, nombre').eq('rol', 'empleado');
    if (data) setEmpleados(data);
  };

  const cargarFichajes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('fichajes')
      .select('id_fichaje, hora_entrada, hora_salida, usuarios(id_usuario, nombre)')
      .order('hora_entrada', { ascending: false });

    if (!error && data) {
      setFichajes(data as unknown as Fichaje[]);
    }
    setLoading(false);
  };

  // Lógica de Filtrado Local
  const fichajesFiltrados = fichajes.filter(f => {
    const fechaFichaje = f.hora_entrada.slice(0, 7);
    const pasaFiltroMes = filtroMes === 'todos' || fechaFichaje === filtroMes;
    const pasaFiltroEmpleado = filtroEmpleado === 'todos' || f.usuarios.id_usuario === filtroEmpleado;
    return pasaFiltroMes && pasaFiltroEmpleado;
  });

  // Calculadora de horas trabajadas
  const calcularDuracion = (entrada: string, salida: string | null) => {
    if (!salida) return 'En curso';
    const diff = new Date(salida).getTime() - new Date(entrada).getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  };

  // ==========================================
  // FUNCIONES DE EXPORTACIÓN
  // ==========================================
  const handleExportarExcel = () => {
    if (fichajesFiltrados.length === 0) return alert('No hay datos para exportar.');
    
    // Cabeceras del CSV
    let csvContent = "Fecha,Empleado,Hora Entrada,Hora Salida,Horas Totales\n";
    
    // Filas
    fichajesFiltrados.forEach(f => {
      const fecha = new Date(f.hora_entrada).toLocaleDateString('es-ES');
      const entrada = new Date(f.hora_entrada).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'});
      const salida = f.hora_salida ? new Date(f.hora_salida).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'}) : 'Sin salida';
      const total = calcularDuracion(f.hora_entrada, f.hora_salida);
      
      csvContent += `${fecha},${f.usuarios.nombre},${entrada},${salida},${total}\n`;
    });

    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Informes_RosterApp_${filtroMes}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportarPDF = () => {
    // La impresión a PDF oculta los botones gracias a las clases 'print:hidden'
    window.print();
  };

  // Generador de meses para el filtro
  const generarOpcionesMeses = () => {
    const opciones = [];
    const fecha = new Date();
    for (let i = 0; i < 6; i++) {
      const valor = fecha.toISOString().slice(0, 7);
      const etiqueta = fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      opciones.push({ valor, etiqueta: etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1) });
      fecha.setMonth(fecha.getMonth() - 1);
    }
    return opciones;
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors duration-300 print:bg-white print:p-0">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 print:mb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 print:text-black">Informes y Registros</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium print:text-gray-600">Exporta los datos de jornadas y asistencia de la plantilla</p>
        </div>
        
        {/* BOTONES (Se ocultan al imprimir el PDF) */}
        <div className="flex items-center gap-3 print:hidden">
          <button 
            onClick={handleExportarPDF}
            className="bg-transparent border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 font-bold py-2.5 px-5 rounded-lg shadow-sm transition-all cursor-pointer text-sm"
          >
            Exportar PDF
          </button>
          <button 
            onClick={handleExportarExcel}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm transition-all cursor-pointer text-sm"
          >
            Exportar Excel
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors duration-300 print:border-none print:shadow-none">
        
        {/* BARRA DE FILTROS (Se oculta al imprimir el PDF) */}
        <div className="p-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 flex flex-wrap gap-4 print:hidden">
          <select 
            value={filtroMes} 
            onChange={(e) => setFiltroMes(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white text-sm rounded-lg px-4 py-2 font-bold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="todos">Histórico Completo</option>
            {generarOpcionesMeses().map(mes => (
              <option key={mes.valor} value={mes.valor}>{mes.etiqueta}</option>
            ))}
          </select>

          <select 
            value={filtroEmpleado} 
            onChange={(e) => setFiltroEmpleado(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white text-sm rounded-lg px-4 py-2 font-bold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="todos">Todos los empleados</option>
            {empleados.map(emp => (
              <option key={emp.id_usuario} value={emp.id_usuario}>{emp.nombre}</option>
            ))}
          </select>
        </div>

        {/* TABLA DE RESULTADOS */}
        {loading ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400 font-bold">Cargando registros...</div>
        ) : fichajesFiltrados.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse print:text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-700/50 print:bg-gray-100">
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest print:text-black">Fecha</th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest print:text-black">Empleado</th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest print:text-black text-center">Entrada</th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest print:text-black text-center">Salida</th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest print:text-black text-right">Horas Totales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700 print:divide-gray-300">
                {fichajesFiltrados.map((fichaje) => (
                  <tr key={fichaje.id_fichaje} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 text-sm font-bold text-gray-800 dark:text-gray-200 print:text-black">
                      {new Date(fichaje.hora_entrada).toLocaleDateString('es-ES')}
                    </td>
                    <td className="p-4 text-sm font-bold text-gray-800 dark:text-gray-200 print:text-black">
                      {fichaje.usuarios?.nombre || 'Usuario Desconocido'}
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800/50 print:border-none print:bg-transparent print:p-0 print:text-black">
                        {new Date(fichaje.hora_entrada).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {fichaje.hora_salida ? (
                        <span className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-mono text-xs font-bold px-2 py-1 rounded border border-red-200 dark:border-red-800/50 print:border-none print:bg-transparent print:p-0 print:text-black">
                          {new Date(fichaje.hora_salida).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500 italic">En Curso</span>
                      )}
                    </td>
                    <td className="p-4 text-right text-sm font-black text-blue-600 dark:text-blue-400 print:text-black">
                      {calcularDuracion(fichaje.hora_entrada, fichaje.hora_salida)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-4 text-gray-400 dark:text-gray-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">No hay registros</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">No se encontraron fichajes para los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </div>
  );
}