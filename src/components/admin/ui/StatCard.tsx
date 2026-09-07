import type { ReactNode } from 'react';
import { Skeleton } from '../ui/Skeleton'; // 🔥 IMPORTACIÓN DEL SKELETON

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  onClick?: () => void; 
  loading?: boolean; // 🔥 NUEVA PROP
}

export default function StatCard({ label, value, icon, color = 'border-gray-200 dark:border-luxury-border', onClick, loading }: StatCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`p-6 rounded-2xl border flex flex-col justify-between h-32 bg-white dark:bg-luxury-card shadow-sm dark:shadow-none transition-all duration-300 ${color} ${
        onClick ? 'cursor-pointer hover:border-luxury-red/40 dark:hover:border-luxury-red/40 hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(211,0,45,0.05)] active:scale-[0.98]' : ''
      }`}
    >
      
      <div className="flex justify-between items-start pointer-events-none">
        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest transition-colors duration-300">
          {label}
        </p>
        <div className="text-gray-400 dark:text-gray-600 transition-colors duration-300">
          {icon}
        </div>
      </div>

      <div className="pointer-events-none">
        {/* 🔥 RENDERIZADO CONDICIONAL DEL SKELETON */}
        {loading ? (
          <Skeleton className="h-8 w-20 rounded-lg mt-1" />
        ) : (
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight transition-colors duration-300">
            {value}
          </h2>
        )}
      </div>

    </div>
  );
}