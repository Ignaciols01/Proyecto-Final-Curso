
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function EmployeeLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 font-sans flex flex-col">
      <header className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-100 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            <div className="flex-shrink-0 flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">RosterApp</h1>
              </div>

              <nav className="hidden sm:flex items-center gap-1 ml-8 border-l border-gray-200 pl-8">
                <NavLink to="/empleado/turnos" className={({ isActive }) => `px-5 py-2 rounded-xl text-sm font-bold transition-all group ${isActive ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-md' : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50'}`}>
                  Mis Turnos
                </NavLink>
                <NavLink to="/empleado/fichaje" className={({ isActive }) => `px-5 py-2 rounded-xl text-sm font-bold transition-all group ${isActive ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-md' : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50'}`}>
                  Fichar
                </NavLink>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-gray-900">Hola, Empleado</p>
                <p className="text-xs text-gray-500 font-medium">Mi Panel</p>
              </div>
              <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 rounded-xl transition-all shadow-sm hover:shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}