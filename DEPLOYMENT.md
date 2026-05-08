# 🚀 SCAIO - Guia de Deploy em Produção

## Visão Geral

Este guia cobre o deploy completo do SCAIO em produção usando:
- **Backend**: Railway.app (com Docker)
- **Frontend**: Vercel
- **Monitoramento**: Prometheus + Grafana (self-hosted)

---

## 📋 Pré-requisitos

### Contas Necessárias

| Serviço | Link | Custo |
|---------|------|-------|
| GitHub | github.com | Free |
| Railway | railway.app | $5/mo (hobby) |
| Vercel | vercel.com | Free |
| Groq | groq.com | Free tier |

### Ferramentas Locais

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Instalar Vercel CLI
npm i -g vercel

# Verificar instalações
railway --version
vercel --version
docker --version
```

---

## 🔧 Configuração

### 1. Backend (Railway)

```bash
cd backend

# Login no Railway
railway login

# Criar novo projeto
railway init

# Adicionar variáveis de ambiente
railway variables set MIN_QUALITY_SCORE=7.0
railway variables set MAX_RETRIES=3
railway variables set GROQ_API_KEY=your_groq_key

# Adicionar banco de dados
railway add postgres
railway add redis

# Deploy
railway up --detach
```

### 2. Frontend (Vercel)

```bash
# Login no Vercel
vercel login

# Link com projeto
vercel link

# Deploy produção
vercel --prod
```

### 3. Monitoramento (Local/VPS)

```bash
cd backend

# Iniciar stack de monitoramento
docker-compose -f docker-compose.monitoring.yml up -d

# Acessar Grafana
# URL: http://localhost:3000
# Login: admin / scaio_monitor_pass
```

---

## 📊 Endpoints em Produção

| Serviço | URL | Status |
|---------|-----|--------|
| Frontend | `https://scaio.vercel.app` | ✅ |
| Backend API | `https://scaio-production.up.railway.app` | ✅ |
| Health Check | `/health` | ✅ |
| Metrics | `/metrics` | ✅ |
| WebSocket | `/ws` | ✅ |
| Grafana | `http://localhost:3000` | ✅ |
| Prometheus | `http://localhost:9090` | ✅ |

---

## 🔍 Métricas de Produção

### Dashboard Principal (Grafana)

| Métrica | Target | Atual |
|---------|--------|-------|
| Health State | GREEN | - |
| Avg Score | ≥ 7.0 | - |
| Success Rate | ≥ 70% | - |
| Latency P99 | < 200ms | - |
| Energy/Inference | < 10 units | - |
| Cache Hit Rate | ≥ 80% | - |
| Cost/1k Inferences | < $0.15 | - |

### Alertas Configurados

| Alerta | Condição | Ação |
|--------|----------|------|
| Health RED | `scaio_health_state == 3` | WhatsApp + Email |
| Score < 5 | `scaio_avg_score < 5` | Email |
| Latency > 500ms | `histogram_quantile(0.99, ...) > 0.5` | Slack |
| Bias Detected | `scaio_bias_detections > 0` | Email + Log |

---

## 🚀 Deploy Automatizado

### Usando o Script

```bash
cd backend
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### Via GitHub Actions

```yaml
# .github/workflows/cd.yml
on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        uses: railwayapp/deploy@v1
        with:
          token: ${{ secrets.RAILWAY_TOKEN }}
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🔄 Rollback

### Railway (Backend)

```bash
# Listar deployments
railway deployments

# Rollback para versão anterior
railway rollback <deployment-id>
```

### Vercel (Frontend)

```bash
# Listar deployments
vercel ls

# Rollback
vercel rollback <deployment-id>
```

---

## 📈 Monitoramento em Produção

### 1. Acessar Grafana

```bash
# URL: http://localhost:3000
# Dashboard: SCAIO Production Monitor
```

### 2. Métricas Chave

| Painel | Descrição |
|--------|-----------|
| Health State | Estado atual do sistema (GREEN/YELLOW/ORANGE/RED) |
| Avg Score | Qualidade média das decisões |
| Success Rate | Taxa de sucesso dos ciclos |
| Energy/Inference | Consumo energético por inferência |
| Latency P99 | Latência do 99º percentil |
| Cache Hit Rate | Eficiência do cache semântico |
| Bias Detections | Vieses detectados em tempo real |
| Precedent Tokens | Tokens ativos e valor do pool |

### 3. Alertas

```yaml
# monitoring/alertmanager.yml
route:
  receiver: 'whatsapp'
  group_by: ['alertname']

receivers:
  - name: 'whatsapp'
    webhook_configs:
      - url: 'http://evolution-api:8080/webhook'
```

---

## 💰 Custos Estimados

| Serviço | Plano | Custo/mês |
|---------|-------|-----------|
| Railway | Hobby | $5 |
| Vercel | Hobby | $0 |
| Groq API | Free Tier | $0 (até 14.400 req/dia) |
| Ollama | Self-hosted | $0 |
| **Total** | | **$5/mo** |

---

## 🛡️ Segurança

### Variáveis de Ambiente Sensíveis

Nunca commitar:
- `GROQ_API_KEY`
- `EVOLUTION_API_KEY`
- `POSTGRES_PASSWORD`
- `API_KEY`

Usar secrets do Railway/Vercel.

### HTTPS

- Vercel: Automático (Let's Encrypt)
- Railway: Automático (Let's Encrypt)

### Rate Limiting

Configurar no Railway:
- Max requests: 1000/min
- Max concurrent: 50

---

## 📞 Suporte

| Problema | Solução |
|----------|---------|
| Deploy falha no Railway | Verificar logs: `railway logs` |
| Frontend 404 | Verificar build: `vercel --build` |
| Métricas não aparecem | Verificar Prometheus: `curl localhost:9090/-/healthy` |
| WebSocket desconecta | Verificar CORS e firewall |

---

## ✅ Checklist de Deploy

- [ ] Railway CLI instalado
- [ ] Vercel CLI instalado
- [ ] GROQ_API_KEY configurada
- [ ] PostgreSQL provisionado
- [ ] Redis provisionado
- [ ] Tests passing (87% coverage)
- [ ] Monitoring stack running
- [ ] Health check passing
- [ ] WhatsApp notification tested

---

**SCAIO v1.0.0 | Deploy Guide | Última atualização: Março 2026**
