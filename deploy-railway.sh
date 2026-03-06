#!/bin/bash
# Deploy backend to Railway. Run from repo root: ./deploy-railway.sh
# You must run "railway login" once, and have linked this to a Railway project (railway link from backend/).

set -e
cd "$(dirname "$0")/backend"
echo "Deploying from backend/ ..."
railway up
