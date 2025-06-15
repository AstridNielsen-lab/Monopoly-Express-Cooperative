# Monopoly Express - Sistema de Entregas

Sistema completo de entregas com backend SQLite, validação por email e cálculo de frete inteligente.

## 🚀 Funcionalidades

### Para Usuários
- ✅ Cadastro e login com validação por email
- ✅ Cálculo de frete inteligente baseado em distância real
- ✅ Criação de solicitações de entrega
- ✅ Acompanhamento em tempo real
- ✅ Histórico de entregas

### Para Motoboys
- ✅ Cadastro com validação por email
- ✅ Sistema de aprovação manual
- ✅ Aceitar/rejeitar corridas
- ✅ Rastreamento de localização
- ✅ Estatísticas de ganhos
- ✅ Status online/offline

### Sistema de Backend
- ✅ SQLite como banco de dados
- ✅ Cálculo de frete corrigido com APIs reais
- ✅ Validação por email obrigatória
- ✅ Sistema de aprovação para motoboys
- ✅ APIs RESTful completas

## 📋 Pré-requisitos

- Node.js 18+ 
- NPM ou Yarn
- Conta de email (Gmail recomendado) para envio de emails

## 🛠️ Instalação

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
```

### 3. Configurar email (Gmail)
1. Acesse sua conta Google
2. Vá em "Segurança" → "Verificação em duas etapas"
3. Em "Senhas de app", gere uma nova senha
4. Use essa senha no campo `SMTP_PASSWORD` do arquivo `.env`

### 4. Iniciar o backend
```bash
npm run backend
```

### 5. Iniciar o frontend
```bash
npm run dev
```

## 🔧 Configuração do Email

Para que a validação por email funcione, você precisa configurar as credenciais SMTP no arquivo `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-de-app
```

### Para Gmail:
1. Ative a verificação em 2 etapas
2. Gere uma "senha de app" específica
3. Use essa senha (não sua senha normal)

## 📊 Estrutura do Banco de Dados

O sistema usa SQLite com as seguintes tabelas:
- `users` - Usuários/clientes
- `motoboys` - Entregadores
- `deliveries` - Entregas
- `motoboy_locations` - Histórico de localização
- `ratings` - Avaliações

## 🔄 Fluxo do Sistema

### Registro de Motoboy
1. Motoboy se cadastra com dados completos
2. Sistema envia email de verificação
3. Motoboy confirma email
4. Admin aprova o cadastro
5. Sistema envia email de aprovação
6. Motoboy pode começar a trabalhar

### Criação de Entrega
1. Usuário informa endereços de coleta e entrega
2. Sistema calcula frete usando APIs reais (OSRM + Nominatim)
3. Usuário confirma a criação
4. Entrega fica disponível para motoboys
5. Motoboy aceita e realiza a entrega

## 📡 APIs Disponíveis

### Autenticação
- `POST /api/auth/register/user` - Cadastro de usuário
- `POST /api/auth/register/motoboy` - Cadastro de motoboy
- `POST /api/auth/login/user` - Login de usuário
- `POST /api/auth/login/motoboy` - Login de motoboy
- `POST /api/auth/verify/user` - Verificar email do usuário
- `POST /api/auth/verify/motoboy` - Verificar email do motoboy
- `POST /api/auth/approve/motoboy/:id` - Aprovar motoboy

### Entregas
- `POST /api/delivery/calculate-freight` - Calcular frete
- `POST /api/delivery/create` - Criar entrega
- `GET /api/delivery/available` - Listar entregas disponíveis
- `POST /api/delivery/:id/accept` - Aceitar entrega
- `PATCH /api/delivery/:id/status` - Atualizar status

### Motoboys
- `GET /api/motoboy/:id` - Dados do motoboy
- `GET /api/motoboy/:id/stats` - Estatísticas
- `PATCH /api/motoboy/:id/location` - Atualizar localização
- `PATCH /api/motoboy/:id/status` - Atualizar status online/offline

## 💰 Cálculo de Frete

O sistema usa um algoritmo inteligente que considera:
- **Distância real** (usando rotas de trânsito)
- **Tipo de veículo** (bicicleta, moto, carro)
- **Horário** (pico, normal, noturno)
- **Preço base** + **preço por km**
- **Limites mínimo e máximo**

### Fórmula
```
Frete = (Preço Base + Distância × Preço/km) × Multiplicador Veículo × Multiplicador Horário
```

### Multiplicadores
- **Bicicleta**: 0.8x
- **Moto**: 1.0x
- **Carro**: 1.3x

- **Normal**: 1.0x
- **Pico**: 1.4x (7-9h, 17-19h)
- **Noturno**: 1.2x (22-6h)

## 🔒 Segurança

- Validação de email obrigatória
- Aprovação manual de motoboys
- Rate limiting nas APIs
- Sanitização de dados
- CORS configurado

## 🚧 Melhorias Futuras

- [ ] Sistema de pagamento integrado
- [ ] Chat em tempo real
- [ ] Notificações push
- [ ] App mobile nativo
- [ ] Dashboard administrativo
- [ ] Sistema de avaliações
- [ ] Integração com mapas

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se todas as dependências estão instaladas
2. Confirme as configurações de email
3. Verifique os logs do backend
4. Teste as APIs usando Postman ou similar

## 📄 Licença

Este projeto é para fins educacionais e de demonstração.

# Monopoly Express - O Futuro da Logística

![Monopoly Express Logo](https://via.placeholder.com/200x100/FF6600/FFFFFF?text=Monopoly+Express)

## 🚀 Sobre o Projeto

Monopoly Express é uma plataforma completa de logística que conecta clientes e motoboys através de tecnologia inovadora. Nossa missão é revolutionar o mercado de entregas em São Paulo.

## 📱 Aplicativo Mobile

### Download do APK
**[📥 Baixar APK - Versão 4.1 (5.6MB)](/downloads/MonopolyExpress-v4.1.apk)**

- **Compatibilidade:** Android 7.0+ (API 24)
- **Funcionalidades:** Cliente e Motoboy
- **Tamanho:** 5.6MB
- **Última atualização:** 15/06/2025
- **Novidades:** Sistema de mapa GPS completo, notificações e avaliações
- **Download:** Direto do servidor, mais rápido e confiável

### Como Instalar
1. Baixe o APK clicando no link acima
2. Ative "Fontes desconhecidas" nas configurações do Android
3. Abra o arquivo APK e instale

## 🌐 Site Web

Acesse nossa plataforma web completa com:
- Interface moderna e responsiva
- Sistema de autenticação
- Dashboard para motoboys e clientes
- Tracking em tempo real

### Tecnologias Utilizadas

#### Frontend
- **React 18** + TypeScript
- **Vite** para build otimizado
- **Tailwind CSS** para estilização
- **Framer Motion** para animações
- **Lucide React** para ícones
- **React Router** para navegação
- **React Hook Form** para formulários

#### Mobile (Android)
- **Java nativo**
- **Material Design Components**
- **RecyclerView** para listas
- **Architecture:** Singleton pattern

## 🏗️ Estrutura do Projeto

```
Monopoly Express/
├── src/                    # Código fonte web
│   ├── components/         # Componentes React
│   ├── pages/             # Páginas da aplicação
│   ├── contexts/          # Contextos React
│   ├── hooks/             # Hooks customizados
│   └── types/             # Definições TypeScript
├── CooperativaMotoboy/     # Aplicativo Android
│   ├── app/src/main/java/  # Código Java
│   ├── app/src/main/res/   # Recursos Android
│   └── *.apk              # APKs compilados
├── public/                # Arquivos públicos
│   └── downloads/         # APKs para download
└── dist/                  # Build de produção
```

## 🚦 Como Executar

### Web Development
```bash
npm install
npm run dev
```

### Build para Produção
```bash
npm run build
npm run preview
```

### Aplicativo Android
1. Abra o projeto `CooperativaMotoboy/` no Android Studio
2. Conecte um dispositivo ou configure um emulador
3. Execute com Shift+F10

## 📋 Funcionalidades

### Para Clientes
- ✅ Solicitar coletas e entregas
- ✅ Definir endereços de origem e destino
- ✅ Adicionar descrição do pedido
- ✅ Definir valor do frete
- ✅ Acompanhar status em tempo real

### Para Motoboys
- ✅ Ver lista de corridas disponíveis
- ✅ Aceitar corridas
- ✅ Sistema de avaliação
- ✅ Controle de ganhos
- ✅ Interface intuitiva

## 🎯 Roadmap

- [ ] Backend com API REST
- [ ] Autenticação JWT
- [ ] Notificações push
- [ ] Integração com mapas
- [ ] Chat entre cliente e motoboy
- [ ] Sistema de pagamento
- [ ] Histórico de corridas
- [ ] Rastreamento GPS em tempo real

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- **Website:** [monopolyexpress.com](https://monopolyexpress.com)
- **Email:** contato@monopolyexpress.com
- **GitHub:** [Monopoly-Express-Cooperative](https://github.com/AstridNielsen-lab/Monopoly-Express-Cooperative)

---

**Monopoly Express** - *O dente de ouro da logística* 🦷✨

Feito com ❤️ pela equipe Monopoly Express

