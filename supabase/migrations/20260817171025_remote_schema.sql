drop policy "Solo Altos mandos crean" on "public"."requests";

drop policy "Staff edita" on "public"."requests";

alter table "public"."request_files" drop constraint "request_files_file_type_check";


  create table "public"."request_tasks_respaldo" (
    "id" uuid,
    "request_id" uuid,
    "discipline" text,
    "assigned_to" uuid[],
    "status" text,
    "quantity" integer,
    "deliverable_url" text,
    "delivery_notes" text,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "coordinator_notes" text
      );


alter table "public"."request_tasks_respaldo" enable row level security;


  create table "public"."task_assignees_respaldo" (
    "id" uuid,
    "task_id" uuid,
    "profile_id" uuid,
    "created_at" timestamp with time zone,
    "assigned_by" uuid,
    "assigned_quantity" integer,
    "specific_instructions" text,
    "deliverable_url" text,
    "delivery_notes" text,
    "status" text,
    "completed_at" timestamp with time zone,
    "due_date" date,
    "assigned_items" jsonb
      );


alter table "public"."task_assignees_respaldo" enable row level security;

alter table "public"."requests" add column "cancellation_reason" text;

alter table "public"."requests" add column "cierre_solicitado" boolean default false;

alter table "public"."requests" add column "is_active" boolean default true;

alter table "public"."request_files" add constraint "request_files_file_type_check" CHECK (((file_type)::text = ANY ((ARRAY['input'::character varying, 'output'::character varying])::text[]))) not valid;

alter table "public"."request_files" validate constraint "request_files_file_type_check";

grant delete on table "public"."request_tasks_respaldo" to "anon";

grant insert on table "public"."request_tasks_respaldo" to "anon";

grant references on table "public"."request_tasks_respaldo" to "anon";

grant select on table "public"."request_tasks_respaldo" to "anon";

grant trigger on table "public"."request_tasks_respaldo" to "anon";

grant truncate on table "public"."request_tasks_respaldo" to "anon";

grant update on table "public"."request_tasks_respaldo" to "anon";

grant delete on table "public"."request_tasks_respaldo" to "authenticated";

grant insert on table "public"."request_tasks_respaldo" to "authenticated";

grant references on table "public"."request_tasks_respaldo" to "authenticated";

grant select on table "public"."request_tasks_respaldo" to "authenticated";

grant trigger on table "public"."request_tasks_respaldo" to "authenticated";

grant truncate on table "public"."request_tasks_respaldo" to "authenticated";

grant update on table "public"."request_tasks_respaldo" to "authenticated";

grant delete on table "public"."request_tasks_respaldo" to "service_role";

grant insert on table "public"."request_tasks_respaldo" to "service_role";

grant references on table "public"."request_tasks_respaldo" to "service_role";

grant select on table "public"."request_tasks_respaldo" to "service_role";

grant trigger on table "public"."request_tasks_respaldo" to "service_role";

grant truncate on table "public"."request_tasks_respaldo" to "service_role";

grant update on table "public"."request_tasks_respaldo" to "service_role";

grant delete on table "public"."task_assignees_respaldo" to "anon";

grant insert on table "public"."task_assignees_respaldo" to "anon";

grant references on table "public"."task_assignees_respaldo" to "anon";

grant select on table "public"."task_assignees_respaldo" to "anon";

grant trigger on table "public"."task_assignees_respaldo" to "anon";

grant truncate on table "public"."task_assignees_respaldo" to "anon";

grant update on table "public"."task_assignees_respaldo" to "anon";

grant delete on table "public"."task_assignees_respaldo" to "authenticated";

grant insert on table "public"."task_assignees_respaldo" to "authenticated";

grant references on table "public"."task_assignees_respaldo" to "authenticated";

grant select on table "public"."task_assignees_respaldo" to "authenticated";

grant trigger on table "public"."task_assignees_respaldo" to "authenticated";

grant truncate on table "public"."task_assignees_respaldo" to "authenticated";

grant update on table "public"."task_assignees_respaldo" to "authenticated";

grant delete on table "public"."task_assignees_respaldo" to "service_role";

grant insert on table "public"."task_assignees_respaldo" to "service_role";

grant references on table "public"."task_assignees_respaldo" to "service_role";

grant select on table "public"."task_assignees_respaldo" to "service_role";

grant trigger on table "public"."task_assignees_respaldo" to "service_role";

grant truncate on table "public"."task_assignees_respaldo" to "service_role";

grant update on table "public"."task_assignees_respaldo" to "service_role";


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



