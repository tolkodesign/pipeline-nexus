import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Specialty {
  id: number;
  name: string;
}

export function useSpecialties() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpecialties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('specialties')
        .select('id, name')
        .order('id', { ascending: true });

      if (error) {
        throw error;
      }

      setSpecialties(data || []);
    } catch (err: any) {
      console.error('Error fetching specialties:', err);
      setError(err.message || 'Error loading specialties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const getSpecialtyById = useCallback((id: number) => {
    return specialties.find(s => s.id === id);
  }, [specialties]);

  const getSpecialtyByName = (name: string) => {
    return specialties.find(s => s.name.toLowerCase() === name.toLowerCase());
  };

  const resolveSpecialtyName = useCallback((specId?: number, fallbackStr?: string): string => {
    if (specId) {
      const s = getSpecialtyById(specId);
      if (s) return s.name;
    }
    if (fallbackStr) {
      const lowerStr = fallbackStr.toLowerCase();
      // Casos comunes de legacy
      if (lowerStr.includes('rp') || lowerStr.includes('relaciones')) {
         const s = specialties.find(x => x.name.toLowerCase().includes('rp'));
         if (s) return s.name;
      }
      if (lowerStr.includes('contenid') || lowerStr.includes('copy')) {
         const s = specialties.find(x => x.name.toLowerCase().includes('contenid') || x.name.toLowerCase().includes('copy'));
         if (s) return s.name;
      }
      if (lowerStr.includes('programaci') || lowerStr.includes('desarrollo')) {
         const s = specialties.find(x => x.name.toLowerCase().includes('programaci') || x.name.toLowerCase().includes('desarrollo'));
         if (s) return s.name;
      }
      if (lowerStr.includes('diseñ') || lowerStr.includes('arte')) {
         const s = specialties.find(x => x.name.toLowerCase().includes('diseñ') || x.name.toLowerCase().includes('arte'));
         if (s) return s.name;
      }
      
      const s = specialties.find(x => x.name.toLowerCase().includes(lowerStr));
      if (s) return s.name;
      
      return fallbackStr; // Si de plano no existe, regresamos el string legacy
    }
    return 'General';
  }, [specialties, getSpecialtyById]);

  const getActiveSpecialtiesFromRequest = (req: any): number[] => {
    let ids: number[] = [];
    if (req.specialty_ids && req.specialty_ids.length > 0) {
       ids = [...req.specialty_ids];
    } else {
       if (req.needs_design) { const s = specialties.find((x: any) => x.name.toLowerCase().includes('dise')); if (s) ids.push(s.id); }
       if (req.needs_dev) { const s = specialties.find((x: any) => x.name.toLowerCase().includes('programaci')); if (s) ids.push(s.id); }
       if (req.needs_av) { const s = specialties.find((x: any) => x.name.toLowerCase().includes('audiovisual')); if (s) ids.push(s.id); }
       if (req.needs_copy) { const s = specialties.find((x: any) => x.name.toLowerCase().includes('contenid') || x.name.toLowerCase().includes('copy')); if (s) ids.push(s.id); }
       if (req.needs_prod) { const s = specialties.find((x: any) => x.name.toLowerCase().includes('producci')); if (s) ids.push(s.id); }
       if (req.needs_staff) { const s = specialties.find((x: any) => x.name.toLowerCase().includes('staff')); if (s) ids.push(s.id); }
       if (req.needs_rp) { const s = specialties.find((x: any) => x.name.toLowerCase().includes('rp') || x.name.toLowerCase().includes('relaciones')); if (s) ids.push(s.id); }
    }
    return Array.from(new Set(ids));
  };

  return { 
    specialties, 
    loading, 
    error, 
    getSpecialtyById, 
    getSpecialtyByName, 
    resolveSpecialtyName,
    getActiveSpecialtiesFromRequest,
    refetch: fetchSpecialties
  };
}
