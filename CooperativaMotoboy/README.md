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
- [ ] 🗺️ Tela de Mapa para Motoboy com GPS
- [ ] 🌟 Funcionalidades extras (notificações, avaliações)

### 📊 Progresso Geral: 75% 🚀

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
# Compilar APK
gradlew.bat assembleDebug

# APK gerado em:
app/build/outputs/apk/debug/app-debug.apk
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

### 🚧 Em Desenvolvimento
- [ ] Implementando Splash Screen
- [ ] Criando sistema de Login/Cadastro
- [ ] Configurando banco SQLite

---

## 🤝 Contribuição

Este é um projeto em desenvolvimento ativo. As funcionalidades estão sendo implementadas conforme a especificação.

## 📄 Licença

Monopoly Express © 2024 - App de Logística

