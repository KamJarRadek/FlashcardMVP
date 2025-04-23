-- migration: create flashcards table with rls, policies, indexes, and trigger for updated_at
-- purpose: define flashcards schema, secure with row-level security, add indexes for performance,
--          and auto-update the updated_at timestamp on modifications.
-- affected objects: table public.flashcards, indexes idx_flashcards_user_id, idx_flashcards_status,
--                   idx_flashcards_source, rls policies for select/insert/update/delete,
--                   function update_flashcards_updated_at, trigger update_flashcards_updated_at.
-- special considerations: uses jwt.claims.user_id for RLS; only authenticated users may access their own records.

begin;

--
-- 1. create flashcards table
--
create table if not exists public.flashcards (
                                               id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,  -- ← zmieniono public.users na auth.users
  definition text not null,
  concept text not null,
  status varchar(20) not null check (status in ('accepted','rejected')),
  source varchar(20) not null check (source in ('ai','manual')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  duration interval not null default '0 seconds'
  );

--
-- 2. enable row level security on flashcards
--
alter table public.flashcards enable row level security;

--
-- 3. rls policies
--

-- select policies
-- allow authenticated users to select only their own flashcards
create policy flashcards_select_authenticated
  on public.flashcards
  for select
               to authenticated
               using (
               user_id = current_setting('jwt.claims.user_id')::uuid
               );

-- explicitly deny anon (unauthenticated) users from selecting any flashcards
create policy flashcards_select_anon
  on public.flashcards
  for select
               to anon
               using (
               false
               );

-- insert policies
-- allow authenticated users to insert flashcards only for themselves
create policy flashcards_insert_authenticated
  on public.flashcards
  for insert
  to authenticated
  with check (
    user_id = current_setting('jwt.claims.user_id')::uuid
  );

-- deny anon users from inserting flashcards
create policy flashcards_insert_anon
  on public.flashcards
  for insert
  to anon
  with check (
    false
  );

-- update policies
-- allow authenticated users to update only their own flashcards
create policy flashcards_update_authenticated
  on public.flashcards
  for update
                             to authenticated
                             using (
                             user_id = current_setting('jwt.claims.user_id')::uuid
                             )
      with check (
                             user_id = current_setting('jwt.claims.user_id')::uuid
                             );

-- deny anon users from updating any flashcards
create policy flashcards_update_anon
  on public.flashcards
  for update
               to anon
               using (
               false
               )
      with check (
               false
               );

-- delete policies
-- allow authenticated users to delete only their own flashcards
create policy flashcards_delete_authenticated
  on public.flashcards
  for delete
to authenticated
  using (
    user_id = current_setting('jwt.claims.user_id')::uuid
  );

-- deny anon users from deleting any flashcards
create policy flashcards_delete_anon
  on public.flashcards
  for delete
to anon
  using (
    false
  );

--
-- 4. indexes for performance
--
create index if not exists idx_flashcards_user_id on public.flashcards(user_id);
create index if not exists idx_flashcards_status  on public.flashcards(status);
create index if not exists idx_flashcards_source  on public.flashcards(source);

--
-- 5. function and trigger to auto-update updated_at
--

-- function: update_updated_at_column
-- updates the updated_at field on row modification
create or replace function public.update_flashcards_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
return new;
end;
$$ language plpgsql;

-- trigger: update_flashcards_updated_at
-- fires before update on flashcards to keep updated_at current
create trigger update_flashcards_updated_at
  before update on public.flashcards
  for each row
  execute function public.update_flashcards_updated_at();

commit;
