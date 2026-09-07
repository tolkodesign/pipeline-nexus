// Definición de tipos para la Fase 2 de migración de especialidades
// Estos tipos garantizan la convivencia de los campos legacy y la nueva estructura dinámica.

export interface Specialty {
  id: number;
  name: string;
}

export interface Deliverable {
  id: string;
  organization_id: string;
  name: string;
  category_id?: number;
  target_format_id?: number;
  is_active: boolean;
  created_at: string;
  is_package: boolean;
  
  // Legacy flags
  needs_design?: boolean;
  needs_dev?: boolean;
  needs_av?: boolean;
  needs_copy?: boolean;
  needs_prod?: boolean;
  needs_staff?: boolean;
  needs_rp?: boolean;

  // Nuevas columnas relacionales
  specialty_ids?: number[];
}

export interface Request {
  id: string;
  organization_id: string;
  requester_id: string;
  title: string;
  priority_id?: number;
  category_id?: number;
  target_format_id?: number;
  description?: string;
  status: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado' | 'entregado' | string;
  due_date?: string;
  created_at: string;
  project_month?: string;
  department?: string;
  request_date?: string;
  quantity?: number;
  external_resource_url?: string;
  project_id?: string;
  max_revisions?: number;
  revisions_used?: number;
  total_adjustments?: number;
  organization_deliverable_id?: string;
  cc_emails?: string;
  send_email_notification?: boolean;
  original_due_date?: string;
  delivered_at?: string;
  reopened_at?: string;
  updated_at?: string;
  editing_hours?: number;
  page_or_slide_count?: number;
  is_active?: boolean;
  cancellation_reason?: string;
  cierre_solicitado?: boolean;

  // Legacy flags
  needs_design?: boolean;
  needs_dev?: boolean;
  needs_av?: boolean;
  needs_copy?: boolean;
  needs_prod?: boolean;
  needs_staff?: boolean;
  needs_rp?: boolean;

  // Nuevas columnas relacionales
  specialty_ids?: number[];
}

export interface RequestTask {
  id: string;
  request_id?: string;
  assigned_to?: string[];
  status?: string;
  quantity?: number;
  deliverable_url?: string;
  delivery_notes?: string;
  created_at?: string;
  updated_at?: string;
  coordinator_notes?: string;

  // Legacy column
  discipline?: string;

  // Nuevas columnas relacionales
  specialty_id?: number;
}
