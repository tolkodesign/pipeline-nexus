import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getNormalizedRole } from '../lib/identity';

const AuthContext = createContext<any>({});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Ver si hay una sesión activa al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    // 2. Escuchar cambios (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (id: string) => {
    // 🔥 AQUÍ ESTÁ LA MAGIA: Traemos los datos cruzados con las nuevas tablas
    const { data } = await supabase
      .from('profiles')
      .select('*, specialties(name), internal_roles(name)')
      .eq('id', id)
      .single();

    if (data) {
      // 🔪 MATAMOS LOS CAMPOS VIEJOS DE TEXTO:
      // Sobrescribimos a huevo con lo que viene de las tablas relacionales.
      // Si por alguna razón no tiene área, dirá 'General' y listo.
      data.specialty = data.specialties?.name || 'General';
      
      // FASE 2B: Mantenemos internal_role por compatibilidad legacy si existe en relacional o propio,
      // pero NUNCA forzamos un cliente a ser Colaborador.
      data.internal_role = data.internal_roles?.name || data.internal_role || null;
      
      // FASE 2B: Nueva fuente de verdad normalizada
      data.normalized_role = getNormalizedRole(data.role_id);
    }

    setProfile(data);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);