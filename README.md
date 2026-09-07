# 🍕 Pizzaria Bella Massa - Sistema Completo de Pedidos

> **Skill reutilizável** para sistemas de delivery, pedidos online e gestão de restaurantes

[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-blue)](https://tailwindcss.com/)

---

## 📖 Sobre

Sistema completo e funcional para pizzarias e restaurantes, desenvolvido com React + TypeScript + Tailwind CSS. Inclui todas as funcionalidades essenciais para gestão de pedidos, desde a tela do cliente até relatórios avançados de vendas.

### ✨ Características

- 🛒 **Tela do Cliente**: Cardápio completo, carrinho, checkout
- 👨‍🍳 **Painel da Cozinha**: Dashboard em tempo real com notificações
- ⚙️ **Painel Admin**: Gestão de produtos e estoque
- 📊 **Relatórios**: Análise de vendas com gráficos e exportação
- 📍 **Rastreamento**: Acompanhamento de pedidos pelo cliente
- 💾 **Persistência**: Dados salvos automaticamente no navegador
- 📱 **Responsivo**: Funciona em desktop, tablet e mobile

---

## 🚀 Começando

### Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Acesso

- **Página Inicial**: http://localhost:5173/
- **Tela do Cliente**: http://localhost:5173/cliente
- **Painel da Cozinha**: http://localhost:5173/cozinha
- **Painel Admin**: http://localhost:5173/admin
- **Relatórios**: http://localhost:5173/relatorios
- **Rastreamento**: http://localhost:5173/rastrear

---

## 📚 Documentação

### 📘 Guias

- **[SKILL.md](./SKILL.md)** - Documentação completa da arquitetura e padrões
- **[QUICKSTART.md](./QUICKSTART.md)** - Guia rápido para usar em novos projetos
- **[README.md](./README.md)** - Este arquivo (visão geral)

### 🎯 Componentes Reutilizáveis

Todos os componentes reutilizáveis estão em `src/components/reusable.tsx`:

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
```

---

## 🏗️ Arquitetura

```
src/
├── context/              # Gerenciamento de estado
│   ├── OrderContext.tsx  # Pedidos e status
│   └── MenuContext.tsx   # Produtos e estoque
├── data/
│   └── menu.ts          # Cardápio e tipos
├── components/
│   └── reusable.tsx     # Componentes reutilizáveis
└── pages/
    ├── HomePage.tsx     # Landing page
    ├── CustomerPage.tsx # Tela do cliente
    ├── KitchenPage.tsx  # Painel da cozinha
    ├── AdminPage.tsx    # Gestão de produtos
    ├── ReportsPage.tsx  # Relatórios
    └── TrackingPage.tsx # Rastreamento
```

---

## 🎨 Funcionalidades Detalhadas

### 🛒 Tela do Cliente

- Cardápio organizado por categorias
- Seleção de tamanho (P, M, G)
- Opção de borda recheada
- Carrinho de compras interativo
- Sistema de cupons de desconto
- Cálculo automático de troco
- Validação de formulários

### 👨‍🍳 Painel da Cozinha

- Dashboard em tempo real
- 3 colunas: Novos, Preparando, Prontos
- Notificações sonoras
- Timer de cada pedido
- Indicadores de urgência
- Estatísticas do dia
- Histórico de entregues

### ⚙️ Painel Admin

- CRUD completo de produtos
- Gestão de estoque com controles rápidos
- Indicadores visuais (estoque baixo/esgotado)
- Formulários com validação
- Reset para padrão

### 📊 Relatórios

- Filtros por período (hoje, 7 dias, 30 dias, personalizado)
- KPIs: Receita, pedidos, ticket médio
- Gráfico de vendas por dia
- Ranking de produtos mais vendidos
- Resumo financeiro
- Exportação CSV
- Tabela de pedidos

### 📍 Rastreamento

- Busca por número do pedido
- Timeline visual do status
- Tempo estimado de entrega
- Informações do pedido
- Atualização em tempo real

---

## 💡 Casos de Uso

### 1. Pizzaria (Original)
Sistema completo para pizzarias com cardápio de pizzas, bebidas e bordas.

### 2. Hamburgueria
Adapte o cardápio para hambúrgueres, combos e acompanhamentos.

### 3. Restaurante Japonês
Configure para sushis, temakis e pratos quentes.

### 4. Loja de Delivery
Use para qualquer negócio que precise de sistema de pedidos online.

### 5. Food Truck
Sistema simplificado para negócios móveis.

---

## 🔧 Personalização

### Mudar Cores do Tema

Edite `tailwind.config.js` e substitua as classes de cor nos componentes.

### Adicionar Novos Produtos

Edite `src/data/menu.ts` e adicione seus produtos seguindo a interface.

### Customizar Status de Pedido

Edite `OrderContext.tsx` e adicione novos status ao tipo `Order['status']`.

### Integrar Backend

Substitua `localStorage` por chamadas API nos Contexts.

---

## 📦 Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Type safety
- **React Router** - Navegação
- **Tailwind CSS** - Estilização
- **Context API** - Estado global
- **localStorage** - Persistência
- **Vite** - Build tool

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
# Upload da pasta dist/
```

### Configurações

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18+

---

## 🎓 Aprendizados

Este projeto demonstra:

✅ **Arquitetura React** - Componentes, Contexts, Hooks  
✅ **TypeScript** - Interfaces, tipos, type safety  
✅ **Gerenciamento de Estado** - Context API, localStorage  
✅ **UX/UI** - Design responsivo, feedback visual  
✅ **CRUD Completo** - Criação, leitura, atualização, deleção  
✅ **Relatórios** - Filtros, gráficos, exportação  
✅ **Tempo Real** - Notificações, timers, atualizações  
✅ **Boas Práticas** - Código limpo, reutilizável, documentado  

---

## 🔄 Como Reutilizar

### Opção 1: Copiar e Adaptar

1. Leia o [QUICKSTART.md](./QUICKSTART.md)
2. Copie os arquivos necessários
3. Adapte para seu negócio
4. Personalize cores e textos

### Opção 2: Usar como Template

1. Clone este repositório
2. Renomeie para seu projeto
3. Modifique `menu.ts` com seus produtos
4. Ajuste as páginas conforme necessário

### Opção 3: Extrair Componentes

1. Use `src/components/reusable.tsx`
2. Importe os componentes que precisar
3. Combine com seu próprio código

---

## 📝 Licença

Este código é fornecido como template educacional. Sinta-se livre para usar, modificar e distribuir conforme necessário.

---

## 🤝 Contribuindo

Sugestões e melhorias são bem-vindas! Algumas ideias:

- [ ] Autenticação de usuários
- [ ] Integração com backend real
- [ ] Gateway de pagamento
- [ ] Push notifications
- [ ] PWA (Progressive Web App)
- [ ] Testes automatizados
- [ ] Internacionalização (i18n)
- [ ] Modo escuro

---

## 📞 Suporte

Para dúvidas sobre como usar este skill:

1. Consulte o [SKILL.md](./SKILL.md) para documentação detalhada
2. Veja o [QUICKSTART.md](./QUICKSTART.md) para guia rápido
3. Explore os exemplos em `src/components/reusable.tsx`

---

## 🎉 Agradecimentos

Desenvolvido com ❤️ usando as melhores práticas de React e TypeScript.

**Versão**: 1.0.0  
**Última atualização**: 2026-01-21

---

<div align="center">

**Feito com React + TypeScript + Tailwind CSS**

[Documentação Completa](./SKILL.md) • [Guia Rápido](./QUICKSTART.md) • [Componentes](./src/components/reusable.tsx)

</div>
