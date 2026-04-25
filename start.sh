#!/usr/bin/env bash
set -e

BACKEND_PORT="${PORT:-4000}"
FRONTEND_PORT="${NEXT_PORT:-3000}"

# Kill anything already on the ports
for port in "$BACKEND_PORT" "$FRONTEND_PORT"; do
  pids=$(lsof -ti :"$port" 2>/dev/null || true)
  if [ -n "$pids" ]; then
    echo "[start] Killing processes on port $port: $pids"
    echo "$pids" | xargs kill 2>/dev/null || true
  fi
done

echo "[start] Starting backend on port $BACKEND_PORT..."
(cd backend && npm run dev) &
BACKEND_PID=$!

echo "[start] Starting frontend on port $FRONTEND_PORT..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM

wait
