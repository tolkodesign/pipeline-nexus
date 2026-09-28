import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getNormalizedRole } from '../lib/identity';
import type { NormalizedRole } from '../lib/identity';

export function useUserRole() {
  const [role, setRole] = useState<NormalizedRole | string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setRole(null);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('role_id, internal_role') // Mantenemos pedir internal_role por retrocompatibilidad con componentes como Team.tsx que esperan un string capitalizado legacy temporalmente si es necesario, aunque aquí usaremos la fuente de verdad.
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        // FASE 2B: Usamos la nueva fuente de verdad basada única y exclusivamente en role_id.
        // Ojo: algunos componentes (como Team.tsx) esperan "Admin", y NORMALIZED_ROLES.ADMIN es "Admin".
        // Mapea perfectamente según el nuevo contrato.
        setRole(getNormalizedRole(data?.role_id));
      } catch (error) {
        console.error('Error sacando el rol:', error);
        setRole('Cliente'); // Fallback seguro
      } finally {
        setLoadingRole(false);
      }
    };

    fetchRole();
  }, []);

  return { role, loadingRole };
}