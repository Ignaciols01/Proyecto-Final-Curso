import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Usuario {
  id_usuario: string;
  email: string;
  rol: string;
}

export default function Empleados() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [empleados, setEmpleados] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('empleado');

  const fetchEmpleados = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('usuarios')
      .select('*');

    if (error) {
      console.error('Error al descargar empleados:', error.message);
    } else {
      setEmpleados(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('usuarios')
      .insert([{ email, password: 'passwordTemporal123', rol }]);

    if (error) {
      alert('Hubo un error al guardar: ' + error.message);
    } else {
      fetchEmpleados();
      setNombre('');
      setEmail('');
      setIsModalOpen(false);
    }
  };

  // NUEVA FUNCIÓN: Eliminar empleado de la base de datos
  const eliminarEmpleado = async (id: string, email: string) => {
    const confirmar = window.confirm(`¿Estás seguro de que quieres eliminar a ${email}? Esta acción no se puede deshacer.`);
    
    if (confirmar) {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id_usuario', id); // Filtramos por el ID específico

      if (error) {
        alert('Error al eliminar: ' + error.message);
      } else {
        // Refrescamos la lista localmente para que desaparezca de la tabla
        setEmpleados(empleados.filter(emp => emp.id_usuario !== id));
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto transition-colors duration-300">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-400">Plantilla de Empleados</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">Gestiona los datos y accesos de tu equipo de trabajo</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors w-full md:w-auto cursor-pointer"
        >
          + NUEVO EMPLEADO
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-700 text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold">
                <th className="p-4">Correo Electrónico</th>
                <th className="p-4">Rol / Puesto</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {empleados.map((emp) => (
                <tr key={emp.id_usuario} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                        {emp.email.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{emp.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${emp.rol === 'administrador' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                      {emp.rol}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="flex items-center justify-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Activo</span>
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {/* BOTÓN DE ELIMINAR AHORA FUNCIONAL */}
                    <button 
                      onClick={() => eliminarEmpleado(emp.id_usuario, emp.email)}
                      className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1 cursor-pointer"
                      title="Eliminar Empleado"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && empleados.length === 0 && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-4 border border-blue-100 dark:border-slate-600">
              <svg className="w-8 h-8 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">No hay empleados registrados</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">La base de datos está limpia. Haz clic en "+ Nuevo Empleado" para empezar.</p>
          </div>
        )}

        {loading && <div className="p-12 text-center text-blue-600 font-bold italic animate-pulse transition-colors duration-300">Consultando base de datos de RosterApp...</div>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in border border-gray-100 dark:border-slate-700">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-extrabold text-gray-800 dark:text-white">Añadir Empleado</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Nombre Completo (Solo Visual)</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Ignacio" required className="w-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Correo Electrónico</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="empleado@empresa.com" required className="w-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Rol / Puesto</label>
                <select value={rol} onChange={(e) => setRol(e.target.value)} className="w-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                  <option value="empleado">Empleado Base</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
              <div className="pt-4 flex items-center justify-end space-x-3">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl shadow-sm transition-colors cursor-pointer">Guardar Empleado</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}