# supabase Setup Instructions

This project is configured to use Supabase for the database and Realtime features.

## 1. Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

- `DATABASE_URL`: Your Supabase connection string (Transaction/Session mode). It typically looks like `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
- `VITE_SUPABASE_URL`: Your Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.

## 2. Database Setup

Ensure your database tables (`transactions`, `level_logs`, `system_metrics`) exist. You can run the migrations using `drizzle-kit`:

```bash
npm run db:push
```

## 3. Enable Realtime

For the dashboard to update in real-time, you **MUST enable Realtime** for your tables in the Supabase Dashboard:

1. Go to **Database** -> **Replication**.
2. Select the `api` (or `public`) schema.
3. Toggle **Insert/Update/Delete** for the following tables:
   - `transactions`
   - `security_logs`
   - `system_metrics`
4. Alternatively, run this SQL in the Supabase SQL Editor:

```sql
alter publication supabase_realtime add table transactions, security_logs, system_metrics;
```

## 4. Run the Project

```bash
npm run dev
```
