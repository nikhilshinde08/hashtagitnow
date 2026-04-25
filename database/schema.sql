-- ============================================================
-- HASHTAGITNOW — Full Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- ─── EXTENSIONS ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── 1. PROFILES ────────────────────────────────────────────
-- Extended user profile linked to Supabase auth.users
create table if not exists profiles (
  id                    uuid references auth.users(id) on delete cascade primary key,
  full_name             text,
  email                 text,
  avatar_url            text,

  -- Subscription
  subscription_status   text default 'inactive'
                        check (subscription_status in ('inactive','trialing','active','past_due','canceled','paused')),
  subscription_plan     text check (subscription_plan in ('starter','pro')),
  stripe_customer_id    text unique,
  stripe_subscription_id text unique,
  trial_ends_at         timestamptz,
  current_period_end    timestamptz,

  -- Usage counters (reset monthly)
  analyses_used         int default 0,
  analyses_limit        int default 0,
  usage_reset_at        timestamptz default (now() + interval '1 month'),

  -- Preferences
  default_niche         text,
  preferred_language    text default 'en',

  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- ─── 2. CONNECTED ACCOUNTS ──────────────────────────────────
-- Social media accounts the user has connected via OAuth
create table if not exists connected_accounts (
  id              uuid default uuid_generate_v4() primary key,
  user_id         uuid references profiles(id) on delete cascade not null,
  platform        text not null check (platform in ('instagram','youtube','facebook','tiktok','twitter','snapchat')),
  platform_user_id text not null,
  username        text,
  display_name    text,
  profile_picture text,
  access_token    text,               -- encrypted in production
  refresh_token   text,
  token_expires_at timestamptz,
  follower_count  int,
  is_business     boolean default false,
  connected_at    timestamptz default now(),
  last_synced_at  timestamptz,

  unique (user_id, platform)
);

-- ─── 3. ANALYSES ────────────────────────────────────────────
-- Each hashtag analysis run by a user
create table if not exists analyses (
  id                  uuid default uuid_generate_v4() primary key,
  user_id             uuid references profiles(id) on delete cascade not null,

  -- Input
  input_type          text not null check (input_type in ('url','caption')),
  input_content       text not null,
  niche               text,
  normalized_niches   text[],

  -- Post data (from Apify or OAuth)
  post_url            text,
  post_caption        text,
  post_media_type     text,
  post_likes          int,
  post_comments       int,
  post_views          int,
  detected_hashtags   text[],

  -- AI output
  post_summary        jsonb,          -- { topic, niche, engagementNote }
  hashtag_audit       jsonb,          -- { effective, tooGeneric, irrelevant, missing }
  recommended_hashtags jsonb,         -- { highReach, niche, lowCompetition }
  analysis_issues     text[],
  analysis_suggestions text[],
  explanation         text,

  -- Meta
  processing_ms       int,            -- how long the request took
  used_instagram_insights boolean default false,
  created_at          timestamptz default now()
);

-- ─── 4. COMPARISONS ─────────────────────────────────────────
-- Each /compare request
create table if not exists comparisons (
  id                uuid default uuid_generate_v4() primary key,
  user_id           uuid references profiles(id) on delete cascade not null,

  -- Input
  urls              text[] not null,
  total_requested   int,
  total_analyzed    int,
  failed            int default 0,

  -- AI output
  ranked_posts      jsonb,            -- array of { rank, url, shortCaption, likes, comments, videoViews, hashtagCount }
  top_performer     jsonb,            -- { url, reason }
  bottom_performer  jsonb,            -- { url, reason }
  hashtag_patterns  jsonb,            -- { workingTags, avoidTags, missingFromLow }
  key_insights      text[],
  per_post_recs     jsonb,            -- array of { url, currentPerformance, actions }
  overall_strategy  text,

  processing_ms     int,
  created_at        timestamptz default now()
);

-- ─── 5. TRENDING SEARCHES ───────────────────────────────────
-- Cached trending hashtag results (shared across users, expires after 1 hour)
create table if not exists trending_searches (
  id                  uuid default uuid_generate_v4() primary key,
  niche               text not null,
  normalized_niches   text[],

  -- AI output
  rising_hashtags     jsonb,          -- array of { tag, postCount, reason, bestFor }
  sweet_spot_hashtags jsonb,
  saturated_hashtags  jsonb,
  content_angles      text[],
  strategy            text,

  -- Cache control
  created_at          timestamptz default now(),
  expires_at          timestamptz default (now() + interval '1 hour'),

  -- Track who searched (for analytics)
  search_count        int default 1
);

create index if not exists trending_niche_idx on trending_searches (niche, expires_at);

-- ─── 6. SAVED HASHTAG SETS ──────────────────────────────────
-- Users can save their favourite hashtag sets for reuse
create table if not exists saved_hashtag_sets (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references profiles(id) on delete cascade not null,
  name        text not null,
  niche       text,
  platform    text default 'instagram',
  hashtags    text[] not null,
  source      text check (source in ('analysis','manual','trending')),
  analysis_id uuid references analyses(id) on delete set null,
  created_at  timestamptz default now()
);

-- ─── 7. USAGE EVENTS ────────────────────────────────────────
-- Granular log of every action for billing and analytics
create table if not exists usage_events (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references profiles(id) on delete cascade not null,
  event_type  text not null check (event_type in ('analyze','compare','trending','save_hashtags','connect_account')),
  metadata    jsonb,                  -- { platform, inputType, niche, etc }
  created_at  timestamptz default now()
);

create index if not exists usage_events_user_idx on usage_events (user_id, created_at desc);
create index if not exists usage_events_type_idx on usage_events (event_type, created_at desc);

-- ─── 8. WAITLIST ────────────────────────────────────────────
-- Email capture for coming-soon platforms and features
create table if not exists waitlist (
  id          uuid default uuid_generate_v4() primary key,
  email       text not null unique,
  platform    text,                   -- 'youtube','tiktok','snapchat','twitter','facebook'
  feature     text,                   -- 'account_connect','ai_caption','best_time', etc
  source_page text,
  created_at  timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table profiles            enable row level security;
alter table connected_accounts  enable row level security;
alter table analyses            enable row level security;
alter table comparisons         enable row level security;
alter table saved_hashtag_sets  enable row level security;
alter table usage_events        enable row level security;
alter table trending_searches   enable row level security;
alter table waitlist            enable row level security;

-- profiles
create policy "users_read_own_profile"   on profiles for select using (auth.uid() = id);
create policy "users_update_own_profile" on profiles for update using (auth.uid() = id);
create policy "users_insert_own_profile" on profiles for insert with check (auth.uid() = id);

-- connected_accounts
create policy "users_manage_own_accounts" on connected_accounts for all using (auth.uid() = user_id);

-- analyses
create policy "users_read_own_analyses"   on analyses for select using (auth.uid() = user_id);
create policy "users_insert_own_analyses" on analyses for insert with check (auth.uid() = user_id);

-- comparisons
create policy "users_read_own_comparisons"   on comparisons for select using (auth.uid() = user_id);
create policy "users_insert_own_comparisons" on comparisons for insert with check (auth.uid() = user_id);

-- saved hashtag sets
create policy "users_manage_own_sets" on saved_hashtag_sets for all using (auth.uid() = user_id);

-- usage events
create policy "users_read_own_events"   on usage_events for select using (auth.uid() = user_id);
create policy "users_insert_own_events" on usage_events for insert with check (auth.uid() = user_id);

-- trending searches (readable by all authenticated users — it's shared cache)
create policy "authenticated_read_trending" on trending_searches
  for select using (auth.role() = 'authenticated');

-- waitlist (public insert)
create policy "anyone_can_join_waitlist" on waitlist
  for insert with check (true);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================

create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at();

-- ============================================================
-- INCREMENT USAGE COUNTER
-- ============================================================

create or replace function increment_analyses_used(p_user_id uuid)
returns void language plpgsql security definer as $$
begin
  update profiles
  set analyses_used = analyses_used + 1
  where id = p_user_id;
end;
$$;

-- ============================================================
-- USAGE LIMIT CHECK FUNCTION
-- ============================================================

create or replace function check_usage_limit(p_user_id uuid)
returns boolean language plpgsql security definer as $$
declare
  v_limit int;
  v_used  int;
  v_status text;
  v_reset timestamptz;
begin
  select analyses_limit, analyses_used, subscription_status, usage_reset_at
  into v_limit, v_used, v_status, v_reset
  from profiles where id = p_user_id;

  -- Reset counter if month has passed
  if v_reset < now() then
    update profiles set analyses_used = 0, usage_reset_at = now() + interval '1 month'
    where id = p_user_id;
    v_used := 0;
  end if;

  -- Pro plan = unlimited
  if v_status = 'active' and v_limit = 0 then return true; end if;

  return v_used < v_limit;
end;
$$;
