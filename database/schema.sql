-- =====================================================
-- BarberPro — PostgreSQL schema (Supabase)
-- Run this entire file in the Supabase SQL Editor.
-- =====================================================

create extension if not exists btree_gist;

-- ---------------- SERVICES ----------------
create table public.services (
  id int8 generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null,
  price int8 not null,
  duration int8 not null,
  description text,
  is_active boolean not null default true,
  image_url text,
  badge text
);

-- ---------------- BARBERS ----------------
create table public.barbers (
  id int8 generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null,
  title text,
  is_active boolean not null default true,
  photo_url text,
  bio text
);

-- ---------------- WORKING HOURS ----------------
create table public.working_hours (
  id int8 generated always as identity primary key,
  created_at timestamptz not null default now(),
  barber_id int8 not null references public.barbers (id) on delete cascade,
  weekday int2 not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  unique (barber_id, weekday)
);

-- ---------------- BOOKINGS ----------------
create table public.bookings (
  id int8 generated always as identity primary key,
  created_at timestamptz not null default now(),
  service_id int8 not null references public.services (id),
  barber_id int8 not null references public.barbers (id) on delete restrict,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null default '',
  customer_notes text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'done', 'cancelled')),
  check (ends_at > starts_at)
);

-- No double-booking: overlapping active bookings for the same barber are impossible.
alter table public.bookings
add constraint bookings_no_overlap
exclude using gist (
  barber_id with =,
  tstzrange(starts_at, ends_at) with &&
)
where (status in ('pending', 'confirmed'));

-- ---------------- RPC: least-privilege slot availability ----------------
create or replace function public.get_booked_slots(
  p_barber_id int8,
  p_from timestamptz,
  p_to timestamptz
)
returns table (starts_at timestamptz, ends_at timestamptz)
language sql stable security definer set search_path = public
as $$
  select starts_at, ends_at
  from public.bookings
  where barber_id = p_barber_id
    and status in ('pending', 'confirmed')
    and starts_at >= p_from
    and starts_at <= p_to;
$$;

-- ---------------- ROW LEVEL SECURITY ----------------
alter table public.services enable row level security;
alter table public.barbers enable row level security;
alter table public.working_hours enable row level security;
alter table public.bookings enable row level security;

create policy "Public can read active services"
on public.services for select using (is_active = true);

create policy "Public can read active barbers"
on public.barbers for select using (is_active = true);

create policy "Public can read working hours"
on public.working_hours for select using (true);

create policy "Public can create bookings"
on public.bookings for insert with check (true);

create policy "Admins can read bookings"
on public.bookings for select using (auth.role() = 'authenticated');

create policy "Admins can update bookings"
on public.bookings for update using (auth.role() = 'authenticated');

-- ---------------- SEED DATA ----------------
insert into public.services (name, price, duration, description) values
  ('Haircut Reguler', 50000, 30, 'Konsultasi gaya singkat, potongan presisi sesuai bentuk wajah, ditutup styling. Rapi yang bertahan berminggu-minggu — bukan sekadar pendek.'),
  ('Beard Trim', 30000, 20, 'Jenggot dan kumis dibentuk simetris dengan garis tegas, dirawat minyak khusus. Rapi di rahang, tajam di kesan pertama.'),
  ('Haircut + Beard', 75000, 45, 'Transformasi lengkap: potongan presisi plus pembentukan jenggot dalam satu sesi. Keluar dari kursi sebagai versi terbaik dirimu.');

insert into public.barbers (name, title, bio) values
  ('Andi Pratama', 'Senior Barber', 'Sepuluh tahun, ribuan kepala, satu prinsip: potongan harus cocok dengan wajah, bukan dengan tren. Spesialis classic cut dan fade bersih — dipercaya para eksekutif muda.'),
  ('Rizky Fauzan', 'Barber', 'Arsitek skin fade tim kami. Teliti sampai milimeter, karena detail kecil adalah perbedaan antara "bagus" dan "luar biasa".'),
  ('Dimas Saputra', 'Junior Barber', 'Lulusan terbaik akademi barbershop dan favorit pelanggan anak-anak. Sabar, telaten, tidak pernah buru-buru — rambutmu ditangani dengan tenang.');

insert into public.working_hours (barber_id, weekday, start_time, end_time)
select b.id, w.weekday, time '10:00', time '20:00'
from public.barbers b
cross join (select generate_series(0, 6) as weekday) w;

-- Example schedule variation: Andi is off on Sundays.
delete from public.working_hours
where weekday = 0
  and barber_id = (select id from public.barbers where name = 'Andi Pratama');