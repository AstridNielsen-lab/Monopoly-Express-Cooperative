# Cooperativa Motoboy - App Android

Aplicativo Android para cooperativa de motoboys, permitindo que clientes solicitem coletas e motoboys vejam e aceitem corridas disponíveis.

## Funcionalidades

### Tela Principal
- Dois botões: **CLIENTE** e **MOTOBOY**
- Interface simples e intuitiva

### Área do Cliente
- Solicitar coleta para entrega
- Informar endereços de coleta e entrega
- Adicionar descrição do pedido
- Definir valor do frete
- Visualizar status da solicitação

### Área do Motoboy
- Ver lista de corridas disponíveis
- Aceitar corridas
- Atualizar lista de corridas
- Interface com cards informativos

## Tecnologias Utilizadas

- **Android nativo** (Java)
- **Material Design Components**
- **RecyclerView** para listas
- **Architecture**: Singleton pattern para gerenciamento de dados

## Estrutura do Projeto

```
app/src/main/
├── java/com/cooperativa/motoboy/
│   ├── MainActivity.java          # Tela principal
│   ├── ClienteActivity.java       # Área do cliente
│   ├── MotoboyActivity.java       # Área do motoboy
│   ├── Corrida.java               # Modelo de dados
│   ├── GerenciadorCorridas.java   # Gerenciador de corridas
│   └── CorridaAdapter.java        # Adapter para lista
├── res/
│   ├── layout/                    # Layouts XML
│   ├── values/                    # Strings e estilos
│   └── ...
└── AndroidManifest.xml
```

## Como Compilar e Instalar

### Pré-requisitos
1. **Android Studio** instalado
2. **Android SDK** (mínimo API 24 - Android 7.0)
3. **Java JDK 17** (já instalado)

### Opção 1: Usando Android Studio
1. Abra o Android Studio
2. Selecione "Open an existing Android Studio project"
3. Navegue até a pasta `CooperativaMotoboy`
4. Aguarde o projeto carregar e sincronizar
5. Conecte um dispositivo Android ou configure um emulador
6. Clique em "Run" (botão play verde) ou pressione Shift+F10

### Opção 2: Linha de Comando (se Android SDK estiver configurado)
```bash
cd CooperativaMotoboy

# Windows
gradlew.bat assembleDebug

# O APK será gerado em:
# app/build/outputs/apk/debug/app-debug.apk
```

### Instalação do APK
1. Ative "Fontes desconhecidas" no Android (Configurações > Segurança)
2. Transfira o APK para o dispositivo
3. Toque no arquivo APK para instalar

## Como Usar

### Para Clientes:
1. Abra o app e toque em "CLIENTE"
2. Preencha os campos:
   - Endereço de coleta
   - Endereço de entrega
   - Descrição do pedido (opcional)
   - Valor do frete
3. Toque em "Enviar Solicitação"
4. Acompanhe o status da corrida

### Para Motoboys:
1. Abra o app e toque em "MOTOBOY"
2. Visualize a lista de corridas disponíveis
3. Toque em "Aceitar Corrida" na corrida desejada
4. Use "Atualizar Lista" para verificar novas corridas

## Próximos Passos

Para tornar o app mais completo, considere adicionar:

1. **Backend real** (substituir o sistema local atual)
2. **Autenticação** de usuários
3. **Notificações push** para novas corridas
4. **Geolocalização** e mapas
5. **Chat** entre cliente e motoboy
6. **Histórico** de corridas
7. **Sistema de pagamento**
8. **Avaliações** e feedback
9. **Rastreamento** em tempo real
10. **Múltiplos status** de entrega (coletado, em trânsito, entregue)

## Suporte

Para dúvidas ou problemas:
1. Verifique se todos os pré-requisitos estão instalados
2. Certifique-se de que o Android SDK está atualizado
3. Limpe o projeto (Build > Clean Project) se houver erros

## Licença

Este projeto é destinado para uso da cooperativa de motoboys.

