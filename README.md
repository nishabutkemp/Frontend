# Fastretro Frontend

MVP frontend for private employee tickets and AI-grouped manager workflows.

## Run

```bash
npm install
npm run dev
```

## Configuration

Create `.env` from `.env.example`.

- `VITE_API_BASE_URL` - backend base URL, for example `https://api.fastretro.internal/v1`.
- `VITE_AUTH_LOGIN_PATH` - login endpoint relative to API base URL, default `/auth/login`.
- `VITE_USE_MOCKS` - `true` by default when no API URL is set.
- `VITE_DEV_AUTH_TOKEN` - optional bearer token fallback for real API calls.
- `VITE_DEV_USER_ROLE` - `employee` or `manager` for mock mode.

Routes:

- Employee: `/employee`, `/employee/tickets/new`, `/employee/tickets`, `/employee/tickets/:ticketId`
- Manager: `/manager/groups`, `/manager/groups/:groupId`, `/manager/analytics`
