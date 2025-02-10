 -- Enable the "vector" extension.
create extension IF NOT EXISTS vector
with schema extensions;

create table documents (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  embedding vector(1536),
  metadata jsonb
);

create function match_documents (
  query_embedding vector(1536),
  match_count int default null,
  filter jsonb DEFAULT '{}'
) returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity
  from documents d
  where d.metadata @> filter
  order by d.embedding <=> query_embedding
  limit match_count;
end;
$$;