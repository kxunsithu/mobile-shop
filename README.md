# Mobile Phone E-commerce Website

Separate React (frontend) and Laravel (backend) application.

## Structure

- `frontend/` — React + TypeScript + Tailwind
- `backend/` — Laravel REST API

## Backend Setup (Local - SQLite)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite   # auto-created if missing
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

Backend runs at http://127.0.0.1:8000 (API base: /api/v1).

Demo accounts:
- Admin: admin@example.com / password
- Customer: customer@example.com / password

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs at http://127.0.0.1:5173.

## Environment

Frontend `.env`:
```
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Backend `.env` (local):
```
APP_ENV=local
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

## Production (Railway + Vercel)

Backend (Railway):
- Root directory: `backend`
- Add PostgreSQL service, reference variables:
```
DB_CONNECTION=pgsql
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_DATABASE=${{Postgres.PGDATABASE}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
APP_ENV=production
APP_KEY=base64:...
```
- Run `php artisan migrate --force` during deploy.
- Configure CORS for Vercel domain.

Frontend (Vercel):
- Root directory: `frontend`
- Env: `VITE_API_BASE_URL=https://your-backend.up.railway.app/api/v1`

## Notes

- Switching DB between SQLite and PostgreSQL only requires env changes.
- All migrations are compatible with both SQLite and PostgreSQL.
- Admin routes protected by role middleware.
