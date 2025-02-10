create table profiles (
  id uuid references auth.users not null default auth.uid() primary key,
  first_name text,
  last_name text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Can view own profile data." on profiles for select using (auth.uid() = id);
create policy "Can update own profile data." on profiles for update using (auth.uid() = id);
