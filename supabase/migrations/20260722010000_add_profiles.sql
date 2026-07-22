create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated" on public.profiles
for select to authenticated using (true);

create or replace function public.create_user_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'username', ''),
      split_part(new.email, '@', 1),
      new.id::text
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists create_profile_after_user_insert on auth.users;
create trigger create_profile_after_user_insert
after insert on auth.users
for each row execute function public.create_user_profile();

insert into public.profiles (id, username)
select
  id,
  coalesce(
    nullif(raw_user_meta_data ->> 'username', ''),
    split_part(email, '@', 1),
    id::text
  )
from auth.users
on conflict (id) do nothing;

alter table public.files
drop constraint if exists files_user_profile_fkey;
alter table public.files
add constraint files_user_profile_fkey
foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.folders
drop constraint if exists folders_user_profile_fkey;
alter table public.folders
add constraint folders_user_profile_fkey
foreign key (user_id) references public.profiles(id) on delete cascade;
