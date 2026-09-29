-- Langit progress sync (plan stage 8). Applied to the Supabase project "langit".
--
-- A device holds a random 16-character sync code; rows are keyed by the code's
-- SHA-256, so the code itself is never stored. The table is closed to the API
-- (RLS on, no policies, no grants); the two functions below are the only way in.
-- They are public on purpose: the secret code is the credential.

create table public.sync_progress (
  code_hash text primary key,
  data jsonb not null,
  version bigint not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.sync_progress enable row level security;
revoke all on table public.sync_progress from anon, authenticated;

create or replace function public.sync_pull(p_code text)
returns table (data jsonb, version bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select s.data, s.version
  from public.sync_progress s
  where length(p_code) >= 16
    and s.code_hash = encode(sha256(convert_to(p_code, 'UTF8')), 'hex');
$$;

-- p_version 0 creates the row and returns null when the code is already taken.
-- Otherwise the row is only replaced while p_version is still current; null means
-- another device wrote first, so the caller pulls, merges, and tries again.
create or replace function public.sync_push(p_code text, p_data jsonb, p_version bigint)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  h text;
  v bigint;
begin
  if length(p_code) < 16 then
    raise exception 'sync code too short';
  end if;
  if octet_length(p_data::text) > 1000000 then
    raise exception 'progress too large';
  end if;
  h := encode(sha256(convert_to(p_code, 'UTF8')), 'hex');
  if p_version = 0 then
    insert into public.sync_progress (code_hash, data) values (h, p_data)
    on conflict (code_hash) do nothing
    returning version into v;
  else
    update public.sync_progress s
    set data = p_data, version = s.version + 1, updated_at = now()
    where s.code_hash = h and s.version = p_version
    returning s.version into v;
  end if;
  return v;
end;
$$;

-- Langit has no sign-in; only the anon role calls the functions.
revoke execute on function public.sync_pull(text) from public, authenticated;
revoke execute on function public.sync_push(text, jsonb, bigint) from public, authenticated;
grant execute on function public.sync_pull(text) to anon;
grant execute on function public.sync_push(text, jsonb, bigint) to anon;

comment on function public.sync_pull(text) is 'Public on purpose: returns the progress for a secret 16-character sync code, or nothing.';
comment on function public.sync_push(text, jsonb, bigint) is 'Public on purpose: writes progress for a secret 16-character sync code, with a version check.';
