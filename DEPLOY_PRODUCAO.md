# 🚀 Deploy em Produção - Monopoly Express

## 🎆 Arquitetura de Deploy

### Frontend: **Vercel**
- 🌐 **URL**: https://monopoly-express.vercel.app
- ⚡ **Framework**: React + Vite
- 🔄 **Deploy automático** via GitHub

### Backend: **Railway**
- 🚂 **URL**: https://monopoly-express-backend.railway.app
- 🖺 **Banco**: SQLite com volume persistente
- 🔄 **Deploy automático** via GitHub

---

## 🛠️ 1. Deploy do Backend (Railway)

### 1.1 Criar conta no Railway
1. Acesse: https://railway.app/
2. Faça login com GitHub
3. Conecte seu repositório

### 1.2 Configurar variáveis de ambiente
```env
# Servidor
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://monopoly-express.vercel.app

# Email SMTP (Configure com suas credenciais)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app

# Segurança (GERE CHAVES FORTES!)
JWT_SECRET=sua_chave_secreta_muito_forte_64_caracteres_no_minimo_para_seguranca
BCRYPT_ROUNDS=12

# Mercado Pago (Configure com credenciais de PRODUÇÃO)
MP_ACCESS_TOKEN=APP_USR-seu-token-de-producao
MP_PUBLIC_KEY=APP_USR-sua-chave-publica
MP_CLIENT_ID=seu-client-id
MP_CLIENT_SECRET=seu-client-secret
MP_SUBSCRIPTION_PLAN_ID=monopoly-express-premium

# CORS
ALLOWED_ORIGINS=https://monopoly-express.vercel.app,https://www.monopoly-express.com

# Banco de dados
DATABASE_URL=/app/data/monopoly_express.db
```

### 1.3 Deploy automático
✅ Já configurado com `railway.toml`

---

## 🌐 2. Deploy do Frontend (Vercel)

### 2.1 Conectar repositório
1. Acesse: https://vercel.com/
2. Importe do GitHub: `Monopoly-Express-Cooperative`
3. Configurar projeto

### 2.2 Configurar variáveis de ambiente
```env
VITE_API_URL=https://monopoly-express-backend.railway.app/api
VITE_APP_NAME=Monopoly Express
VITE_ENVIRONMENT=production
```

### 2.3 Configurações de build
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

✅ Já configurado com `vercel.json`

---

## 🔐 3. Configurações de Segurança

### 3.1 JWT Secret
```bash
# Gerar chave forte
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3.2 Senha de App Gmail
1. Acesse: https://myaccount.google.com/security
2. Ative "Verificação em 2 etapas"
3. Gere "Senha de app" para SMTP
4. Use a senha de 16 caracteres gerada

### 3.3 Mercado Pago Produção
1. Acesse: https://www.mercadopago.com.br/developers/
2. Crie uma aplicação
3. Obtenha credenciais de **PRODUÇÃO**
4. Configure webhook: `https://seu-backend.railway.app/api/subscription/webhook`

---

## 🧪 4. Testes de Produção

### 4.1 Teste automatizado
```bash
# Substitua pelas URLs reais
API_BASE_URL="https://monopoly-express-backend.railway.app/api" node test-frontend-backend.js
```

### 4.2 Testes manuais
1. **Health check**: https://monopoly-express-backend.railway.app/api/health
2. **Frontend**: https://monopoly-express.vercel.app
3. **Cadastro de usuário**
4. **Login**
5. **Criar entrega**
6. **Calcular frete**
7. **Teste de assinatura**

---

## 🔄 5. Deploy Automático

### 5.1 Workflow
```
GitHub Push → main branch
    │
    ├── Railway (Backend)
    │   ├── Build automático
    │   ├── Deploy backend
    │   └── Health check
    │
    └── Vercel (Frontend)
        ├── Build automático
        ├── Deploy frontend
        └── Preview/Production
```

### 5.2 Comandos de deploy
```bash
# Deploy manual (se necessário)
git add .
git commit -m "Update for production"
git push origin main

# Vercel CLI (opcional)
npx vercel --prod

# Railway CLI (opcional)
railway deploy
```

---

## 📊 6. Monitoramento

### 6.1 URLs de monitoramento
- **Backend Health**: https://monopoly-express-backend.railway.app/api/health
- **Frontend**: https://monopoly-express.vercel.app
- **Logs Railway**: https://railway.app/dashboard
- **Logs Vercel**: https://vercel.com/dashboard

### 6.2 Métricas importantes
- **Uptime**: >99.9%
- **Response time**: <500ms
- **Error rate**: <1%
- **Database size**: Monitorar crescimento

---

## 🛡️ 7. Backup e Segurança

### 7.1 Backup do banco SQLite
```bash
# No Railway, criar script de backup
# Agendar backup diário via cron
sqlite3 /app/data/monopoly_express.db ".backup backup_$(date +%Y%m%d).db"
```

### 7.2 Variáveis sensíveis
- ✅ Usar variáveis de ambiente
- ✅ Não commitar .env
- ✅ Rotar chaves regularmente
- ✅ Monitorar acesso

---

## 🐛 8. Troubleshooting

### 8.1 Problemas comuns

**CORS Error**
```
Solução: Verificar ALLOWED_ORIGINS no backend
```

**Database connection**
```
Solução: Verificar se volume está montado corretamente
```

**Mercado Pago webhook**
```
Solução: Configurar URL correta no painel MP
```

**Email não enviando**
```
Solução: Verificar senha de app Gmail
```

### 8.2 Logs importantes
```bash
# Railway
railway logs

# Vercel
vercel logs

# Local debug
NODE_ENV=production npm run backend
```

---

## 🎯 9. Checklist de Deploy

### 9.1 Pré-deploy
- [ ] Testar localmente
- [ ] Configurar variáveis de ambiente
- [ ] Gerar chaves de segurança
- [ ] Configurar Mercado Pago
- [ ] Configurar email SMTP

### 9.2 Deploy
- [ ] Deploy backend (Railway)
- [ ] Deploy frontend (Vercel)
- [ ] Configurar domínio (opcional)
- [ ] Configurar SSL/HTTPS
- [ ] Configurar webhook Mercado Pago

### 9.3 Pós-deploy
- [ ] Testar health check
- [ ] Testar cadastro/login
- [ ] Testar entregas
- [ ] Testar pagamentos
- [ ] Configurar monitoramento
- [ ] Documentar URLs de produção

---

## 📜 10. URLs Finais

```
🌐 Frontend: https://monopoly-express.vercel.app
🚂 Backend:  https://monopoly-express-backend.railway.app
📊 Health:   https://monopoly-express-backend.railway.app/api/health
📋 Admin:    https://monopoly-express.vercel.app/admin
💳 Payment:  Mercado Pago Webhook configurado
📧 Email:    SMTP Gmail configurado
```

---

**🎉 Sistema pronto para produção!**

Todos os arquivos de configuração foram criados. Agora é só seguir os passos de deploy para ter o sistema rodando em produção.

