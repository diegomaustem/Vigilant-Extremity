📈 MENSAGERIA COM RABBITMQ 
🏗️ ORGANIZAÇÃO DO AUTO-SCALING

1. MONITOR (A cada 30 segundos)
   └── Verifica tamanho da fila RabbitMQ

2. DECISÃO (Regras)                                                        
    ├── 0-10 mensagens   → 2 workers                                      
    ├── 10-50 mensagens  → 5 workers                                       
    ├── 50-100 mensagens → 10 workers                                        
    └── 100+ mensagens   → 20 workers

3. AÇÃO (Escala)                                
    └── docker-compose up -d --scale worker=N

SUBIR O SERVIÇO : 

# Subir todos os serviços
npm run docker:up

# Ver logs
npm run docker:logs

# Ver status
docker-compose -f docker/docker-compose.yml ps
