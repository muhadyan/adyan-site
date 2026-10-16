#!/usr/bin/env bash
# shellcheck disable=SC2034 # the sourced hub libs (http.sh, smoke-identity.sh) read these
# Seeds the fictional demo business "Toko Sekar Batik" into the LOCAL Admos e2e
# stack (scripts/demo-stack.sh), through the apps' own HTTP APIs, for the
# portfolio screenshots: five months of Accounting sales and expenses (busier each
# month, daily in the last one), six batik products with stock in Laris, one
# running exhibition, and a few paid orders today (cash and QRIS) that flow into
# Accounting.
#
# macOS only: dates use BSD `date -v`.
#
# Usage: bash scripts/seed-local-demo.sh
# Env:   DEMO_EMAIL (default demo+sekar@example.com), DEMO_PASSWORD (default:
#        random, printed once at the end), HUB_DIR, and the harness's E2E_*
#        variables (for example E2E_DB_PORT). Every name here is made up.
set -euo pipefail

HUB_DIR="${HUB_DIR:-/Users/adyan/Developer/example/admos-sales/admos-laris-hub}"
E2E="$HUB_DIR/technology/scripts/e2e"
# shellcheck source=/dev/null
. "$E2E/lib/common.sh"
# shellcheck source=/dev/null
. "$E2E/lib/codes.sh"
# shellcheck source=/dev/null
. "$E2E/lib/http.sh"
# shellcheck source=/dev/null
. "$E2E/lib/smoke-identity.sh"
load_common_env

# Our own scratch files, so the hub's smoke files are never truncated.
SMOKE_TMP="$(mktemp -d "${TMPDIR:-/tmp}/sekar-seed.XXXXXX")"
JAR="$SMOKE_TMP/cookies.txt"
RESP_BODY="$SMOKE_TMP/body.json"
HEADERS="$SMOKE_TMP/headers.txt"
VARIANTS="$SMOKE_TMP/variants.tsv"
smoke_init
SMOKE_ORIGIN="$E2E_LARIS_WEB_URL"

assert_local_db "$E2E_ACC_DATABASE_URL"
assert_local_db "$E2E_LARIS_DATABASE_URL"
for url in "$E2E_ACC_API_URL" "$E2E_LARIS_API_URL"; do
  case "$url" in
    http://127.0.0.1:* | http://localhost:* | http://*.localhost:*) ;;
    *) die "refusing $url: the demo seed only talks to a local stack" ;;
  esac
done

EMAIL="${DEMO_EMAIL:-demo+sekar@example.com}"
PASSWORD="${DEMO_PASSWORD:-Sekar-$(openssl rand -hex 5)-26}"
BUSINESS="Toko Sekar Batik"
# The cashier's address follows the owner's, so a second demo business can be seeded beside the first.
CASHIER_EMAIL="kasir-$(printf '%s' "${EMAIL%@*}" | tr -c 'a-zA-Z0-9' '-')@example.com"
ACC_TOKEN=""
LARIS_TOKEN=""
ORG_ID=""
STORE_ID=""

days_ago() { date -v-"$1"d '+%Y-%m-%d'; }
# month_day MONTHS_AGO DAY prints that day of the month MONTHS_AGO months back.
month_day() { date -v-"$1"m -v"$2"d '+%Y-%m-%d'; }
now_utc() { date -u '+%Y-%m-%dT%H:%M:%SZ'; }
ok() { case "$STATUS" in 200 | 201) ;; *) fail "$1" "HTTP $STATUS" ;; esac; }

# acc_save PATH BODY posts a save with a fresh idempotency key.
acc_save() {
  AUTH="Bearer $ACC_TOKEN"
  call POST "$E2E_ACC_API_URL$1" "$2" "Idempotency-Key: $(new_uuid)"
  AUTH=""
  ok "Accounting $1"
}

# ---------------------------------------------------------------------------
# Identity: Akun Admos owner, Accounting started, Laris shop linked
# ---------------------------------------------------------------------------

sign_up() {
  public POST "$E2E_ACC_API_URL/v1/auth/register" "$(jq -nc --arg e "$EMAIL" --arg p "$PASSWORD" --arg b "$BUSINESS" \
    '{name: "Sekar Ayu", email: $e, password: $p, business_name: $b, app: "laris"}')"
  [ "$STATUS" = 201 ] || fail "register $EMAIL (already seeded? use another DEMO_EMAIL or down.sh --drop)" "HTTP $STATUS"
  ACC_TOKEN="$(field '.data.token')"
  ORG_ID="$(field '.data.businesses[0].id')"
  is_int "$ORG_ID" || fail "register" "no business id"
  local code
  code="$(wait_code acc-api "$EMAIL" 'verif' 20)" || fail "verification code" "nothing in the Accounting log"
  acc POST /v1/auth/verify-email "$(jq -nc --arg c "$code" '{code: $c}')"
  ok "verify-email"
  public GET "$E2E_ACC_API_URL/v1/auth/session"
  ok "session"
  ACC_TOKEN="$(field '.data.token')"
  public POST "$E2E_LARIS_API_URL/v1/auth/exchange" '{}'
  ok "Laris exchange"
  LARIS_TOKEN="$(field '.data.token')"
  STORE_ID="$(field '.data.store.id')"
  acc POST /v1/organization/start-accounting "$(jq -nc --argjson o "$ORG_ID" '{organization_id: $o}')"
  ok "start-accounting"
  poll 60 linked || fail "Laris shop linked to Accounting" "not linked after 60 s"
  pass "owner $EMAIL, business $ORG_ID, shop $STORE_ID"
}

shop_profile() {
  laris PUT /v1/store "$(jq -nc --arg n "$BUSINESS" '{name: $n,
    address: "Jl. Prawirotaman No. 12, Mergangsan, Yogyakarta", phone: "",
    receipt_footer: "Matur nuwun, sugeng rawuh malih", bank_name: "BCA",
    bank_account: "0000123456", bank_holder: "Sekar Ayu"}')"
  ok "shop profile"
  laris POST /v1/cashiers "$(jq -nc --arg e "$CASHIER_EMAIL" '{name: "Dewi", email: $e}')"
  ok "invite cashier"
  local link token
  link="$(wait_code laris-api "$CASHIER_EMAIL" 'invit' 20)" || fail "cashier invitation" "nothing in the Laris log"
  token="${link##*/}"
  token="${token##*token=}"
  public POST "$E2E_LARIS_API_URL/v1/cashier-invitations/$token" '{"pin": "135790"}'
  ok "cashier accepts"
  pass "shop address, bank account and cashier Dewi"
}

# ---------------------------------------------------------------------------
# Accounting: opening balances and a month of expenses
# ---------------------------------------------------------------------------

load_accounts() {
  acc GET "/v1/account/list?organization_id=$ORG_ID&limit=200"
  ok "account list"
  cp "$RESP_BODY" "$SMOKE_TMP/accounts.json"
}

account() {
  local id
  id="$(jq -r --arg n "$1" '[.. | objects | select(.name? == $n and .code? != null) | .id][0] // empty' "$SMOKE_TMP/accounts.json")"
  is_int "$id" || fail "account $1" "not in the chart of accounts"
  printf '%s\n' "$id"
}

# journal DATE MEMO DEBIT_ACCOUNT CREDIT_ACCOUNT AMOUNT
journal() {
  acc_save /v1/journal/save "$(jq -nc --argjson o "$ORG_ID" --arg d "$1" --arg m "$2" \
    --argjson da "$(account "$3")" --argjson ca "$(account "$4")" --arg a "$5" \
    '{id: 0, organization_id: $o, transaction_date: $d, memo: $m, transaction_kind: "general",
      lines: [{account_id: $da, debit: $a, credit: "0"}, {account_id: $ca, debit: "0", credit: $a}],
      inventory_movements: []}')"
}

opening_and_expenses() {
  local month
  journal "$(days_ago 160)" "Modal awal di laci" "Kas" "Ekuitas Saldo Awal" 5000000
  journal "$(days_ago 160)" "Modal awal di rekening" "Rekening Bank" "Ekuitas Saldo Awal" 45000000
  for month in 4 3 2 1 0; do
    journal "$(month_day "$month" 1)" "Sewa kios" "Biaya Sewa - Bangunan" "Rekening Bank" 1500000
    journal "$(month_day "$month" 5)" "Upah dua penjahit" "Upah" "Rekening Bank" 2400000
    journal "$(month_day "$month" 10)" "Token listrik kios" "Listrik" "Kas" $((350000 + month * 5000))
  done
  journal "$(days_ago 14)" "Iklan Instagram koleksi baru" "Iklan & Promosi" "Rekening Bank" 450000
  journal "$(days_ago 10)" "Ongkir paket ke pelanggan" "Ongkos Kirim Penjualan" "Kas" 210000
  journal "$(days_ago 6)" "Paket data HP toko" "Komunikasi - Penjualan" "Kas" 150000
  journal "$(days_ago 3)" "Sewa booth pameran" "Marketing Lainnya" "Rekening Bank" 750000
  pass "opening balances and monthly rent, wages and electricity for five months"
}

# ---------------------------------------------------------------------------
# Laris: products with stock, the exhibition
# ---------------------------------------------------------------------------

funding_account() {
  laris GET /v1/accounting/context
  ok "accounting context"
  local id
  id="$(field '[.data.funding_accounts[] | select(.name == "Rekening Bank")][0].id')"
  [ -n "$id" ] || id="$(field '[.data.funding_accounts[] | select(.name | test("^Kas"))][0].id')"
  is_int "$id" || fail "funding account" "neither Rekening Bank nor Kas offered"
  printf '%s\n' "$id"
}

# product INDEX NAME OPTION VALUES PRICE COST STOCK FUNDING
product() {
  local body
  body="$(jq -nc --arg n "$2" --arg o "$3" --arg v "$4" --argjson p "$5" --argjson c "$6" --argjson s "$7" \
    --argjson f "$8" --arg d "$(days_ago 155)" '
    ($v | split(",")) as $vals
    | {name: $n, track_stock: true, options: [{name: $o, values: $vals}],
       variants: [$vals[] | {option_values: [.], price: $p, cost_price: $c, stock: $s}],
       stock_change: {doc_date: $d, note: "Stok awal dari pengrajin",
                      sources: [{account_id: $f, amount: ($c * $s * ($vals | length))}]}}')"
  laris POST /v1/products "$body"
  ok "product $2"
  jq -r --arg i "$1" '.data.variants | to_entries[] | [$i, .key, .value.id, .value.code, .value.price] | @tsv' \
    "$RESP_BODY" >>"$VARIANTS"
}

products() {
  local fund
  fund="$(funding_account)"
  : >"$VARIANTS"
  product 0 "Kemeja Batik Parang Kusumo" Ukuran "M,L,XL" 245000 118000 22 "$fund"
  product 1 "Blus Batik Kawung Sogan" Ukuran "S,M,L" 215000 96000 20 "$fund"
  product 2 "Dress Batik Mega Mendung" Ukuran "S,M,L" 325000 158000 20 "$fund"
  product 3 "Outer Batik Sidomukti" Ukuran "All Size" 285000 132000 24 "$fund"
  product 4 "Selendang Batik Lasem" Warna "Merah,Biru Indigo" 145000 61000 24 "$fund"
  product 5 "Kain Batik Tulis Truntum" Warna "Sogan,Indigo" 650000 335000 8 "$fund"
  pass "6 batik products, $(wc -l <"$VARIANTS" | tr -d ' ') variants with stock"
}

# variant PRODUCT N prints "id<TAB>code<TAB>price" of the product's Nth variant (wrapping).
variant() {
  awk -F '\t' -v p="$1" -v v="$2" '$1 == p { row[n++] = $3 "\t" $4 "\t" $5 } END { print row[v % n] }' "$VARIANTS"
}

exhibition() {
  laris POST /v1/events "$(jq -nc --arg s "$(days_ago 1)" --arg e "$(date -v+2d '+%Y-%m-%d')" \
    '{name: "Pameran Wastra Nusantara", venue: "Jogja Expo Center", starts_on: $s, ends_on: $e}')"
  ok "create exhibition"
  local id
  id="$(field '.data.id')"
  laris PUT /v1/store/active-event "$(jq -nc --argjson id "$id" '{event_id: $id}')"
  ok "activate exhibition"
  pass "exhibition Pameran Wastra Nusantara is running"
}

# ---------------------------------------------------------------------------
# Sales: a month of Shopee and walk-in sales in Accounting, today's Laris orders
# ---------------------------------------------------------------------------

channel() {
  jq -r --arg n "$1" '[.. | objects | select(.name? == $n) | .id][0] // empty' "$SMOKE_TMP/channels.json"
}

# acc_sale DATE CHANNEL_ID PRODUCT N QTY
acc_sale() {
  local vid
  vid="$(variant "$3" "$4" | cut -f1)"
  acc_save /v1/sale/save "$(jq -nc --argjson o "$ORG_ID" --arg d "$1" --argjson ch "$2" --argjson v "$vid" --arg q "$5" \
    '{id: 0, organization_id: $o, transaction_date: $d, sales_channel_id: $ch,
      lines: [{laris_variant_id: $v, quantity: $q}], fees: [], memo: ""}')"
}

month_of_sales() {
  acc GET "/v1/sales-channel/list?organization_id=$ORG_ID"
  ok "sales channels"
  cp "$RESP_BODY" "$SMOKE_TMP/channels.json"
  local shopee direct day count=0
  shopee="$(channel Shopee)"
  direct="$(channel Direct)"
  if ! is_int "$shopee" || ! is_int "$direct"; then fail "sales channels" "Shopee or Direct missing"; fi
  for day in $(seq 150 -1 1); do
    # Busier each month: every 5th day five months ago, every day this month.
    [ $((day % (1 + (day - 1) / 30))) = 0 ] || continue
    acc_sale "$(days_ago "$day")" "$([ $((day % 2)) = 1 ] && echo "$shopee" || echo "$direct")" \
      $((day % 5)) "$day" $((1 + day % (day > 30 ? 2 : 3)))
    count=$((count + 1))
    if [ "$day" -le 30 ] || [ $((day % 3)) = 0 ]; then
      acc_sale "$(days_ago "$day")" "$shopee" $(((day + 2) % 6)) $((day + 1)) 1
      count=$((count + 1))
    fi
  done
  pass "$count sales over five months (Shopee and walk-in)"
}

# order METHOD "PRODUCT:N:QTY ..." places a counter order and pays it by METHOD
# (cash, qris), or leaves it unpaid (a buyer who stepped away from the stand).
order() {
  local method="$1" id lines="[]" total=0 item p n q row
  id="$(new_uuid)"
  for item in $2; do
    IFS=: read -r p n q <<<"$item"
    row="$(variant "$p" "$n")"
    lines="$(jq -c --arg c "$(cut -f2 <<<"$row")" --argjson q "$q" '. + [{code: $c, qty: $q}]' <<<"$lines")"
    total=$((total + $(cut -f3 <<<"$row") * q))
  done
  laris PUT "/v1/orders/$id" "$(jq -nc --arg t "$(now_utc)" --argjson l "$lines" \
    '{created_at: $t, device_tag: "demo", channel: "counter", discount: 0, shipping_cost: 0, lines: $l}')"
  ok "order $id"
  if [ "$method" = unpaid ]; then
    return 0
  elif [ "$method" = cash ]; then
    laris POST "/v1/orders/$id/pay-cash" "$(jq -nc --argjson r $(((total + 49999) / 50000 * 50000)) '{cash_received: $r}')"
    ok "pay cash"
  else
    laris POST "/v1/orders/$id/pay-qris" ""
    ok "pay QRIS (is scripts/fake-duitku.ts running?)"
    poll 20 order_paid "$id" || fail "QRIS order $id" "not paid 20 s after the QR"
    QRIS_ORDERS="$QRIS_ORDERS${QRIS_ORDERS:+,}'$id'"
  fi
}

order_paid() {
  laris GET "/v1/orders/$1"
  [ "$(field '.data.status')" = paid ]
}

orders_today() {
  QRIS_ORDERS=""
  order qris "2:1:1"
  order qris "5:0:1 4:1:1"
  order cash "0:1:1 4:0:1"
  order qris "3:0:1 1:1:1"
  order cash "1:2:2"
  order qris "0:2:1"
  order cash "3:0:1"
  order cash "0:0:1 1:0:1 4:1:2"
  order unpaid "4:0:1"
  settle_qris "$QRIS_ORDERS"
  pass "8 paid orders today at the exhibition (4 cash, 4 QRIS, all settled), 1 left unpaid"
}

# settle_qris "'uuid','uuid'" makes those QRIS sales withdrawable now, so Saldo
# shows no payout date (the site does not publish the payout timing). No API
# backdates a QR, so this one SQL statement moves only available_at; every amount
# stays, which keeps Saldo Laris in Accounting equal to the Laris ledger.
settle_qris() {
  sql "$E2E_LARIS_DATABASE_URL" "UPDATE ledger_entry SET available_at = now() - interval '1 hour'
    WHERE store_id = $STORE_ID AND order_id::text IN ($1)" >/dev/null
}

printf 'Seeding %s on %s and %s\n\n' "$BUSINESS" "$E2E_ACC_API_URL" "$E2E_LARIS_API_URL"
sign_up
shop_profile
load_accounts
opening_and_expenses
products
exhibition
month_of_sales
orders_today
rm -rf "$SMOKE_TMP"
printf '\nDone. Sign in with:\n  DEMO_EMAIL=%s DEMO_PASSWORD=%s\n' "$EMAIL" "$PASSWORD"
