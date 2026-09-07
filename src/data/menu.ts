export interface Pizza {
  id: string;
  name: string;
  description: string;
  ingredients: string;
  prices: { P: number; M: number; G: number };
  category: 'tradicional' | 'especial' | 'doce';
  emoji: string;
}

export interface Drink {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  category: 'refrigerante' | 'suco' | 'agua';
}

export interface Crust {
  id: string;
  name: string;
  price: number;
  emoji: string;
}

export interface Coupon {
  code: string;
  discount: number; // percentage
  description: string;
}

export const pizzas: Pizza[] = [
  // Tradicionais
  {
    id: 'margherita',
    name: 'Margherita',
    description: 'A clássica italiana',
    ingredients: 'Molho de tomate, mussarela, tomate e manjericão',
    prices: { P: 28, M: 38, G: 48 },
    category: 'tradicional',
    emoji: '🍕',
  },
  {
    id: 'calabresa',
    name: 'Calabresa',
    description: 'Sabor que todos amam',
    ingredients: 'Molho de tomate, mussarela, calabresa e cebola',
    prices: { P: 30, M: 40, G: 52 },
    category: 'tradicional',
    emoji: '🌶️',
  },
  {
    id: 'portuguesa',
    name: 'Portuguesa',
    description: 'Tradicional e completa',
    ingredients: 'Molho de tomate, mussarela, presunto, ovo, cebola, azeitona e ervilha',
    prices: { P: 32, M: 42, G: 54 },
    category: 'tradicional',
    emoji: '🥚',
  },
  {
    id: 'frango-catupiry',
    name: 'Frango c/ Catupiry',
    description: 'Cremosa e deliciosa',
    ingredients: 'Molho de tomate, mussarela, frango desfiado e catupiry',
    prices: { P: 32, M: 44, G: 56 },
    category: 'tradicional',
    emoji: '🐔',
  },
  {
    id: 'quatro-queijos',
    name: 'Quatro Queijos',
    description: 'Para os amantes de queijo',
    ingredients: 'Molho de tomate, mussarela, provolone, parmesão e catupiry',
    prices: { P: 34, M: 46, G: 58 },
    category: 'tradicional',
    emoji: '🧀',
  },
  {
    id: 'napolitana',
    name: 'Napolitana',
    description: 'Simples e saborosa',
    ingredients: 'Molho de tomate, mussarela, tomate, parmesão e alho',
    prices: { P: 28, M: 38, G: 50 },
    category: 'tradicional',
    emoji: '🍅',
  },
  // Especiais
  {
    id: 'pepperoni',
    name: 'Pepperoni',
    description: 'Estilo americano',
    ingredients: 'Molho de tomate, mussarela, pepperoni e orégano',
    prices: { P: 36, M: 48, G: 60 },
    category: 'especial',
    emoji: '🔴',
  },
  {
    id: 'bacon',
    name: 'Bacon Crocante',
    description: 'Irresistível',
    ingredients: 'Molho de tomate, mussarela, bacon crocante e cebola caramelizada',
    prices: { P: 36, M: 48, G: 62 },
    category: 'especial',
    emoji: '🥓',
  },
  {
    id: 'vegetariana',
    name: 'Vegetariana',
    description: 'Leve e saudável',
    ingredients: 'Molho de tomate, mussarela, brócolis, milho, palmito, tomate e azeitona',
    prices: { P: 34, M: 46, G: 58 },
    category: 'especial',
    emoji: '🥦',
  },
  {
    id: 'lombo',
    name: 'Lombo c/ Catupiry',
    description: 'Combinação perfeita',
    ingredients: 'Molho de tomate, mussarela, lombo canadense e catupiry',
    prices: { P: 38, M: 50, G: 64 },
    category: 'especial',
    emoji: '🥩',
  },
  // Doces
  {
    id: 'chocolate',
    name: 'Chocolate',
    description: 'Sobremesa perfeita',
    ingredients: 'Chocolate ao leite e granulado',
    prices: { P: 30, M: 40, G: 50 },
    category: 'doce',
    emoji: '🍫',
  },
  {
    id: 'banana-canela',
    name: 'Banana c/ Canela',
    description: 'Doce e aromática',
    ingredients: 'Leite condensado, banana, canela e açúcar',
    prices: { P: 28, M: 38, G: 48 },
    category: 'doce',
    emoji: '🍌',
  },
  {
    id: 'romeu-julieta',
    name: 'Romeu e Julieta',
    description: 'Clássico mineiro',
    ingredients: 'Goiabada e queijo minas',
    prices: { P: 30, M: 40, G: 52 },
    category: 'doce',
    emoji: '🍬',
  },
];

export const drinks: Drink[] = [
  { id: 'coca-2l', name: 'Coca-Cola 2L', description: 'Garrafa 2 litros', price: 12, emoji: '🥤', category: 'refrigerante' },
  { id: 'coca-lata', name: 'Coca-Cola Lata', description: 'Lata 350ml', price: 6, emoji: '🥫', category: 'refrigerante' },
  { id: 'guarana-2l', name: 'Guaraná 2L', description: 'Garrafa 2 litros', price: 10, emoji: '🧃', category: 'refrigerante' },
  { id: 'guarana-lata', name: 'Guaraná Lata', description: 'Lata 350ml', price: 5, emoji: '🥫', category: 'refrigerante' },
  { id: 'suco-laranja', name: 'Suco de Laranja', description: 'Natural 500ml', price: 9, emoji: '🍊', category: 'suco' },
  { id: 'suco-uva', name: 'Suco de Uva', description: 'Natural 500ml', price: 9, emoji: '🍇', category: 'suco' },
  { id: 'agua-sem', name: 'Água sem Gás', description: '500ml', price: 4, emoji: '💧', category: 'agua' },
  { id: 'agua-com', name: 'Água com Gás', description: '500ml', price: 5, emoji: '🫧', category: 'agua' },
];

export const crusts: Crust[] = [
  { id: 'normal', name: 'Normal', price: 0, emoji: '⭕' },
  { id: 'catupiry', name: 'Catupiry', price: 6, emoji: '🧀' },
  { id: 'cheddar', name: 'Cheddar', price: 6, emoji: '🟡' },
  { id: 'chocolate-borda', name: 'Chocolate', price: 8, emoji: '🍫' },
  { id: 'nutella', name: 'Nutella', price: 10, emoji: '🤎' },
];

export const coupons: Coupon[] = [
  { code: 'BEMVINDO10', discount: 10, description: '10% de desconto' },
  { code: 'PROMO20', discount: 20, description: '20% de desconto' },
  { code: 'FRETE5', discount: 5, description: '5% de desconto' },
];

export const deliveryFee = 5.00;

export const sizes = {
  P: { label: 'Pequena', slices: '4 fatias', diameter: '25cm' },
  M: { label: 'Média', slices: '6 fatias', diameter: '30cm' },
  G: { label: 'Grande', slices: '8 fatias', diameter: '35cm' },
};

export const estimatedTime = {
  novo: '40-50 min',
  preparando: '25-35 min',
  pronto: '10-15 min',
  entregue: 'Entregue ✅',
};
