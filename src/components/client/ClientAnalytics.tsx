import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, LabelList } from 'recharts';
import { Activity, PieChart as PieIcon, Trophy, TrendingUp, Building2 } from 'lucide-react';
import { Skeleton } from '../admin/ui/Skeleton'; // 🔥 IMPORTACIÓN DEL SKELETON

interface Props {
  monthlyData: any[];
  disciplineData: any[];
  deliverableData: any[]; 
  clientData?: any[];
  loading?: boolean; // 🔥 NUEVA PROP
}

const AREA_COLORS: Record<string, string> = {
  'Contenido': '#f9a8d4',      
  'Diseño': '#3b82f6',         
  'Audiovisual': '#10b981',    
  'Programación': '#f59e0b',   
  'RP': '#8b5cf6',             
  'Producción': '#ec4899',     
  'Staff': '#06b6d4'          
};

export default function ClientAnalytics({ monthlyData, disciplineData, deliverableData, clientData = [], loading }: Props) {
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border p-3 rounded-xl shadow-xl transition-colors duration-300">
          <p className="text-gray-500 dark:text-gray-400 text-[9px] uppercase font-black tracking-widest mb-0.5">
            {payload[0].name}
          </p>
          <p className="font-black text-lg flex items-baseline gap-1" style={{ color: 'var(--color-luxury-red)' }}>
            {payload[0].value} <span className="text-xs text-gray-900 dark:text-white font-medium">pedidos</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const maxRequests = clientData.length > 0 ? Math.max(...clientData.map(c => c.total)) : 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full min-w-0">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full min-w-0">
        
        {/* 📊 Gráfica 1: Ritmo Mensual */}
        <div className="lg:col-span-2 bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border shadow-sm dark:shadow-none rounded-2xl p-4 md:p-6 h-[320px] flex flex-col relative transition-colors duration-300 min-w-0">
          <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 pointer-events-none text-gray-900 dark:text-white transition-colors">
            <TrendingUp size={80} />
          </div>
          
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
            <Activity size={14} className="text-luxury-red shrink-0"/> Ritmo Mensual de Solicitudes
          </h3>
          
          <div className="flex-1 w-full z-10 min-w-0">
            {/* 🔥 SKELETON DE GRÁFICA */}
            {loading ? (
              <Skeleton className="w-full h-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 15, right: 0, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="none" tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                  <YAxis stroke="none" tick={{ fill: '#9ca3af', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-luxury-red)', opacity: 0.05 }} />
                  
                  <Bar dataKey="solicitudes" radius={[6, 6, 0, 0]} fill="var(--color-luxury-red)" maxBarSize={40}>
                    <LabelList dataKey="solicitudes" position="top" fill="#9ca3af" fontSize={11} fontWeight="bold" offset={6} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 📊 Gráfica 2: Distribución por Disciplinas */}
        <div className="lg:col-span-1 bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border shadow-sm dark:shadow-none rounded-2xl p-4 md:p-6 h-[320px] flex flex-col transition-colors duration-300 min-w-0">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
            <PieIcon size={14} className="text-luxury-red shrink-0"/> Áreas Solicitadas
          </h3>
          
          <div className="flex-1 w-full min-w-0">
            {/* 🔥 SKELETON DE PIE CHART */}
            {loading ? (
              <div className="h-full flex items-center justify-center">
                 <Skeleton className="w-40 h-40 rounded-full" />
              </div>
            ) : disciplineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={disciplineData} 
                    cx="50%" 
                    cy="40%" 
                    innerRadius={45} 
                    outerRadius={65} 
                    paddingAngle={4} 
                    dataKey="value" 
                    stroke="none"
                  >
                    {disciplineData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={AREA_COLORS[entry.name] || '#9ca3af'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={40} 
                    iconType="circle" 
                    wrapperStyle={{ fontSize: '11px', color: '#9ca3af', fontWeight: 'bold' }}
                    formatter={(value, entry: any) => (
                      <span className="text-gray-700 dark:text-gray-300">
                        {value}: <span className="text-luxury-red font-black">{entry.payload.value}</span>
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-gray-400 dark:text-gray-500 font-medium italic">
                Sin datos operativos registrados...
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0">
        
        {/* 📊 Gráfica 3: TOP ENTREGABLES */}
        {(loading || deliverableData.length > 0) && (
          <div className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border shadow-sm dark:shadow-none rounded-2xl p-4 md:p-6 h-[400px] flex flex-col transition-colors duration-300 w-full min-w-0">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
              <Trophy size={14} className="text-luxury-red shrink-0"/> Top Entregables
            </h3>
            
            <div className="flex-1 w-full min-w-0">
              {loading ? (
                <Skeleton className="w-full h-full rounded-xl" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deliverableData} layout="vertical" margin={{ top: 0, right: 35, left: -20, bottom: 0 }}>
                    <XAxis type="number" stroke="none" hide/>
                    <YAxis dataKey="name" type="category" stroke="none" tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 'bold' }} width={120} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-luxury-red)', opacity: 0.03 }} />
                    
                    <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={20}>
                      <LabelList dataKey="total" position="right" fill="#9ca3af" fontSize={11} fontWeight="bold" offset={10} />
                      {deliverableData.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill="var(--color-luxury-red)" 
                          fillOpacity={1 - (index * 0.15)} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {/* 📊 Gráfica 4: SOLICITUDES POR CUENTA */}
        {(loading || (clientData && clientData.length > 0)) && (
          <div className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border shadow-sm dark:shadow-none rounded-2xl p-4 md:p-6 h-[400px] flex flex-col transition-colors duration-300 w-full min-w-0">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
              <Building2 size={14} className="text-luxury-red shrink-0"/> Solicitudes por Cuenta
            </h3>
            
            <div className="flex-1 w-full min-w-0 flex flex-col justify-between py-2">
              {loading ? (
                // SKELETONS PARA LAS BARRAS DE CLIENTES
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 py-2">
                     <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                     <div className="flex flex-col gap-2 flex-1">
                       <Skeleton className="h-4 w-1/3 rounded-md" />
                       <Skeleton className="h-3 w-1/4 rounded-md" />
                     </div>
                     <Skeleton className="h-2 w-24 rounded-full" />
                  </div>
                ))
              ) : (
                clientData.map((client, i) => {
                  const barWidthPercentage = Math.round((client.total / maxRequests) * 100);
                  return (
                    <div key={i} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img 
                          src={client.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=1E1E24&color=D3002D`} 
                          alt={client.name} 
                          className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-white/10 shrink-0 bg-white"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-black text-gray-900 dark:text-white truncate">{client.name}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{client.total} Solicitudes</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 w-28 md:w-36">
                        <div className="flex-1 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-1000" 
                            style={{ width: `${barWidthPercentage}%`, backgroundColor: 'var(--color-luxury-red)' }}
                          />
                        </div>
                        <span className="text-xs font-black text-gray-900 dark:text-white w-6 text-right">{client.total}</span>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}