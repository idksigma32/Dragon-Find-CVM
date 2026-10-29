create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'student' check (role in ('student', 'staff')),
  created_at timestamptz not null default now()
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  location text not null,
  item_type text not null check (item_type in ('lost', 'found')),
  status text not null default 'open' check (status in ('open', 'claimed', 'returned', 'archived')),
  image_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  unique (item_id, student_id)
);

alter table public.profiles enable row level security;
alter table public.items enable row level security;
alter table public.claims enable row level security;

create policy "Students can view profiles" on public.profiles for select to authenticated using (true);
create policy "Students can create their profile" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "Students can update their profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

create policy "Authenticated users can view open items" on public.items for select to authenticated using (status != 'archived' or user_id = auth.uid());
create policy "Students can create their own items" on public.items for insert to authenticated with check (user_id = auth.uid());
create policy "Students can update their own items" on public.items for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Students can delete their own items" on public.items for delete to authenticated using (user_id = auth.uid());

create policy "Students can view their claims or claims on their items" on public.claims for select to authenticated using (student_id = auth.uid() or exists (select 1 from public.items where items.id = claims.item_id and items.user_id = auth.uid()));
create policy "Students can submit their own claims" on public.claims for insert to authenticated with check (student_id = auth.uid());
create policy "Students can withdraw their own claims" on public.claims for delete to authenticated using (student_id = auth.uid());
create policy "Staff can manage claims" on public.claims for update to authenticated using (exists (select 1 from public.profiles where id = auth.uid() and role = 'staff')) with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'staff'));

insert into storage.buckets (id, name, public) values ('item-images', 'item-images', false) on conflict (id) do nothing;
create policy "Authenticated users can view item images" on storage.objects for select to authenticated using (bucket_id = 'item-images');
create policy "Users upload images to their own folder" on storage.objects for insert to authenticated with check (bucket_id = 'item-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users delete their own images" on storage.objects for delete to authenticated using (bucket_id = 'item-images' and owner_id = auth.uid()::text);
