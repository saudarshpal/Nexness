#!/bin/sh
set -e

echo "Running migrations..."
cd /app/packages/database
bunx prisma db push

echo "Starting api..."
cd /app/apps/api
exec bun start