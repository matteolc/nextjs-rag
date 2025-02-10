create table uploads (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) not null,
  namespace varchar(255) not null,
  name varchar(255) not null,
  size bigint not null,
  type varchar(255) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  metadata jsonb
);

create index idx_uploads_namespace on uploads (namespace);
create index idx_uploads_name on uploads (name);
create index idx_uploads_created_at on uploads (created_at);
create index idx_uploads_metadata on uploads using gin (metadata);
