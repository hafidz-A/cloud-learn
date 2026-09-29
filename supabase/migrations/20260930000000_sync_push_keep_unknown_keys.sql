-- AZ-104 stage 1 (docs/AZ104_TAHAP1_RENCANA.md, approved). An update now merges
-- the new progress into the stored JSON at the top level (s.data || p_data)
-- instead of replacing it. Keys the client sends still win, exactly as before,
-- but keys it leaves out stay. That way an older app version, which does not
-- know the AZ-104 key "courses", cannot erase AZ-104 progress when it syncs.
-- Only this function changes: the table, RLS, and grants stay as they were.

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
  if jsonb_typeof(p_data) <> 'object' then
    raise exception 'progress must be a JSON object';
  end if;
  h := encode(sha256(convert_to(p_code, 'UTF8')), 'hex');
  if p_version = 0 then
    insert into public.sync_progress (code_hash, data) values (h, p_data)
    on conflict (code_hash) do nothing
    returning version into v;
  else
    update public.sync_progress s
    set data = s.data || p_data, version = s.version + 1, updated_at = now()
    where s.code_hash = h and s.version = p_version
    returning s.version into v;
  end if;
  return v;
end;
$$;

-- create or replace keeps the existing privileges; restated so this file stands on its own.
revoke execute on function public.sync_push(text, jsonb, bigint) from public, authenticated;
grant execute on function public.sync_push(text, jsonb, bigint) to anon;

comment on function public.sync_push(text, jsonb, bigint) is 'Public on purpose: writes progress for a secret 16-character sync code, with a version check. Top-level keys the caller leaves out are kept.';
