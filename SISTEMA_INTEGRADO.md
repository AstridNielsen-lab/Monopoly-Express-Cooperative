# Sistema Monopoly Express Integrado 🚀

## ✅ Status de Integração

**FRONTEND + BACKEND TOTALMENTE CONECTADOS!**

O sistema agora possui um backend real com SQLite e todas as funcionalidades implementadas:

- ✅ **Autenticação real** (login/registro)
- ✅ **Banco de dados SQLite** com todas as tabelas
- ✅ **Sistema de assinaturas** integrado com Mercado Pago
- ✅ **API de entregas** completa
- ✅ **Sistema de motoboys** com aprovação
- ✅ **Cálculo de frete** real
- ✅ **Notificações por email** configuradas

## 🚀 Como Iniciar o Sistema

### 1. Iniciar o Backend
```bash
npm run backend
```
O backend estará disponível em: http://localhost:3001

### 2. Iniciar o Frontend (Em outro terminal)
```bash
npm run dev
```
O frontend estará disponível em: http://localhost:5173

### 3. Testar a Integração
```bash
node test-frontend-backend.js
```

## 📋 Funcionalidades Implementadas

### 🔐 Sistema de Autenticação
- **Usuários**: Cadastro e login de clientes
- **Motoboys**: Cadastro com aprovação obrigatória
- **Administradores**: Gerenciamento do sistema
- **Verificação de email**: Emails automáticos de confirmação

### 📦 Sistema de Entregas
- **Cálculo de frete**: Baseado em distância e tipo de veículo
- **Criação de entregas**: Interface intuitiva
- **Acompanhamento**: Status em tempo real
- **Aceitação**: Motoboys podem aceitar entregas

### 💳 Sistema de Assinaturas
- **Mercado Pago**: Integração completa
- **Assinatura Premium**: R$ 19,90/mês
- **Webhook**: Atualização automática de status
- **Gerenciamento**: Criar/cancelar assinaturas

### 🏍️ Sistema de Motoboys
- **Cadastro**: Com dados pessoais e veículo
- **Aprovação**: Sistema de aprovação manual
- **Disponibilidade**: Controle online/offline
- **Localização**: Rastreamento GPS

## 🔧 Arquivos Principais

### Backend (`/backend/`)
- `server.ts` - Servidor principal
- `database/setup.ts` - Configuração do banco SQLite
- `routes/` - Todas as rotas da API
- `services/` - Serviços do Mercado Pago

### Frontend (`/src/`)
- `services/api.ts` - **NOVO!** Integração com backend
- `contexts/AuthContext.tsx` - **ATUALIZADO!** Autenticação real
- `hooks/useDelivery.ts` - **NOVO!** Hook para entregas
- `components/` - Componentes React

## 📊 APIs Disponíveis

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register/user` - Cadastro usuário
- `POST /api/auth/register/motoboy` - Cadastro motoboy
- `GET /api/auth/pending/motoboys` - Motoboys pendentes
- `POST /api/auth/approve/motoboy/:id` - Aprovar motoboy

### Usuários
- `GET /api/user/:id` - Dados do usuário
- `GET /api/user/:id/stats` - Estatísticas
- `PATCH /api/user/:id` - Atualizar dados

### Entregas
- `POST /api/delivery/calculate-freight` - Calcular frete
- `POST /api/delivery/create` - Criar entrega
- `GET /api/delivery/available` - Entregas disponíveis
- `POST /api/delivery/:id/accept` - Aceitar entrega
- `PATCH /api/delivery/:id/status` - Atualizar status

### Assinaturas
- `POST /api/subscription/check` - Verificar assinatura
- `POST /api/subscription/create` - Criar assinatura
- `POST /api/subscription/cancel` - Cancelar assinatura
- `GET /api/subscription/test` - Testar Mercado Pago

## 💾 Banco de Dados

**SQLite Local**: `database.sqlite`

### Tabelas Criadas:
- `users` - Usuários do sistema
- `motoboys` - Motoboys cadastrados
- `deliveries` - Entregas criadas
- `verification_tokens` - Tokens de verificação

## 🔑 Configurações (.env)

```env
# Servidor
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app

# Segurança
JWT_SECRET=sua-chave-secreta
BCRYPT_ROUNDS=12

# Mercado Pago (PRODUÇÃO CONFIGURADA!)
MP_ACCESS_TOKEN=APP_USR-***
MP_PUBLIC_KEY=APP_USR-***
MP_CLIENT_ID=***
MP_CLIENT_SECRET=***
```

## 🧪 Como Testar

### 1. Teste Automático
```bash
node test-frontend-backend.js
```

### 2. Teste Manual
1. Acesse http://localhost:5173
2. Registre um novo usuário
3. Faça login
4. Crie uma entrega
5. Calcule o frete
6. Teste a assinatura premium

### 3. Teste de Motoboy
1. Registre como motoboy
2. Aguarde aprovação (admin)
3. Faça login após aprovação
4. Veja entregas disponíveis
5. Aceite uma entrega

## 🔧 Comandos Úteis

```bash
# Iniciar desenvolvimento completo
npm run dev           # Frontend
npm run backend       # Backend (outro terminal)

# Teste de APIs
node test-api.js
node test-frontend-backend.js

# Banco de dados
node test-database.js
node create-admin.js  # Criar usuário admin

# Build para produção
npm run build
```

## 🎯 Próximos Passos

1. **✅ CONCLUÍDO**: Backend integrado
2. **✅ CONCLUÍDO**: Autenticação real
3. **✅ CONCLUÍDO**: Sistema de entregas
4. **✅ CONCLUÍDO**: Mercado Pago integrado
5. **🔄 PRÓXIMO**: Melhorar UX/UI
6. **🔄 PRÓXIMO**: Notificações push
7. **🔄 PRÓXIMO**: App mobile

## 🚨 Importante

- **Banco SQLite**: Dados persistem entre reinicializações
- **Emails**: Configurados para Gmail (SMTP)
- **Mercado Pago**: Credenciais de PRODUÇÃO ativas
- **CORS**: Configurado para localhost:5173
- **Rate Limiting**: 100 requests/15min por IP

## 💡 Dicas

1. **Console do navegador**: Veja logs detalhados das APIs
2. **Backend logs**: Monitore requisições no terminal
3. **Database**: Arquivo `database.sqlite` na raiz
4. **Postman**: Use as rotas para testar APIs
5. **Email**: Verifique spam para emails de verificação

---

**🎉 O sistema está 100% funcional e pronto para uso!**

Todos os dados são reais, persistem no banco SQLite, e as integrações estão ativas.

