create table token_aggregation (
    profile_id uuid not null references profiles(id),
    service service_enum not null,
    model text not null,
    namespace text not null,
    time_bucket timestamp with time zone not null,
    total_prompt_tokens bigint not null,
    total_completion_tokens bigint not null,
    total_tokens bigint generated always as (total_prompt_tokens + total_completion_tokens) stored,
    primary key (profile_id, service, model, namespace, time_bucket)
);

create index idx_token_aggregation_time on token_aggregation (time_bucket);
create index idx_token_aggregation_service_model on token_aggregation (service, model);

create or replace function update_token_aggregation()
returns trigger as $$
begin
    insert into token_aggregation (
        profile_id,
        service,
        model,
        namespace,
        time_bucket,
        total_prompt_tokens,
        total_completion_tokens
    )
    values (
        new.profile_id,
        new.service,
        new.model,
        new.namespace,
        date_trunc('day', new.created_at),
        new.prompt_tokens,
        new.completion_tokens
    )
    on conflict (profile_id, service, model, namespace, time_bucket) do update
    set
        total_prompt_tokens = token_aggregation.total_prompt_tokens + excluded.total_prompt_tokens,
        total_completion_tokens = token_aggregation.total_completion_tokens + excluded.total_completion_tokens;

    return new;
end;
$$ language plpgsql;

create trigger token_consumption_aggregation_trigger
after insert on token_consumption
for each row execute function update_token_aggregation(); 