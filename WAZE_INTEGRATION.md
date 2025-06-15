# Integração com Waze - Monopoly Express

## Visão Geral

O sistema Monopoly Express agora possui integração completa com o Waze, permitindo que motoboys naveguem facilmente para locais de coleta e entrega, enquanto usuários podem rastrear suas entregas visualizando as rotas no mapa.

## Funcionalidades Implementadas

### Para Motoboys

#### 1. **ROTA COMPLETA** - Funcionalidade Principal 🚀
- **Quando**: Após aceitar uma entrega (status: 'accepted')
- **Botão**: "Iniciar Rota Completa no Waze" (verde, destaque)
- **Ação**: 
  1. Abre automaticamente o Waze navegando para a **coleta**
  2. Pergunta se deseja abrir também o endereço de **entrega** em outra aba
  3. Exibe painel com **informações completas da rota**:
     - 📍 Endereço de coleta + coordenadas
     - 🏠 Endereço de entrega + coordenadas  
     - 📦 Descrição do item
     - 💰 Valor da entrega
     - 🗺️ Links diretos para Waze (coleta e entrega)
     - 📋 Botão para copiar todas as informações
- **URLs geradas**: 
  - Coleta: `https://waze.com/ul?ll=lat,lng&navigate=yes&utm_source=monopoly_express_delivery_route`
  - Entrega: `https://waze.com/ul?ll=lat,lng&navigate=yes&utm_source=monopoly_express_delivery_final`

#### 2. Navegação Individual (Durante entrega)
- **Quando**: Durante a entrega (status: 'in_progress')
- **Botões**: "Ver Coleta" + "Ir para Entrega" (azul, pequenos)
- **Ação**: Navegação individual para locais específicos
- **URL gerada**: `https://waze.com/ul?ll=lat,lng&navigate=yes&utm_source=monopoly_express`

### Para Usuários

#### 1. Visualização da Coleta
- **Quando**: Entrega aceita ou em andamento
- **Botão**: "Ver Coleta" (azul, tamanho pequeno)
- **Ação**: Mostra no Waze onde o motoboy deve buscar o item
- **URL gerada**: `https://waze.com/ul?ll=lat,lng&z=17&utm_source=monopoly_express`

#### 2. Visualização da Entrega
- **Quando**: Entrega aceita ou em andamento
- **Botão**: "Ver Entrega" (azul, tamanho pequeno)
- **Ação**: Mostra no Waze o destino final da entrega
- **URL gerada**: `https://waze.com/ul?ll=lat,lng&z=17&utm_source=monopoly_express`

## Como Funciona

### Detecção de Plataforma

O componente `WazeIntegration` detecta automaticamente a plataforma:

- **Dispositivos Móveis com Waze instalado**: Abre o app nativo
- **Dispositivos Móveis sem Waze**: Abre a versão web
- **Desktop**: Abre a versão web diretamente

### Fallback Inteligente

Em dispositivos móveis, o sistema:
1. Tenta abrir o app Waze usando `waze://`
2. Se falhar, automaticamente abre a versão web após 100ms

### Validação

Antes de abrir o Waze, o sistema valida:
- Se há coordenadas ou endereço disponível
- Se os parâmetros são válidos
- Mostra mensagens de erro apropriadas se necessário

## URLs Geradas

### Exemplos de URLs do Waze

#### Navegação com Coordenadas
```
https://waze.com/ul?ll=-23.550520,-46.633308&navigate=yes&utm_source=monopoly_express
```

#### Visualização com Zoom
```
https://waze.com/ul?ll=-23.561414,-46.656166&z=17&utm_source=monopoly_express
```

#### Busca por Endereço
```
https://waze.com/ul?q=Rua%20das%20Flores%2C%20123%20-%20Centro&navigate=yes&utm_source=monopoly_express
```

## Componente WazeIntegration

### Props Disponíveis

```typescript
interface WazeIntegrationProps {
  latitude?: number;           // Latitude do destino
  longitude?: number;          // Longitude do destino
  address?: string;           // Endereço alternativo
  variant?: 'navigate' | 'search' | 'show'; // Tipo de ação
  buttonText?: string;        // Texto personalizado do botão
  className?: string;         // Classes CSS adicionais
  size?: 'sm' | 'md' | 'lg'; // Tamanho do botão
}
```

### Variantes

- **navigate**: Inicia navegação direta
- **search**: Busca o local no mapa
- **show**: Mostra o local com zoom específico

### Exemplo de Uso

```tsx
<WazeIntegration
  latitude={-23.550520}
  longitude={-46.633308}
  address="Rua das Flores, 123"
  variant="navigate"
  buttonText="Ir para Coleta"
  size="sm"
  className="flex-1"
/>
```

## Vantagens da Integração

### Para Motoboys
1. **Navegação Otimizada**: Usa as rotas em tempo real do Waze
2. **Alertas de Trânsito**: Recebe informações sobre trânsito e acidentes
3. **Facilidade de Uso**: Um clique para navegar
4. **Precisão**: Coordenadas exatas dos locais

### Para Usuários
1. **Transparência**: Podem ver exatamente onde está sua entrega
2. **Rastreamento Visual**: Visualização clara no mapa
3. **Estimativa de Tempo**: Podem calcular quanto tempo falta
4. **Confiança**: Maior controle sobre o processo

### Para o Negócio
1. **Eficiência**: Entregas mais rápidas e precisas
2. **Satisfação**: Melhora a experiência do usuário
3. **Profissionalismo**: Interface moderna e integrada
4. **Analytics**: UTM source permite rastreamento de uso

## Tratamento de Erros

O sistema possui tratamento completo de erros:

- **Sem Coordenadas**: "Endereço ou coordenadas necessários para abrir o Waze"
- **Erro de Abertura**: "Erro ao abrir o Waze"
- **Sucesso**: "Abrindo Waze..."

## Monitoramento

Todos os links incluem `utm_source=monopoly_express` para:
- Identificar tráfego vindo da nossa aplicação
- Permitir analytics do uso da integração
- Facilitar suporte técnico se necessário

## Requisitos Técnicos

- **React 18+**
- **TypeScript**
- **Lucide React** (ícones)
- **React Hot Toast** (notificações)
- **Tailwind CSS** (estilos)

## Compatibilidade

- ✅ **iOS**: Safari, Chrome, Firefox
- ✅ **Android**: Chrome, Firefox, Samsung Browser
- ✅ **Desktop**: Chrome, Firefox, Safari, Edge
- ✅ **PWA**: Funciona em Progressive Web Apps

## Componente WazeDeliveryRoute

### Props Disponíveis

```typescript
interface DeliveryRouteProps {
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  deliveryAddress: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  currentLocation?: { latitude: number; longitude: number };
  description?: string;
  price: number;
  className?: string;
}
```

### Exemplo de Uso

```tsx
<WazeDeliveryRoute
  pickupAddress="Rua das Flores, 123 - Centro"
  pickupLatitude={-23.550520}
  pickupLongitude={-46.633308}
  deliveryAddress="Av. Paulista, 1000 - Bela Vista"
  deliveryLatitude={-23.561414}
  deliveryLongitude={-46.656166}
  description="Documentos importantes"
  price={18.00}
  currentLocation={currentLocation}
/>
```

## Fluxo de Uso Prático

### Cenário: Motoboy aceita uma entrega

1. **Motoboy aceita entrega** no app
2. **Aparece botão verde** "Iniciar Rota Completa no Waze"
3. **Motoboy clica no botão**:
   - ✅ Waze abre automaticamente navegando para coleta
   - ✅ Aparece painel com informações da rota
   - ✅ Sistema pergunta se quer abrir entrega em outra aba
4. **Motoboy vê painel completo**:
   ```
   📦 ROTA DE ENTREGA - Monopoly Express
   
   📍 1º COLETA:
   Rua das Flores, 123 - Centro
   Coords: -23.550520, -46.633308
   
   🏠 2º ENTREGA:
   Av. Paulista, 1000 - Bela Vista
   Coords: -23.561414, -46.656166
   
   📦 ITEM: Documentos importantes
   💰 VALOR: R$ 18.00
   
   [Waze Coleta] [Waze Entrega] [Copiar Info]
   ```
5. **Motoboy pode**:
   - 🗺️ Clicar em "Waze Coleta" para ir direto à coleta
   - 🗺️ Clicar em "Waze Entrega" para ver o destino
   - 📋 Copiar todas as informações para enviar ao cliente
   - ❌ Fechar o painel (informações ficam disponíveis)

### Exemplo de Informações Copiadas

```
📦 ROTA DE ENTREGA - Monopoly Express

📍 COLETA:
Rua das Flores, 123 - Centro
Coords: -23.550520, -46.633308

🏠 ENTREGA:
Av. Paulista, 1000 - Bela Vista
Coords: -23.561414, -46.656166

📦 ITEM: Documentos importantes
💰 VALOR: R$ 18.00

🗺️ WAZE COLETA: https://waze.com/ul?ll=-23.550520,-46.633308&navigate=yes&utm_source=monopoly_express_delivery_route
🗺️ WAZE ENTREGA: https://waze.com/ul?ll=-23.561414,-46.656166&navigate=yes&utm_source=monopoly_express_delivery_final
```

## Vantagens da Nova Funcionalidade

### ✅ **Automação Completa**
- Um clique resolve toda a navegação
- Não precisa mais copiar endereços manualmente
- Sistema inteligente abre coleta primeiro

### ✅ **Informações Centralizadas**
- Todos os dados da entrega em um lugar
- Coordenadas precisas sempre visíveis
- Valor e descrição sempre acessíveis

### ✅ **Flexibilidade**
- Pode abrir locais individuais se necessário
- Pode copiar informações para compartilhar
- Funciona offline (informações salvas)

### ✅ **Profissionalismo**
- Interface limpa e organizada
- Experiência fluida para o motoboy
- Informações completas para o cliente

## Próximos Passos

Possíveis melhorias futuras:

1. **Rastreamento em Tempo Real**: Integrar com API de localização
2. **Estimativas de Tempo**: Calcular ETA usando APIs do Waze
3. **Favoritos**: Salvar locais frequentes
4. **Histórico**: Manter histórico de rotas utilizadas
5. **Analytics**: Dashboard de uso da integração
6. **Múltiplas Paradas**: Suporte nativo do Waze para rota com paradas
7. **Notificações**: Avisar cliente quando motoboy sai para coleta/entrega

---

**Desenvolvido com ❤️ para o Monopoly Express**

