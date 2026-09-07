// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Estos datos los sacas de Project Settings > API en tu dashboard de Supabase
// Ponlos en un archivo .env en la raíz de tu proyecto
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);