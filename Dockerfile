# Dockerfile para Monopoly Express - Deploy Completo
FROM node:18-alpine

# Instalar dependências do sistema
RUN apk add --no-cache python3 make g++ sqlite

# Criar diretório da aplicação
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Compilar TypeScript
RUN npm run build

# Criar diretório para banco de dados
RUN mkdir -p /app/data

# Expor portas
EXPOSE 3001 5173

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_URL=/app/data/monopoly_express.db

# Script de inicialização
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Comando padrão
CMD ["docker-entrypoint.sh"]

