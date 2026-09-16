-- ComplyDesk government compliance records
-- Apply this migration in Supabase SQL Editor or with the Supabase CLI.

create table if not exists public.government_compliance (
  record_id uuid primary key default gen_random_uuid(),
  invoice_no text,
  invoice_date date,
  seller_legal_name text,
  seller_gstin text,
  seller_location text,
  seller_pincode numeric,
  seller_state_code numeric,
  buyer_legal_name text,
  buyer_gstin text,
  buyer_location text,
  buyer_pincode numeric,
  buyer_state_code numeric,
  place_of_supply numeric,
  supply_type text,
  document_type text,
  reverse_charge text,
  hsn_code numeric,
  item_description text,
  quantity numeric,
  qty_unit text,
  taxable_value numeric,
  gst_rate numeric,
  cgst_value numeric,
  sgst_value numeric,
  igst_value numeric,
  total_invoice_value numeric,
  transporter_name text,
  transporter_gstin text,
  transport_mode numeric,
  transport_distance_km numeric,
  transport_document_no text,
  transport_document_date date,
  vehicle_no text,
  eway_bill_no numeric,
  eway_status text,
  eway_doc_no text,
  eway_from_gstin text,
  eway_to_gstin text,
  eway_total_value numeric,
  eway_vehicle_no text,
  rule_issue text,
  expected_result text,
  data_type text default 'government_compliance',
  created_at timestamptz default now()
);

alter table public.government_compliance enable row level security;

-- The current app uses a simulated login and the public anon client.
-- Replace this with authenticated-only policies when Supabase Auth is enabled.
drop policy if exists "Allow invoice inserts" on public.government_compliance;
create policy "Allow invoice inserts"
on public.government_compliance
for insert
to anon, authenticated
with check (true);

drop policy if exists "Allow invoice reads" on public.government_compliance;
create policy "Allow invoice reads"
on public.government_compliance
for select
to anon, authenticated
using (true);
