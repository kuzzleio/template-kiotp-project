#!/bin/bash

echo "$CI"

if [ "$CI" != "true" ] && [ ! -d "node_modules" ]; then
  echo "node_modules directory not found. Installing dependencies from..."
  npm ci
fi

echo "Starting application $1..."

# Run the npm run dev command
if [ "$1" = "web" ]; then
  echo "Running npm run dev with host..."
  npm run dev --prefix /var/app/apps/web -- --host
else
  echo "Running npm run dev..."
  npm run dev --prefix /var/app/apps/api
fi