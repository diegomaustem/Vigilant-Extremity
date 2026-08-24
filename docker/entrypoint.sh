#!/bin/sh
set -e

echo "🔍 Carregando banco de dados..."

# Aguarda o PostgreSQL
until nc -z -v -w30 "$DB_HOST" "$DB_PORT"; do
  echo "⏳ Estabelecendo conexão com banco de dados $DB_HOST:$DB_PORT..."
  sleep 2
done
echo "✅ Banco de dados pronto."

# Aguarda o RabbitMQ
echo "🔍 Aguardando RabbitMQ..."
until nc -z -v -w30 rabbitmq 5672; do
  echo "⏳ Aguardando RabbitMQ..."
  sleep 2
done
echo "✅ RabbitMQ pronto!"

echo "🔄 Executando migrações..."
npm run knex migrate:latest

echo "🚀 Iniciando aplicação..."
exec node dist/server.js