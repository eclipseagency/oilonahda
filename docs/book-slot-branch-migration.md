# Make `book_slot` capacity per-branch

The booking UI and `/api/booking/slots` now count availability **per branch**
(Al Rabie vs Al Nahda each get their own 5-per-30-min capacity). The website
display is already per-branch. The authoritative capacity guard, however, is the
Postgres RPC `book_slot`, which still enforces a **global** 5/slot across both
branches. This means a slot can rarely show as available on the site but be
rejected at submit (combined bookings ≥ 5). It never overbooks.

## Why this isn't auto-applied

`book_slot` is defined only in Supabase (not in the repo), and it returns a
generated booking `reference` whose logic isn't visible from the app's anon key.
Rewriting the function blind risks dropping that logic, so apply the change by
hand after reading the current definition.

## Safe procedure

1. Supabase Dashboard → SQL Editor. Get the current definition:

   ```sql
   select pg_get_functiondef('public.book_slot'::regprocedure);
   ```

2. In that definition, the capacity check looks like (counts all bookings for the
   date+slot):

   ```sql
   select count(*) into v_count
   from bookings
   where date = p_date and time_slot = p_time_slot and status <> 'cancelled';
   if v_count >= 5 then raise exception 'SLOT_FULL'; end if;
   ```

   Add a `p_branch text default 'al-rabie'` parameter to the signature and scope
   the count by branch:

   ```sql
   select count(*) into v_count
   from bookings
   where date = p_date and time_slot = p_time_slot
     and branch = p_branch and status <> 'cancelled';
   ```

   Also set `branch = p_branch` on the INSERT so the row is tagged atomically
   (today the app stamps `branch` in a follow-up UPDATE — fine to keep, but
   setting it in the RPC closes the gap).

3. Update the caller in `src/app/api/booking/route.ts` to pass `p_branch: branch`
   in the `supabase.rpc('book_slot', { ... })` call.

Keep everything else (reference generation, DUPLICATE_BOOKING check, return
shape) exactly as-is.
