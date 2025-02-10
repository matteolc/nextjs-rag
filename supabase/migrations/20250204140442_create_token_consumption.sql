-- Create enum type first
CREATE TYPE service_enum AS ENUM ('chat', 'summarization', 'extraction', 'other');

create table token_consumption (
    id uuid primary key default uuid_generate_v4(),
    profile_id uuid not null references profiles(id),
    namespace text not null,
    prompt_tokens integer not null,
    completion_tokens integer not null,
    model text not null,
    service service_enum not null,
    chat_id text,
    message_id text not null,
    created_at timestamp with time zone default now()
);

create index idx_token_consumption_profile_id on token_consumption (profile_id);
create index idx_token_consumption_namespace on token_consumption (namespace);
create index idx_token_consumption_chat_id on token_consumption (chat_id);
create index idx_token_consumption_message_id on token_consumption (message_id);
create index idx_token_consumption_service on token_consumption (service);

