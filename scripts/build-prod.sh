#!/bin/bash

set -e

# =========================
#  Helper: usage
# =========================
usage() {
  cat <<EOF
Usage:
  npm run build:prod <backend_ver> <report_ver> <data_raw_ver> <cron_ver> <payment_orchestrator_ver>

  or with named args (recommended with npm):
  npm run build:prod -- --backend <ver> --report <ver> --data-raw <ver> --cron <ver> --payment-orchestrator <ver>

Examples:
  npm run build:prod 0.7.5 1.3.0 0.9.2 2.1.0 1.0.0
  npm run build:prod -- --backend 0.7.5 --report 1.3.0 --data-raw 0.9.2 --cron 2.1.0 --payment-orchestrator 1.0.0
EOF
}

# =========================
#  Semver validation
# =========================
is_semver() {
  # simple semver: X.Y.Z
  local v="$1"
  [[ "$v" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]
}

BACKEND_VER=""
REPORT_VER=""
DATA_RAW_VER=""
CRON_VER=""
PAYMENT_ORCHESTRATOR_VER=""

# =========================
#  Parse args
# =========================

if [[ "$1" == "--help" || "$1" == "-h" ]]; then
  usage
  exit 0
fi

if [[ "$1" == --* ]]; then
  # ----- Named args mode -----
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --backend)
        BACKEND_VER="$2"
        shift 2
        ;;
      --report)
        REPORT_VER="$2"
        shift 2
        ;;
      --data-raw|--data_raw)
        DATA_RAW_VER="$2"
        shift 2
        ;;
      --cron)
        CRON_VER="$2"
        shift 2
        ;;
      --payment-orchestrator|--payment_orchestrator)
        PAYMENT_ORCHESTRATOR_VER="$2"
        shift 2
        ;;
      --help|-h)
        usage
        exit 0
        ;;
      *)
        echo "⚠️ Unknown argument: $1"
        usage
        exit 1
        ;;
    esac
  done
else
  # ----- Positional mode -----
  BACKEND_VER="$1"
  REPORT_VER="$2"
  DATA_RAW_VER="$3"
  CRON_VER="$4"
  PAYMENT_ORCHESTRATOR_VER="$5"
fi

# =========================
#  Validate presence
# =========================

if [[ -z "$BACKEND_VER" || -z "$REPORT_VER" || -z "$DATA_RAW_VER" || -z "$CRON_VER" || -z "$PAYMENT_ORCHESTRATOR_VER" ]]; then
  echo "❌ ERROR: Not enough arguments."
  usage
  exit 1
fi

# =========================
#  Validate semver
# =========================

for pair in \
  "Backend:$BACKEND_VER" \
  "Report worker:$REPORT_VER" \
  "Data raw worker:$DATA_RAW_VER" \
  "Cron worker:$CRON_VER" \
  "Payment orchestrator:$PAYMENT_ORCHESTRATOR_VER"
do
  NAME="${pair%%:*}"
  VER="${pair##*:}"
  if ! is_semver "$VER"; then
    echo "❌ ERROR: $NAME version '$VER' is not valid semver (expected X.Y.Z)"
    usage
    exit 1
  fi
done

echo "✅ Versions accepted:"
echo "   Backend:              $BACKEND_VER"
echo "   Report worker:        $REPORT_VER"
echo "   Data raw:             $DATA_RAW_VER"
echo "   Cron:                 $CRON_VER"
echo "   Payment orchestrator: $PAYMENT_ORCHESTRATOR_VER"
echo ""

# =========================
#  Build & push
# =========================

echo "🚀 Building & pushing images for linux/amd64..."
echo ""

docker buildx build \
  --platform linux/amd64 \
  -t devonvione/onvi_business_backend:$BACKEND_VER \
  -t devonvione/onvi_business_report_worker:$REPORT_VER \
  -t devonvione/onvi_business_data_raw_worker:$DATA_RAW_VER \
  -t devonvione/onvi_business_cron:$CRON_VER \
  -t devonvione/onvi_business_payment_orchestrator:$PAYMENT_ORCHESTRATOR_VER \
  -f Dockerfile \
  . \
  --push

echo ""
echo "✅ DONE! Images pushed to Docker Hub:"
echo "   devonvione/onvi_business_backend:$BACKEND_VER"
echo "   devonvione/onvi_business_report_worker:$REPORT_VER"
echo "   devonvione/onvi_business_data_raw_worker:$DATA_RAW_VER"
echo "   devonvione/onvi_business_cron:$CRON_VER"
echo "   devonvione/onvi_business_payment_orchestrator:$PAYMENT_ORCHESTRATOR_VER"
echo ""