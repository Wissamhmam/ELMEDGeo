#!/bin/bash
set -e

echo "Restoring database from backup.dump..."
pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" /docker-entrypoint-initdb.d/backup.dump
echo "Database restoration complete."
