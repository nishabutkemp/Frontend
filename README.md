# Pulse Tickets Frontend

MVP frontend for private employee tickets and AI-grouped manager workflows.

## Run

```bash
npm install
npm run dev
```

## Configuration

Create `.env` from `.env.example`.

- `VITE_API_BASE_URL` - backend base URL, for example `https://api.pulsetickets.internal/v1`.
- `VITE_AUTH_LOGIN_PATH` - login endpoint relative to API base URL, default `/auth/login`.
- `VITE_USE_MOCKS` - `true` by default when no API URL is set.
- `VITE_DEV_AUTH_TOKEN` - optional bearer token fallback for real API calls.
- `VITE_DEV_USER_ROLE` - `employee` or `manager` for mock mode.

Routes:

- Employee: `/employee`, `/employee/tickets/new`, `/employee/tickets`, `/employee/tickets/:ticketId`
- Manager: `/manager/groups`, `/manager/groups/:groupId`, `/manager/analytics`

## Docker

Build image:

```bash
docker build -t pulse-tickets-frontend .
```

Run container:

```bash
docker run -d --name pulse-tickets-frontend -p 80:80 \
  -e VITE_API_BASE_URL=http://2.27.54.78:8000/v1 \
  -e VITE_AUTH_LOGIN_PATH=/auth/login \
  -e VITE_USE_MOCKS=false \
  pulse-tickets-frontend
```

The container serves the built SPA with `nginx` on port `80`.
Client-side routes are supported through `try_files ... /index.html`.
Runtime variables are injected into `/config.js` on container start, so the same image can be reused across environments without rebuilding.

Or with Docker Compose:

```bash
docker compose up -d --build
```
