# 🧠 SCAIO Backend - Sistema Cognitivo Autônomo

Backend em Python do SCAIO, implementando a arquitetura **Multi-Agent Metacognitive Architecture (MAMA)**.

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    SCAIO - 4 Camadas                         │
├─────────────────────────────────────────────────────────────┤
│  CAMADA 4: Comunicação Humana (WhatsApp)                    │
│  CAMADA 3: Meta-Health Agent (systemd + auto-restart)       │
│  CAMADA 2: Health Agent (sensores + classificador)          │
│  CAMADA 1: EditalHunter (agente cognitivo + memória)        │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Componentes

| Componente | Descrição |
|------------|-----------|
| `EditalHunter` | Agente principal com metacognição |
| `HealthAgent` | Supervisor de saúde do sistema |
| `MetaHealthAgent` | Supervisor do supervisor (última camada) |
| `QdrantMemory` | Memória semântica + procedural |
| `CognitiveGraph` | LangGraph com 7 etapas |
| `FastAPI` | API REST + WebSocket |

## 🚀 Instalação

### Pré-requisitos

- Python 3.11+
- Docker e Docker Compose (recomendado)

### Com Docker (Recomendado)

```bash
# Clone e entre no diretório
cd backend

# Copie as variáveis de ambiente
cp .env.example .env

# Inicie todos os serviços
docker-compose up -d

# Verifique se está rodando
curl http://localhost:8000/health
```

### Localmente

```bash
# Crie ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Instale dependências
pip install -r requirements.txt

# Configure variáveis
cp .env.example .env
# Edite .env com suas configurações

# Execute
python -m src.api.main
```

## 📡 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Health check |
| GET | `/api/metrics` | Métricas do sistema |
| POST | `/api/search` | Buscar editais |
| GET | `/api/memory/stats` | Estatísticas da memória |
| GET | `/api/memory/search` | Buscar na memória |
| WS | `/ws` | Métricas em tempo real |

### Exemplos de Uso

```bash
# Health check
curl http://localhost:8000/health

# Buscar editais
curl -X POST "http://localhost:8000/api/search?description=editais+saude"

# Métricas
curl http://localhost:8000/api/metrics

# Estatísticas da memória
curl http://localhost:8000/api/memory/stats
```

## 🧠 Ciclo Cognitivo

O EditalHunter executa este ciclo para cada tarefa:

```
┌─────────┐    ┌─────────┐    ┌─────────┐
│  PLAN   │───▶│ EXECUTE │───▶│EVALUATE │
└─────────┘    └─────────┘    └────┬────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
              ┌─────────┐   ┌─────────┐   ┌─────────┐
              │ REFLECT │   │ ADJUST  │   │ ESCALATE│
              └────┬────┘   └────┬────┘   └────┬────┘
                   │              │              │
                   ▼              ▼              ▼
              ┌─────────┐    ┌─────────┐
              │ PERSIST │◀───│ DELIVER │
              └─────────┘    └─────────┘
```

### Significado dos Estados

| Estado | Significado Jurídico |
|--------|---------------------|
| 🟢 GREEN | Conformidade plena |
| 🟡 YELLOW | Observação |
| 🟠 ORANGE | Notificação extrajudicial |
| 🔴 RED | Citação judicial |

## 🗄️ Banco de Dados

### PostgreSQL (EventStore)
- Eventos e logs de auditoria
- Estado dos agentes

### Qdrant (Memória Vetorial)
- `semantic_memory`: Fatos sobre editais
- `procedural_memory`: Estratégias aprendidas

### Redis
- Cache de consultas
- Filas de processamento

## ⚙️ Configuração

Todas as configurações estão em `.env`:

```bash
# Quality Thresholds
MIN_QUALITY_SCORE=7.0    # Limiar de materialidade
MAX_RETRIES=3             # Auto-correções máximas
MIN_SUCCESS_RATE=70.0     # Taxa mínima de sucesso

# Monitoring
HEALTH_CHECK_INTERVAL=60  # Intervalo de verificação (segundos)
```

## 🧪 Testes

```bash
# Executar todos os testes
pytest

# Com cobertura
pytest --cov=src --cov-report=html
```

## 📊 Monitoramento

O sistema expõe métricas via:

1. **Endpoint /api/metrics**: JSON com todas as métricas
2. **WebSocket /ws**: Métricas em tempo real
3. **Prometheus**: Integração futura

## 🔒 Segurança

- Autenticação via API Key
- Rate limiting recomendado
- Logs de auditoria completos

## 📚 Documentação

- [README Principal](../README.md)
- [Guia do Usuário](../USER_GUIDE.md)
- [Documentação Técnica](../TECHNICAL.md)

---

**SCAIO v1.0.0** | Licença: MIT
