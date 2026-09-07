drop policy "Solo Altos mandos crean" on "public"."requests";

drop policy "Staff edita" on "public"."requests";

alter table "public"."request_files" drop constraint "request_files_file_type_check";


  create table "public"."package_deliverable_items" (
    "id" uuid not null default gen_random_uuid(),
    "package_id" uuid not null,
    "item_deliverable_id" uuid not null,
    "quantity" integer default 1,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."package_deliverable_items" enable row level security;

alter table "public"."file_extensions" add column "is_active" boolean default true;

alter table "public"."organization_deliverables" add column "is_package" boolean default false;

alter table "public"."organization_deliverables" add column "needs_av" boolean default false;

alter table "public"."organization_deliverables" add column "needs_copy" boolean default false;

alter table "public"."organization_deliverables" add column "needs_design" boolean default false;

alter table "public"."organization_deliverables" add column "needs_dev" boolean default false;

alter table "public"."organization_deliverables" add column "needs_prod" boolean default false;

alter table "public"."organization_deliverables" add column "needs_rp" boolean default false;

alter table "public"."organization_deliverables" add column "needs_staff" boolean default false;

alter table "public"."request_categories" add column "is_active" boolean default true;

alter table "public"."requests" add column "items_breakdown" jsonb default '[]'::jsonb;

alter table "public"."task_assignees" add column "assigned_by" uuid;

alter table "public"."task_assignees" add column "assigned_items" jsonb default '[]'::jsonb;

alter table "public"."task_assignees" add column "assigned_quantity" integer default 1;

alter table "public"."task_assignees" add column "completed_at" timestamp with time zone;

alter table "public"."task_assignees" add column "deliverable_url" text;

alter table "public"."task_assignees" add column "delivery_notes" text;

alter table "public"."task_assignees" add column "due_date" date;

alter table "public"."task_assignees" add column "specific_instructions" text;

alter table "public"."task_assignees" add column "status" text default 'pendiente'::text;

CREATE UNIQUE INDEX package_deliverable_items_pkey ON public.package_deliverable_items USING btree (id);

alter table "public"."package_deliverable_items" add constraint "package_deliverable_items_pkey" PRIMARY KEY using index "package_deliverable_items_pkey";

alter table "public"."package_deliverable_items" add constraint "package_deliverable_items_item_deliverable_id_fkey" FOREIGN KEY (item_deliverable_id) REFERENCES public.organization_deliverables(id) ON DELETE CASCADE not valid;

alter table "public"."package_deliverable_items" validate constraint "package_deliverable_items_item_deliverable_id_fkey";

alter table "public"."package_deliverable_items" add constraint "package_deliverable_items_package_id_fkey" FOREIGN KEY (package_id) REFERENCES public.organization_deliverables(id) ON DELETE CASCADE not valid;

alter table "public"."package_deliverable_items" validate constraint "package_deliverable_items_package_id_fkey";

alter table "public"."task_assignees" add constraint "task_assignees_assigned_by_fkey" FOREIGN KEY (assigned_by) REFERENCES public.profiles(id) not valid;

alter table "public"."task_assignees" validate constraint "task_assignees_assigned_by_fkey";

alter table "public"."request_files" add constraint "request_files_file_type_check" CHECK (((file_type)::text = ANY ((ARRAY['input'::character varying, 'output'::character varying])::text[]))) not valid;

alter table "public"."request_files" validate constraint "request_files_file_type_check";

grant delete on table "public"."package_deliverable_items" to "anon";

grant insert on table "public"."package_deliverable_items" to "anon";

grant references on table "public"."package_deliverable_items" to "anon";

grant select on table "public"."package_deliverable_items" to "anon";

grant trigger on table "public"."package_deliverable_items" to "anon";

grant truncate on table "public"."package_deliverable_items" to "anon";

grant update on table "public"."package_deliverable_items" to "anon";

grant delete on table "public"."package_deliverable_items" to "authenticated";

grant insert on table "public"."package_deliverable_items" to "authenticated";

grant references on table "public"."package_deliverable_items" to "authenticated";

grant select on table "public"."package_deliverable_items" to "authenticated";

grant trigger on table "public"."package_deliverable_items" to "authenticated";

grant truncate on table "public"."package_deliverable_items" to "authenticated";

grant update on table "public"."package_deliverable_items" to "authenticated";

grant delete on table "public"."package_deliverable_items" to "service_role";

grant insert on table "public"."package_deliverable_items" to "service_role";

grant references on table "public"."package_deliverable_items" to "service_role";

grant select on table "public"."package_deliverable_items" to "service_role";

grant trigger on table "public"."package_deliverable_items" to "service_role";

grant truncate on table "public"."package_deliverable_items" to "service_role";

grant update on table "public"."package_deliverable_items" to "service_role";


  create policy "Acceso total para usuarios autenticados en file_extensions"
  on "public"."file_extensions"
  as permissive
  for all
  to authenticated
using (true)
with check (true);



  create policy "Acceso total para usuarios autenticados en organization_deliver"
  on "public"."organization_deliverables"
  as permissive
  for all
  to authenticated
using (true)
with check (true);



  create policy "Acceso total para usuarios autenticados en package_deliverable_"
  on "public"."package_deliverable_items"
  as permissive
  for all
  to authenticated
using (true)
with check (true);



  create policy "Acceso total para usuarios autenticados en request_categories"
  on "public"."request_categories"
  as permissive
  for all
  to authenticated
using (true)
with check (true);



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



