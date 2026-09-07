create type "public"."request_status" as enum ('pendiente', 'en_proceso', 'revision', 'entregado', 'cancelado', 'contrapropuesta', 'en_revision_cliente', 'completado');

create sequence "public"."file_extensions_id_seq";

create sequence "public"."priorities_id_seq";

create sequence "public"."request_categories_id_seq";


  create table "public"."audit_logs" (
    "id" uuid not null default gen_random_uuid(),
    "table_name" text not null,
    "record_id" uuid not null,
    "action" text not null,
    "old_data" jsonb,
    "new_data" jsonb,
    "performed_by" uuid,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."audit_logs" enable row level security;


  create table "public"."category_allowed_formats" (
    "category_id" integer not null,
    "format_id" integer not null
      );


alter table "public"."category_allowed_formats" enable row level security;


  create table "public"."file_extensions" (
    "id" integer not null default nextval('public.file_extensions_id_seq'::regclass),
    "extension" character varying(10) not null
      );


alter table "public"."file_extensions" enable row level security;


  create table "public"."internal_roles" (
    "id" integer generated always as identity not null,
    "name" character varying not null
      );


alter table "public"."internal_roles" enable row level security;


  create table "public"."notifications" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "profile_id" uuid not null,
    "title" text not null,
    "message" text not null,
    "action_link" text,
    "is_read" boolean default false,
    "type" text default 'info'::text
      );


alter table "public"."notifications" enable row level security;


  create table "public"."organization_deliverables" (
    "id" uuid not null default gen_random_uuid(),
    "organization_id" uuid not null,
    "name" character varying not null,
    "category_id" integer,
    "target_format_id" integer,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."organization_deliverables" enable row level security;


  create table "public"."organization_distribution_lists" (
    "organization_id" uuid not null,
    "profile_id" uuid not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."organization_distribution_lists" enable row level security;


  create table "public"."organization_members" (
    "organization_id" uuid not null,
    "profile_id" uuid not null,
    "role_in_org" character varying(255) default 'manager'::character varying
      );


alter table "public"."organization_members" enable row level security;


  create table "public"."organizations" (
    "id" uuid not null default gen_random_uuid(),
    "name" character varying(255) not null,
    "logo_url" text,
    "industry" character varying(100),
    "created_at" timestamp with time zone default now(),
    "address" text,
    "primary_color" character varying(7) default '#D3002D'::character varying,
    "secondary_color" character varying(7) default '#0F0F12'::character varying,
    "banner_url" text,
    "distribution_email" character varying,
    "is_active" boolean default true
      );


alter table "public"."organizations" enable row level security;


  create table "public"."priorities" (
    "id" integer not null default nextval('public.priorities_id_seq'::regclass),
    "level" character varying(20) not null,
    "color_code" character(7),
    "weight" integer
      );


alter table "public"."priorities" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null default gen_random_uuid(),
    "full_name" text,
    "avatar_url" text,
    "phone" text,
    "is_admin" boolean default false,
    "created_at" timestamp with time zone default now(),
    "email" character varying(255),
    "internal_role" character varying(50),
    "specialty" text,
    "leader_id" uuid,
    "is_active" boolean default true,
    "role_id" integer,
    "specialty_id" integer
      );


alter table "public"."profiles" enable row level security;


  create table "public"."projects" (
    "id" uuid not null default gen_random_uuid(),
    "organization_id" uuid not null,
    "name" character varying not null,
    "description" text,
    "created_at" timestamp with time zone default now(),
    "banner_url" text
      );


alter table "public"."projects" enable row level security;


  create table "public"."request_categories" (
    "id" integer not null default nextval('public.request_categories_id_seq'::regclass),
    "name" character varying(50) not null
      );


alter table "public"."request_categories" enable row level security;


  create table "public"."request_comments" (
    "id" uuid not null default gen_random_uuid(),
    "request_id" uuid,
    "user_id" uuid,
    "message" text not null,
    "is_internal" boolean default false,
    "created_at" timestamp with time zone default now(),
    "is_correction" boolean default false
      );


alter table "public"."request_comments" enable row level security;


  create table "public"."request_files" (
    "id" uuid not null default gen_random_uuid(),
    "request_id" uuid,
    "storage_path" text not null,
    "file_type" character varying(20),
    "uploader_id" uuid,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."request_files" enable row level security;


  create table "public"."request_tasks" (
    "id" uuid not null default gen_random_uuid(),
    "request_id" uuid,
    "discipline" text not null,
    "assigned_to" uuid[],
    "status" text default 'pendiente'::text,
    "quantity" integer default 1,
    "deliverable_url" text,
    "delivery_notes" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "coordinator_notes" text
      );


alter table "public"."request_tasks" enable row level security;


  create table "public"."requests" (
    "id" uuid not null default gen_random_uuid(),
    "organization_id" uuid not null,
    "requester_id" uuid not null,
    "title" text not null,
    "priority_id" integer,
    "category_id" integer,
    "target_format_id" integer,
    "description" text,
    "status" public.request_status default 'pendiente'::public.request_status,
    "due_date" date,
    "created_at" timestamp with time zone default now(),
    "project_month" character varying(20),
    "department" character varying(50),
    "request_date" date default CURRENT_DATE,
    "quantity" integer default 1,
    "external_resource_url" text,
    "project_id" uuid,
    "needs_design" boolean default false,
    "needs_dev" boolean default false,
    "needs_av" boolean default false,
    "needs_copy" boolean default false,
    "max_revisions" integer default 2,
    "revisions_used" integer default 0,
    "final_deliverable_url" text,
    "total_adjustments" integer default 0,
    "organization_deliverable_id" uuid,
    "cc_emails" text,
    "needs_prod" boolean default false,
    "needs_staff" boolean default false,
    "needs_rp" boolean default false,
    "send_email_notification" boolean default true,
    "original_due_date" date,
    "delivered_at" timestamp with time zone,
    "reopened_at" timestamp with time zone,
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."requests" enable row level security;


  create table "public"."sectors" (
    "id" uuid not null default gen_random_uuid(),
    "name" character varying not null
      );


alter table "public"."sectors" enable row level security;


  create table "public"."specialties" (
    "id" integer generated always as identity not null,
    "name" character varying not null
      );


alter table "public"."specialties" enable row level security;


  create table "public"."task_adjustments" (
    "id" uuid not null default gen_random_uuid(),
    "task_id" uuid not null,
    "description" text not null,
    "origin" text not null,
    "is_internal" boolean not null default true,
    "status" text not null default 'pendiente'::text,
    "created_by" uuid,
    "created_at" timestamp with time zone not null default now(),
    "resolved_at" timestamp with time zone
      );


alter table "public"."task_adjustments" enable row level security;


  create table "public"."task_assignees" (
    "id" uuid not null default gen_random_uuid(),
    "task_id" uuid not null,
    "profile_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."task_assignees" enable row level security;

alter sequence "public"."file_extensions_id_seq" owned by "public"."file_extensions"."id";

alter sequence "public"."priorities_id_seq" owned by "public"."priorities"."id";

alter sequence "public"."request_categories_id_seq" owned by "public"."request_categories"."id";

CREATE UNIQUE INDEX audit_logs_pkey ON public.audit_logs USING btree (id);

CREATE UNIQUE INDEX category_allowed_formats_pkey ON public.category_allowed_formats USING btree (category_id, format_id);

CREATE UNIQUE INDEX file_extensions_extension_key ON public.file_extensions USING btree (extension);

CREATE UNIQUE INDEX file_extensions_pkey ON public.file_extensions USING btree (id);

CREATE UNIQUE INDEX internal_roles_name_key ON public.internal_roles USING btree (name);

CREATE UNIQUE INDEX internal_roles_pkey ON public.internal_roles USING btree (id);

CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);

CREATE UNIQUE INDEX org_deliverables_pkey ON public.organization_deliverables USING btree (id);

CREATE UNIQUE INDEX organization_distribution_lists_pkey ON public.organization_distribution_lists USING btree (organization_id, profile_id);

CREATE UNIQUE INDEX organization_members_pkey ON public.organization_members USING btree (organization_id, profile_id);

CREATE UNIQUE INDEX organizations_pkey ON public.organizations USING btree (id);

CREATE UNIQUE INDEX priorities_level_key ON public.priorities USING btree (level);

CREATE UNIQUE INDEX priorities_pkey ON public.priorities USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);

CREATE UNIQUE INDEX request_categories_name_key ON public.request_categories USING btree (name);

CREATE UNIQUE INDEX request_categories_pkey ON public.request_categories USING btree (id);

CREATE UNIQUE INDEX request_comments_pkey ON public.request_comments USING btree (id);

CREATE UNIQUE INDEX request_files_pkey ON public.request_files USING btree (id);

CREATE UNIQUE INDEX request_tasks_pkey ON public.request_tasks USING btree (id);

CREATE UNIQUE INDEX requests_pkey ON public.requests USING btree (id);

CREATE UNIQUE INDEX sectors_name_key ON public.sectors USING btree (name);

CREATE UNIQUE INDEX sectors_pkey ON public.sectors USING btree (id);

CREATE UNIQUE INDEX specialties_name_key ON public.specialties USING btree (name);

CREATE UNIQUE INDEX specialties_pkey ON public.specialties USING btree (id);

CREATE UNIQUE INDEX task_adjustments_pkey ON public.task_adjustments USING btree (id);

CREATE UNIQUE INDEX task_assignees_pkey ON public.task_assignees USING btree (id);

CREATE UNIQUE INDEX task_assignees_task_id_profile_id_key ON public.task_assignees USING btree (task_id, profile_id);

alter table "public"."audit_logs" add constraint "audit_logs_pkey" PRIMARY KEY using index "audit_logs_pkey";

alter table "public"."category_allowed_formats" add constraint "category_allowed_formats_pkey" PRIMARY KEY using index "category_allowed_formats_pkey";

alter table "public"."file_extensions" add constraint "file_extensions_pkey" PRIMARY KEY using index "file_extensions_pkey";

alter table "public"."internal_roles" add constraint "internal_roles_pkey" PRIMARY KEY using index "internal_roles_pkey";

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."organization_deliverables" add constraint "org_deliverables_pkey" PRIMARY KEY using index "org_deliverables_pkey";

alter table "public"."organization_distribution_lists" add constraint "organization_distribution_lists_pkey" PRIMARY KEY using index "organization_distribution_lists_pkey";

alter table "public"."organization_members" add constraint "organization_members_pkey" PRIMARY KEY using index "organization_members_pkey";

alter table "public"."organizations" add constraint "organizations_pkey" PRIMARY KEY using index "organizations_pkey";

alter table "public"."priorities" add constraint "priorities_pkey" PRIMARY KEY using index "priorities_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."request_categories" add constraint "request_categories_pkey" PRIMARY KEY using index "request_categories_pkey";

alter table "public"."request_comments" add constraint "request_comments_pkey" PRIMARY KEY using index "request_comments_pkey";

alter table "public"."request_files" add constraint "request_files_pkey" PRIMARY KEY using index "request_files_pkey";

alter table "public"."request_tasks" add constraint "request_tasks_pkey" PRIMARY KEY using index "request_tasks_pkey";

alter table "public"."requests" add constraint "requests_pkey" PRIMARY KEY using index "requests_pkey";

alter table "public"."sectors" add constraint "sectors_pkey" PRIMARY KEY using index "sectors_pkey";

alter table "public"."specialties" add constraint "specialties_pkey" PRIMARY KEY using index "specialties_pkey";

alter table "public"."task_adjustments" add constraint "task_adjustments_pkey" PRIMARY KEY using index "task_adjustments_pkey";

alter table "public"."task_assignees" add constraint "task_assignees_pkey" PRIMARY KEY using index "task_assignees_pkey";

alter table "public"."audit_logs" add constraint "audit_logs_performed_by_fkey" FOREIGN KEY (performed_by) REFERENCES public.profiles(id) not valid;

alter table "public"."audit_logs" validate constraint "audit_logs_performed_by_fkey";

alter table "public"."category_allowed_formats" add constraint "category_allowed_formats_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.request_categories(id) ON DELETE CASCADE not valid;

alter table "public"."category_allowed_formats" validate constraint "category_allowed_formats_category_id_fkey";

alter table "public"."category_allowed_formats" add constraint "category_allowed_formats_format_id_fkey" FOREIGN KEY (format_id) REFERENCES public.file_extensions(id) ON DELETE CASCADE not valid;

alter table "public"."category_allowed_formats" validate constraint "category_allowed_formats_format_id_fkey";

alter table "public"."file_extensions" add constraint "file_extensions_extension_key" UNIQUE using index "file_extensions_extension_key";

alter table "public"."internal_roles" add constraint "internal_roles_name_key" UNIQUE using index "internal_roles_name_key";

alter table "public"."notifications" add constraint "notifications_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_profile_id_fkey";

alter table "public"."organization_deliverables" add constraint "org_deliverables_category_fkey" FOREIGN KEY (category_id) REFERENCES public.request_categories(id) not valid;

alter table "public"."organization_deliverables" validate constraint "org_deliverables_category_fkey";

alter table "public"."organization_deliverables" add constraint "org_deliverables_format_fkey" FOREIGN KEY (target_format_id) REFERENCES public.file_extensions(id) not valid;

alter table "public"."organization_deliverables" validate constraint "org_deliverables_format_fkey";

alter table "public"."organization_deliverables" add constraint "org_deliverables_org_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;

alter table "public"."organization_deliverables" validate constraint "org_deliverables_org_fkey";

alter table "public"."organization_distribution_lists" add constraint "organization_distribution_lists_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;

alter table "public"."organization_distribution_lists" validate constraint "organization_distribution_lists_organization_id_fkey";

alter table "public"."organization_distribution_lists" add constraint "organization_distribution_lists_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."organization_distribution_lists" validate constraint "organization_distribution_lists_profile_id_fkey";

alter table "public"."organization_members" add constraint "organization_members_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;

alter table "public"."organization_members" validate constraint "organization_members_organization_id_fkey";

alter table "public"."organization_members" add constraint "organization_members_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."organization_members" validate constraint "organization_members_profile_id_fkey";

alter table "public"."priorities" add constraint "priorities_level_key" UNIQUE using index "priorities_level_key";

alter table "public"."profiles" add constraint "profiles_leader_id_fkey" FOREIGN KEY (leader_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."profiles" validate constraint "profiles_leader_id_fkey";

alter table "public"."profiles" add constraint "profiles_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public.internal_roles(id) not valid;

alter table "public"."profiles" validate constraint "profiles_role_id_fkey";

alter table "public"."profiles" add constraint "profiles_specialty_id_fkey" FOREIGN KEY (specialty_id) REFERENCES public.specialties(id) not valid;

alter table "public"."profiles" validate constraint "profiles_specialty_id_fkey";

alter table "public"."projects" add constraint "projects_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;

alter table "public"."projects" validate constraint "projects_organization_id_fkey";

alter table "public"."request_categories" add constraint "request_categories_name_key" UNIQUE using index "request_categories_name_key";

alter table "public"."request_comments" add constraint "request_comments_request_id_fkey" FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE CASCADE not valid;

alter table "public"."request_comments" validate constraint "request_comments_request_id_fkey";

alter table "public"."request_comments" add constraint "request_comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) not valid;

alter table "public"."request_comments" validate constraint "request_comments_user_id_fkey";

alter table "public"."request_files" add constraint "request_files_file_type_check" CHECK (((file_type)::text = ANY ((ARRAY['input'::character varying, 'output'::character varying])::text[]))) not valid;

alter table "public"."request_files" validate constraint "request_files_file_type_check";

alter table "public"."request_files" add constraint "request_files_request_id_fkey" FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE CASCADE not valid;

alter table "public"."request_files" validate constraint "request_files_request_id_fkey";

alter table "public"."request_files" add constraint "request_files_uploader_id_fkey" FOREIGN KEY (uploader_id) REFERENCES public.profiles(id) not valid;

alter table "public"."request_files" validate constraint "request_files_uploader_id_fkey";

alter table "public"."request_tasks" add constraint "request_tasks_request_id_fkey" FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE CASCADE not valid;

alter table "public"."request_tasks" validate constraint "request_tasks_request_id_fkey";

alter table "public"."requests" add constraint "requests_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.request_categories(id) not valid;

alter table "public"."requests" validate constraint "requests_category_id_fkey";

alter table "public"."requests" add constraint "requests_organization_deliverable_id_fkey" FOREIGN KEY (organization_deliverable_id) REFERENCES public.organization_deliverables(id) not valid;

alter table "public"."requests" validate constraint "requests_organization_deliverable_id_fkey";

alter table "public"."requests" add constraint "requests_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) not valid;

alter table "public"."requests" validate constraint "requests_organization_id_fkey";

alter table "public"."requests" add constraint "requests_priority_id_fkey" FOREIGN KEY (priority_id) REFERENCES public.priorities(id) not valid;

alter table "public"."requests" validate constraint "requests_priority_id_fkey";

alter table "public"."requests" add constraint "requests_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE SET NULL not valid;

alter table "public"."requests" validate constraint "requests_project_id_fkey";

alter table "public"."requests" add constraint "requests_requester_id_fkey" FOREIGN KEY (requester_id) REFERENCES public.profiles(id) not valid;

alter table "public"."requests" validate constraint "requests_requester_id_fkey";

alter table "public"."requests" add constraint "requests_target_format_id_fkey" FOREIGN KEY (target_format_id) REFERENCES public.file_extensions(id) not valid;

alter table "public"."requests" validate constraint "requests_target_format_id_fkey";

alter table "public"."sectors" add constraint "sectors_name_key" UNIQUE using index "sectors_name_key";

alter table "public"."specialties" add constraint "specialties_name_key" UNIQUE using index "specialties_name_key";

alter table "public"."task_adjustments" add constraint "task_adjustments_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."task_adjustments" validate constraint "task_adjustments_created_by_fkey";

alter table "public"."task_adjustments" add constraint "task_adjustments_origin_check" CHECK ((origin = ANY (ARRAY['cliente'::text, 'agencia'::text]))) not valid;

alter table "public"."task_adjustments" validate constraint "task_adjustments_origin_check";

alter table "public"."task_adjustments" add constraint "task_adjustments_status_check" CHECK ((status = ANY (ARRAY['pendiente'::text, 'resuelto'::text]))) not valid;

alter table "public"."task_adjustments" validate constraint "task_adjustments_status_check";

alter table "public"."task_adjustments" add constraint "task_adjustments_task_id_fkey" FOREIGN KEY (task_id) REFERENCES public.request_tasks(id) ON DELETE CASCADE not valid;

alter table "public"."task_adjustments" validate constraint "task_adjustments_task_id_fkey";

alter table "public"."task_assignees" add constraint "task_assignees_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."task_assignees" validate constraint "task_assignees_profile_id_fkey";

alter table "public"."task_assignees" add constraint "task_assignees_task_id_fkey" FOREIGN KEY (task_id) REFERENCES public.request_tasks(id) ON DELETE CASCADE not valid;

alter table "public"."task_assignees" validate constraint "task_assignees_task_id_fkey";

alter table "public"."task_assignees" add constraint "task_assignees_task_id_profile_id_key" UNIQUE using index "task_assignees_task_id_profile_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_delivery_file()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.status = 'entregado' THEN
        IF NOT EXISTS (
            SELECT 1 FROM request_files 
            WHERE request_id = NEW.id AND file_type = 'output'
        ) THEN
            RAISE EXCEPTION 'No se puede marcar como entregado sin subir un archivo final (entregable).';
        END IF;
    END IF;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_user_role(required_role text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND LOWER(internal_role) = LOWER(required_role)
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_profile_by_admin(user_email text, user_full_name text, org_id uuid, user_role text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  new_user_id UUID;
BEGIN
  -- 1. Buscamos el ID en auth.users que coincida con el email que el admin puso
  SELECT id INTO new_user_id FROM auth.users WHERE email = user_email;

  IF new_user_id IS NOT NULL THEN
    -- 2. Creamos el perfil si no existe
    INSERT INTO public.profiles (id, full_name, email, is_admin)
    VALUES (new_user_id, user_full_name, user_email, false)
    ON CONFLICT (id) DO NOTHING;

    -- 3. Lo vinculamos a la empresa
    INSERT INTO public.organization_members (organization_id, profile_id, role_in_org)
    VALUES (org_id, new_user_id, user_role);
  END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fn_track_request_revisions()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Detecta si el mensaje es una corrección oficial
    IF NEW.is_correction = true THEN
        UPDATE public.requests
        SET revisions_used = revisions_used + 1
        WHERE id = NEW.request_id;
    END IF;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.on_new_request_received()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE v_profile_record RECORD; v_client_name TEXT; v_specialty_ids INT[] := ARRAY[]::INT[];
BEGIN
  SELECT COALESCE(name, 'Un cliente Partner') INTO v_client_name FROM public.organizations WHERE id = NEW.organization_id;
  FOR v_profile_record IN SELECT id FROM public.profiles WHERE role_id = 3 AND is_active = true LOOP
    INSERT INTO public.notifications (profile_id, title, message, type, action_link) VALUES (v_profile_record.id, 'Nueva Solicitud Global', v_client_name || ' ingresó el ticket: ' || COALESCE(NEW.title, 'Sin título'), 'info', '?ticket=' || NEW.id);
  END LOOP;
  IF NEW.needs_av THEN v_specialty_ids := array_append(v_specialty_ids, 1); END IF; IF NEW.needs_rp THEN v_specialty_ids := array_append(v_specialty_ids, 2); END IF; IF NEW.needs_prod THEN v_specialty_ids := array_append(v_specialty_ids, 3); END IF; IF NEW.needs_design THEN v_specialty_ids := array_append(v_specialty_ids, 4); END IF; IF NEW.needs_copy THEN v_specialty_ids := array_append(v_specialty_ids, 5); END IF; IF NEW.needs_dev THEN v_specialty_ids := array_append(v_specialty_ids, 6); END IF; IF NEW.needs_staff THEN v_specialty_ids := array_append(v_specialty_ids, 7); END IF;
  IF cardinality(v_specialty_ids) > 0 THEN FOR v_profile_record IN SELECT id FROM public.profiles WHERE role_id IN (2, 4, 5) AND specialty_id = ANY(v_specialty_ids) AND is_active = true LOOP
      INSERT INTO public.notifications (profile_id, title, message, type, action_link) VALUES (v_profile_record.id, 'Nueva Solicitud Inbound', v_client_name || ' requiere a tu célula para el ticket: ' || COALESCE(NEW.title, 'Sin título'), 'info', '?ticket=' || NEW.id);
  END LOOP; END IF; RETURN NEW;
END; $function$
;

CREATE OR REPLACE FUNCTION public.on_request_disciplines_updated()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE v_profile_record RECORD; v_client_name TEXT; v_new_specialty_ids INT[] := ARRAY[]::INT[];
BEGIN
  SELECT COALESCE(name, 'Un cliente Partner') INTO v_client_name FROM public.organizations WHERE id = NEW.organization_id;
  IF NEW.needs_av AND (OLD.needs_av IS DISTINCT FROM TRUE) THEN v_new_specialty_ids := array_append(v_new_specialty_ids, 1); END IF; IF NEW.needs_rp AND (OLD.needs_rp IS DISTINCT FROM TRUE) THEN v_new_specialty_ids := array_append(v_new_specialty_ids, 2); END IF; IF NEW.needs_prod AND (OLD.needs_prod IS DISTINCT FROM TRUE) THEN v_new_specialty_ids := array_append(v_new_specialty_ids, 3); END IF; IF NEW.needs_design AND (OLD.needs_design IS DISTINCT FROM TRUE) THEN v_new_specialty_ids := array_append(v_new_specialty_ids, 4); END IF; IF NEW.needs_copy AND (OLD.needs_copy IS DISTINCT FROM TRUE) THEN v_new_specialty_ids := array_append(v_new_specialty_ids, 5); END IF; IF NEW.needs_dev AND (OLD.needs_dev IS DISTINCT FROM TRUE) THEN v_new_specialty_ids := array_append(v_new_specialty_ids, 6); END IF; IF NEW.needs_staff AND (OLD.needs_staff IS DISTINCT FROM TRUE) THEN v_new_specialty_ids := array_append(v_new_specialty_ids, 7); END IF;
  IF cardinality(v_new_specialty_ids) > 0 THEN FOR v_profile_record IN SELECT id FROM public.profiles WHERE role_id IN (2, 4, 5) AND specialty_id = ANY(v_new_specialty_ids) AND is_active = true LOOP
      INSERT INTO public.notifications (profile_id, title, message, type, action_link) VALUES (v_profile_record.id, 'Área agregada al proyecto', 'Se activó tu célula en el ticket: ' || COALESCE(NEW.title, 'Sin título'), 'alert', '?ticket=' || NEW.id);
  END LOOP; END IF; RETURN NEW;
END; $function$
;

CREATE OR REPLACE FUNCTION public.on_task_assigned()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE v_discipline TEXT; v_project_title TEXT;
BEGIN
  SELECT rt.discipline, r.title INTO v_discipline, v_project_title FROM public.request_tasks rt JOIN public.requests r ON r.id = rt.request_id WHERE rt.id = NEW.task_id;
  INSERT INTO public.notifications (profile_id, title, message, type, action_link) VALUES (NEW.profile_id, 'Nueva Tarea Asignada', 'Recibiste la pieza de ' || v_discipline || ' para: ' || COALESCE(v_project_title, 'Sin título'), 'info', '?task=' || NEW.task_id);
  RETURN NEW;
END; $function$
;

CREATE OR REPLACE FUNCTION public.on_task_corrections()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE v_profile_id UUID; v_project_title TEXT;
BEGIN
  IF NEW.status = 'con_correcciones' AND OLD.status IS DISTINCT FROM 'con_correcciones' THEN SELECT r.title INTO v_project_title FROM public.requests r WHERE r.id = NEW.request_id;
    FOR v_profile_id IN SELECT profile_id FROM public.task_assignees WHERE task_id = NEW.id LOOP
      INSERT INTO public.notifications (profile_id, title, message, type, action_link) VALUES (v_profile_id, 'Ajustes Requeridos', 'Revisión solicitada en ' || NEW.discipline || ' para: ' || COALESCE(v_project_title, 'Sin título'), 'alert', '?task=' || NEW.id);
  END LOOP; END IF; RETURN NEW;
END; $function$
;

CREATE OR REPLACE FUNCTION public.on_task_submitted()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE v_profile_record RECORD; v_project_title TEXT; v_specialty_id INT;
BEGIN
  IF NEW.status = 'entregado' AND OLD.status IS DISTINCT FROM 'entregado' THEN SELECT title INTO v_project_title FROM public.requests WHERE id = NEW.request_id;
    CASE LOWER(NEW.discipline) WHEN 'audiovisual' THEN v_specialty_id := 1; WHEN 'rp' THEN v_specialty_id := 2; WHEN 'relaciones públicas' THEN v_specialty_id := 2; WHEN 'producción' THEN v_specialty_id := 3; WHEN 'diseño' THEN v_specialty_id := 4; WHEN 'contenido' THEN v_specialty_id := 5; WHEN 'programación' THEN v_specialty_id := 6; WHEN 'staff' THEN v_specialty_id := 7; ELSE v_specialty_id := 0; END CASE;
    FOR v_profile_record IN SELECT id FROM public.profiles WHERE role_id IN (2, 4, 5) AND specialty_id = v_specialty_id AND is_active = true LOOP
      INSERT INTO public.notifications (profile_id, title, message, type, action_link) VALUES (v_profile_record.id, 'Pieza Lista para Revisión', 'Tu célula envió un entregable de ' || NEW.discipline || ' para: ' || COALESCE(v_project_title, 'Sin título'), 'success', '?ticket=' || NEW.request_id);
  END LOOP; END IF; RETURN NEW;
END; $function$
;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$
;

grant delete on table "public"."audit_logs" to "anon";

grant insert on table "public"."audit_logs" to "anon";

grant references on table "public"."audit_logs" to "anon";

grant select on table "public"."audit_logs" to "anon";

grant trigger on table "public"."audit_logs" to "anon";

grant truncate on table "public"."audit_logs" to "anon";

grant update on table "public"."audit_logs" to "anon";

grant delete on table "public"."audit_logs" to "authenticated";

grant insert on table "public"."audit_logs" to "authenticated";

grant references on table "public"."audit_logs" to "authenticated";

grant select on table "public"."audit_logs" to "authenticated";

grant trigger on table "public"."audit_logs" to "authenticated";

grant truncate on table "public"."audit_logs" to "authenticated";

grant update on table "public"."audit_logs" to "authenticated";

grant delete on table "public"."audit_logs" to "service_role";

grant insert on table "public"."audit_logs" to "service_role";

grant references on table "public"."audit_logs" to "service_role";

grant select on table "public"."audit_logs" to "service_role";

grant trigger on table "public"."audit_logs" to "service_role";

grant truncate on table "public"."audit_logs" to "service_role";

grant update on table "public"."audit_logs" to "service_role";

grant delete on table "public"."category_allowed_formats" to "anon";

grant insert on table "public"."category_allowed_formats" to "anon";

grant references on table "public"."category_allowed_formats" to "anon";

grant select on table "public"."category_allowed_formats" to "anon";

grant trigger on table "public"."category_allowed_formats" to "anon";

grant truncate on table "public"."category_allowed_formats" to "anon";

grant update on table "public"."category_allowed_formats" to "anon";

grant delete on table "public"."category_allowed_formats" to "authenticated";

grant insert on table "public"."category_allowed_formats" to "authenticated";

grant references on table "public"."category_allowed_formats" to "authenticated";

grant select on table "public"."category_allowed_formats" to "authenticated";

grant trigger on table "public"."category_allowed_formats" to "authenticated";

grant truncate on table "public"."category_allowed_formats" to "authenticated";

grant update on table "public"."category_allowed_formats" to "authenticated";

grant delete on table "public"."category_allowed_formats" to "service_role";

grant insert on table "public"."category_allowed_formats" to "service_role";

grant references on table "public"."category_allowed_formats" to "service_role";

grant select on table "public"."category_allowed_formats" to "service_role";

grant trigger on table "public"."category_allowed_formats" to "service_role";

grant truncate on table "public"."category_allowed_formats" to "service_role";

grant update on table "public"."category_allowed_formats" to "service_role";

grant delete on table "public"."file_extensions" to "anon";

grant insert on table "public"."file_extensions" to "anon";

grant references on table "public"."file_extensions" to "anon";

grant select on table "public"."file_extensions" to "anon";

grant trigger on table "public"."file_extensions" to "anon";

grant truncate on table "public"."file_extensions" to "anon";

grant update on table "public"."file_extensions" to "anon";

grant delete on table "public"."file_extensions" to "authenticated";

grant insert on table "public"."file_extensions" to "authenticated";

grant references on table "public"."file_extensions" to "authenticated";

grant select on table "public"."file_extensions" to "authenticated";

grant trigger on table "public"."file_extensions" to "authenticated";

grant truncate on table "public"."file_extensions" to "authenticated";

grant update on table "public"."file_extensions" to "authenticated";

grant delete on table "public"."file_extensions" to "service_role";

grant insert on table "public"."file_extensions" to "service_role";

grant references on table "public"."file_extensions" to "service_role";

grant select on table "public"."file_extensions" to "service_role";

grant trigger on table "public"."file_extensions" to "service_role";

grant truncate on table "public"."file_extensions" to "service_role";

grant update on table "public"."file_extensions" to "service_role";

grant delete on table "public"."internal_roles" to "anon";

grant insert on table "public"."internal_roles" to "anon";

grant references on table "public"."internal_roles" to "anon";

grant select on table "public"."internal_roles" to "anon";

grant trigger on table "public"."internal_roles" to "anon";

grant truncate on table "public"."internal_roles" to "anon";

grant update on table "public"."internal_roles" to "anon";

grant delete on table "public"."internal_roles" to "authenticated";

grant insert on table "public"."internal_roles" to "authenticated";

grant references on table "public"."internal_roles" to "authenticated";

grant select on table "public"."internal_roles" to "authenticated";

grant trigger on table "public"."internal_roles" to "authenticated";

grant truncate on table "public"."internal_roles" to "authenticated";

grant update on table "public"."internal_roles" to "authenticated";

grant delete on table "public"."internal_roles" to "service_role";

grant insert on table "public"."internal_roles" to "service_role";

grant references on table "public"."internal_roles" to "service_role";

grant select on table "public"."internal_roles" to "service_role";

grant trigger on table "public"."internal_roles" to "service_role";

grant truncate on table "public"."internal_roles" to "service_role";

grant update on table "public"."internal_roles" to "service_role";

grant delete on table "public"."notifications" to "anon";

grant insert on table "public"."notifications" to "anon";

grant references on table "public"."notifications" to "anon";

grant select on table "public"."notifications" to "anon";

grant trigger on table "public"."notifications" to "anon";

grant truncate on table "public"."notifications" to "anon";

grant update on table "public"."notifications" to "anon";

grant delete on table "public"."notifications" to "authenticated";

grant insert on table "public"."notifications" to "authenticated";

grant references on table "public"."notifications" to "authenticated";

grant select on table "public"."notifications" to "authenticated";

grant trigger on table "public"."notifications" to "authenticated";

grant truncate on table "public"."notifications" to "authenticated";

grant update on table "public"."notifications" to "authenticated";

grant delete on table "public"."notifications" to "service_role";

grant insert on table "public"."notifications" to "service_role";

grant references on table "public"."notifications" to "service_role";

grant select on table "public"."notifications" to "service_role";

grant trigger on table "public"."notifications" to "service_role";

grant truncate on table "public"."notifications" to "service_role";

grant update on table "public"."notifications" to "service_role";

grant delete on table "public"."organization_deliverables" to "anon";

grant insert on table "public"."organization_deliverables" to "anon";

grant references on table "public"."organization_deliverables" to "anon";

grant select on table "public"."organization_deliverables" to "anon";

grant trigger on table "public"."organization_deliverables" to "anon";

grant truncate on table "public"."organization_deliverables" to "anon";

grant update on table "public"."organization_deliverables" to "anon";

grant delete on table "public"."organization_deliverables" to "authenticated";

grant insert on table "public"."organization_deliverables" to "authenticated";

grant references on table "public"."organization_deliverables" to "authenticated";

grant select on table "public"."organization_deliverables" to "authenticated";

grant trigger on table "public"."organization_deliverables" to "authenticated";

grant truncate on table "public"."organization_deliverables" to "authenticated";

grant update on table "public"."organization_deliverables" to "authenticated";

grant delete on table "public"."organization_deliverables" to "service_role";

grant insert on table "public"."organization_deliverables" to "service_role";

grant references on table "public"."organization_deliverables" to "service_role";

grant select on table "public"."organization_deliverables" to "service_role";

grant trigger on table "public"."organization_deliverables" to "service_role";

grant truncate on table "public"."organization_deliverables" to "service_role";

grant update on table "public"."organization_deliverables" to "service_role";

grant delete on table "public"."organization_distribution_lists" to "anon";

grant insert on table "public"."organization_distribution_lists" to "anon";

grant references on table "public"."organization_distribution_lists" to "anon";

grant select on table "public"."organization_distribution_lists" to "anon";

grant trigger on table "public"."organization_distribution_lists" to "anon";

grant truncate on table "public"."organization_distribution_lists" to "anon";

grant update on table "public"."organization_distribution_lists" to "anon";

grant delete on table "public"."organization_distribution_lists" to "authenticated";

grant insert on table "public"."organization_distribution_lists" to "authenticated";

grant references on table "public"."organization_distribution_lists" to "authenticated";

grant select on table "public"."organization_distribution_lists" to "authenticated";

grant trigger on table "public"."organization_distribution_lists" to "authenticated";

grant truncate on table "public"."organization_distribution_lists" to "authenticated";

grant update on table "public"."organization_distribution_lists" to "authenticated";

grant delete on table "public"."organization_distribution_lists" to "service_role";

grant insert on table "public"."organization_distribution_lists" to "service_role";

grant references on table "public"."organization_distribution_lists" to "service_role";

grant select on table "public"."organization_distribution_lists" to "service_role";

grant trigger on table "public"."organization_distribution_lists" to "service_role";

grant truncate on table "public"."organization_distribution_lists" to "service_role";

grant update on table "public"."organization_distribution_lists" to "service_role";

grant delete on table "public"."organization_members" to "anon";

grant insert on table "public"."organization_members" to "anon";

grant references on table "public"."organization_members" to "anon";

grant select on table "public"."organization_members" to "anon";

grant trigger on table "public"."organization_members" to "anon";

grant truncate on table "public"."organization_members" to "anon";

grant update on table "public"."organization_members" to "anon";

grant delete on table "public"."organization_members" to "authenticated";

grant insert on table "public"."organization_members" to "authenticated";

grant references on table "public"."organization_members" to "authenticated";

grant select on table "public"."organization_members" to "authenticated";

grant trigger on table "public"."organization_members" to "authenticated";

grant truncate on table "public"."organization_members" to "authenticated";

grant update on table "public"."organization_members" to "authenticated";

grant delete on table "public"."organization_members" to "service_role";

grant insert on table "public"."organization_members" to "service_role";

grant references on table "public"."organization_members" to "service_role";

grant select on table "public"."organization_members" to "service_role";

grant trigger on table "public"."organization_members" to "service_role";

grant truncate on table "public"."organization_members" to "service_role";

grant update on table "public"."organization_members" to "service_role";

grant delete on table "public"."organizations" to "anon";

grant insert on table "public"."organizations" to "anon";

grant references on table "public"."organizations" to "anon";

grant select on table "public"."organizations" to "anon";

grant trigger on table "public"."organizations" to "anon";

grant truncate on table "public"."organizations" to "anon";

grant update on table "public"."organizations" to "anon";

grant delete on table "public"."organizations" to "authenticated";

grant insert on table "public"."organizations" to "authenticated";

grant references on table "public"."organizations" to "authenticated";

grant select on table "public"."organizations" to "authenticated";

grant trigger on table "public"."organizations" to "authenticated";

grant truncate on table "public"."organizations" to "authenticated";

grant update on table "public"."organizations" to "authenticated";

grant delete on table "public"."organizations" to "service_role";

grant insert on table "public"."organizations" to "service_role";

grant references on table "public"."organizations" to "service_role";

grant select on table "public"."organizations" to "service_role";

grant trigger on table "public"."organizations" to "service_role";

grant truncate on table "public"."organizations" to "service_role";

grant update on table "public"."organizations" to "service_role";

grant delete on table "public"."priorities" to "anon";

grant insert on table "public"."priorities" to "anon";

grant references on table "public"."priorities" to "anon";

grant select on table "public"."priorities" to "anon";

grant trigger on table "public"."priorities" to "anon";

grant truncate on table "public"."priorities" to "anon";

grant update on table "public"."priorities" to "anon";

grant delete on table "public"."priorities" to "authenticated";

grant insert on table "public"."priorities" to "authenticated";

grant references on table "public"."priorities" to "authenticated";

grant select on table "public"."priorities" to "authenticated";

grant trigger on table "public"."priorities" to "authenticated";

grant truncate on table "public"."priorities" to "authenticated";

grant update on table "public"."priorities" to "authenticated";

grant delete on table "public"."priorities" to "service_role";

grant insert on table "public"."priorities" to "service_role";

grant references on table "public"."priorities" to "service_role";

grant select on table "public"."priorities" to "service_role";

grant trigger on table "public"."priorities" to "service_role";

grant truncate on table "public"."priorities" to "service_role";

grant update on table "public"."priorities" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."projects" to "anon";

grant insert on table "public"."projects" to "anon";

grant references on table "public"."projects" to "anon";

grant select on table "public"."projects" to "anon";

grant trigger on table "public"."projects" to "anon";

grant truncate on table "public"."projects" to "anon";

grant update on table "public"."projects" to "anon";

grant delete on table "public"."projects" to "authenticated";

grant insert on table "public"."projects" to "authenticated";

grant references on table "public"."projects" to "authenticated";

grant select on table "public"."projects" to "authenticated";

grant trigger on table "public"."projects" to "authenticated";

grant truncate on table "public"."projects" to "authenticated";

grant update on table "public"."projects" to "authenticated";

grant delete on table "public"."projects" to "service_role";

grant insert on table "public"."projects" to "service_role";

grant references on table "public"."projects" to "service_role";

grant select on table "public"."projects" to "service_role";

grant trigger on table "public"."projects" to "service_role";

grant truncate on table "public"."projects" to "service_role";

grant update on table "public"."projects" to "service_role";

grant delete on table "public"."request_categories" to "anon";

grant insert on table "public"."request_categories" to "anon";

grant references on table "public"."request_categories" to "anon";

grant select on table "public"."request_categories" to "anon";

grant trigger on table "public"."request_categories" to "anon";

grant truncate on table "public"."request_categories" to "anon";

grant update on table "public"."request_categories" to "anon";

grant delete on table "public"."request_categories" to "authenticated";

grant insert on table "public"."request_categories" to "authenticated";

grant references on table "public"."request_categories" to "authenticated";

grant select on table "public"."request_categories" to "authenticated";

grant trigger on table "public"."request_categories" to "authenticated";

grant truncate on table "public"."request_categories" to "authenticated";

grant update on table "public"."request_categories" to "authenticated";

grant delete on table "public"."request_categories" to "service_role";

grant insert on table "public"."request_categories" to "service_role";

grant references on table "public"."request_categories" to "service_role";

grant select on table "public"."request_categories" to "service_role";

grant trigger on table "public"."request_categories" to "service_role";

grant truncate on table "public"."request_categories" to "service_role";

grant update on table "public"."request_categories" to "service_role";

grant delete on table "public"."request_comments" to "anon";

grant insert on table "public"."request_comments" to "anon";

grant references on table "public"."request_comments" to "anon";

grant select on table "public"."request_comments" to "anon";

grant trigger on table "public"."request_comments" to "anon";

grant truncate on table "public"."request_comments" to "anon";

grant update on table "public"."request_comments" to "anon";

grant delete on table "public"."request_comments" to "authenticated";

grant insert on table "public"."request_comments" to "authenticated";

grant references on table "public"."request_comments" to "authenticated";

grant select on table "public"."request_comments" to "authenticated";

grant trigger on table "public"."request_comments" to "authenticated";

grant truncate on table "public"."request_comments" to "authenticated";

grant update on table "public"."request_comments" to "authenticated";

grant delete on table "public"."request_comments" to "service_role";

grant insert on table "public"."request_comments" to "service_role";

grant references on table "public"."request_comments" to "service_role";

grant select on table "public"."request_comments" to "service_role";

grant trigger on table "public"."request_comments" to "service_role";

grant truncate on table "public"."request_comments" to "service_role";

grant update on table "public"."request_comments" to "service_role";

grant delete on table "public"."request_files" to "anon";

grant insert on table "public"."request_files" to "anon";

grant references on table "public"."request_files" to "anon";

grant select on table "public"."request_files" to "anon";

grant trigger on table "public"."request_files" to "anon";

grant truncate on table "public"."request_files" to "anon";

grant update on table "public"."request_files" to "anon";

grant delete on table "public"."request_files" to "authenticated";

grant insert on table "public"."request_files" to "authenticated";

grant references on table "public"."request_files" to "authenticated";

grant select on table "public"."request_files" to "authenticated";

grant trigger on table "public"."request_files" to "authenticated";

grant truncate on table "public"."request_files" to "authenticated";

grant update on table "public"."request_files" to "authenticated";

grant delete on table "public"."request_files" to "service_role";

grant insert on table "public"."request_files" to "service_role";

grant references on table "public"."request_files" to "service_role";

grant select on table "public"."request_files" to "service_role";

grant trigger on table "public"."request_files" to "service_role";

grant truncate on table "public"."request_files" to "service_role";

grant update on table "public"."request_files" to "service_role";

grant delete on table "public"."request_tasks" to "anon";

grant insert on table "public"."request_tasks" to "anon";

grant references on table "public"."request_tasks" to "anon";

grant select on table "public"."request_tasks" to "anon";

grant trigger on table "public"."request_tasks" to "anon";

grant truncate on table "public"."request_tasks" to "anon";

grant update on table "public"."request_tasks" to "anon";

grant delete on table "public"."request_tasks" to "authenticated";

grant insert on table "public"."request_tasks" to "authenticated";

grant references on table "public"."request_tasks" to "authenticated";

grant select on table "public"."request_tasks" to "authenticated";

grant trigger on table "public"."request_tasks" to "authenticated";

grant truncate on table "public"."request_tasks" to "authenticated";

grant update on table "public"."request_tasks" to "authenticated";

grant delete on table "public"."request_tasks" to "service_role";

grant insert on table "public"."request_tasks" to "service_role";

grant references on table "public"."request_tasks" to "service_role";

grant select on table "public"."request_tasks" to "service_role";

grant trigger on table "public"."request_tasks" to "service_role";

grant truncate on table "public"."request_tasks" to "service_role";

grant update on table "public"."request_tasks" to "service_role";

grant delete on table "public"."requests" to "anon";

grant insert on table "public"."requests" to "anon";

grant references on table "public"."requests" to "anon";

grant select on table "public"."requests" to "anon";

grant trigger on table "public"."requests" to "anon";

grant truncate on table "public"."requests" to "anon";

grant update on table "public"."requests" to "anon";

grant delete on table "public"."requests" to "authenticated";

grant insert on table "public"."requests" to "authenticated";

grant references on table "public"."requests" to "authenticated";

grant select on table "public"."requests" to "authenticated";

grant trigger on table "public"."requests" to "authenticated";

grant truncate on table "public"."requests" to "authenticated";

grant update on table "public"."requests" to "authenticated";

grant delete on table "public"."requests" to "service_role";

grant insert on table "public"."requests" to "service_role";

grant references on table "public"."requests" to "service_role";

grant select on table "public"."requests" to "service_role";

grant trigger on table "public"."requests" to "service_role";

grant truncate on table "public"."requests" to "service_role";

grant update on table "public"."requests" to "service_role";

grant delete on table "public"."sectors" to "anon";

grant insert on table "public"."sectors" to "anon";

grant references on table "public"."sectors" to "anon";

grant select on table "public"."sectors" to "anon";

grant trigger on table "public"."sectors" to "anon";

grant truncate on table "public"."sectors" to "anon";

grant update on table "public"."sectors" to "anon";

grant delete on table "public"."sectors" to "authenticated";

grant insert on table "public"."sectors" to "authenticated";

grant references on table "public"."sectors" to "authenticated";

grant select on table "public"."sectors" to "authenticated";

grant trigger on table "public"."sectors" to "authenticated";

grant truncate on table "public"."sectors" to "authenticated";

grant update on table "public"."sectors" to "authenticated";

grant delete on table "public"."sectors" to "service_role";

grant insert on table "public"."sectors" to "service_role";

grant references on table "public"."sectors" to "service_role";

grant select on table "public"."sectors" to "service_role";

grant trigger on table "public"."sectors" to "service_role";

grant truncate on table "public"."sectors" to "service_role";

grant update on table "public"."sectors" to "service_role";

grant delete on table "public"."specialties" to "anon";

grant insert on table "public"."specialties" to "anon";

grant references on table "public"."specialties" to "anon";

grant select on table "public"."specialties" to "anon";

grant trigger on table "public"."specialties" to "anon";

grant truncate on table "public"."specialties" to "anon";

grant update on table "public"."specialties" to "anon";

grant delete on table "public"."specialties" to "authenticated";

grant insert on table "public"."specialties" to "authenticated";

grant references on table "public"."specialties" to "authenticated";

grant select on table "public"."specialties" to "authenticated";

grant trigger on table "public"."specialties" to "authenticated";

grant truncate on table "public"."specialties" to "authenticated";

grant update on table "public"."specialties" to "authenticated";

grant delete on table "public"."specialties" to "service_role";

grant insert on table "public"."specialties" to "service_role";

grant references on table "public"."specialties" to "service_role";

grant select on table "public"."specialties" to "service_role";

grant trigger on table "public"."specialties" to "service_role";

grant truncate on table "public"."specialties" to "service_role";

grant update on table "public"."specialties" to "service_role";

grant delete on table "public"."task_adjustments" to "anon";

grant insert on table "public"."task_adjustments" to "anon";

grant references on table "public"."task_adjustments" to "anon";

grant select on table "public"."task_adjustments" to "anon";

grant trigger on table "public"."task_adjustments" to "anon";

grant truncate on table "public"."task_adjustments" to "anon";

grant update on table "public"."task_adjustments" to "anon";

grant delete on table "public"."task_adjustments" to "authenticated";

grant insert on table "public"."task_adjustments" to "authenticated";

grant references on table "public"."task_adjustments" to "authenticated";

grant select on table "public"."task_adjustments" to "authenticated";

grant trigger on table "public"."task_adjustments" to "authenticated";

grant truncate on table "public"."task_adjustments" to "authenticated";

grant update on table "public"."task_adjustments" to "authenticated";

grant delete on table "public"."task_adjustments" to "service_role";

grant insert on table "public"."task_adjustments" to "service_role";

grant references on table "public"."task_adjustments" to "service_role";

grant select on table "public"."task_adjustments" to "service_role";

grant trigger on table "public"."task_adjustments" to "service_role";

grant truncate on table "public"."task_adjustments" to "service_role";

grant update on table "public"."task_adjustments" to "service_role";

grant delete on table "public"."task_assignees" to "anon";

grant insert on table "public"."task_assignees" to "anon";

grant references on table "public"."task_assignees" to "anon";

grant select on table "public"."task_assignees" to "anon";

grant trigger on table "public"."task_assignees" to "anon";

grant truncate on table "public"."task_assignees" to "anon";

grant update on table "public"."task_assignees" to "anon";

grant delete on table "public"."task_assignees" to "authenticated";

grant insert on table "public"."task_assignees" to "authenticated";

grant references on table "public"."task_assignees" to "authenticated";

grant select on table "public"."task_assignees" to "authenticated";

grant trigger on table "public"."task_assignees" to "authenticated";

grant truncate on table "public"."task_assignees" to "authenticated";

grant update on table "public"."task_assignees" to "authenticated";

grant delete on table "public"."task_assignees" to "service_role";

grant insert on table "public"."task_assignees" to "service_role";

grant references on table "public"."task_assignees" to "service_role";

grant select on table "public"."task_assignees" to "service_role";

grant trigger on table "public"."task_assignees" to "service_role";

grant truncate on table "public"."task_assignees" to "service_role";

grant update on table "public"."task_assignees" to "service_role";


  create policy "Acceso total a auditoria"
  on "public"."audit_logs"
  as permissive
  for all
  to authenticated
using (true)
with check (true);



  create policy "Solo admins ven auditoria"
  on "public"."audit_logs"
  as permissive
  for select
  to public
using (public.check_user_role('Admin'::text));



  create policy "Lectura formatos permitidos"
  on "public"."category_allowed_formats"
  as permissive
  for select
  to public
using (true);



  create policy "Lectura extensiones"
  on "public"."file_extensions"
  as permissive
  for select
  to public
using (true);



  create policy "Permitir leer roles a usuarios autenticados"
  on "public"."internal_roles"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Los usuarios pueden marcar como leídas sus notificaciones"
  on "public"."notifications"
  as permissive
  for update
  to authenticated
using ((auth.uid() = profile_id));



  create policy "Los usuarios solo ven sus notificaciones"
  on "public"."notifications"
  as permissive
  for select
  to authenticated
using ((auth.uid() = profile_id));



  create policy "Permitir borrar entregables"
  on "public"."organization_deliverables"
  as permissive
  for delete
  to public
using (true);



  create policy "Permitir crear entregables"
  on "public"."organization_deliverables"
  as permissive
  for insert
  to public
with check (true);



  create policy "Permitir editar entregables"
  on "public"."organization_deliverables"
  as permissive
  for update
  to public
using (true);



  create policy "Permitir leer entregables"
  on "public"."organization_deliverables"
  as permissive
  for select
  to public
using (true);



  create policy "Admins pueden gestionar listas de distribucion"
  on "public"."organization_distribution_lists"
  as permissive
  for all
  to authenticated
using ((auth.uid() IN ( SELECT profiles.id
   FROM public.profiles
  WHERE ((lower((profiles.internal_role)::text) = 'admin'::text) OR (profiles.is_admin = true)))))
with check ((auth.uid() IN ( SELECT profiles.id
   FROM public.profiles
  WHERE ((lower((profiles.internal_role)::text) = 'admin'::text) OR (profiles.is_admin = true)))));



  create policy "Usuarios pueden ver sus propias asignaciones"
  on "public"."organization_distribution_lists"
  as permissive
  for select
  to authenticated
using ((auth.uid() = profile_id));



  create policy "Lectura de miembros de empresa"
  on "public"."organization_members"
  as permissive
  for select
  to public
using (true);



  create policy "Permitir borrar miembros"
  on "public"."organization_members"
  as permissive
  for delete
  to public
using (true);



  create policy "Permitir insertar miembros"
  on "public"."organization_members"
  as permissive
  for insert
  to public
with check (true);



  create policy "Permitir ver miembros"
  on "public"."organization_members"
  as permissive
  for select
  to public
using (true);



  create policy "Permitir vincular miembros a empresa"
  on "public"."organization_members"
  as permissive
  for insert
  to public
with check (true);



  create policy "Permitir vincular miembros"
  on "public"."organization_members"
  as permissive
  for insert
  to public
with check (true);



  create policy "Staff puede ver miembros de organizaciones"
  on "public"."organization_members"
  as permissive
  for all
  to authenticated
using (true)
with check (true);



  create policy "Lectura publica de empresas"
  on "public"."organizations"
  as permissive
  for select
  to public
using (true);



  create policy "Permitir a clientes actualizar su empresa"
  on "public"."organizations"
  as permissive
  for update
  to authenticated
using ((id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE (organization_members.profile_id = auth.uid()))))
with check ((id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE (organization_members.profile_id = auth.uid()))));



  create policy "Permitir actualizar organizaciones"
  on "public"."organizations"
  as permissive
  for update
  to public
using (true);



  create policy "Permitir crear empresas"
  on "public"."organizations"
  as permissive
  for insert
  to public
with check (true);



  create policy "Permitir lectura de organizaciones"
  on "public"."organizations"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Permitir registro de nuevas empresas"
  on "public"."organizations"
  as permissive
  for insert
  to public
with check (true);



  create policy "Permitir ver empresas"
  on "public"."organizations"
  as permissive
  for select
  to public
using (true);



  create policy "Staff puede ver organizaciones"
  on "public"."organizations"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Lectura prioridades"
  on "public"."priorities"
  as permissive
  for select
  to public
using (true);



  create policy "Permitir lectura de prioridades"
  on "public"."priorities"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Lectura publica de perfiles"
  on "public"."profiles"
  as permissive
  for select
  to public
using (true);



  create policy "Permitir actualizar perfiles"
  on "public"."profiles"
  as permissive
  for update
  to public
using (true);



  create policy "Permitir crear perfiles"
  on "public"."profiles"
  as permissive
  for insert
  to public
with check (true);



  create policy "Permitir a clientes actualizar sus proyectos"
  on "public"."projects"
  as permissive
  for update
  to authenticated
using ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE (organization_members.profile_id = auth.uid()))))
with check ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE (organization_members.profile_id = auth.uid()))));



  create policy "Permitir a clientes crear proyectos"
  on "public"."projects"
  as permissive
  for insert
  to authenticated
with check ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE (organization_members.profile_id = auth.uid()))));



  create policy "Permitir a clientes ver sus proyectos"
  on "public"."projects"
  as permissive
  for select
  to authenticated
using ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE (organization_members.profile_id = auth.uid()))));



  create policy "Permitir lectura de proyectos"
  on "public"."projects"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Staff interno puede crear tableros"
  on "public"."projects"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.is_admin = true) OR (profiles.internal_role IS NOT NULL))))));



  create policy "Lectura categorias"
  on "public"."request_categories"
  as permissive
  for select
  to public
using (true);



  create policy "Cualquiera puede comentar"
  on "public"."request_comments"
  as permissive
  for insert
  to public
with check (true);



  create policy "Lectura de comentarios"
  on "public"."request_comments"
  as permissive
  for select
  to public
using (((is_internal = false) OR (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))));



  create policy "Unrestricted_request_files"
  on "public"."request_files"
  as permissive
  for all
  to authenticated
using (true)
with check (true);



  create policy "Permitir insertar tareas"
  on "public"."request_tasks"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Permitir todo a usuarios logueados en tasks"
  on "public"."request_tasks"
  as permissive
  for all
  to public
using ((auth.role() = 'authenticated'::text))
with check ((auth.role() = 'authenticated'::text));



  create policy "Clientes solo editan sus propios requerimientos"
  on "public"."requests"
  as permissive
  for update
  to authenticated
using ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE (organization_members.profile_id = auth.uid()))));



  create policy "Crear solicitudes"
  on "public"."requests"
  as permissive
  for insert
  to public
with check (true);



  create policy "Permitir leer solicitudes"
  on "public"."requests"
  as permissive
  for select
  to public
using (true);



  create policy "Solo Admin borra"
  on "public"."requests"
  as permissive
  for delete
  to public
using (((( SELECT profiles.internal_role
   FROM public.profiles
  WHERE (profiles.id = auth.uid())))::text = 'Admin'::text));



  create policy "Solo Altos mandos crean"
  on "public"."requests"
  as permissive
  for insert
  to public
with check (((( SELECT profiles.internal_role
   FROM public.profiles
  WHERE (profiles.id = auth.uid())))::text = ANY ((ARRAY['Admin'::character varying, 'Lider'::character varying])::text[])));



  create policy "Staff edita"
  on "public"."requests"
  as permissive
  for update
  to public
using (((( SELECT profiles.internal_role
   FROM public.profiles
  WHERE (profiles.id = auth.uid())))::text = ANY ((ARRAY['Admin'::character varying, 'Lider'::character varying, 'Coordinador'::character varying])::text[])));



  create policy "Todos pueden leer"
  on "public"."requests"
  as permissive
  for select
  to public
using (true);



  create policy "Unrestricted_requests"
  on "public"."requests"
  as permissive
  for all
  to authenticated
using (true)
with check (true);



  create policy "Ver solicitudes"
  on "public"."requests"
  as permissive
  for select
  to public
using (true);



  create policy "Allow public insert on sectors"
  on "public"."sectors"
  as permissive
  for insert
  to public
with check (true);



  create policy "Allow public select on sectors"
  on "public"."sectors"
  as permissive
  for select
  to public
using (true);



  create policy "Permitir actualizar sectores"
  on "public"."sectors"
  as permissive
  for update
  to public
using (true);



  create policy "Permitir borrar sectores"
  on "public"."sectors"
  as permissive
  for delete
  to public
using (true);



  create policy "Permitir insertar sectores"
  on "public"."sectors"
  as permissive
  for insert
  to public
with check (true);



  create policy "Permitir lectura de sectores"
  on "public"."sectors"
  as permissive
  for select
  to public
using (true);



  create policy "Permitir actualizar a usuarios autenticados"
  on "public"."specialties"
  as permissive
  for update
  to authenticated
using (true);



  create policy "Permitir borrar a usuarios autenticados"
  on "public"."specialties"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Permitir insertar a usuarios autenticados"
  on "public"."specialties"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Permitir lectura a usuarios autenticados"
  on "public"."specialties"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Permitir leer especialidades a usuarios autenticados"
  on "public"."specialties"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Permitir actualizar ajustes a autenticados"
  on "public"."task_adjustments"
  as permissive
  for update
  to authenticated
using (true);



  create policy "Permitir borrar ajustes a autenticados"
  on "public"."task_adjustments"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Permitir insertar ajustes a autenticados"
  on "public"."task_adjustments"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Permitir lectura ajustes a autenticados"
  on "public"."task_adjustments"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Permitir todo a usuarios autenticados"
  on "public"."task_assignees"
  as permissive
  for all
  to authenticated
using (true)
with check (true);


CREATE TRIGGER trg_track_revisions AFTER INSERT ON public.request_comments FOR EACH ROW EXECUTE FUNCTION public.fn_track_request_revisions();

CREATE TRIGGER "notificaciones-nexus" AFTER UPDATE ON public.request_tasks FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://kptapytkyyvqiiojmrts.supabase.co/functions/v1/nexus-mailer', 'POST', '{"Content-type":"application/json"}', '{}', '5000');

CREATE TRIGGER trigger_on_task_corrections AFTER UPDATE ON public.request_tasks FOR EACH ROW EXECUTE FUNCTION public.on_task_corrections();

CREATE TRIGGER trigger_on_task_submitted AFTER UPDATE ON public.request_tasks FOR EACH ROW EXECUTE FUNCTION public.on_task_submitted();

CREATE TRIGGER enforce_delivery_file BEFORE UPDATE ON public.requests FOR EACH ROW EXECUTE FUNCTION public.check_delivery_file();

CREATE TRIGGER "notificacion-nueva-solicitud" AFTER INSERT ON public.requests FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://kptapytkyyvqiiojmrts.supabase.co/functions/v1/nexus-mailer', 'POST', '{"Content-type":"application/json"}', '{}', '5000');

CREATE TRIGGER trigger_on_new_request_received AFTER INSERT ON public.requests FOR EACH ROW EXECUTE FUNCTION public.on_new_request_received();

CREATE TRIGGER trigger_on_request_disciplines_updated AFTER UPDATE ON public.requests FOR EACH ROW EXECUTE FUNCTION public.on_request_disciplines_updated();

CREATE TRIGGER trigger_on_task_assigned AFTER INSERT ON public.task_assignees FOR EACH ROW EXECUTE FUNCTION public.on_task_assigned();


  create policy "Allow public insert on client-logos storage"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'client-logos'::text));



  create policy "Allow public select on client-logos storage"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'client-logos'::text));



  create policy "Permitir lectura a request-attachments"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using ((bucket_id = 'request-attachments'::text));



  create policy "Permitir modificar archivos"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using ((bucket_id = 'request-attachments'::text));



  create policy "Permitir uploads a request-attachments"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'request-attachments'::text));



  create policy "Public Access"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'avatars'::text));



  create policy "Public Insert"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'avatars'::text));



