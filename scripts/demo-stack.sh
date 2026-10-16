#!/usr/bin/env bash
# Starts the Admos LOCAL e2e stack (admos-laris-hub technology/scripts/e2e/up.sh)
# with the two extras the portfolio screenshots need, then stays attached:
#   - Accounting: Catat dari Foto on, photos kept on disk, the OpenRouter key read
#     at start from the dev .env of be-admos-accounting (never copied anywhere);
#   - Laris: QRIS pointed at scripts/fake-duitku.ts on 127.0.0.1.
# Both go in the hub's gitignored env/*.env files, removed again on exit.
#
# Usage: bash scripts/demo-stack.sh            (run in its own terminal; Ctrl-C stops it)
# Env:   HUB_DIR, ACC_BE_DIR and every E2E_* variable of the harness pass through
#        (E2E_DB_PORT=5442 for a Postgres other than Postgres.app's 5432).
set -euo pipefail

SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
HUB_DIR="${HUB_DIR:-/Users/adyan/Developer/example/admos-sales/admos-laris-hub}"
ACC_BE_DIR="${ACC_BE_DIR:-/Users/adyan/Developer/example/admos-accounting/codebase/be-admos-accounting}"
ENV_DIR="$HUB_DIR/technology/scripts/e2e/env"
RUN_DIR="${DEMO_RUN_DIR:-${TMPDIR:-/tmp}/adyan-site-demo}"
MARKER="# written by adyan-site scripts/demo-stack.sh"
FAKE_PORT="${FAKE_DUITKU_PORT:-18099}"
FAKE_MERCHANT="DEMO01"
FAKE_KEY="demo-local-duitku-key-0123456789abcdef"
LARIS_API_PORT="${E2E_LARIS_API_PORT:-18081}"

# write_env NAME OVERRIDES writes env/NAME.env as the example plus OVERRIDES,
# refusing to replace a file somebody else made.
write_env() {
  local name="$1" overrides="$2" file="$ENV_DIR/$1.env" keys
  if [ -f "$file" ] && ! grep -qF "$MARKER" "$file"; then
    echo "ERROR: $file exists and is not ours; move it away first" >&2
    exit 1
  fi
  keys="$(printf '%s\n' "$overrides" | grep -oE '^[A-Z_]+=' | tr '\n' '|' | sed 's/|$//')"
  { grep -vE "^($keys)" "$ENV_DIR/$name.env.example"; printf '\n%s\n%s\n' "$MARKER" "$overrides"; } >"$file"
}

cleanup() {
  [ -n "${FAKE_PID:-}" ] && kill "$FAKE_PID" 2>/dev/null || true
  for name in accounting-api laris-api; do
    if grep -qF "$MARKER" "$ENV_DIR/$name.env" 2>/dev/null; then rm -f "$ENV_DIR/$name.env"; fi
  done
}
trap cleanup EXIT

grep -q '^OPENROUTER_API_KEY=.' "$ACC_BE_DIR/.env" 2>/dev/null ||
  echo "WARN: no OPENROUTER_API_KEY in $ACC_BE_DIR/.env, Catat dari Foto stays off" >&2
# These paths are written into env files the hub sources as shell: refuse quotes and expansions.
case "$ACC_BE_DIR$RUN_DIR" in
  *[\'\"\$\`\\]*) echo "refusing a path with quotes, \$, \` or \\: $ACC_BE_DIR $RUN_DIR" >&2; exit 1 ;;
esac
mkdir -p "$RUN_DIR/objects"

write_env accounting-api "CATAT_ENABLED=true
OBJECT_STORE_DRIVER=fs
OBJECT_STORE_FS_ROOT=$RUN_DIR/objects
OPENROUTER_API_KEY=\"\$(sed -n 's/^OPENROUTER_API_KEY=//p' '$ACC_BE_DIR/.env')\""

write_env laris-api "DUITKU_MERCHANT_CODE=$FAKE_MERCHANT
DUITKU_API_KEY=$FAKE_KEY
DUITKU_BASE_URL=http://127.0.0.1:$FAKE_PORT
DUITKU_CALLBACK_URL=http://127.0.0.1:$LARIS_API_PORT/v1/webhook/duitku/callback"

FAKE_DUITKU_PORT="$FAKE_PORT" FAKE_DUITKU_MERCHANT="$FAKE_MERCHANT" FAKE_DUITKU_KEY="$FAKE_KEY" \
  bun "$SITE_DIR/scripts/fake-duitku.ts" >"$RUN_DIR/fake-duitku.log" 2>&1 &
FAKE_PID=$!

export HUB_DIR ACC_BE_DIR
"$HUB_DIR/technology/scripts/e2e/up.sh" --attach
