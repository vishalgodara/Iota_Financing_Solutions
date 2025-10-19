#!/usr/bin/env bash
# Starts backend (server.js) in background and frontend (vite) in foreground.
# Usage: ./scripts/start-dev.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# Start backend in background and redirect logs
echo "Starting backend (server.js) on port 3001..."
nohup node server.js > /tmp/ifs-server.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID (logs: /tmp/ifs-server.log)"

# Start frontend (vite) in foreground so logs show in terminal
echo "Starting frontend (vite)..."
npm run dev

# If npm run dev exits, we clean up the backend
echo "Frontend exited, killing backend PID $BACKEND_PID"
kill $BACKEND_PID || true
