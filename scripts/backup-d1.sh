#!/usr/bin/env bash
# Backup Cloudflare D1 comments & typo reports
# Usage: ./scripts/backup-d1.sh [remote|local]

set -euo pipefail

TARGET="${1:-remote}"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_FILE="${BACKUP_DIR}/d1_backup_${TIMESTAMP}.sql"

mkdir -p "${BACKUP_DIR}"

echo "==> Backing up D1 database (target: ${TARGET})..."

if [ "${TARGET}" = "remote" ]; then
  npx wrangler d1 export ln-sakayori-db --remote --output="${OUTPUT_FILE}"
else
  npx wrangler d1 export ln-sakayori-db --local --output="${OUTPUT_FILE}"
fi

echo "==> Backup completed successfully: ${OUTPUT_FILE} ($(du -h "${OUTPUT_FILE}" | cut -f1))"
