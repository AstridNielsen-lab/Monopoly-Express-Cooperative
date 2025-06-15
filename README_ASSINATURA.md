# Monopoly Express - Sistema de Assinatura

## 🚀 Funcionalidade Implementada

Foi adicionado um sistema completo de assinatura premium ao site da Monopoly Express com valor de **R$ 19,90/mês**, integrado com a API do Mercado Pago.

### ✨ Principais Recursos:

- **Botão de assinatura** na página inicial e na página "Seja Membro"
- **Integração completa** com a API do Mercado Pago
- **Validação automática** de assinantes
- **Página de sucesso** após confirmação da assinatura
- **Sistema de verificação** de status de assinatura
- **Contexto de autenticação** atualizado com informações premium

### 📋 Benefícios do Plano Premium:

- ✅ Acesso prioritário a entregas de maior valor
- ✅ Ferramentas avançadas de análise de ganhos
- ✅ Suporte técnico prioritário 24/7
- ✅ Participação nos lucros da cooperativa
- ✅ Seguro premium contra acidentes
- ✅ Programa de benefícios exclusivos

## 🛠️ Configuração

### 1. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

**Já configurado no projeto:**
- ✅ Email SMTP: `juliocamposmachado@gmail.com`
- ✅ Senha de aplicativo configurada
- ✅ Valor da assinatura: R$ 19,90

**Necessário configurar:**
- 🔄 Credenciais do Mercado Pago (quando estiver em produção)

### 2. Configurar Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Crie uma nova aplicação
3. Copie as credenciais de **TEST** (desenvolvimento)
4. Substitua no arquivo `.env`:

```env
MP_ACCESS_TOKEN=TEST-seu-token-aqui
MP_PUBLIC_KEY=TEST-sua-chave-publica-aqui
```

### 3. Instalar e Executar

```bash
# Instalar dependências
npm install

# Executar backend (Terminal 1)
npm run backend

# Executar frontend (Terminal 2)
npm run dev
```

## 🎯 Como Usar

### Para Usuários:

1. **Acesse o site** em `http://localhost:5173`
2. **Clique no botão** "Assinar por R$ 19,90/mês"
3. **Faça login** ou crie uma conta (se necessário)
4. **Complete o pagamento** via Mercado Pago
5. **Seja redirecionado** para página de sucesso

### Para Desenvolvedores:

#### API Endpoints de Assinatura:

- `POST /api/subscription/check` - Verificar status de assinatura
- `POST /api/subscription/create` - Criar nova assinatura
- `POST /api/subscription/cancel` - Cancelar assinatura
- `GET /api/subscription/list` - Listar todas as assinaturas (admin)
- `GET /api/subscription/test` - Testar conexão com Mercado Pago

#### Componentes Criados:

- `SubscriptionButton.tsx` - Botão de assinatura reutilizável
- `SubscriptionSuccess.tsx` - Página de confirmação

#### Serviços:

- `mercadoPagoService.ts` - Integração com API do Mercado Pago
- `emailService.ts` - Envio de emails (já configurado)

## 🔧 Modo de Desenvolvimento

O sistema está configurado em **modo mock** para desenvolvimento:

- ✅ Alguns emails de teste têm assinatura ativa automaticamente
- ✅ Botão funciona sem necessidade de pagamento real
- ✅ Todos os endpoints estão funcionando

**Emails de teste com assinatura ativa:**
- `admin@monopolyexpress.com`
- `teste@exemplo.com`
- `usuario@monopoly.com`

## 🚀 Deploy em Produção

### 1. Configurar Mercado Pago Produção:

```env
MP_ACCESS_TOKEN=APP_USR-seu-token-de-producao
MP_PUBLIC_KEY=APP_USR-sua-chave-de-producao
NODE_ENV=production
```

### 2. Configurar Webhook:

No painel do Mercado Pago, configure o webhook para:
```
https://seu-dominio.com/api/subscription/webhook
```

### 3. Substituir Mock por Serviço Real:

No arquivo `backend/routes/subscription.ts`, descomente:
```typescript
// import MercadoPagoService from '../services/mercadoPagoService.js';
```

E substitua:
```typescript
// const mpService = MockMercadoPagoService.getInstance();
const mpService = MercadoPagoService.getInstance();
```

## 📱 Funcionalidades Implementadas

### Frontend:
- ✅ Botão de assinatura na página inicial
- ✅ Botão de assinatura na página "Seja Membro"
- ✅ Página de sucesso após assinatura
- ✅ Verificação automática de status
- ✅ Atualização do contexto de autenticação

### Backend:
- ✅ API completa de assinatura
- ✅ Integração com Mercado Pago
- ✅ Sistema de webhook
- ✅ Validação de assinantes
- ✅ Banco de dados SQLite

### Segurança:
- ✅ Validação de tokens
- ✅ Verificação de status em tempo real
- ✅ Proteção contra fraudes
- ✅ Logs detalhados

## 🎨 Interface

O botão de assinatura possui diferentes estados:

- **Padrão**: "Assinar por R$ 19,90/mês" (com ícone de cartão)
- **Carregando**: "Processando..." (com spinner)
- **Pendente**: "Assinatura Pendente" (com ícone de check)
- **Ativa**: "Assinatura Ativa" (com ícone de coroa)

## 📧 Contato

Para dúvidas sobre a implementação, entre em contato:
- **Email**: juliocamposmachado@gmail.com
- **WhatsApp**: https://wa.me/5511970603441

---

**Desenvolvido com ❤️ para a Monopoly Express**

