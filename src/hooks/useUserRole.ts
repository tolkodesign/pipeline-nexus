import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// 🔥 DICCIONARIO INFALIBLE PARA TRADUCIR EL ID NUMÉRICO
const ROLES_MAP: Record<number, string> = {
  1: 'Reviewer', // O Colaborador
  2: 'Lider',
  3: 'Admin',
  4: 'Coordinador',
  5: 'Ejecutivo de Comunicación'
};

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        // 1. Vemos quién carajos está logueado en Supabase Auth
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setRole(null);
          return;
        }

        // 2. 🔥 CORRECCIÓN: Pedimos el role_id numérico (y el viejo por si las moscas)
        const { data, error } = await supabase
          .from('profiles')
          .select('role_id, internal_role')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        // 3. 🔥 TRADUCCIÓN MÁGICA: Le damos prioridad al número, si no existe usa el texto viejo, si no, es Lector.
        const mappedRole = data?.role_id ? ROLES_MAP[data.role_id] : data?.internal_role;
        
        setRole(mappedRole || 'Lector');
      } catch (error) {
        console.error('Error sacando el rol:', error);
        setRole('Lector');
      } finally {
        setLoadingRole(false);
      }
    };

    fetchRole();
  }, []);

  return { role, loadingRole };
}