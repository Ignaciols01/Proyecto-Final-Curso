
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-sans overflow-hidden">
      <aside className="w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-100 flex flex-col justify-between z-10 shadow-lg flex-shrink-0">
        <div>
          <div className="h-20 flex items-center px-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">RosterApp</h1>
          </div>
          <nav className="p-4 space-y-2 mt-6">
            <NavLink to="/admin/dashboard" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm group ${isActive ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-md' : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Calendario
            </NavLink>
            <NavLink to="/admin/empleados" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm group ${isActive ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-md' : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              Empleados
            </NavLink>
            <NavLink to="/admin/informes" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm group ${isActive ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-md' : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Informes
            </NavLink>
            <NavLink to="/admin/configuracion" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm group ${isActive ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-md' : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Configuración
            </NavLink>
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gradient-to-t from-blue-50 to-transparent">
          <div className="flex items-center gap-3 px-3 py-3 mb-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md">
              AD
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs text-gray-500 font-bold uppercase">Conectado como</p>
              <p className="text-sm font-bold text-gray-900 truncate">Admin Gerencia</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-sm font-bold text-gray-600 py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:text-red-600 rounded-xl transition-all shadow-sm hover:shadow-md">
            CERRAR SESIÓN
          </button>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-gradient-to-br from-white via-slate-50 to-blue-50">
        <Outlet />
      </main>
    </div>
  );
}