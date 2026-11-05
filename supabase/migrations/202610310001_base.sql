-- Base inicial fechada. Não contém autorização de perfil infantil ou regras de pontuação.
-- Aplicar somente após revisão; não usar com dados reais antes dos testes de isolamento.
begin;

create schema if not exists circuit_private;
revoke all on schema circuit_private from public, anon, authenticated;

create table public.circuit_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  account_type text not null check (account_type in ('responsavel', 'individual')),
  created_at timestamptz not null default now()
);

create table public.circuit_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.circuit_accounts(user_id) on delete cascade,
  nickname text not null check (length(trim(nickname)) between 1 and 40),
  education text not null check (education in ('fundamental_iniciais','fundamental_finais','medio','superior')),
  profile_type text not null check (profile_type in ('individual','acompanhado')),
  sound_enabled boolean not null default false,
  animation_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index circuit_profiles_owner_idx on public.circuit_profiles(owner_id);
create unique index circuit_one_individual_profile on public.circuit_profiles(owner_id) where profile_type = 'individual' and deleted_at is null;

create table circuit_private.activity_versions (
  activity_id text not null,
  content_version integer not null check (content_version > 0),
  title text not null,
  primary key (activity_id, content_version)
);

-- Conteúdo correto é restrito ao esquema privado e nunca é enviado antes da resposta.
create table circuit_private.questions (
  activity_id text not null,
  content_version integer not null,
  question_id text not null,
  question_order integer not null check (question_order > 0),
  correct_option_id text not null,
  primary key (activity_id, content_version, question_id),
  unique (activity_id, content_version, question_order),
  foreign key (activity_id, content_version) references circuit_private.activity_versions(activity_id, content_version)
);

create table public.circuit_progress (
  profile_id uuid primary key references public.circuit_profiles(id) on delete cascade,
  block_number integer not null default 1 check (block_number between 1 and 5),
  step_id text,
  completed_blocks integer[] not null default '{}',
  pieces text[] not null default '{}',
  content_version integer not null default 1 check (content_version > 0),
  revision bigint not null default 0 check (revision >= 0),
  updated_at timestamptz not null default now(),
  check (completed_blocks <@ array[1,2,3,4,5]),
  check (pieces in (array[]::text[], array['H'], array['H','CNOT']))
);

create table public.circuit_attempts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.circuit_profiles(id) on delete cascade,
  activity_id text not null,
  content_version integer not null,
  status text not null default 'em_andamento' check (status in ('em_andamento','concluida')),
  score integer check (score >= 0),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  foreign key (activity_id, content_version) references circuit_private.activity_versions(activity_id, content_version),
  check ((status = 'em_andamento' and score is null and finished_at is null) or (status = 'concluida' and score is not null and finished_at is not null))
);
create unique index circuit_one_active_attempt on public.circuit_attempts(profile_id, activity_id) where status = 'em_andamento';

create table circuit_private.attempt_questions (
  attempt_id uuid not null references public.circuit_attempts(id) on delete cascade,
  question_id text not null,
  errors integer not null default 0 check (errors >= 0),
  hint_used boolean not null default false,
  answered boolean not null default false,
  score integer check (score is null or score >= 0),
  primary key (attempt_id, question_id)
);

create table circuit_private.operation_results (
  profile_id uuid not null references public.circuit_profiles(id) on delete cascade,
  operation_id uuid not null,
  request_fingerprint text not null,
  result jsonb not null,
  created_at timestamptz not null default now(),
  primary key (profile_id, operation_id)
);

create table public.circuit_best_scores (
  profile_id uuid not null references public.circuit_profiles(id) on delete cascade,
  activity_id text not null,
  content_version integer not null,
  best_score integer not null check (best_score >= 0),
  primary key (profile_id, activity_id, content_version),
  foreign key (activity_id, content_version) references circuit_private.activity_versions(activity_id, content_version)
);

create table public.circuit_certificates (
  profile_id uuid not null references public.circuit_profiles(id) on delete cascade,
  trail_id text not null,
  display_name text not null,
  education_at_completion text not null check (education_at_completion in ('fundamental_iniciais','fundamental_finais','medio','superior')),
  first_completed_at timestamptz not null default now(),
  primary key (profile_id, trail_id)
);

create table public.circuit_awards (
  profile_id uuid not null references public.circuit_profiles(id) on delete cascade,
  award_id text not null,
  awarded_at timestamptz not null default now(),
  primary key (profile_id, award_id)
);

alter table public.circuit_accounts enable row level security;
alter table public.circuit_profiles enable row level security;
alter table public.circuit_progress enable row level security;
alter table public.circuit_attempts enable row level security;
alter table public.circuit_best_scores enable row level security;
alter table public.circuit_certificates enable row level security;
alter table public.circuit_awards enable row level security;

-- Não concede políticas de acesso: anon e authenticated não leem nem escrevem.
-- Uma próxima migração deve implementar autorização por conta e sessão infantil,
-- transações e permissões de função antes de qualquer uso pelo cliente.
revoke all on public.circuit_accounts, public.circuit_profiles, public.circuit_progress,
  public.circuit_attempts, public.circuit_best_scores, public.circuit_certificates,
  public.circuit_awards from anon, authenticated;
revoke all on all tables in schema circuit_private from public, anon, authenticated;

commit;
