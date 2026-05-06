import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

// Importaciones de los componentes generados por shadcn
// (Asegúrate de que la ruta '@/components/ui/chart' coincide con tu alias en vite.config.ts)
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  ChartLegend, 
  ChartLegendContent 
} from '@/components/ui/chart';

export default function AdminEstadisticas() {
  const [loading, setLoading] = useState(true);
  
  const [dataSolicitudes, setDataSolicitudes] = useState<any[]>([]);
  const [dataFindes, setDataFindes] = useState<any[]>([]);
  const [dataSemana, setDataSemana] = useState<any[]>([]);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    setLoading(true);
    
    try {
      // 1. Obtener estado de solicitudes
      const { data: sols } = await supabase.from('solicitudes_libres').select('estado');
      if (sols) {
        const counts = sols.reduce((acc: any, curr: any) => {
          acc[curr.estado] = (acc[curr.estado] || 0) + 1;
          return acc;
        }, {});
        
        setDataSolicitudes([
          { estado: 'Aprobadas', cantidad: counts['aprobada'] || 0, fill: "var(--color-aprobadas)" },
          { estado: 'Pendientes', cantidad: counts['pendiente'] || 0, fill: "var(--color-pendientes)" },
          { estado: 'Rechazadas', cantidad: counts['rechazada'] || 0, fill: "var(--color-rechazadas)" },
        ]);
      }

      // 2. Obtener Top Empleados por Findes Trabajados
      const { data: users } = await supabase
        .from('usuarios')
        .select('nombre, findes_trabajados')
        .eq('rol', 'empleado')
        .order('findes_trabajados', { ascending: false })
        .limit(5);
        
      if (users) {
        setDataFindes(users.map(u => ({
          nombre: u.nombre.split(' ')[0], 
          findes: u.findes_trabajados || 0
        })));
      }

      // 3. Obtener turnos de esta semana para ver la carga
      const hoy = new Date();
      const lunes = new Date(hoy.setDate(hoy.getDate() - hoy.getDay() + 1)).toISOString().split('T')[0];
      const domingo = new Date(hoy.setDate(hoy.getDate() - hoy.getDay() + 7)).toISOString().split('T')[0];

      const { data: turnos } = await supabase
        .from('turnos')
        .select('fecha')
        .gte('fecha', lunes)
        .lte('fecha', domingo);

      if (turnos) {
        const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const conteoPorDia: any = { 'Lunes': 0, 'Martes': 0, 'Miércoles': 0, 'Jueves': 0, 'Viernes': 0, 'Sábado': 0, 'Domingo': 0 };
        
        turnos.forEach(t => {
          const diaIndex = new Date(t.fecha).getDay();
          const nombreDia = diaIndex === 0 ? 'Domingo' : diasSemana[diaIndex - 1];
          conteoPorDia[nombreDia]++;
        });

        setDataSemana(Object.keys(conteoPorDia).map(dia => ({
          dia,
          turnos: conteoPorDia[dia]
        })));
      }

    } catch (error) {
      console.error("Error cargando estadísticas", error);
    } finally {
      setLoading(false);
    }
  };

  // Configuraciones exclusivas de shadcn/ui para definir colores y etiquetas
  const chartConfigSolicitudes = {
    cantidad: { label: "Total Solicitudes" },
    aprobadas: { label: "Aprobadas", color: "#10b981" },
    pendientes: { label: "Pendientes", color: "#f59e0b" },
    rechazadas: { label: "Rechazadas", color: "#ef4444" },
  };

  const chartConfigFindes = {
    findes: { label: "Fines de semana", color: "#3b82f6" },
  };

  const chartConfigSemana = {
    turnos: { label: "Turnos Asignados", color: "#10b981" },
  };

  if (loading) {
    return <div className="p-8 text-center font-bold text-gray-500">Cargando métricas...</div>;
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors duration-300">
      
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-400">Estadísticas</h1>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">Analíticas y rendimiento de la plantilla</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GRÁFICO 1: Estado de las solicitudes (Pie) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Histórico de Solicitudes</h2>
          <ChartContainer config={chartConfigSolicitudes} className="min-h-[300px] w-full flex-1">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={dataSolicitudes}
                dataKey="cantidad"
                nameKey="estado"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                stroke="none"
              >
                {dataSolicitudes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent />} className="flex-wrap gap-2" />
            </PieChart>
          </ChartContainer>
        </div>

        {/* GRÁFICO 2: Top Empleados por Findes Trabajados (Barras) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Top Findes Trabajados</h2>
          <ChartContainer config={chartConfigFindes} className="min-h-[300px] w-full flex-1">
            <BarChart accessibilityLayer data={dataFindes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="nombre" 
                tickLine={false} 
                tickMargin={10} 
                axisLine={false} 
                tick={{ fontSize: 12 }} 
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar 
                dataKey="findes" 
                fill="var(--color-findes)" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={50} 
              />
            </BarChart>
          </ChartContainer>
        </div>

        {/* GRÁFICO 3: Carga de turnos de la semana (Línea) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col lg:col-span-2">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Carga de Turnos (Semana Actual)</h2>
          <ChartContainer config={chartConfigSemana} className="min-h-[300px] w-full flex-1">
            <LineChart accessibilityLayer data={dataSemana} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="dia" 
                tickLine={false} 
                tickMargin={10} 
                axisLine={false} 
                tick={{ fontSize: 12 }} 
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="turnos" 
                stroke="var(--color-turnos)" 
                strokeWidth={4}
                dot={{ r: 6, fill: 'var(--color-turnos)', strokeWidth: 2, stroke: 'var(--background)' }} 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ChartContainer>
        </div>

      </div>
    </div>
  );
}