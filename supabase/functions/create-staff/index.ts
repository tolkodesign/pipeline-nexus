import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password, name, phone, role } = await req.json()
    console.log(`[CHISME] Intentando registrar a: ${email}`);

    let projectUrl = Deno.env.get('SUPABASE_URL') ?? Deno.env.get('PROJECT_URL') ?? '';
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY') ?? '';

    if (projectUrl.includes('127.0.0.1') || projectUrl.includes('localhost')) {
      projectUrl = 'http://kong:8000';
    }

    console.log("PROJECT_URL used: ", projectUrl);

    // Validamos si le llegaron las contraseñas
    if (!projectUrl || !serviceKey) {
        console.error("[ERROR] Faltan los secretos PROJECT_URL o SERVICE_ROLE_KEY");
        throw new Error("Variables de entorno no configuradas.");
    }

    const supabaseAdmin = createClient(projectUrl, serviceKey)

    // 1. Crear en Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { full_name: name }
    })

    if (authError) {
        console.error("[ERROR EN AUTH]:", authError.message);
        throw authError;
    }

    const userId = authData.user.id
    console.log(`[CHISME] Usuario creado en Auth con ID: ${userId}`);

    // 2. Crear en Profiles
    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
      id: userId,
      full_name: name,
      phone: phone || null,
      internal_role: role
    })

    if (profileError) {
        console.error("[ERROR EN PROFILES]:", profileError.message);
        throw profileError;
    }

    console.log("[CHISME] ¡Todo un éxito!");
    return new Response(JSON.stringify({ user_id: userId }), { 
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })

  } catch (error: any) {
    console.error("[ERROR FATAL]:", error.message);
    return new Response(JSON.stringify({ error: error.message || String(error) }), { 
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})