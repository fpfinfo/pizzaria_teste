# 🍕 Pizzaria Bella Massa - Skill Documentation

## 📋 Visão Geral

Aplicação completa de sistema de pedidos para pizzaria com:
- **Tela do Cliente**: Cardápio, carrinho, checkout com pagamento em dinheiro
- **Tela da Cozinha**: Dashboard de pedidos em tempo real
- **Painel Admin**: Gerenciamento de produtos e estoque
- **Relatórios**: Análise de vendas e exportação de dados
- **Rastreamento**: Acompanhamento de pedidos pelo cliente

---

## 🏗️ Arquitetura

### Estrutura de Pastas

```
src/
├── context/           # Gerenciamento de estado global
│   ├── OrderContext.tsx    # Pedidos e status
│   └── MenuContext.tsx     # Produtos (pizzas, bebidas, bordas)
├── data/              # Dados estáticos e tipos
│   └── menu.ts        # Cardápio padrão, interfaces, cupons
├── pages/             # Páginas da aplicação
│   ├── HomePage.tsx        # Landing page
│   ├── CustomerPage.tsx    # Tela do cliente
│   ├── KitchenPage.tsx     # Painel da cozinha
│   ├── AdminPage.tsx       # Gestão de produtos
│   ├── ReportsPage.tsx     # Relatórios de vendas
│   └── TrackingPage.tsx    # Rastreamento de pedidos
└── App.tsx            # Rotas e providers
```

### Tecnologias Utilizadas

- **React 18** + **TypeScript**
- **React Router** para navegação
- **Tailwind CSS** para estilização
- **Context API** para estado global
- **localStorage** para persistência

---

## 🔧 Componentes Reutilizáveis

### 1. Sistema de Contextos

#### OrderContext - Gerenciamento de Pedidos

```typescript
interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  pizzaItems: PizzaItem[];
  drinkItems: DrinkItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  cashPaid: number;
  change: number;
  status: 'novo' | 'preparando' | 'pronto' | 'entregue';
  createdAt: string;
  notes: string;
  couponCode?: string;
}

// Funções disponíveis
addOrder(order) → string (retorna ID)
updateOrderStatus(id, status)
getStats() → { totalOrders, totalRevenue, avgTicket, activeOrders }
```

**Padrão de uso:**
```typescript
const { orders, addOrder, updateOrderStatus, getStats } = useOrders();
```

#### MenuContext - Gerenciamento de Produtos

```typescript
interface Pizza {
  id: string;
  name: string;
  description: string;
  ingredients: string;
  prices: { P: number; M: number; G: number };
  category: 'tradicional' | 'especial' | 'doce';
  emoji: string;
  available: boolean;
}

interface Drink {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: 'refrigerante' | 'suco' | 'agua' | 'outros';
  available: boolean;
  stock: number;
}

// Funções disponíveis
addPizza, updatePizza, removePizza
addDrink, updateDrink, removeDrink, decrementDrinkStock
addCrust, updateCrust, removeCrust
resetMenu
```

**Padrão de uso:**
```typescript
const { pizzas, drinks, crusts, addPizza, updateDrink, decrementDrinkStock } = useMenu();
```

---

## 💡 Padrões de Código

### 1. Persistência com localStorage

```typescript
function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error(`Error loading ${key}:`, e);
  }
  return fallback;
}

function saveToStorage<T>(key: string, data: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key}:`, e);
  }
}
```

### 2. Controle de Estoque com Decremento Automático

```typescript
// Ao criar pedido
const id = addOrder({ /* dados do pedido */ });

// Decrementa estoque automaticamente
cart
  .filter((item): item is CartDrinkItem => item.type === 'drink')
  .forEach((item) => {
    decrementDrinkStock(item.drink.id, item.quantity);
  });
```

### 3. Sistema de Cupons de Desconto

```typescript
const coupons = [
  { code: 'BEMVINDO10', discount: 10, description: '10% de desconto' },
  { code: 'PROMO20', discount: 20, description: '20% de desconto' },
];

const applyCoupon = (code: string) => {
  const coupon = coupons.find((c) => c.code === code.toUpperCase());
  if (coupon) {
    setAppliedCoupon({ code: coupon.code, discount: coupon.discount });
  }
};
```

### 4. Notificações Sonoras na Cozinha

```typescript
const playNotificationSound = () => {
  const audio = new Audio('data:audio/wav;base64,...');
  audio.play().catch(e => console.log('Audio play failed'));
};

// Detecta novos pedidos
useEffect(() => {
  const newCount = newOrders.length;
  if (newCount > prevNewCount.current && soundEnabled) {
    playNotificationSound();
  }
  prevNewCount.current = newCount;
}, [newOrders.length, soundEnabled]);
```

### 5. Cálculo de Tempo Estimado

```typescript
const estimatedTime = {
  novo: { min: 20, max: 30, label: '20-30 min' },
  preparando: { min: 10, max: 20, label: '10-20 min' },
  pronto: { min: 5, max: 10, label: '5-10 min' },
};
```

### 6. Relatórios com Filtros de Data

```typescript
const getFilteredOrders = () => {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(0);
  }

  return orders.filter(order => new Date(order.createdAt) >= startDate);
};
```

### 7. Exportação CSV

```typescript
const exportToCSV = () => {
  const headers = ['ID', 'Data', 'Cliente', 'Telefone', 'Endereço', 'Total', 'Status'];
  const rows = filteredOrders.map(order => [
    order.id,
    new Date(order.createdAt).toLocaleString('pt-BR'),
    order.customerName,
    order.customerPhone,
    order.address,
    `R$ ${order.total.toFixed(2)}`,
    order.status,
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `relatorio-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};
```

---

## 🎨 Componentes de UI Reutilizáveis

### 1. Card de Produto com Estoque

```typescript
<div className={`bg-white rounded-2xl p-4 shadow-sm transition-all border text-center relative ${
  isOutOfStock ? 'border-gray-200 opacity-60' : 'border-gray-100 hover:border-orange-200 hover:shadow-lg'
}`}>
  {isOutOfStock && (
    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
      ESGOTADO
    </div>
  )}
  {!isOutOfStock && drink.stock <= 5 && (
    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
      Últimas {drink.stock}
    </div>
  )}
  {/* Conteúdo do card */}
</div>
```

### 2. Controle de Estoque Rápido

```typescript
<div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
  <button
    onClick={() => updateDrink(drink.id, { stock: Math.max(0, drink.stock - 1) })}
    className="w-7 h-7 rounded bg-white hover:bg-red-100 text-red-600 font-bold text-sm"
  >
    −
  </button>
  <input
    type="number"
    value={drink.stock}
    onChange={(e) => updateDrink(drink.id, { stock: Math.max(0, parseInt(e.target.value) || 0) })}
    className="w-12 text-center bg-white rounded py-1 text-sm font-bold"
    min="0"
  />
  <button
    onClick={() => updateDrink(drink.id, { stock: drink.stock + 1 })}
    className="w-7 h-7 rounded bg-white hover:bg-green-100 text-green-600 font-bold text-sm"
  >
    +
  </button>
  <button
    onClick={() => updateDrink(drink.id, { stock: drink.stock + 10 })}
    className="px-2 h-7 rounded bg-white hover:bg-blue-100 text-blue-600 font-bold text-xs"
  >
    +10
  </button>
</div>
```

### 3. Timeline de Status do Pedido

```typescript
const steps = [
  { status: 'novo', label: 'Pedido Recebido', icon: '📝' },
  { status: 'preparando', label: 'Em Preparação', icon: '👨‍🍳' },
  { status: 'pronto', label: 'Pronto para Entrega', icon: '✅' },
  { status: 'entregue', label: 'Entregue', icon: '🎉' },
];

<div className="flex items-center justify-between">
  {steps.map((step, index) => (
    <div key={step.status} className="flex items-center flex-1">
      <div className={`flex flex-col items-center ${
        currentStepIndex >= index ? 'text-orange-500' : 'text-gray-300'
      }`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
          currentStepIndex >= index ? 'bg-orange-100' : 'bg-gray-100'
        }`}>
          {step.icon}
        </div>
        <p className="text-xs font-semibold mt-2 text-center">{step.label}</p>
      </div>
      {index < steps.length - 1 && (
        <div className={`flex-1 h-1 mx-2 ${
          currentStepIndex > index ? 'bg-orange-500' : 'bg-gray-200'
        }`} />
      )}
    </div>
  ))}
</div>
```

---

## 🔄 Como Adaptar para Outros Negócios

### 1. Restaurantes em Geral

**Mudanças necessárias:**
- Renomear interfaces: `Pizza` → `Product`, `Drink` → `SideItem`
- Ajustar categorias no `menu.ts`
- Modificar preços e tamanhos conforme necessário
- Manter estrutura de estoque para itens controlados

### 2. Lojas de Varejo

**Adaptações:**
- Remover sistema de tamanhos (P, M, G)
- Adicionar campo de SKU/código de barras
- Implementar controle de estoque mais robusto
- Adicionar categorias de produtos personalizadas

### 3. Serviços de Delivery

**Manter:**
- Sistema de pedidos com status
- Rastreamento em tempo real
- Notificações sonoras
- Relatórios de vendas

**Adicionar:**
- Integração com APIs de mapas (Google Maps, Mapbox)
- Sistema de rotas para entregadores
- Cálculo de taxa de entrega por distância

### 4. E-commerce

**Adaptações:**
- Substituir pagamento em dinheiro por gateway (Stripe, PayPal)
- Adicionar sistema de login/autenticação
- Implementar carrinho persistente
- Adicionar sistema de avaliações

---

## 📦 Checklist para Novos Projetos

### Setup Inicial

- [ ] Instalar dependências: `react-router-dom`
- [ ] Configurar Tailwind CSS
- [ ] Criar estrutura de pastas (context, data, pages)
- [ ] Definir interfaces TypeScript para produtos
- [ ] Implementar Contexts (OrderContext, MenuContext)

### Funcionalidades Essenciais

- [ ] Tela de listagem de produtos
- [ ] Carrinho de compras
- [ ] Checkout com validações
- [ ] Sistema de status de pedidos
- [ ] Painel administrativo básico
- [ ] Persistência com localStorage

### Funcionalidades Avançadas

- [ ] Controle de estoque
- [ ] Sistema de cupons
- [ ] Relatórios e gráficos
- [ ] Notificações em tempo real
- [ ] Exportação de dados
- [ ] Rastreamento de pedidos

### Boas Práticas

- [ ] Usar TypeScript para type safety
- [ ] Implementar validações de formulário
- [ ] Adicionar feedback visual (loading states, toasts)
- [ ] Otimizar performance com useMemo/useCallback
- [ ] Testar em diferentes dispositivos (responsivo)
- [ ] Documentar código e decisões de arquitetura

---

## 🚀 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Faça upload da pasta dist/
```

### Configurações Importantes

- **Environment Variables**: Não necessário (tudo client-side)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18+

---

## 📚 Recursos Adicionais

### Documentação Oficial

- [React](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

### Bibliotecas Úteis para Expansão

- **Formulários**: React Hook Form, Formik
- **Validação**: Yup, Zod
- **Gráficos**: Chart.js, Recharts
- **Notificações**: React Toastify
- **Ícones**: React Icons, Heroicons
- **Datas**: date-fns, dayjs

---

## 🎯 Próximos Passos Sugeridos

1. **Autenticação**: Implementar login para clientes e administradores
2. **Backend**: Migrar localStorage para API REST/GraphQL
3. **Pagamentos**: Integrar gateway de pagamento real
4. **Push Notifications**: Service Workers para notificações push
5. **PWA**: Transformar em Progressive Web App
6. **Analytics**: Integrar Google Analytics ou Plausible
7. **SEO**: Otimizar meta tags e structured data
8. **Testes**: Implementar testes unitários e E2E

---

## 📝 Licença

Este código é fornecido como template educacional. Sinta-se livre para usar, modificar e distribuir conforme necessário.

---

**Criado com ❤️ usando React + TypeScript + Tailwind CSS**

**Versão**: 1.0.0  
**Última atualização**: 2026-01-21
