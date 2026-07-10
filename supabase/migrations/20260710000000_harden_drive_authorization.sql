alter table public.folders enable row level security;
alter table public.files enable row level security;
create unique index if not exists files_share_token_unique
on public.files (share_token) where share_token is not null;

drop policy if exists "folders_select_own" on public.folders;

create policy "folders_select_own" on public.folders for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "folders_insert_own" on public.folders;

create policy "folders_insert_own" on public.folders for insert to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "folders_update_own" on public.folders;

create policy "folders_update_own" on public.folders for update to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "folders_delete_own" on public.folders;

create policy "folders_delete_own" on public.folders for delete to authenticated
using (user_id = (select auth.uid()));


drop policy if exists "files_select_own" on public.files;

create policy "files_select_own" on public.files for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "files_insert_own" on public.files;

create policy "files_insert_own" on public.files for insert to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "files_update_own" on public.files;

create policy "files_update_own" on public.files for update to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "files_delete_own" on public.files;

create policy "files_delete_own" on public.files for delete to authenticated
using (user_id = (select auth.uid()));


create or replace function public.validate_drive_parent_owner()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_table_name = 'folders' and new.parent_id is not null and not exists (
    select 1 from public.folders p where p.id = new.parent_id and p.user_id = new.user_id
  ) then raise exception 'Parent folder must belong to the same user'; end if;
  if tg_table_name = 'files' and new.folder_id is not null and not exists (
    select 1 from public.folders p where p.id = new.folder_id and p.user_id = new.user_id
  ) then raise exception 'Folder must belong to the same user'; end if;
  return new;
end;
$$;

drop trigger if exists validate_folder_parent_owner on public.folders;
create trigger validate_folder_parent_owner before insert or update of parent_id, user_id
on public.folders for each row execute function public.validate_drive_parent_owner();
drop trigger if exists validate_file_folder_owner on public.files;
create trigger validate_file_folder_owner before insert or update of folder_id, user_id
on public.files for each row execute function public.validate_drive_parent_owner();

create or replace function public.enforce_storage_quota()
returns trigger language plpgsql security definer set search_path = '' as $$
declare used_bytes bigint;
begin
  perform pg_advisory_xact_lock(hashtext(new.user_id::text));
  select coalesce(sum(size), 0) into used_bytes from public.files
  where user_id = new.user_id and upload_status in ('pending', 'success')
    and id is distinct from new.id;
  if new.upload_status in ('pending', 'success') and used_bytes + new.size > 524288000 then
    raise exception 'Storage quota exceeded';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_files_storage_quota on public.files;
create trigger enforce_files_storage_quota before insert or update of size, upload_status
on public.files for each row execute function public.enforce_storage_quota();

create or replace function public.enable_file_share(p_file_id uuid)
returns text language plpgsql security invoker set search_path = '' as $$
declare v_token text;
begin
  v_token := encode(extensions.gen_random_bytes(8), 'hex');
  update public.files set is_shared = true, share_token = v_token
  where id = p_file_id and user_id = auth.uid() and upload_status = 'success';
  if not found then raise exception 'File not found'; end if;
  return v_token;
end;
$$;

create or replace function public.disable_file_share(p_file_id uuid)
returns void language plpgsql security invoker set search_path = '' as $$
begin
  update public.files set is_shared = false, share_token = null
  where id = p_file_id and user_id = auth.uid();
  if not found then raise exception 'File not found'; end if;
end;
$$;

revoke all on function public.enable_file_share(uuid) from public, anon;
revoke all on function public.disable_file_share(uuid) from public, anon;
grant execute on function public.enable_file_share(uuid) to authenticated;
grant execute on function public.disable_file_share(uuid) to authenticated;
