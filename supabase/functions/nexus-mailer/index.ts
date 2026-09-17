import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "npm:resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  try {
    const payload = await req.json();
    const { type, table, record, old_record } = payload;

    console.log(`🔥 [WEBHOOK RECIBIDO] - Tabla: ${table} | Tipo: ${type} | ID: ${record?.id}`);

    let supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    // 🔥 AQUÍ DEFINIMOS LA URL DE TU FRONTEND (Configúrala en los Secrets de Supabase)
    const frontendUrl = Deno.env.get("FRONTEND_URL") || "https://pipeline.tolkogroup.com";

    if (supabaseUrl.includes("127.0.0.1") || supabaseUrl.includes("localhost")) {
      supabaseUrl = "http://kong:8000";
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    // -------------------------------------------------------------
    // TRIGGER 1: NUEVA SOLICITUD (INSERT)
    // -------------------------------------------------------------
    if (table === "requests" && type === "INSERT") {
      console.log("📝 Procesando nueva solicitud para darle formato VIP...");
      
      const orgId = record.organization_id;
      const ticketTitle = record.title;
      const requesterId = record.requester_id;
      const ccEmailsString = record.cc_emails;
      
      // 🕵️‍♂️ CONSULTA A BASE DE DATOS
      const [orgResult, requesterResult, projectResult, priorityResult, deliverableResult] = await Promise.all([
        supabaseAdmin.from("organizations").select("name, distribution_email").eq("id", orgId).single(),
        supabaseAdmin.from("profiles").select("full_name, email").eq("id", requesterId).single(),
        supabaseAdmin.from("projects").select("name").eq("id", record.project_id).single(),
        supabaseAdmin.from("priorities").select("level").eq("id", record.priority_id).single(),
        record.organization_deliverable_id 
          ? supabaseAdmin.from("organization_deliverables").select("name").eq("id", record.organization_deliverable_id).single() 
          : Promise.resolve({ data: null })
      ]);

      if (orgResult.error || !orgResult.data) {
        console.error("🛑 Error: Organización no encontrada en la BD.");
        throw new Error("Organización no encontrada");
      }

      // Desempaquetamos la info
      const clientName = orgResult.data.name;
      const distroEmail = orgResult.data.distribution_email; 
      const requesterName = requesterResult.data?.full_name || "Usuario Tolko";
      const requesterEmail = requesterResult.data?.email;
      const projectName = projectResult.data?.name || "Sin Proyecto";
      const priorityLevel = priorityResult.data?.level || "Normal";
      const deliverableName = deliverableResult.data?.name || "Entregable Genérico";

      // 📅 FORMATO DE DEADLINE (DÍA, MES Y AÑO EN ESPAÑOL)
      let formattedDueDate = "Sin fecha asignada";
      if (record.due_date) {
        const [year, month, day] = record.due_date.split("-");
        const monthNames = [
          "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
          "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        if (year && month && day) {
          const monthIndex = parseInt(month, 10) - 1;
          formattedDueDate = `${day} de ${monthNames[monthIndex]} de ${year}`;
        }
      }

      // 🎨 MAPEADO DE ÁREAS REQUERIDAS (DINÁMICO)
      const requiredAreasList: string[] = [];
      if (record.needs_dev) requiredAreasList.push("Plataformas Digitales");
      if (record.needs_copy) requiredAreasList.push("Contenido");
      if (record.needs_design) requiredAreasList.push("Diseño");
      if (record.needs_av) requiredAreasList.push("Audiovisual");
      if (record.needs_prod) requiredAreasList.push("Producción");
      if (record.needs_staff) requiredAreasList.push("Staff");
      if (record.needs_rp) requiredAreasList.push("Relaciones Públicas");

      if (record.specialty_ids && Array.isArray(record.specialty_ids) && record.specialty_ids.length > 0) {
        const { data: specs } = await supabaseAdmin
          .from('specialties')
          .select('name')
          .in('id', record.specialty_ids);
          
        if (specs) {
          specs.forEach((s: any) => {
            const name = s.name.trim();
            const mappedName = name.toLowerCase().includes('programac') ? 'Plataformas Digitales' : name;
            if (!requiredAreasList.includes(mappedName)) {
              requiredAreasList.push(mappedName);
            }
          });
        }
      }

      const areasNeededString = requiredAreasList.length > 0 
        ? requiredAreasList.join(", ") 
        : "General";

      const requestDate = new Date().toLocaleString('es-MX', { 
        timeZone: 'America/Mexico_City',
        dateStyle: 'full', 
        timeStyle: 'short' 
      });

      console.log(`🏢 Organización: ${clientName} | 📧 Correo Destino (Base): ${distroEmail}`);

      const mainRecipient = distroEmail || requesterEmail;
      
      if (!mainRecipient) {
        console.log(`⚠️ ABORTANDO ENVÍO: No hay destinatario principal válido.`);
        return new Response(JSON.stringify({ message: "Sin destinatario principal" }), { status: 200 });
      }

      // MODO SILENCIOSO / COPIAS
      let ccList: string[] = [];

      if (ccEmailsString) {
        const extraMails = ccEmailsString.split(',').map((m: string) => m.trim()).filter((m: string) => m);
        ccList = [...ccList, ...extraMails];
      }

      if (record.send_email_notification === false) {
        console.log("🤫 MODO SILENCIOSO ACTIVO: El cliente no recibirá notificación.");
      } else {
        console.log("🔊 MODO NORMAL: Se avisará a todos.");
        if (requesterEmail) ccList.push(requesterEmail);
      }

      ccList = [...new Set(ccList)].filter(email => email !== mainRecipient);
      
      console.log(`👥 Correos en copia (CC):`, ccList);
      console.log(`🚀 Enviando correo de lujo a Resend a ${mainRecipient}...`);
      
      // 🔥 CONSTRUIMOS EL LINK DIRECTO AL TICKET
      const directTicketUrl = `${frontendUrl}/dashboard?ticket=${record.id}`;

      // 🎨 DISEÑO HTML ACTUALIZADO
      const htmlTemplate = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 650px; margin: auto; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
          
          <div style="background-color: #E3002D; padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-weight: 900; letter-spacing: 3px; font-size: 24px; text-transform: uppercase;">PIPELINE TOLKO</h1>
            <p style="color: #ffffff; opacity: 0.8; margin: 5px 0 0 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Mesa de Control y Contenido</p>
          </div>
          
          <div style="padding: 40px 30px; color: #1F2937;">
            <p style="font-size: 16px; margin-top: 0;">Hola equipo,</p>
            <p style="font-size: 15px; line-height: 1.6; color: #4B5563;">
              Se ha ingresado una nueva solicitud de materiales por parte de <strong>${requesterName}</strong> para la cuenta <strong>${clientName}</strong>. 
              A continuación, se detallan las especificaciones del ticket:
            </p>
            
            <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; line-height: 1.8;">
                <tr>
                  <td width="35%" style="color: #6B7280; font-weight: bold; padding-bottom: 8px;">📋 Solicitud:</td>
                  <td width="65%" style="color: #111827; font-weight: bold; padding-bottom: 8px;">${ticketTitle}</td>
                </tr>
                <tr>
                  <td style="color: #6B7280; font-weight: bold; padding-bottom: 8px;">💼 Proyecto:</td>
                  <td style="color: #111827; padding-bottom: 8px;">${projectName}</td>
                </tr>
                <tr>
                  <td style="color: #6B7280; font-weight: bold; padding-bottom: 8px;">📦 Entregable:</td>
                  <td style="color: #111827; padding-bottom: 8px;">${deliverableName} <span style="color: #9CA3AF;">(x${record.quantity})</span></td>
                </tr>
                <tr>
                  <td style="color: #6B7280; font-weight: bold; padding-bottom: 8px;">⚡ Prioridad:</td>
                  <td style="padding-bottom: 8px;">
                    <span style="background-color: #FEE2E2; color: #B91C1C; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase;">${priorityLevel}</span>
                  </td>
                </tr>
                <tr>
                  <td style="color: #6B7280; font-weight: bold; padding-bottom: 8px;">📅 Deadline:</td>
                  <td style="color: #111827; font-weight: bold; padding-bottom: 8px;">${formattedDueDate}</td>
                </tr>
                <tr>
                  <td style="color: #6B7280; font-weight: bold; padding-bottom: 8px;">🕒 Ingresado el:</td>
                  <td style="color: #111827; padding-bottom: 8px;">${requestDate}</td>
                </tr>
                <tr>
                  <td style="color: #6B7280; font-weight: bold; padding-top: 8px; border-top: 1px dashed #E5E7EB;">🛠️ Áreas requeridas:</td>
                  <td style="color: #D3002D; font-weight: bold; padding-top: 8px; border-top: 1px dashed #E5E7EB;">${areasNeededString}</td>
                </tr>
              </table>
            </div>

            <h3 style="color: #D3002D; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #E5E7EB; padding-bottom: 8px; margin-bottom: 15px;">Descripción / Brief Detallado</h3>
            <p style="font-size: 14px; color: #374151; line-height: 1.6; background-color: #F3F4F6; padding: 15px; border-radius: 6px; white-space: pre-wrap;">${record.description}</p>
            
            ${record.external_resource_url ? `
            <div style="margin-top: 25px;">
              <span style="color: #6B7280; font-weight: bold; font-size: 14px;">🔗 Enlace de referencia adjunto:</span><br/>
              <a href="${record.external_resource_url}" style="color: #2563EB; font-size: 14px; word-break: break-all;">${record.external_resource_url}</a>
            </div>
            ` : ''}

            ${ccEmailsString ? `
            <div style="margin-top: 30px; font-size: 12px; color: #9CA3AF; border-top: 1px dashed #E5E7EB; padding-top: 15px;">
              <strong>Personas copiadas en este ticket:</strong> ${ccEmailsString}
            </div>
            ` : ''}

            <!-- 🔥 BOTÓN DE LLAMADO A LA ACCIÓN (CTA) -->
            <div style="margin: 40px 0 20px 0; text-align: center;">
              <a href="${directTicketUrl}" target="_blank" style="background-color: #D3002D; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; display: inline-block; box-shadow: 0 4px 6px rgba(211, 0, 45, 0.25);">
                VER SOLICITUD EN PLATAFORMA
              </a>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
              <p style="font-size: 14px; color: #6B7280; line-height: 1.5; margin: 0;">
                Nuestra mesa de control operativo revisará esta solicitud en breve para asignarla a los especialistas correspondientes. 
              </p>
              <p style="font-size: 14px; color: #111827; font-weight: bold; margin-top: 15px;">
                Saludos cordiales,<br/>El equipo de Tolko Group.
              </p>
            </div>
          </div>
          
          <div style="background-color: #F9FAFB; padding: 30px 20px; text-align: center; border-top: 1px solid #E5E7EB;">
            <img src="https://mcusercontent.com/f8003344e5055720b1568282f/images/e84ab177-5143-b5b7-4514-9298f1f3fa99.png" alt="Tolko Logo" width="60" height="60" style="border-radius: 12px; margin-bottom: 15px; display: inline-block; object-fit: contain;" />
            <p style="font-size: 11px; color: #9CA3AF; margin: 0;">Este es un mensaje automatizado enviado desde Pipeline Tolko.</p>
            <p style="font-size: 11px; color: #9CA3AF; margin: 5px 0 0 0;">Por favor, no respondas directamente a esta dirección de correo.</p>
          </div>
        </div>
      `;

        const resendResponse = await resend.emails.send({
          from: "Pipeline Tolko <no-reply@pipeline.tolkogroup.com>",
          to: [mainRecipient],
          cc: ccList.length > 0 ? ccList : undefined,
          subject: `[NUEVO TICKET] ${clientName} - ${ticketTitle}`,
          html: htmlTemplate,
        });

      console.log("✅ RESPUESTA DE RESEND:", resendResponse);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // -------------------------------------------------------------
    // TRIGGER 2: MOVIMIENTOS EN LAS TAREAS (UPDATE)
    // -------------------------------------------------------------
    if (table === "request_tasks" && type === "UPDATE") {
      const newStatus = record.status;
      const oldStatus = old_record.status;
      const assigneeId = record.assigned_to;

      if (newStatus === oldStatus) {
        return new Response(JSON.stringify({ message: "Sin cambios de estatus" }), { status: 200 });
      }

      const { data: taskData, error: taskError } = await supabaseAdmin
        .from("request_tasks")
        .select(`
          profiles!request_tasks_assigned_to_fkey ( full_name, email ),
          requests ( id, title, organizations ( name ) )
        `)
        .eq("id", record.id)
        .single();

      if (taskError || !taskData) throw new Error("Error al cruzar la tarea");

      const reviewerEmail = taskData.profiles?.email;
      const reviewerName = taskData.profiles?.full_name?.split(" ")[0] || "Creador";
      const projectName = taskData.requests?.title || "Sin título";
      const parentTicketId = taskData.requests?.id;
      const organization = Array.isArray(taskData.requests?.organizations) ? taskData.requests?.organizations[0] : taskData.requests?.organizations;
      const clientName = organization?.name || "Cliente";

      // Link para el colaborador
      const colabTicketUrl = `${frontendUrl}/dashboard?ticket=${parentTicketId}`;

      if (newStatus === "pendiente" && assigneeId && old_record.assigned_to !== assigneeId) {
        await resend.emails.send({
          from: "Pipeline Tolko <no-reply@pipeline.tolkogroup.com>", 
          to: [reviewerEmail],
          subject: `NUEVA ASIGNACIÓN: ${clientName} - ${projectName}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color:#D3002D;">Pipeline Tolko</h2>
              <p>Hola <strong>${reviewerName}</strong>,</p>
              <p>Se te ha asignado una nueva pieza de producción (Disciplina: ${record.discipline}) para la cuenta <strong>${clientName}</strong>.</p>
              <a href="${colabTicketUrl}" style="background-color:#111827; color:#fff; text-decoration:none; padding:10px 20px; border-radius:6px; display:inline-block; margin-top:20px;">IR A LA MESA DE TRABAJO</a>
            </div>`,
        });
      }
      
      else if (newStatus === "entregado") {
        const coordinatorEmail = "coordinador@tolkogroup.com"; 
        await resend.emails.send({
          from: "Pipeline Tolko <no-reply@pipeline.tolkogroup.com>", 
          to: [coordinatorEmail],
          subject: `ENTREGABLE LISTO: ${clientName} - ${projectName}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color:#10b981;">Mesa de Control</h2>
              <p>El Reviewer <strong>${reviewerName}</strong> ha subido un entregable para la cuenta <strong>${clientName}</strong> (Disciplina: ${record.discipline}).</p>
              <a href="${colabTicketUrl}" style="background-color:#10b981; color:#fff; text-decoration:none; padding:10px 20px; border-radius:6px; display:inline-block; margin-top:20px;">REVISAR ENTREGABLE</a>
            </div>`,
        });
      }
    }

    console.log("⚠️ El webhook se disparó pero no cumplió ninguna condición IF principal.");
    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });

  } catch (error: any) {
    console.error("🚨 [ERROR FATAL EN LA FUNCIÓN]:", error.message);
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});