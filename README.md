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
- `VITE_USE_MOCKS` - `true` by default when no API URL is set.
- `VITE_DEV_AUTH_TOKEN` - optional bearer token for real API calls.
- `VITE_DEV_USER_ROLE` - `employee` or `manager` for mock mode.

Routes:

- Employee: `/employee`, `/employee/tickets/new`, `/employee/tickets`, `/employee/tickets/:ticketId`
- Manager: `/manager/groups`, `/manager/groups/:groupId`, `/manager/analytics`
