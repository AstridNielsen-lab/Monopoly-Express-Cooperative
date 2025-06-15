#!/bin/sh
# Script de entrada para container Docker

echo "🚀 Iniciando Monopoly Express em modo produção..."

# Verificar se o banco de dados existe, se não, criar
if [ ! -f "/app/data/monopoly_express.db" ]; then
    echo "📁 Criando banco de dados inicial..."
    node -e "require('./backend/database/setup.js').setupDatabase()"
fi

# Criar usuário admin se não existir
echo "👤 Verificando usuário admin..."
node create-admin.js || echo "💡 Admin já existe ou erro ao criar"

# Iniciar o servidor backend
echo "🗡️ Iniciando servidor backend..."
exec node backend/server.js

