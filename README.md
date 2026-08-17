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



----


   AUTO-SCALER                                                   │
│                                                                                         │
│  ✅ Monitora a fila 'monitor-checks' a cada 30 segundos                               │
│  ✅ Calcula quantos workers são necessários                                           │
│  ✅ Escala workers automaticamente                                                   │
│  ✅ Reduz workers quando a demanda diminui 



O QUE CADA WORKER FAZ?
Worker	Função	O que faz
Worker 1 (API)	Scheduler + Consumer	Agenda verificações E processa
Worker 2	Consumer	Apenas processa verificações
Worker 3	Consumer	Apenas processa verificações
Worker N	Consumer	Apenas processa verificações
