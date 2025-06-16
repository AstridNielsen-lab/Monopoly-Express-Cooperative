# Deploy no Vercel - Monopoly Express

Este guia explica como fazer o deploy da aplicação Monopoly Express no Vercel com SQLite.

## 🚀 Passos para Deploy

### 1. Preparar o projeto

```bash
# Instalar dependências
npm install

# Build do projeto
npm run build
```

### 2. Configurar variáveis de ambiente no Vercel

No painel do Vercel, configure as seguintes variáveis:

```env
# Configurações básicas
NODE_ENV=production
VITE_API_URL=https://seu-projeto.vercel.app/api
VITE_APP_NAME=Monopoly Express
VITE_ENVIRONMENT=production

# Segurança
JWT_SECRET=sua_chave_secreta_super_forte_com_pelo_menos_64_caracteres
BCRYPT_ROUNDS=12

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app-16-caracteres

# Mercado Pago (Produção)
MP_ACCESS_TOKEN=APP_USR-seu-access-token-de-producao
MP_PUBLIC_KEY=APP_USR-sua-public-key-de-producao
MP_CLIENT_ID=seu-client-id
MP_CLIENT_SECRET=seu-client-secret
MP_SUBSCRIPTION_PLAN_ID=monopoly-express-premium

# Google Maps
GOOGLE_MAPS_API_KEY=sua-chave-do-google-maps

# CORS
ALLOWED_ORIGINS=https://seu-projeto.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=200
```

### 3. Deploy via CLI do Vercel

```bash
# Instalar CLI do Vercel
npm i -g vercel

# Login no Vercel
vercel login

# Deploy
vercel --prod
```

### 4. Deploy via GitHub

1. Faça push do código para o GitHub
2. Conecte o repositório no Vercel
3. Configure as variáveis de ambiente
4. Deploy automático será feito

## 📁 Estrutura das APIs Serverless

As APIs foram adaptadas para funcionar como serverless functions:

```
api/
├── database.ts          # Configuração do SQLite
├── health.ts           # Health check
└── auth/
    ├── login.ts        # Login de usuários
    └── register.ts     # Registro de usuários
```

## ⚠️ Limitações do SQLite no Vercel

1. **Dados temporários**: O SQLite no Vercel usa `/tmp`, que é limpo entre execuções
2. **Não persistente**: Dados não persistem entre deploys
3. **Recomendação**: Para produção, considere migrar para:
   - Vercel Postgres
   - PlanetScale
   - Railway PostgreSQL
   - Supabase

## 🔄 Alternativa: Vercel Postgres

Para dados persistentes, use Vercel Postgres:

1. Ative Vercel Postgres no projeto
2. Configure `DATABASE_URL` nas variáveis de ambiente
3. Adapte as queries para PostgreSQL

## 📱 Configuração para App Android

Para o app Android usar a API do Vercel, atualize a configuração:

```java
// Em ApiConfig.java ou similar
public static final String BASE_URL = "https://monopoly-express.vercel.app/api/";
```

## 🧪 Testando o Deploy

Após o deploy, teste os endpoints:

```bash
# Health check
curl https://seu-projeto.vercel.app/api/health

# Login
curl -X POST https://seu-projeto.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com", "password":"123456", "userType":"user"}'
```

## 🔧 Troubleshooting

### Erro de CORS
- Verifique se a URL está correta em `ALLOWED_ORIGINS`
- Certifique-se que as funções serverless têm headers CORS

### Erro de banco de dados
- Verifique logs do Vercel
- Teste localmente primeiro
- Considere usar banco externo para produção

### Performance
- SQLite no `/tmp` é mais lento
- Para alta performance, use banco externo
- Monitore uso de memória e tempo de execução

## 📊 Monitoramento

- Use Vercel Analytics para monitorar performance
- Configure alertas para erros
- Monitore logs das functions

---

**Nota**: Este setup é adequado para desenvolvimento e testes. Para produção com muitos usuários, recomenda-se usar um banco de dados dedicado.

