-- PyQuest : comptes, progression synchronisée et classement hebdomadaire.
-- À exécuter une fois dans Supabase > SQL Editor.

-- 1. Profils publics (pseudo visible dans le classement)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  pseudo text not null check (char_length(pseudo) between 3 and 20 and pseudo ~ '^[A-Za-z0-9_-]+$'),
  created_at timestamptz not null default now()
);
create unique index if not exists profiles_pseudo_unique on public.profiles (lower(pseudo));
alter table public.profiles enable row level security;
drop policy if exists "profils visibles" on public.profiles;
create policy "profils visibles" on public.profiles for select using (true);
drop policy if exists "créer son profil" on public.profiles;
create policy "créer son profil" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "modifier son profil" on public.profiles;
create policy "modifier son profil" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- 2. Progression privée (chacun ne voit que la sienne)
create table if not exists public.progress (
  user_id uuid primary key references auth.users on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.progress enable row level security;
drop policy if exists "ma progression" on public.progress;
create policy "ma progression" on public.progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 3. XP de la semaine : aucune écriture directe, uniquement via add_xp() (anti-triche)
create table if not exists public.weekly_xp (
  user_id uuid not null references auth.users on delete cascade,
  week date not null,
  xp int not null default 0,
  last_at timestamptz,
  primary key (user_id, week)
);
alter table public.weekly_xp enable row level security;

create or replace function public.current_week() returns date
language sql stable as $$ select date_trunc('week', now() at time zone 'Europe/Paris')::date $$;

-- Ajoute l'XP d'une leçon : 60 XP max par appel, et au plus un appel toutes les 15 secondes
create or replace function public.add_xp(amount int) returns int
language plpgsql security definer set search_path = public as $$
declare total int;
begin
  if auth.uid() is null then raise exception 'non connecté'; end if;
  amount := least(greatest(coalesce(amount, 0), 0), 60);
  insert into weekly_xp as w (user_id, week, xp, last_at)
  values (auth.uid(), current_week(), amount, now())
  on conflict (user_id, week) do update
    set xp = w.xp + case when w.last_at > now() - interval '15 seconds' then 0 else excluded.xp end,
        last_at = now()
  returning w.xp into total;
  return total;
end $$;

-- Classement de la semaine : top 50 + ma ligne si je suis plus bas
create or replace function public.leaderboard()
returns table (rk bigint, pseudo text, xp int, is_me boolean)
language sql stable security definer set search_path = public as $$
  with r as (
    select rank() over (order by w.xp desc) as rk, p.pseudo, w.xp, (w.user_id = auth.uid()) as is_me
    from weekly_xp w join profiles p on p.id = w.user_id
    where w.week = current_week() and w.xp > 0
  )
  select r.rk, r.pseudo, r.xp, coalesce(r.is_me, false) from r
  where r.rk <= 50 or r.is_me
  order by r.rk, r.pseudo;
$$;

-- 4. Accès à l'API (le projet n'expose pas les nouvelles tables automatiquement)
grant usage on schema public to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;
grant select, insert, update on public.progress to authenticated;
revoke all on public.weekly_xp from anon, authenticated;

revoke all on function public.add_xp(int) from public, anon;
grant execute on function public.add_xp(int) to authenticated;
grant execute on function public.leaderboard() to anon, authenticated;
