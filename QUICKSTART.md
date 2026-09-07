# 🚀 Guia Rápido - Como Usar Este Skill em Novos Projetos

## ⚡ Começando em 5 Minutos

### 1. Clone ou Copie a Estrutura

```bash
# Criar novo projeto Vite + React + TypeScript
npm create vite@latest meu-projeto -- --template react-ts
cd meu-projeto

# Instalar dependências essenciais
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Copie os Arquivos Essenciais

```
src/
├── context/
│   ├── OrderContext.tsx      ← Copiar e adaptar
│   └── MenuContext.tsx       ← Copiar e adaptar
├── data/
│   └── menu.ts              ← Criar com seus produtos
├── components/
│   └── reusable.tsx         ← Copiar componentes reutilizáveis
└── pages/
    ├── HomePage.tsx         ← Adaptar
    ├── CustomerPage.tsx     ← Adaptar
    ├── KitchenPage.tsx      ← Adaptar
    └── AdminPage.tsx        ← Adaptar
```

### 3. Configure o App.tsx

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import { MenuProvider } from './context/MenuContext';

function App() {
  return (
    <MenuProvider>
      <OrderProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cliente" element={<CustomerPage />} />
            <Route path="/cozinha" element={<KitchenPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </BrowserRouter>
      </OrderProvider>
    </MenuProvider>
  );
}
```

---

## 🎯 Adaptações por Tipo de Negócio

### 🍔 Hamburgueria

**Mudanças no `menu.ts`:**
```typescript
export interface Product {
  id: string;
  name: string;
  description: string;
  ingredients: string;
  prices: { P: number; M: number; G: number };
  category: 'classico' | 'especial' | 'vegano';
  emoji: string;
  available: boolean;
  customizable?: boolean; // Permite adicionar extras
}

export const products: Product[] = [
  {
    id: 'x-salada',
    name: 'X-Salada',
    description: 'O clássico',
    ingredients: 'Pão, hambúrguer, queijo, alface, tomate',
    prices: { P: 18, M: 25, G: 32 },
    category: 'classico',
    emoji: '🍔',
    available: true,
    customizable: true,
  },
  // ... mais produtos
];
```

### 🍣 Restaurante Japonês

**Mudanças no `menu.ts`:**
```typescript
export interface Product {
  id: string;
  name: string;
  description: string;
  pieces?: number; // Quantidade de peças
  prices: { P: number; M: number; G: number };
  category: 'sushi' | 'sashimi' | 'temaki' | 'hot-roll';
  emoji: string;
  available: boolean;
}
```

### 🛍️ Loja de Roupas

**Mudanças no `menu.ts`:**
```typescript
export interface Product {
  id: string;
  name: string;
  description: string;
  sizes: string[]; // ['P', 'M', 'G', 'GG']
  colors: string[]; // ['Preto', 'Branco', 'Azul']
  price: number;
  category: 'camiseta' | 'calca' | 'vestido' | 'acessorios';
  emoji: string;
  available: boolean;
  stock: number;
}
```

---

## 🔧 Checklist de Personalização

### Dados (menu.ts)
- [ ] Definir interfaces dos produtos
- [ ] Criar array de produtos padrão
- [ ] Definir categorias
- [ ] Configurar preços e tamanhos
- [ ] Adicionar emojis apropriados

### Contextos
- [ ] Adaptar `OrderContext` para seus campos
- [ ] Adaptar `MenuContext` para seus produtos
- [ ] Ajustar funções de cálculo (subtotal, desconto, etc.)
- [ ] Configurar persistência (localStorage keys)

### Páginas
- [ ] `CustomerPage`: Ajustar cardápio e checkout
- [ ] `KitchenPage`: Ajustar colunas de status
- [ ] `AdminPage`: Ajustar formulários de cadastro
- [ ] `ReportsPage`: Ajustar métricas e gráficos

### Estilos
- [ ] Trocar cores do tema (Tailwind config)
- [ ] Ajustar emojis e ícones
- [ ] Personalizar textos e mensagens
- [ ] Adaptar layout responsivo

---

## 💡 Exemplos de Adaptação

### Exemplo 1: Mudar Cores do Tema

No `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          500: '#ef4444', // Vermelho em vez de laranja
          600: '#dc2626',
        },
      },
    },
  },
};
```

Depois, troque `orange-500` por `primary-500` nos componentes.

### Exemplo 2: Adicionar Campo Personalizado

No `OrderContext.tsx`:
```typescript
export interface Order {
  // ... campos existentes
  deliveryMethod: 'retirada' | 'entrega';
  estimatedDeliveryTime?: string;
}
```

### Exemplo 3: Novo Status de Pedido

```typescript
export type OrderStatus = 
  | 'novo' 
  | 'confirmado'  // NOVO
  | 'preparando' 
  | 'saiu_entrega' // NOVO
  | 'entregue';
```

Atualize a `OrderTimeline` com os novos passos.

---

## 📦 Componentes Reutilizáveis

Use os componentes de `src/components/reusable.tsx`:

```typescript
import { 
  ProductCard, 
  QuantityControl, 
  OrderTimeline,
  Modal,
  Drawer,
  Toast,
  formatCurrency,
  useLocalStorage 
} from './components/reusable';

// Exemplo de uso
<ProductCard
  name="Meu Produto"
  emoji="🎁"
  price={29.90}
  stock={10}
  onAdd={() => addToCart(product)}
/>
```

---

## 🚀 Deploy Rápido

### Vercel (Mais Fácil)

```bash
npm install -g vercel
vercel login
vercel
```

### Netlify

```bash
npm run build
# Arraste a pasta dist/ para o Netlify
```

### Configurações Importantes

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Não necessário (tudo client-side)

---

## 🎓 Dicas Avançadas

### 1. Lazy Loading de Páginas

```typescript
import { lazy, Suspense } from 'react';

const CustomerPage = lazy(() => import('./pages/CustomerPage'));
const KitchenPage = lazy(() => import('./pages/KitchenPage'));

function App() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Routes>
        <Route path="/cliente" element={<CustomerPage />} />
        <Route path="/cozinha" element={<KitchenPage />} />
      </Routes>
    </Suspense>
  );
}
```

### 2. Error Boundaries

```typescript
import { Component, ErrorInfo, ReactNode } from 'react';

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Algo deu errado. Recarregue a página.</h1>;
    }
    return this.props.children;
  }
}
```

### 3. Loading States

```typescript
function CustomerPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-4xl">🍕</div>
      </div>
    );
  }

  return <div>Conteúdo da página</div>;
}
```

---

## 🐛 Troubleshooting

### Problema: Produtos não salvam no localStorage
**Solução**: Verifique se as keys são únicas e se o JSON é válido.

### Problema: Estoque não decrementa
**Solução**: Certifique-se de chamar `decrementDrinkStock` após criar o pedido.

### Problema: Relatórios vazios
**Solução**: Verifique se os pedidos têm `createdAt` no formato ISO.

### Problema: Build falha
**Solução**: Execute `npm run build` localmente primeiro para ver os erros.

---

## 📚 Recursos Adicionais

- **SKILL.md**: Documentação completa da arquitetura
- **reusable.tsx**: Componentes prontos para usar
- **menu.ts**: Exemplos de estruturas de dados

---

## ✅ Checklist Final

Antes de lançar:

- [ ] Testar todos os fluxos (pedido, cozinha, admin)
- [ ] Verificar responsividade em mobile
- [ ] Testar com dados reais
- [ ] Configurar analytics (Google Analytics, etc.)
- [ ] Adicionar favicon e meta tags
- [ ] Testar em diferentes navegadores
- [ ] Fazer backup dos dados
- [ ] Documentar para o cliente/usuário

---

**Pronto! Seu sistema de pedidos está funcionando! 🎉**

Para suporte ou dúvidas, consulte o `SKILL.md` para documentação detalhada.
