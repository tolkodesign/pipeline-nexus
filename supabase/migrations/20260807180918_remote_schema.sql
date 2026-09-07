drop policy "Solo Altos mandos crean" on "public"."requests";

drop policy "Staff edita" on "public"."requests";

alter table "public"."request_files" drop constraint "request_files_file_type_check";

alter table "public"."organizations" add column "has_mailchimp" boolean default false;

alter table "public"."request_files" add constraint "request_files_file_type_check" CHECK (((file_type)::text = ANY ((ARRAY['input'::character varying, 'output'::character varying])::text[]))) not valid;

alter table "public"."request_files" validate constraint "request_files_file_type_check";


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



