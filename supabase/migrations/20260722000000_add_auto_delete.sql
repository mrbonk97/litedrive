create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  auto_delete_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

drop policy if exists "user_settings_select_own" on public.user_settings;
create policy "user_settings_select_own" on public.user_settings
for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "user_settings_insert_own" on public.user_settings;
create policy "user_settings_insert_own" on public.user_settings
for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "user_settings_update_own" on public.user_settings;
create policy "user_settings_update_own" on public.user_settings
for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

alter table public.files
add column if not exists auto_delete_at timestamptz;

create index if not exists files_auto_delete_at_idx
on public.files (auto_delete_at)
where auto_delete_at is not null;

create or replace function public.schedule_file_auto_delete()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if exists (
    select 1 from public.user_settings
    where user_id = new.user_id and auto_delete_enabled = true
  ) then
    new.auto_delete_at := now() + interval '7 days';
  end if;
  return new;
end;
$$;

drop trigger if exists schedule_file_auto_delete on public.files;
create trigger schedule_file_auto_delete before insert on public.files
for each row execute function public.schedule_file_auto_delete();

create or replace function public.set_auto_delete_enabled(p_enabled boolean)
returns void language plpgsql security invoker set search_path = '' as $$
begin
  insert into public.user_settings (user_id, auto_delete_enabled, updated_at)
  values (auth.uid(), p_enabled, now())
  on conflict (user_id) do update
  set auto_delete_enabled = excluded.auto_delete_enabled,
      updated_at = excluded.updated_at;

  update public.files
  set auto_delete_at = case
    when p_enabled then now() + interval '7 days'
    else null
  end
  where user_id = auth.uid();
end;
$$;

revoke all on function public.set_auto_delete_enabled(boolean) from public, anon;
grant execute on function public.set_auto_delete_enabled(boolean) to authenticated;
