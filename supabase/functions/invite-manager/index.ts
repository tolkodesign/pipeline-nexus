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
    const { email, password, fullName, organizationId, role } = await req.json()

    let supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (supabaseUrl.includes('127.0.0.1') || supabaseUrl.includes('localhost')) {
      supabaseUrl = 'http://kong:8000';
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    })

    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), { 
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    await supabaseAdmin.from('profiles').insert([{ id: authUser.user.id, full_name: fullName, email, is_admin: false }])
    await supabaseAdmin.from('organization_members').insert([{ organization_id: organizationId, profile_id: authUser.user.id, role_in_org: role }])

    return new Response(JSON.stringify({ message: 'Usuario creado y vinculado' }), { 
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})