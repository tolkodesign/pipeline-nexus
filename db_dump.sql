


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."request_status" AS ENUM (
    'pendiente',
    'en_proceso',
    'revision',
    'entregado',
    'cancelado',
    'contrapropuesta',
    'en_revision_cliente',
    'completado'
);


ALTER TYPE "public"."request_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_delivery_file"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."check_delivery_file"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_user_role"("required_role" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND LOWER(internal_role) = LOWER(required_role)
  );
END;
$$;


ALTER FUNCTION "public"."check_user_role"("required_role" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_profile_by_admin"("user_email" "text", "user_full_name" "text", "org_id" "uuid", "user_role" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."create_profile_by_admin"("user_email" "text", "user_full_name" "text", "org_id" "uuid", "user_role" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fn_track_request_revisions"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Detecta si el mensaje es una corrección oficial
    IF NEW.is_correction = true THEN
        UPDATE public.requests
        SET revisions_used = revisions_used + 1
        WHERE id = NEW.request_id;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."fn_track_request_revisions"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."on_new_request_received"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
END; $$;


ALTER FUNCTION "public"."on_new_request_received"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."on_request_disciplines_updated"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE v_profile_record RECORD; v_client_name TEXT; v_new_specialty_ids INT[] := ARRAY[]::INT[];
BEGIN
  SELECT COALESCE(name, 'Un cliente Partner') INTO v_client_name FROM public.organizations WHERE id = NEW.organization_id;
  IF NEW.needs_av AND (OLD.needs_av IS DISTINCT FROM TRUE) THEN v_new_specialty_ids := array_append(v_new_specialty_ids, 1); END IF; IF NEW.needs_rp AND (OLD.needs_rp IS DISTINCT FROM TRUE) THEN v_new_specialty_ids := array_append(v_new_specialty_ids, 2); END IF; IF NEW.needs_prod AND (OLD.needs_prod IS DISTINCT FROM TRUE) THEN v_new_specialty_ids := array_append(v_new_specialty_ids, 3); END IF; IF NEW.needs_design AND (OLD.needs_design IS DISTINCT FROM TRUE) THEN v_new_specialty_ids := array_append(v_new_specialty_ids, 4); END IF; IF NEW.needs_copy AND (OLD.needs_copy IS DISTINCT FROM TRUE) THEN v_new_specialty_ids := array_append(v_new_specialty_ids, 5); END IF; IF NEW.needs_dev AND (OLD.needs_dev IS DISTINCT FROM TRUE) THEN v_new_specialty_ids := array_append(v_new_specialty_ids, 6); END IF; IF NEW.needs_staff AND (OLD.needs_staff IS DISTINCT FROM TRUE) THEN v_new_specialty_ids := array_append(v_new_specialty_ids, 7); END IF;
  IF cardinality(v_new_specialty_ids) > 0 THEN FOR v_profile_record IN SELECT id FROM public.profiles WHERE role_id IN (2, 4, 5) AND specialty_id = ANY(v_new_specialty_ids) AND is_active = true LOOP
      INSERT INTO public.notifications (profile_id, title, message, type, action_link) VALUES (v_profile_record.id, 'Área agregada al proyecto', 'Se activó tu célula en el ticket: ' || COALESCE(NEW.title, 'Sin título'), 'alert', '?ticket=' || NEW.id);
  END LOOP; END IF; RETURN NEW;
END; $$;


ALTER FUNCTION "public"."on_request_disciplines_updated"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."on_task_assigned"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE v_discipline TEXT; v_project_title TEXT;
BEGIN
  SELECT rt.discipline, r.title INTO v_discipline, v_project_title FROM public.request_tasks rt JOIN public.requests r ON r.id = rt.request_id WHERE rt.id = NEW.task_id;
  INSERT INTO public.notifications (profile_id, title, message, type, action_link) VALUES (NEW.profile_id, 'Nueva Tarea Asignada', 'Recibiste la pieza de ' || v_discipline || ' para: ' || COALESCE(v_project_title, 'Sin título'), 'info', '?task=' || NEW.task_id);
  RETURN NEW;
END; $$;


ALTER FUNCTION "public"."on_task_assigned"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."on_task_corrections"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE v_profile_id UUID; v_project_title TEXT;
BEGIN
  IF NEW.status = 'con_correcciones' AND OLD.status IS DISTINCT FROM 'con_correcciones' THEN SELECT r.title INTO v_project_title FROM public.requests r WHERE r.id = NEW.request_id;
    FOR v_profile_id IN SELECT profile_id FROM public.task_assignees WHERE task_id = NEW.id LOOP
      INSERT INTO public.notifications (profile_id, title, message, type, action_link) VALUES (v_profile_id, 'Ajustes Requeridos', 'Revisión solicitada en ' || NEW.discipline || ' para: ' || COALESCE(v_project_title, 'Sin título'), 'alert', '?task=' || NEW.id);
  END LOOP; END IF; RETURN NEW;
END; $$;


ALTER FUNCTION "public"."on_task_corrections"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."on_task_submitted"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE v_profile_record RECORD; v_project_title TEXT; v_specialty_id INT;
BEGIN
  IF NEW.status = 'entregado' AND OLD.status IS DISTINCT FROM 'entregado' THEN SELECT title INTO v_project_title FROM public.requests WHERE id = NEW.request_id;
    CASE LOWER(NEW.discipline) WHEN 'audiovisual' THEN v_specialty_id := 1; WHEN 'rp' THEN v_specialty_id := 2; WHEN 'relaciones públicas' THEN v_specialty_id := 2; WHEN 'producción' THEN v_specialty_id := 3; WHEN 'diseño' THEN v_specialty_id := 4; WHEN 'contenido' THEN v_specialty_id := 5; WHEN 'programación' THEN v_specialty_id := 6; WHEN 'staff' THEN v_specialty_id := 7; ELSE v_specialty_id := 0; END CASE;
    FOR v_profile_record IN SELECT id FROM public.profiles WHERE role_id IN (2, 4, 5) AND specialty_id = v_specialty_id AND is_active = true LOOP
      INSERT INTO public.notifications (profile_id, title, message, type, action_link) VALUES (v_profile_record.id, 'Pieza Lista para Revisión', 'Tu célula envió un entregable de ' || NEW.discipline || ' para: ' || COALESCE(v_project_title, 'Sin título'), 'success', '?ticket=' || NEW.request_id);
  END LOOP; END IF; RETURN NEW;
END; $$;


ALTER FUNCTION "public"."on_task_submitted"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
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
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "table_name" "text" NOT NULL,
    "record_id" "uuid" NOT NULL,
    "action" "text" NOT NULL,
    "old_data" "jsonb",
    "new_data" "jsonb",
    "performed_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."audit_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."category_allowed_formats" (
    "category_id" integer NOT NULL,
    "format_id" integer NOT NULL
);


ALTER TABLE "public"."category_allowed_formats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."file_extensions" (
    "id" integer NOT NULL,
    "extension" character varying(10) NOT NULL,
    "is_active" boolean DEFAULT true
);


ALTER TABLE "public"."file_extensions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."file_extensions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."file_extensions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."file_extensions_id_seq" OWNED BY "public"."file_extensions"."id";



CREATE TABLE IF NOT EXISTS "public"."internal_roles" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL
);


ALTER TABLE "public"."internal_roles" OWNER TO "postgres";


ALTER TABLE "public"."internal_roles" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."internal_roles_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "message" "text" NOT NULL,
    "action_link" "text",
    "is_read" boolean DEFAULT false,
    "type" "text" DEFAULT 'info'::"text"
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."organization_deliverables" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "name" character varying NOT NULL,
    "category_id" integer,
    "target_format_id" integer,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "is_package" boolean DEFAULT false,
    "needs_design" boolean DEFAULT false,
    "needs_dev" boolean DEFAULT false,
    "needs_av" boolean DEFAULT false,
    "needs_copy" boolean DEFAULT false,
    "needs_prod" boolean DEFAULT false,
    "needs_staff" boolean DEFAULT false,
    "needs_rp" boolean DEFAULT false
);


ALTER TABLE "public"."organization_deliverables" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."organization_distribution_lists" (
    "organization_id" "uuid" NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."organization_distribution_lists" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."organization_members" (
    "organization_id" "uuid" NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "role_in_org" character varying(255) DEFAULT 'manager'::character varying
);


ALTER TABLE "public"."organization_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."organizations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "logo_url" "text",
    "industry" character varying(100),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "address" "text",
    "primary_color" character varying(7) DEFAULT '#D3002D'::character varying,
    "secondary_color" character varying(7) DEFAULT '#0F0F12'::character varying,
    "banner_url" "text",
    "distribution_email" character varying,
    "is_active" boolean DEFAULT true,
    "has_mailchimp" boolean DEFAULT false
);


ALTER TABLE "public"."organizations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."package_deliverable_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "package_id" "uuid" NOT NULL,
    "item_deliverable_id" "uuid" NOT NULL,
    "quantity" integer DEFAULT 1,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."package_deliverable_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."priorities" (
    "id" integer NOT NULL,
    "level" character varying(20) NOT NULL,
    "color_code" character(7),
    "weight" integer
);


ALTER TABLE "public"."priorities" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."priorities_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."priorities_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."priorities_id_seq" OWNED BY "public"."priorities"."id";



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "full_name" "text",
    "avatar_url" "text",
    "phone" "text",
    "is_admin" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "email" character varying(255),
    "internal_role" character varying(50),
    "specialty" "text",
    "leader_id" "uuid",
    "is_active" boolean DEFAULT true,
    "role_id" integer,
    "specialty_id" integer
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "name" character varying NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "banner_url" "text"
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."request_categories" (
    "id" integer NOT NULL,
    "name" character varying(50) NOT NULL,
    "is_active" boolean DEFAULT true
);


ALTER TABLE "public"."request_categories" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."request_categories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."request_categories_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."request_categories_id_seq" OWNED BY "public"."request_categories"."id";



CREATE TABLE IF NOT EXISTS "public"."request_comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "request_id" "uuid",
    "user_id" "uuid",
    "message" "text" NOT NULL,
    "is_internal" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "is_correction" boolean DEFAULT false
);


ALTER TABLE "public"."request_comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."request_files" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "request_id" "uuid",
    "storage_path" "text" NOT NULL,
    "file_type" character varying(20),
    "uploader_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "request_files_file_type_check" CHECK ((("file_type")::"text" = ANY ((ARRAY['input'::character varying, 'output'::character varying])::"text"[])))
);


ALTER TABLE "public"."request_files" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."request_tasks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "request_id" "uuid",
    "discipline" "text" NOT NULL,
    "assigned_to" "uuid"[],
    "status" "text" DEFAULT 'pendiente'::"text",
    "quantity" integer DEFAULT 1,
    "deliverable_url" "text",
    "delivery_notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "coordinator_notes" "text"
);


ALTER TABLE "public"."request_tasks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."request_tasks_respaldo" (
    "id" "uuid",
    "request_id" "uuid",
    "discipline" "text",
    "assigned_to" "uuid"[],
    "status" "text",
    "quantity" integer,
    "deliverable_url" "text",
    "delivery_notes" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "coordinator_notes" "text"
);


ALTER TABLE "public"."request_tasks_respaldo" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "requester_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "priority_id" integer,
    "category_id" integer,
    "target_format_id" integer,
    "description" "text",
    "status" "public"."request_status" DEFAULT 'pendiente'::"public"."request_status",
    "due_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "project_month" character varying(20),
    "department" character varying(50),
    "request_date" "date" DEFAULT CURRENT_DATE,
    "quantity" integer DEFAULT 1,
    "external_resource_url" "text",
    "project_id" "uuid",
    "needs_design" boolean DEFAULT false,
    "needs_dev" boolean DEFAULT false,
    "needs_av" boolean DEFAULT false,
    "needs_copy" boolean DEFAULT false,
    "max_revisions" integer DEFAULT 2,
    "revisions_used" integer DEFAULT 0,
    "final_deliverable_url" "text",
    "total_adjustments" integer DEFAULT 0,
    "organization_deliverable_id" "uuid",
    "cc_emails" "text",
    "needs_prod" boolean DEFAULT false,
    "needs_staff" boolean DEFAULT false,
    "needs_rp" boolean DEFAULT false,
    "send_email_notification" boolean DEFAULT true,
    "original_due_date" "date",
    "delivered_at" timestamp with time zone,
    "reopened_at" timestamp with time zone,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "items_breakdown" "jsonb" DEFAULT '[]'::"jsonb",
    "editing_hours" numeric DEFAULT 0,
    "page_or_slide_count" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "cancellation_reason" "text",
    "cierre_solicitado" boolean DEFAULT false
);


ALTER TABLE "public"."requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sectors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying NOT NULL
);


ALTER TABLE "public"."sectors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."specialties" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL
);


ALTER TABLE "public"."specialties" OWNER TO "postgres";


ALTER TABLE "public"."specialties" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."specialties_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."task_adjustments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "task_id" "uuid" NOT NULL,
    "description" "text" NOT NULL,
    "origin" "text" NOT NULL,
    "is_internal" boolean DEFAULT true NOT NULL,
    "status" "text" DEFAULT 'pendiente'::"text" NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "resolved_at" timestamp with time zone,
    CONSTRAINT "task_adjustments_origin_check" CHECK (("origin" = ANY (ARRAY['cliente'::"text", 'agencia'::"text"]))),
    CONSTRAINT "task_adjustments_status_check" CHECK (("status" = ANY (ARRAY['pendiente'::"text", 'resuelto'::"text"])))
);


ALTER TABLE "public"."task_adjustments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."task_assignees" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "task_id" "uuid" NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "assigned_by" "uuid",
    "assigned_quantity" integer DEFAULT 1,
    "specific_instructions" "text",
    "deliverable_url" "text",
    "delivery_notes" "text",
    "status" "text" DEFAULT 'pendiente'::"text",
    "completed_at" timestamp with time zone,
    "due_date" "date",
    "assigned_items" "jsonb" DEFAULT '[]'::"jsonb"
);


ALTER TABLE "public"."task_assignees" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."task_assignees_respaldo" (
    "id" "uuid",
    "task_id" "uuid",
    "profile_id" "uuid",
    "created_at" timestamp with time zone,
    "assigned_by" "uuid",
    "assigned_quantity" integer,
    "specific_instructions" "text",
    "deliverable_url" "text",
    "delivery_notes" "text",
    "status" "text",
    "completed_at" timestamp with time zone,
    "due_date" "date",
    "assigned_items" "jsonb"
);


ALTER TABLE "public"."task_assignees_respaldo" OWNER TO "postgres";


ALTER TABLE ONLY "public"."file_extensions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."file_extensions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."priorities" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."priorities_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."request_categories" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."request_categories_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."category_allowed_formats"
    ADD CONSTRAINT "category_allowed_formats_pkey" PRIMARY KEY ("category_id", "format_id");



ALTER TABLE ONLY "public"."file_extensions"
    ADD CONSTRAINT "file_extensions_extension_key" UNIQUE ("extension");



ALTER TABLE ONLY "public"."file_extensions"
    ADD CONSTRAINT "file_extensions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."internal_roles"
    ADD CONSTRAINT "internal_roles_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."internal_roles"
    ADD CONSTRAINT "internal_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."organization_deliverables"
    ADD CONSTRAINT "org_deliverables_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."organization_distribution_lists"
    ADD CONSTRAINT "organization_distribution_lists_pkey" PRIMARY KEY ("organization_id", "profile_id");



ALTER TABLE ONLY "public"."organization_members"
    ADD CONSTRAINT "organization_members_pkey" PRIMARY KEY ("organization_id", "profile_id");



ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organizations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."package_deliverable_items"
    ADD CONSTRAINT "package_deliverable_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."priorities"
    ADD CONSTRAINT "priorities_level_key" UNIQUE ("level");



ALTER TABLE ONLY "public"."priorities"
    ADD CONSTRAINT "priorities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."request_categories"
    ADD CONSTRAINT "request_categories_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."request_categories"
    ADD CONSTRAINT "request_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."request_comments"
    ADD CONSTRAINT "request_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."request_files"
    ADD CONSTRAINT "request_files_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."request_tasks"
    ADD CONSTRAINT "request_tasks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."requests"
    ADD CONSTRAINT "requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sectors"
    ADD CONSTRAINT "sectors_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."sectors"
    ADD CONSTRAINT "sectors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."specialties"
    ADD CONSTRAINT "specialties_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."specialties"
    ADD CONSTRAINT "specialties_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."task_adjustments"
    ADD CONSTRAINT "task_adjustments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."task_assignees"
    ADD CONSTRAINT "task_assignees_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."task_assignees"
    ADD CONSTRAINT "task_assignees_task_id_profile_id_key" UNIQUE ("task_id", "profile_id");



CREATE OR REPLACE TRIGGER "enforce_delivery_file" BEFORE UPDATE ON "public"."requests" FOR EACH ROW EXECUTE FUNCTION "public"."check_delivery_file"();



CREATE OR REPLACE TRIGGER "notificacion-nueva-solicitud" AFTER INSERT ON "public"."requests" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://kptapytkyyvqiiojmrts.supabase.co/functions/v1/nexus-mailer', 'POST', '{"Content-type":"application/json"}', '{}', '5000');



CREATE OR REPLACE TRIGGER "notificaciones-nexus" AFTER UPDATE ON "public"."request_tasks" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://kptapytkyyvqiiojmrts.supabase.co/functions/v1/nexus-mailer', 'POST', '{"Content-type":"application/json"}', '{}', '5000');



CREATE OR REPLACE TRIGGER "trg_track_revisions" AFTER INSERT ON "public"."request_comments" FOR EACH ROW EXECUTE FUNCTION "public"."fn_track_request_revisions"();



CREATE OR REPLACE TRIGGER "trigger_on_new_request_received" AFTER INSERT ON "public"."requests" FOR EACH ROW EXECUTE FUNCTION "public"."on_new_request_received"();



CREATE OR REPLACE TRIGGER "trigger_on_request_disciplines_updated" AFTER UPDATE ON "public"."requests" FOR EACH ROW EXECUTE FUNCTION "public"."on_request_disciplines_updated"();



CREATE OR REPLACE TRIGGER "trigger_on_task_assigned" AFTER INSERT ON "public"."task_assignees" FOR EACH ROW EXECUTE FUNCTION "public"."on_task_assigned"();



CREATE OR REPLACE TRIGGER "trigger_on_task_corrections" AFTER UPDATE ON "public"."request_tasks" FOR EACH ROW EXECUTE FUNCTION "public"."on_task_corrections"();



CREATE OR REPLACE TRIGGER "trigger_on_task_submitted" AFTER UPDATE ON "public"."request_tasks" FOR EACH ROW EXECUTE FUNCTION "public"."on_task_submitted"();



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."category_allowed_formats"
    ADD CONSTRAINT "category_allowed_formats_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."request_categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."category_allowed_formats"
    ADD CONSTRAINT "category_allowed_formats_format_id_fkey" FOREIGN KEY ("format_id") REFERENCES "public"."file_extensions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."organization_deliverables"
    ADD CONSTRAINT "org_deliverables_category_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."request_categories"("id");



ALTER TABLE ONLY "public"."organization_deliverables"
    ADD CONSTRAINT "org_deliverables_format_fkey" FOREIGN KEY ("target_format_id") REFERENCES "public"."file_extensions"("id");



ALTER TABLE ONLY "public"."organization_deliverables"
    ADD CONSTRAINT "org_deliverables_org_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."organization_distribution_lists"
    ADD CONSTRAINT "organization_distribution_lists_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."organization_distribution_lists"
    ADD CONSTRAINT "organization_distribution_lists_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."organization_members"
    ADD CONSTRAINT "organization_members_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."organization_members"
    ADD CONSTRAINT "organization_members_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."package_deliverable_items"
    ADD CONSTRAINT "package_deliverable_items_item_deliverable_id_fkey" FOREIGN KEY ("item_deliverable_id") REFERENCES "public"."organization_deliverables"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."package_deliverable_items"
    ADD CONSTRAINT "package_deliverable_items_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "public"."organization_deliverables"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."internal_roles"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "public"."specialties"("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."request_comments"
    ADD CONSTRAINT "request_comments_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."request_comments"
    ADD CONSTRAINT "request_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."request_files"
    ADD CONSTRAINT "request_files_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."request_files"
    ADD CONSTRAINT "request_files_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."request_tasks"
    ADD CONSTRAINT "request_tasks_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."requests"
    ADD CONSTRAINT "requests_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."request_categories"("id");



ALTER TABLE ONLY "public"."requests"
    ADD CONSTRAINT "requests_organization_deliverable_id_fkey" FOREIGN KEY ("organization_deliverable_id") REFERENCES "public"."organization_deliverables"("id");



ALTER TABLE ONLY "public"."requests"
    ADD CONSTRAINT "requests_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id");



ALTER TABLE ONLY "public"."requests"
    ADD CONSTRAINT "requests_priority_id_fkey" FOREIGN KEY ("priority_id") REFERENCES "public"."priorities"("id");



ALTER TABLE ONLY "public"."requests"
    ADD CONSTRAINT "requests_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."requests"
    ADD CONSTRAINT "requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."requests"
    ADD CONSTRAINT "requests_target_format_id_fkey" FOREIGN KEY ("target_format_id") REFERENCES "public"."file_extensions"("id");



ALTER TABLE ONLY "public"."task_adjustments"
    ADD CONSTRAINT "task_adjustments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."task_adjustments"
    ADD CONSTRAINT "task_adjustments_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."request_tasks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."task_assignees"
    ADD CONSTRAINT "task_assignees_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."task_assignees"
    ADD CONSTRAINT "task_assignees_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."task_assignees"
    ADD CONSTRAINT "task_assignees_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."request_tasks"("id") ON DELETE CASCADE;



CREATE POLICY "Acceso total a auditoria" ON "public"."audit_logs" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Acceso total para usuarios autenticados en file_extensions" ON "public"."file_extensions" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Acceso total para usuarios autenticados en organization_deliver" ON "public"."organization_deliverables" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Acceso total para usuarios autenticados en package_deliverable_" ON "public"."package_deliverable_items" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Acceso total para usuarios autenticados en request_categories" ON "public"."request_categories" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Admins pueden gestionar listas de distribucion" ON "public"."organization_distribution_lists" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE (("lower"(("profiles"."internal_role")::"text") = 'admin'::"text") OR ("profiles"."is_admin" = true))))) WITH CHECK (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE (("lower"(("profiles"."internal_role")::"text") = 'admin'::"text") OR ("profiles"."is_admin" = true)))));



CREATE POLICY "Allow public insert on sectors" ON "public"."sectors" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow public select on sectors" ON "public"."sectors" FOR SELECT USING (true);



CREATE POLICY "Clientes solo editan sus propios requerimientos" ON "public"."requests" FOR UPDATE TO "authenticated" USING (("organization_id" IN ( SELECT "organization_members"."organization_id"
   FROM "public"."organization_members"
  WHERE ("organization_members"."profile_id" = "auth"."uid"()))));



CREATE POLICY "Crear solicitudes" ON "public"."requests" FOR INSERT WITH CHECK (true);



CREATE POLICY "Cualquiera puede comentar" ON "public"."request_comments" FOR INSERT WITH CHECK (true);



CREATE POLICY "Lectura categorias" ON "public"."request_categories" FOR SELECT USING (true);



CREATE POLICY "Lectura de comentarios" ON "public"."request_comments" FOR SELECT USING ((("is_internal" = false) OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true))))));



CREATE POLICY "Lectura de miembros de empresa" ON "public"."organization_members" FOR SELECT USING (true);



CREATE POLICY "Lectura extensiones" ON "public"."file_extensions" FOR SELECT USING (true);



CREATE POLICY "Lectura formatos permitidos" ON "public"."category_allowed_formats" FOR SELECT USING (true);



CREATE POLICY "Lectura prioridades" ON "public"."priorities" FOR SELECT USING (true);



CREATE POLICY "Lectura publica de empresas" ON "public"."organizations" FOR SELECT USING (true);



CREATE POLICY "Lectura publica de perfiles" ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Los usuarios pueden marcar como leídas sus notificaciones" ON "public"."notifications" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "profile_id"));



CREATE POLICY "Los usuarios solo ven sus notificaciones" ON "public"."notifications" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "profile_id"));



CREATE POLICY "Permitir a clientes actualizar su empresa" ON "public"."organizations" FOR UPDATE TO "authenticated" USING (("id" IN ( SELECT "organization_members"."organization_id"
   FROM "public"."organization_members"
  WHERE ("organization_members"."profile_id" = "auth"."uid"())))) WITH CHECK (("id" IN ( SELECT "organization_members"."organization_id"
   FROM "public"."organization_members"
  WHERE ("organization_members"."profile_id" = "auth"."uid"()))));



CREATE POLICY "Permitir a clientes actualizar sus proyectos" ON "public"."projects" FOR UPDATE TO "authenticated" USING (("organization_id" IN ( SELECT "organization_members"."organization_id"
   FROM "public"."organization_members"
  WHERE ("organization_members"."profile_id" = "auth"."uid"())))) WITH CHECK (("organization_id" IN ( SELECT "organization_members"."organization_id"
   FROM "public"."organization_members"
  WHERE ("organization_members"."profile_id" = "auth"."uid"()))));



CREATE POLICY "Permitir a clientes crear proyectos" ON "public"."projects" FOR INSERT TO "authenticated" WITH CHECK (("organization_id" IN ( SELECT "organization_members"."organization_id"
   FROM "public"."organization_members"
  WHERE ("organization_members"."profile_id" = "auth"."uid"()))));



CREATE POLICY "Permitir a clientes ver sus proyectos" ON "public"."projects" FOR SELECT TO "authenticated" USING (("organization_id" IN ( SELECT "organization_members"."organization_id"
   FROM "public"."organization_members"
  WHERE ("organization_members"."profile_id" = "auth"."uid"()))));



CREATE POLICY "Permitir actualizar a usuarios autenticados" ON "public"."specialties" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Permitir actualizar ajustes a autenticados" ON "public"."task_adjustments" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Permitir actualizar organizaciones" ON "public"."organizations" FOR UPDATE USING (true);



CREATE POLICY "Permitir actualizar perfiles" ON "public"."profiles" FOR UPDATE USING (true);



CREATE POLICY "Permitir actualizar sectores" ON "public"."sectors" FOR UPDATE USING (true);



CREATE POLICY "Permitir borrar a usuarios autenticados" ON "public"."specialties" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Permitir borrar ajustes a autenticados" ON "public"."task_adjustments" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Permitir borrar entregables" ON "public"."organization_deliverables" FOR DELETE USING (true);



CREATE POLICY "Permitir borrar miembros" ON "public"."organization_members" FOR DELETE USING (true);



CREATE POLICY "Permitir borrar sectores" ON "public"."sectors" FOR DELETE USING (true);



CREATE POLICY "Permitir crear empresas" ON "public"."organizations" FOR INSERT WITH CHECK (true);



CREATE POLICY "Permitir crear entregables" ON "public"."organization_deliverables" FOR INSERT WITH CHECK (true);



CREATE POLICY "Permitir crear perfiles" ON "public"."profiles" FOR INSERT WITH CHECK (true);



CREATE POLICY "Permitir editar entregables" ON "public"."organization_deliverables" FOR UPDATE USING (true);



CREATE POLICY "Permitir insertar a usuarios autenticados" ON "public"."specialties" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Permitir insertar ajustes a autenticados" ON "public"."task_adjustments" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Permitir insertar miembros" ON "public"."organization_members" FOR INSERT WITH CHECK (true);



CREATE POLICY "Permitir insertar sectores" ON "public"."sectors" FOR INSERT WITH CHECK (true);



CREATE POLICY "Permitir insertar tareas" ON "public"."request_tasks" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Permitir lectura a usuarios autenticados" ON "public"."specialties" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Permitir lectura ajustes a autenticados" ON "public"."task_adjustments" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Permitir lectura de organizaciones" ON "public"."organizations" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Permitir lectura de prioridades" ON "public"."priorities" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Permitir lectura de proyectos" ON "public"."projects" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Permitir lectura de sectores" ON "public"."sectors" FOR SELECT USING (true);



CREATE POLICY "Permitir leer entregables" ON "public"."organization_deliverables" FOR SELECT USING (true);



CREATE POLICY "Permitir leer especialidades a usuarios autenticados" ON "public"."specialties" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Permitir leer roles a usuarios autenticados" ON "public"."internal_roles" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Permitir leer solicitudes" ON "public"."requests" FOR SELECT USING (true);



CREATE POLICY "Permitir registro de nuevas empresas" ON "public"."organizations" FOR INSERT WITH CHECK (true);



CREATE POLICY "Permitir todo a usuarios autenticados" ON "public"."task_assignees" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Permitir todo a usuarios logueados en tasks" ON "public"."request_tasks" USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Permitir ver empresas" ON "public"."organizations" FOR SELECT USING (true);



CREATE POLICY "Permitir ver miembros" ON "public"."organization_members" FOR SELECT USING (true);



CREATE POLICY "Permitir vincular miembros" ON "public"."organization_members" FOR INSERT WITH CHECK (true);



CREATE POLICY "Permitir vincular miembros a empresa" ON "public"."organization_members" FOR INSERT WITH CHECK (true);



CREATE POLICY "Solo Admin borra" ON "public"."requests" FOR DELETE USING (((( SELECT "profiles"."internal_role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())))::"text" = 'Admin'::"text"));



CREATE POLICY "Solo Altos mandos crean" ON "public"."requests" FOR INSERT WITH CHECK (((( SELECT "profiles"."internal_role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())))::"text" = ANY ((ARRAY['Admin'::character varying, 'Lider'::character varying])::"text"[])));



CREATE POLICY "Solo admins ven auditoria" ON "public"."audit_logs" FOR SELECT USING ("public"."check_user_role"('Admin'::"text"));



CREATE POLICY "Staff edita" ON "public"."requests" FOR UPDATE USING (((( SELECT "profiles"."internal_role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())))::"text" = ANY ((ARRAY['Admin'::character varying, 'Lider'::character varying, 'Coordinador'::character varying])::"text"[])));



CREATE POLICY "Staff interno puede crear tableros" ON "public"."projects" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND (("profiles"."is_admin" = true) OR ("profiles"."internal_role" IS NOT NULL))))));



CREATE POLICY "Staff puede ver miembros de organizaciones" ON "public"."organization_members" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Staff puede ver organizaciones" ON "public"."organizations" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Todos pueden leer" ON "public"."requests" FOR SELECT USING (true);



CREATE POLICY "Unrestricted_request_files" ON "public"."request_files" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Unrestricted_requests" ON "public"."requests" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Usuarios pueden ver sus propias asignaciones" ON "public"."organization_distribution_lists" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "profile_id"));



CREATE POLICY "Ver solicitudes" ON "public"."requests" FOR SELECT USING (true);



ALTER TABLE "public"."audit_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."category_allowed_formats" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."file_extensions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."internal_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."organization_deliverables" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."organization_distribution_lists" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."organization_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."organizations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."package_deliverable_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."priorities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."request_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."request_comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."request_files" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."request_tasks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."request_tasks_respaldo" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sectors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."specialties" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."task_adjustments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."task_assignees" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."task_assignees_respaldo" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."notifications";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."check_delivery_file"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_delivery_file"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_delivery_file"() TO "service_role";



GRANT ALL ON FUNCTION "public"."check_user_role"("required_role" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."check_user_role"("required_role" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_user_role"("required_role" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_profile_by_admin"("user_email" "text", "user_full_name" "text", "org_id" "uuid", "user_role" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_profile_by_admin"("user_email" "text", "user_full_name" "text", "org_id" "uuid", "user_role" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_profile_by_admin"("user_email" "text", "user_full_name" "text", "org_id" "uuid", "user_role" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."fn_track_request_revisions"() TO "anon";
GRANT ALL ON FUNCTION "public"."fn_track_request_revisions"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_track_request_revisions"() TO "service_role";



GRANT ALL ON FUNCTION "public"."on_new_request_received"() TO "anon";
GRANT ALL ON FUNCTION "public"."on_new_request_received"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."on_new_request_received"() TO "service_role";



GRANT ALL ON FUNCTION "public"."on_request_disciplines_updated"() TO "anon";
GRANT ALL ON FUNCTION "public"."on_request_disciplines_updated"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."on_request_disciplines_updated"() TO "service_role";



GRANT ALL ON FUNCTION "public"."on_task_assigned"() TO "anon";
GRANT ALL ON FUNCTION "public"."on_task_assigned"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."on_task_assigned"() TO "service_role";



GRANT ALL ON FUNCTION "public"."on_task_corrections"() TO "anon";
GRANT ALL ON FUNCTION "public"."on_task_corrections"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."on_task_corrections"() TO "service_role";



GRANT ALL ON FUNCTION "public"."on_task_submitted"() TO "anon";
GRANT ALL ON FUNCTION "public"."on_task_submitted"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."on_task_submitted"() TO "service_role";



GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";


















GRANT ALL ON TABLE "public"."audit_logs" TO "anon";
GRANT ALL ON TABLE "public"."audit_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."audit_logs" TO "service_role";



GRANT ALL ON TABLE "public"."category_allowed_formats" TO "anon";
GRANT ALL ON TABLE "public"."category_allowed_formats" TO "authenticated";
GRANT ALL ON TABLE "public"."category_allowed_formats" TO "service_role";



GRANT ALL ON TABLE "public"."file_extensions" TO "anon";
GRANT ALL ON TABLE "public"."file_extensions" TO "authenticated";
GRANT ALL ON TABLE "public"."file_extensions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."file_extensions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."file_extensions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."file_extensions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."internal_roles" TO "anon";
GRANT ALL ON TABLE "public"."internal_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."internal_roles" TO "service_role";



GRANT ALL ON SEQUENCE "public"."internal_roles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."internal_roles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."internal_roles_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."organization_deliverables" TO "anon";
GRANT ALL ON TABLE "public"."organization_deliverables" TO "authenticated";
GRANT ALL ON TABLE "public"."organization_deliverables" TO "service_role";



GRANT ALL ON TABLE "public"."organization_distribution_lists" TO "anon";
GRANT ALL ON TABLE "public"."organization_distribution_lists" TO "authenticated";
GRANT ALL ON TABLE "public"."organization_distribution_lists" TO "service_role";



GRANT ALL ON TABLE "public"."organization_members" TO "anon";
GRANT ALL ON TABLE "public"."organization_members" TO "authenticated";
GRANT ALL ON TABLE "public"."organization_members" TO "service_role";



GRANT ALL ON TABLE "public"."organizations" TO "anon";
GRANT ALL ON TABLE "public"."organizations" TO "authenticated";
GRANT ALL ON TABLE "public"."organizations" TO "service_role";



GRANT ALL ON TABLE "public"."package_deliverable_items" TO "anon";
GRANT ALL ON TABLE "public"."package_deliverable_items" TO "authenticated";
GRANT ALL ON TABLE "public"."package_deliverable_items" TO "service_role";



GRANT ALL ON TABLE "public"."priorities" TO "anon";
GRANT ALL ON TABLE "public"."priorities" TO "authenticated";
GRANT ALL ON TABLE "public"."priorities" TO "service_role";



GRANT ALL ON SEQUENCE "public"."priorities_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."priorities_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."priorities_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";



GRANT ALL ON TABLE "public"."request_categories" TO "anon";
GRANT ALL ON TABLE "public"."request_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."request_categories" TO "service_role";



GRANT ALL ON SEQUENCE "public"."request_categories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."request_categories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."request_categories_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."request_comments" TO "anon";
GRANT ALL ON TABLE "public"."request_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."request_comments" TO "service_role";



GRANT ALL ON TABLE "public"."request_files" TO "anon";
GRANT ALL ON TABLE "public"."request_files" TO "authenticated";
GRANT ALL ON TABLE "public"."request_files" TO "service_role";



GRANT ALL ON TABLE "public"."request_tasks" TO "anon";
GRANT ALL ON TABLE "public"."request_tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."request_tasks" TO "service_role";



GRANT ALL ON TABLE "public"."request_tasks_respaldo" TO "anon";
GRANT ALL ON TABLE "public"."request_tasks_respaldo" TO "authenticated";
GRANT ALL ON TABLE "public"."request_tasks_respaldo" TO "service_role";



GRANT ALL ON TABLE "public"."requests" TO "anon";
GRANT ALL ON TABLE "public"."requests" TO "authenticated";
GRANT ALL ON TABLE "public"."requests" TO "service_role";



GRANT ALL ON TABLE "public"."sectors" TO "anon";
GRANT ALL ON TABLE "public"."sectors" TO "authenticated";
GRANT ALL ON TABLE "public"."sectors" TO "service_role";



GRANT ALL ON TABLE "public"."specialties" TO "anon";
GRANT ALL ON TABLE "public"."specialties" TO "authenticated";
GRANT ALL ON TABLE "public"."specialties" TO "service_role";



GRANT ALL ON SEQUENCE "public"."specialties_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."specialties_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."specialties_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."task_adjustments" TO "anon";
GRANT ALL ON TABLE "public"."task_adjustments" TO "authenticated";
GRANT ALL ON TABLE "public"."task_adjustments" TO "service_role";



GRANT ALL ON TABLE "public"."task_assignees" TO "anon";
GRANT ALL ON TABLE "public"."task_assignees" TO "authenticated";
GRANT ALL ON TABLE "public"."task_assignees" TO "service_role";



GRANT ALL ON TABLE "public"."task_assignees_respaldo" TO "anon";
GRANT ALL ON TABLE "public"."task_assignees_respaldo" TO "authenticated";
GRANT ALL ON TABLE "public"."task_assignees_respaldo" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";



































