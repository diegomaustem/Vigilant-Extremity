# 📈 MENSAGERIA COM RABBITMQ 

# 🏗️ ORGANIZAÇÃO DO AUTO-SCALING

1. MONITOR (A cada 30 segundos)
    ├── Verifica tamanho da fila RabbitMQ

2. DECISÃO (Regras)                                                        
    ├── 0-10 mensagens   → 2 workers                                      
    ├── 10-50 mensagens  → 5 workers                                       
    ├── 50-100 mensagens → 10 workers                                        
    └── 100+ mensagens   → 20 workers

3. AÇÃO (Escala)                                
    └── docker-compose up -d --scale worker=N

4. Monitora a fila 'monitor-checks' a cada 30 segundos   

5. Calcula quantos workers são necessários  

6. Escala workers automaticamente        

7. Reduz workers quando a demanda diminui 


# O QUE CADA WORKER FAZ?

1. Worker 1 (API)	Scheduler + Consumer	Agenda verificações E processa

2. Worker 2	Consumer	Apenas processa verificações

3. Worker 3	Consumer	Apenas processa verificações

4. Worker N	Consumer	Apenas processa verificações


# 🚀 SUBIR APLICAÇÃO 
1. Subir todos os serviços
npm run docker:up

# 📋 VER LOGS
2. npm run docker:logs

# ⏳ VER STATUS
3. docker-compose -f docker/docker-compose.yml ps