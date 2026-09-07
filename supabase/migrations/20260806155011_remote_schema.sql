drop trigger if exists "trg_track_revisions" on "public"."request_comments";

drop trigger if exists "trigger_on_task_corrections" on "public"."request_tasks";

drop trigger if exists "trigger_on_task_submitted" on "public"."request_tasks";

drop trigger if exists "enforce_delivery_file" on "public"."requests";

drop trigger if exists "trigger_on_new_request_received" on "public"."requests";

drop trigger if exists "trigger_on_request_disciplines_updated" on "public"."requests";

drop trigger if exists "trigger_on_task_assigned" on "public"."task_assignees";

drop policy "Solo admins ven auditoria" on "public"."audit_logs";

drop policy "Admins pueden gestionar listas de distribucion" on "public"."organization_distribution_lists";

drop policy "Permitir a clientes actualizar su empresa" on "public"."organizations";

drop policy "Permitir a clientes actualizar sus proyectos" on "public"."projects";

drop policy "Permitir a clientes crear proyectos" on "public"."projects";

drop policy "Permitir a clientes ver sus proyectos" on "public"."projects";

drop policy "Staff interno puede crear tableros" on "public"."projects";

drop policy "Lectura de comentarios" on "public"."request_comments";

drop policy "Clientes solo editan sus propios requerimientos" on "public"."requests";

drop policy "Solo Admin borra" on "public"."requests";

drop policy "Solo Altos mandos crean" on "public"."requests";

drop policy "Staff edita" on "public"."requests";

alter table "public"."audit_logs" drop constraint "audit_logs_performed_by_fkey";

alter table "public"."category_allowed_formats" drop constraint "category_allowed_formats_category_id_fkey";

alter table "public"."category_allowed_formats" drop constraint "category_allowed_formats_format_id_fkey";

alter table "public"."notifications" drop constraint "notifications_profile_id_fkey";

alter table "public"."organization_deliverables" drop constraint "org_deliverables_category_fkey";

alter table "public"."organization_deliverables" drop constraint "org_deliverables_format_fkey";

alter table "public"."organization_deliverables" drop constraint "org_deliverables_org_fkey";

alter table "public"."organization_distribution_lists" drop constraint "organization_distribution_lists_organization_id_fkey";

alter table "public"."organization_distribution_lists" drop constraint "organization_distribution_lists_profile_id_fkey";

alter table "public"."organization_members" drop constraint "organization_members_organization_id_fkey";

alter table "public"."organization_members" drop constraint "organization_members_profile_id_fkey";

alter table "public"."package_deliverable_items" drop constraint "package_deliverable_items_item_deliverable_id_fkey";

alter table "public"."package_deliverable_items" drop constraint "package_deliverable_items_package_id_fkey";

alter table "public"."profiles" drop constraint "profiles_leader_id_fkey";

alter table "public"."profiles" drop constraint "profiles_role_id_fkey";

alter table "public"."profiles" drop constraint "profiles_specialty_id_fkey";

alter table "public"."projects" drop constraint "projects_organization_id_fkey";

alter table "public"."request_comments" drop constraint "request_comments_request_id_fkey";

alter table "public"."request_comments" drop constraint "request_comments_user_id_fkey";

alter table "public"."request_files" drop constraint "request_files_file_type_check";

alter table "public"."request_files" drop constraint "request_files_request_id_fkey";

alter table "public"."request_files" drop constraint "request_files_uploader_id_fkey";

alter table "public"."request_tasks" drop constraint "request_tasks_request_id_fkey";

alter table "public"."requests" drop constraint "requests_category_id_fkey";

alter table "public"."requests" drop constraint "requests_organization_deliverable_id_fkey";

alter table "public"."requests" drop constraint "requests_organization_id_fkey";

alter table "public"."requests" drop constraint "requests_priority_id_fkey";

alter table "public"."requests" drop constraint "requests_project_id_fkey";

alter table "public"."requests" drop constraint "requests_requester_id_fkey";

alter table "public"."requests" drop constraint "requests_target_format_id_fkey";

alter table "public"."task_adjustments" drop constraint "task_adjustments_created_by_fkey";

alter table "public"."task_adjustments" drop constraint "task_adjustments_task_id_fkey";

alter table "public"."task_assignees" drop constraint "task_assignees_assigned_by_fkey";

alter table "public"."task_assignees" drop constraint "task_assignees_profile_id_fkey";

alter table "public"."task_assignees" drop constraint "task_assignees_task_id_fkey";

alter table "public"."file_extensions" alter column "id" set default nextval('public.file_extensions_id_seq'::regclass);

alter table "public"."priorities" alter column "id" set default nextval('public.priorities_id_seq'::regclass);

alter table "public"."request_categories" alter column "id" set default nextval('public.request_categories_id_seq'::regclass);

alter table "public"."requests" alter column "status" set default 'pendiente'::public.request_status;

alter table "public"."requests" alter column "status" set data type public.request_status using "status"::text::public.request_status;

alter table "public"."audit_logs" add constraint "audit_logs_performed_by_fkey" FOREIGN KEY (performed_by) REFERENCES public.profiles(id) not valid;

alter table "public"."audit_logs" validate constraint "audit_logs_performed_by_fkey";

alter table "public"."category_allowed_formats" add constraint "category_allowed_formats_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.request_categories(id) ON DELETE CASCADE not valid;

alter table "public"."category_allowed_formats" validate constraint "category_allowed_formats_category_id_fkey";

alter table "public"."category_allowed_formats" add constraint "category_allowed_formats_format_id_fkey" FOREIGN KEY (format_id) REFERENCES public.file_extensions(id) ON DELETE CASCADE not valid;

alter table "public"."category_allowed_formats" validate constraint "category_allowed_formats_format_id_fkey";

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

alter table "public"."package_deliverable_items" add constraint "package_deliverable_items_item_deliverable_id_fkey" FOREIGN KEY (item_deliverable_id) REFERENCES public.organization_deliverables(id) ON DELETE CASCADE not valid;

alter table "public"."package_deliverable_items" validate constraint "package_deliverable_items_item_deliverable_id_fkey";

alter table "public"."package_deliverable_items" add constraint "package_deliverable_items_package_id_fkey" FOREIGN KEY (package_id) REFERENCES public.organization_deliverables(id) ON DELETE CASCADE not valid;

alter table "public"."package_deliverable_items" validate constraint "package_deliverable_items_package_id_fkey";

alter table "public"."profiles" add constraint "profiles_leader_id_fkey" FOREIGN KEY (leader_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."profiles" validate constraint "profiles_leader_id_fkey";

alter table "public"."profiles" add constraint "profiles_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public.internal_roles(id) not valid;

alter table "public"."profiles" validate constraint "profiles_role_id_fkey";

alter table "public"."profiles" add constraint "profiles_specialty_id_fkey" FOREIGN KEY (specialty_id) REFERENCES public.specialties(id) not valid;

alter table "public"."profiles" validate constraint "profiles_specialty_id_fkey";

alter table "public"."projects" add constraint "projects_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;

alter table "public"."projects" validate constraint "projects_organization_id_fkey";

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

alter table "public"."task_adjustments" add constraint "task_adjustments_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."task_adjustments" validate constraint "task_adjustments_created_by_fkey";

alter table "public"."task_adjustments" add constraint "task_adjustments_task_id_fkey" FOREIGN KEY (task_id) REFERENCES public.request_tasks(id) ON DELETE CASCADE not valid;

alter table "public"."task_adjustments" validate constraint "task_adjustments_task_id_fkey";

alter table "public"."task_assignees" add constraint "task_assignees_assigned_by_fkey" FOREIGN KEY (assigned_by) REFERENCES public.profiles(id) not valid;

alter table "public"."task_assignees" validate constraint "task_assignees_assigned_by_fkey";

alter table "public"."task_assignees" add constraint "task_assignees_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."task_assignees" validate constraint "task_assignees_profile_id_fkey";

alter table "public"."task_assignees" add constraint "task_assignees_task_id_fkey" FOREIGN KEY (task_id) REFERENCES public.request_tasks(id) ON DELETE CASCADE not valid;

alter table "public"."task_assignees" validate constraint "task_assignees_task_id_fkey";


  create policy "Solo admins ven auditoria"
  on "public"."audit_logs"
  as permissive
  for select
  to public
using (public.check_user_role('Admin'::text));



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



  create policy "Staff interno puede crear tableros"
  on "public"."projects"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.is_admin = true) OR (profiles.internal_role IS NOT NULL))))));



  create policy "Lectura de comentarios"
  on "public"."request_comments"
  as permissive
  for select
  to public
using (((is_internal = false) OR (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))));



  create policy "Clientes solo editan sus propios requerimientos"
  on "public"."requests"
  as permissive
  for update
  to authenticated
using ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE (organization_members.profile_id = auth.uid()))));



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


CREATE TRIGGER trg_track_revisions AFTER INSERT ON public.request_comments FOR EACH ROW EXECUTE FUNCTION public.fn_track_request_revisions();

CREATE TRIGGER trigger_on_task_corrections AFTER UPDATE ON public.request_tasks FOR EACH ROW EXECUTE FUNCTION public.on_task_corrections();

CREATE TRIGGER trigger_on_task_submitted AFTER UPDATE ON public.request_tasks FOR EACH ROW EXECUTE FUNCTION public.on_task_submitted();

CREATE TRIGGER enforce_delivery_file BEFORE UPDATE ON public.requests FOR EACH ROW EXECUTE FUNCTION public.check_delivery_file();

CREATE TRIGGER trigger_on_new_request_received AFTER INSERT ON public.requests FOR EACH ROW EXECUTE FUNCTION public.on_new_request_received();

CREATE TRIGGER trigger_on_request_disciplines_updated AFTER UPDATE ON public.requests FOR EACH ROW EXECUTE FUNCTION public.on_request_disciplines_updated();

CREATE TRIGGER trigger_on_task_assigned AFTER INSERT ON public.task_assignees FOR EACH ROW EXECUTE FUNCTION public.on_task_assigned();


