do $$
begin
  create type public.file_upload_status as enum ('pending', 'success', 'fail');
exception
  when duplicate_object then null;
end
$$;

alter table public.files alter column upload_status drop default;

alter table public.files
alter column upload_status type public.file_upload_status
using upload_status::text::public.file_upload_status;

alter table public.files
alter column upload_status set default 'pending'::public.file_upload_status;

alter table public.files alter column upload_status set not null;
