import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { startMonth, endMonth, organization_name } = await req.json().catch(() => ({}));
    
    // 1. Validamos de qué empresa vienen a pedir datos
    const orgName = (organization_name || "").toUpperCase();
    
    let API_KEY = "";
    let PREFIX = "";
    let AUDIENCE_ID = "";

    // 2. Ruteador Dinámico de Credenciales
    if (orgName.includes('NOVO NORDISK')) {
      API_KEY = Deno.env.get('MAILCHIMP_API_KEY') || "";
      PREFIX = Deno.env.get('MAILCHIMP_SERVER_PREFIX') || "";
      AUDIENCE_ID = Deno.env.get('MAILCHIMP_AUDIENCE_ID') || "";
    } else if (orgName) {
      // Para otras empresas como BIOPAPEL busca variables: MAILCHIMP_API_KEY_BIOPAPEL
      const safeName = orgName.split(" ")[0]; // Agarra solo la primer palabra
      API_KEY = Deno.env.get(`MAILCHIMP_API_KEY_${safeName}`) || "";
      PREFIX = Deno.env.get(`MAILCHIMP_SERVER_PREFIX_${safeName}`) || "";
      AUDIENCE_ID = Deno.env.get(`MAILCHIMP_AUDIENCE_ID_${safeName}`) || "";
    }

    // 3. Sistema Anti-fugas: Si no encontró credenciales de ESA marca, frena en seco.
    if (!API_KEY || !PREFIX || !AUDIENCE_ID) {
       return new Response(
        JSON.stringify({ 
          success: true, 
          metrics: { totalCampaignsAnalized: 0, totalEmailsSent: 0, openRate: "0.0", clickRate: "0.0" },
          campaigns: [] 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // 4. Conexión segura a Mailchimp con la llave dinámica
    let url = `https://${PREFIX}.api.mailchimp.com/3.0/reports?list_id=${AUDIENCE_ID}&count=100`;

    if (startMonth) {
      const startDate = new Date(`${startMonth}-01T00:00:00Z`);
      url += `&since_send_time=${startDate.toISOString()}`;
    }
    if (endMonth) {
      const endDate = new Date(`${endMonth}-01T00:00:00Z`);
      endDate.setMonth(endDate.getMonth() + 1);
      url += `&before_send_time=${endDate.toISOString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' }
    });

    const data = await response.json();

    let totalSent = 0; 
    let totalUniqueOpens = 0; 
    let totalUniqueClicks = 0;
    let validCampaignsCount = 0;
    
    const detailedCampaigns = (data.reports || []).map((rep: any) => {
      const emailsSent = rep.emails_sent || 0;
      const totalBounces = (rep.bounces?.hard_bounces || 0) + (rep.bounces?.soft_bounces || 0);
      const deliveries = Math.max(0, emailsSent - totalBounces);
      
      const totalOpens = rep.opens?.opens_total || 0;
      const uniqueOpens = rep.opens?.unique_opens || 0;
      const totalClicks = rep.clicks?.clicks_total || 0;
      const uniqueClicks = rep.clicks?.unique_clicks || 0;

      const openRateDecimal = rep.opens?.open_rate || 0;
      const exactOpenRateStr = (openRateDecimal * 100).toFixed(1);

      const clickRateDecimal = rep.clicks?.click_rate || 0;
      const exactClickRateStr = (clickRateDecimal * 100).toFixed(1);

      if (emailsSent > 5) {
          totalSent += deliveries;
          totalUniqueOpens += uniqueOpens; 
          totalUniqueClicks += uniqueClicks; 
          validCampaignsCount++;
      }

      return {
        id: rep.id,
        title: rep.campaign_title || rep.subject_line || 'Sin Título',
        subject: rep.subject_line || '',
        sendTime: rep.send_time,
        emailsSent: emailsSent,
        deliveries: deliveries, 
        uniqueOpens: uniqueOpens,
        uniqueClicks: uniqueClicks,
        totalOpens: totalOpens,
        totalClicks: totalClicks,
        openRate: exactOpenRateStr,
        clickRate: exactClickRateStr
      };
    });

    const avgOpenRate = totalSent > 0 ? ((totalUniqueOpens / totalSent) * 100).toFixed(1) : "0.0";
    const avgClickRate = totalSent > 0 ? ((totalUniqueClicks / totalSent) * 100).toFixed(1) : "0.0";

    return new Response(
      JSON.stringify({ 
        success: true, 
        metrics: {
            totalCampaignsAnalized: validCampaignsCount,
            totalEmailsSent: totalSent,
            openRate: avgOpenRate,
            clickRate: avgClickRate
        },
        campaigns: detailedCampaigns
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 })
  }
})