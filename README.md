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

## Docker

Build image:

```bash
docker build -t pulse-tickets-frontend .
```

Run container:

```bash
docker run -d --name pulse-tickets-frontend -p 127.0.0.1:8080:80 \
  -e VITE_API_BASE_URL=/v1 \
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

## Production SSL On Ubuntu

Recommended topology:

- Frontend container listens only on `127.0.0.1:8080`
- Backend API listens only on `127.0.0.1:8000`
- Host `nginx` listens on `80/443`
- `certbot` issues and renews Let's Encrypt certificates
- Public HTTPS domain proxies `/` to frontend and `/v1/` to backend

Why this layout:

- `certbot --nginx` works cleanly on the host
- the frontend container is not exposed directly to the internet
- API calls avoid mixed-content errors because the frontend uses `VITE_API_BASE_URL=/v1`

### 1. DNS

Point your domain to the Ubuntu server:

- `A example.com -> your_server_ip`
- `A www.example.com -> your_server_ip`

Wait until DNS resolves correctly before requesting certificates.

### 2. Ubuntu Packages

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx docker.io docker-compose-plugin
sudo systemctl enable --now nginx docker
```

### 3. Deploy Frontend

```bash
cd /root
git clone <your_repo_url> frontend
cd /root/frontend
docker compose up -d --build
docker ps
```

Expected port mapping for the frontend container:

```bash
127.0.0.1:8080->80/tcp
```

### 4. Prepare Backend Routing

Your backend should preferably be published only locally too, for example:

```yaml
ports:
  - "127.0.0.1:8000:8000"
```

If backend is in another repo, change that repo's compose file separately.

### 5. Install Nginx Site Config

Use [deploy/nginx/fastretro.conf.example](/Users/max/shit/butkemp/Frontend/deploy/nginx/fastretro.conf.example) as the template.

On the server:

```bash
sudo mkdir -p /var/www/certbot
sudo cp /root/frontend/deploy/nginx/fastretro.conf.example /etc/nginx/sites-available/fastretro.conf
```

Then edit the file:

- replace `example.com` with your real domain
- keep `proxy_pass http://127.0.0.1:8080;` for frontend
- keep `proxy_pass http://127.0.0.1:8000/v1/;` for backend if API is on the same server

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/fastretro.conf /etc/nginx/sites-enabled/fastretro.conf
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Issue SSL Certificate With Certbot

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

Choose the redirect-to-HTTPS option when `certbot` asks.
`certbot` will update the nginx config automatically and add the SSL directives and redirect rules.

### 7. Verify

Open:

- `https://example.com`
- `https://www.example.com`

Check renewal timer:

```bash
systemctl status certbot.timer
sudo certbot renew --dry-run
```

### 8. Firewall

If `ufw` is enabled:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Important

Do not keep the frontend configured with `http://<ip>:8000/v1` when the site is opened over HTTPS.
Browsers will block those API requests as mixed content.
For production with SSL, use:

```bash
VITE_API_BASE_URL=/v1
```
