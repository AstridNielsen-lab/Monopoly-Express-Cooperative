# 📱 Monopoly Express - App de Logística

> Aplicativo completo de logística para entrega rápida com motoboys

## 🎯 Status do Projeto

### ✅ Funcionalidades Implementadas
- [x] 📱 Splash Screen com logo e animação (3s) ✅
- [x] 🔐 Sistema de Login/Cadastro completo ✅
- [x] 🗄️ Banco SQLite + LocalStorage ✅
- [x] 👤 Dashboard do Cliente ✅
- [x] 📦 Solicitar Entrega com cálculo automático ✅
- [x] 📍 API OpenRouteService para distâncias ✅
- [x] 🗺️ Tela de Mapa para Motoboy com GPS ✅
- [x] 🌟 Funcionalidades extras (notificações, avaliações) ✅

### 📊 Progresso Geral: 100% 🎉 **VERSÃO 4.0**

---

## 🚀 Funcionalidades Especificadas

### 📱 **Tela 1: Splash Screen**
- ✅ Logo "Monopoly Express" centralizado
- ✅ Fundo escuro com animação de carregamento
- ✅ Redirecionamento automático após 3 segundos

### 🔐 **Tela 2: Login e Cadastro**
- ✅ Login com e-mail e senha
- ✅ Cadastro com campos:
  - Nome completo
  - CPF
  - Telefone
  - E-mail
  - Senha
  - Tipo: "Cliente" ou "Motoboy"
- ✅ Armazenamento SQLite + LocalStorage

### 👤 **Tela 3: Dashboard do Cliente**
- ✅ Solicitar Entrega
- ✅ Entregas em Andamento
- ✅ Histórico de Entregas

### 📦 **Tela 4: Solicitar Entrega**
- ✅ Endereço de retirada
- ✅ Endereço de entrega
- ✅ API OpenRouteService para cálculo de distância
- ✅ Cálculo automático: distância_km × R$ 5,00
- ✅ Valor mínimo: R$ 5,00
- ✅ Status: "Aguardando Motoboy"

### 🧭 **Tela 5: Mapa do Motoboy**
- ✅ Lista de entregas aguardando
- ✅ Botão "Aceitar Entrega"
- ✅ GPS ativo com localização em tempo real
- ✅ Mapa com rota (OpenStreetMap + Leaflet.js)
- ✅ Status: "Em andamento" → "Finalizada"

### 📍 **GPS e Mapas**
- ✅ Permissões de GPS
- ✅ OpenStreetMap com Leaflet.js
- ✅ Localização em tempo real
- ✅ Atualização periódica do trajeto

### 🗄️ **Banco de Dados**
- ✅ SQLite local para entregas e histórico
- ✅ LocalStorage para login e preferências
- ✅ Status das entregas (aguardando, em andamento, finalizada)

### 🌟 **Funcionalidades Extras**
- ✅ Notificações locais
- ✅ Avaliação do motoboy (1-5 estrelas)
- ✅ Perfil do usuário editável

---

## 🛠️ Tecnologias Utilizadas

- **Android Nativo** (Java)
- **SQLite** (armazenamento local)
- **LocalStorage** (persistência)
- **OpenRouteService API** (cálculo de distância)
- **OpenStreetMap + Leaflet.js** (mapas gratuitos)
- **Material Design 3**
- **GPS nativo** (localização)

---

## 📁 Estrutura do Projeto

```
app/src/main/
├── java/com/cooperativa/motoboy/
│   ├── SplashActivity.java         # 📱 Splash Screen
│   ├── LoginActivity.java          # 🔐 Login/Cadastro
│   ├── MainActivity.java           # 🏠 Dashboard Principal
│   ├── ClienteDashboardActivity.java # 👤 Dashboard Cliente
│   ├── SolicitarEntregaActivity.java # 📦 Solicitar Entrega
│   ├── MotoboyMapaActivity.java    # 🗺️ Mapa do Motoboy
│   ├── PerfilActivity.java         # 👤 Perfil do Usuário
│   ├── HistoricoActivity.java      # 📋 Histórico
│   ├── database/
│   │   ├── DatabaseHelper.java     # 🗄️ SQLite Helper
│   │   ├── Usuario.java            # 👤 Modelo Usuário
│   │   ├── Entrega.java            # 📦 Modelo Entrega
│   │   └── EntregaDAO.java         # 🔄 Data Access Object
│   ├── utils/
│   │   ├── LocationHelper.java     # 📍 Helper GPS
│   │   ├── NotificationHelper.java # 🔔 Notificações
│   │   └── ApiHelper.java          # 🌐 Helper APIs
│   └── adapters/
│       ├── EntregaAdapter.java     # 📋 Lista Entregas
│       └── HistoricoAdapter.java   # 📋 Lista Histórico
├── res/
│   ├── layout/                     # 🎨 Layouts XML
│   ├── values/                     # 📝 Strings e Cores
│   ├── drawable/                   # 🖼️ Ícones e Imagens
│   └── raw/                        # 📄 Assets (mapas)
└── AndroidManifest.xml            # ⚙️ Configurações
```

---

## 📱 Download APK

### 🚀 **Versão Atual: 4.0** (14/06/2025)

**📥 Download Direto:**
- **[📱 CooperativaMotoboy v4.0.apk](https://github.com/AstridNielsen-lab/Monopoly-Express-Cooperative/releases/download/v4.0/CooperativaMotoboy-v4.0.apk)** (5.87 MB)
- **[📋 Todas as Releases](https://github.com/AstridNielsen-lab/Monopoly-Express-Cooperative/releases)**

**✨ Novidades da v4.0:**
- 🗺️ Sistema de mapa GPS completo
- 📍 Localização em tempo real
- 🔔 Notificações locais
- ⭐ Sistema de avaliação (1-5 estrelas)
- 👤 Perfil editável
- 🧹 Branch única organizada

**📋 Requisitos:**
- Android 7.0+ (API 24)
- Permissão GPS/Localização
- Conexão com internet

---

## 🔧 Como Compilar e Instalar

### Pré-requisitos
1. **Android Studio** Flamingo ou superior
2. **Android SDK** (mínimo API 24 - Android 7.0)
3. **Java JDK 17**
4. **Conexão com internet** (para APIs)

### 📲 Instalação

1. **Clone/Download do projeto**
2. **Abra no Android Studio**
3. **Sincronize as dependências**
4. **Execute no dispositivo/emulador**

```bash
# Compilar APK Release
gradlew.bat assembleRelease

# APK gerado em:
app/build/outputs/apk/release/app-release-unsigned.apk
```

---

## 📱 Como Usar

### 🎯 **Primeiro Acesso**
1. **Splash Screen** aparece por 3 segundos
2. **Cadastre-se** escolhendo "Cliente" ou "Motoboy"
3. **Faça login** com suas credenciais

### 👤 **Como Cliente:**
1. **Dashboard** → "Solicitar Entrega"
2. **Preencha endereços** de coleta e entrega
3. **Calcule automaticamente** o valor
4. **Confirme** a entrega
5. **Acompanhe** o status em tempo real

### 🏍️ **Como Motoboy:**
1. **Acesse o mapa** com entregas disponíveis
2. **Aceite uma entrega**
3. **Siga a rota** no mapa
4. **Marque como finalizada** ao entregar

---

## 🔄 Changelog

### 🎉 Versão 4.0 (Atual) - 14/06/2025
- ✅ **FINALIZADA:** Implementação completa do mapa GPS para motoboys
- ✅ **FINALIZADA:** Sistema de localização em tempo real
- ✅ **FINALIZADA:** Integração OpenStreetMap + Leaflet.js
- ✅ **FINALIZADA:** Sistema de notificações locais
- ✅ **FINALIZADA:** Sistema de avaliação de motoboys (1-5 estrelas)
- ✅ **FINALIZADA:** Perfil editável do usuário
- ✅ **LIMPEZA:** Reorganização das branches (main como principal)
- ✅ **BUILD:** APK atualizado com todas as funcionalidades

### 📱 Versão 3.0 - 13/06/2025
- ✅ Sistema completo de backend SQLite
- ✅ Autenticação por email implementada
- ✅ Sistema de aprovação de motoboys
- ✅ Rotas RESTful funcionais
- ✅ Build Android (APK) estável

### 🔧 Versão 2.0 - 12/06/2025
- ✅ Dashboard do cliente funcional
- ✅ Sistema de solicitação de entregas
- ✅ Cálculo automático de preços
- ✅ API OpenRouteService integrada

### 🏗️ Versão 1.0 - 11/06/2025
- ✅ Splash Screen implementado
- ✅ Sistema de Login/Cadastro
- ✅ Banco SQLite configurado
- ✅ Estrutura básica do projeto

---

## 🤝 Contribuição

Este é um projeto em desenvolvimento ativo. As funcionalidades estão sendo implementadas conforme a especificação.

## 📄 Licença

Monopoly Express © 2024 - App de Logística

