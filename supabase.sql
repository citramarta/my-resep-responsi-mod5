create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Makan Siang',
  minutes int not null default 30,
  ingredients text not null default '',
  steps text not null default '',
  favorite boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.recipes enable row level security;
grant select, insert, update, delete on public.recipes to anon, authenticated;

drop policy if exists akses_publik_recipes on public.recipes;
create policy akses_publik_recipes on public.recipes
  for all to anon, authenticated using (true) with check (true);

-- Data contoh (jalankan sekali saja)
insert into public.recipes (title, category, minutes, ingredients, steps, favorite) values
('Nasi Goreng Kampung', 'Makan Siang', 20, E'2 piring nasi dingin\n3 siung bawang putih\n2 butir telur\n2 sdm kecap manis\nCabai secukupnya', E'Tumis bawang putih dan cabai sampai harum\nMasukkan telur, orak-arik\nTambahkan nasi dan kecap, aduk rata\nAngkat dan sajikan hangat', true),
('Pisang Goreng Crispy', 'Camilan', 25, E'5 buah pisang kepok\n100 g tepung terigu\n2 sdm tepung beras\nAir dan sejumput garam', E'Campur tepung, air, dan garam menjadi adonan\nCelup pisang ke adonan\nGoreng di minyak panas sampai keemasan', false),
('Es Teh Lemon', 'Minuman', 5, E'2 kantong teh\n1 buah lemon\nGula secukupnya\nEs batu', E'Seduh teh, tambahkan gula\nDinginkan, tuang ke gelas berisi es\nPeras lemon di atasnya', false);
