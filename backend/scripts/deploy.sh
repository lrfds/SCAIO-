#!/bin/bash
# SCAIO Production Deploy Script
# Deploy backend to Railway + Frontend to Vercel

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         SCAIO Production Deploy Script                       ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}[1/6] Checking prerequisites...${NC}"

command -v docker >/dev/null 2>&1 || { echo -e "${RED}Docker required but not installed.${NC}"; exit 1; }
command -v railway >/dev/null 2>&1 || { echo -e "${RED}Railway CLI required. Install: npm i -g @railway/cli${NC}"; exit 1; }
command -v vercel >/dev/null 2>&1 || { echo -e "${RED}Vercel CLI required. Install: npm i -g vercel${NC}"; exit 1; }

echo -e "${GREEN}✓ All prerequisites met${NC}"
echo ""

# Build and test
echo -e "${YELLOW}[2/6] Running tests...${NC}"
cd backend
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
echo -e "${GREEN}✓ Tests passed${NC}"
cd ..
echo ""

# Deploy backend to Railway
echo -e "${YELLOW}[3/6] Deploying backend to Railway...${NC}"
cd backend
railway login
railway up --detach
BACKEND_URL=$(railway domain)
echo -e "${GREEN}✓ Backend deployed: ${BACKEND_URL}${NC}"
cd ..
echo ""

# Deploy frontend to Vercel
echo -e "${YELLOW}[4/6] Deploying frontend to Vercel...${NC}"
vercel link --yes
vercel --prod
FRONTEND_URL=$(vercel --prod --confirm)
echo -e "${GREEN}✓ Frontend deployed: ${FRONTEND_URL}${NC}"
echo ""

# Setup monitoring
echo -e "${YELLOW}[5/6] Starting monitoring stack...${NC}"
cd backend
docker-compose -f docker-compose.monitoring.yml up -d
echo -e "${GREEN}✓ Monitoring started:${NC}"
echo -e "   Prometheus: http://localhost:9090"
echo -e "   Grafana: http://localhost:3000 (admin/scaio_monitor_pass)"
echo -e "   AlertManager: http://localhost:9093"
cd ..
echo ""

# Health check
echo -e "${YELLOW}[6/6] Running health checks...${NC}"
sleep 10

HEALTH=$(curl -sf "${BACKEND_URL}/health" || echo "")
if [ -z "$HEALTH" ]; then
    echo -e "${RED}✗ Health check failed${NC}"
    echo -e "${YELLOW}Rolling back...${NC}"
    railway rollback
    exit 1
fi

echo -e "${GREEN}✓ Health check passed${NC}"
echo ""

# Summary
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              DEPLOYMENT COMPLETE                             ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║${NC} Frontend: ${FRONTEND_URL}"
echo -e "${GREEN}║${NC} Backend:  ${BACKEND_URL}"
echo -e "${GREEN}║${NC} Grafana:  http://localhost:3000"
echo -e "${GREEN}║${NC} Prometheus: http://localhost:9090"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Send WhatsApp notification (if enabled)
if [ "$WHATSAPP_ENABLED" = "true" ]; then
    echo -e "${YELLOW}Sending WhatsApp notification...${NC}"
    curl -X POST "${EVOLUTION_API_URL}/message/sendText" \
        -H "Content-Type: application/json" \
        -H "apikey: ${EVOLUTION_API_KEY}" \
        -d "{
            \"remoteJid\": \"${WHATSAPP_NUMBER}@s.whatsapp.net\",
            \"textMessage\": {
                \"text\": \"🚀 SCAIO Deploy Concluído\\n\\nFrontend: ${FRONTEND_URL}\\nBackend: ${BACKEND_URL}\\n\\nStatus: ✅ Sucesso\"
            }
        }" || echo -e "${RED}Failed to send WhatsApp notification${NC}"
fi

echo ""
echo -e "${GREEN}Deployment completed successfully!${NC}"
