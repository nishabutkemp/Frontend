#!/bin/sh
set -eu

cat <<EOF >/usr/share/nginx/html/config.js
window.__APP_CONFIG__ = {
  VITE_API_BASE_URL: "${VITE_API_BASE_URL:-}",
  VITE_AUTH_LOGIN_PATH: "${VITE_AUTH_LOGIN_PATH:-/auth/login}",
  VITE_USE_MOCKS: "${VITE_USE_MOCKS:-true}",
  VITE_DEV_AUTH_TOKEN: "${VITE_DEV_AUTH_TOKEN:-}",
  VITE_DEV_USER_ROLE: "${VITE_DEV_USER_ROLE:-employee}"
};
EOF
