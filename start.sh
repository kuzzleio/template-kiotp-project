#!/bin/bash

# Run the npm run dev command
if [ "$1" = "web" ]; then
  echo "Running npm run dev with host..."
  npm run dev --prefix /var/app/apps/web -- --host
else
  echo "Running npm run dev..."
  npm run dev --prefix /var/app/apps/api
fi
