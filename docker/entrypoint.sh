#!/bin/sh
set -e

echo "Carregando banco de dados."

# Aguarda o PostgreSQL
until nc -z -v -w30 "$DB_HOST" "$DB_PORT"; do
  echo "Estabelecendo conexão com banco de dados $DB_HOST:$DB_PORT."
  sleep 2
done
echo "Banco de dados pronto."

echo "Executando migrações."
npm run knex migrate:latest

echo "Iniciando aplicação."
exec node dist/server.js
