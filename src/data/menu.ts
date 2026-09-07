export interface Pizza {
  id: string;
  name: string;
  description: string;
  ingredients: string;
  prices: { P: number; M: number; G: number };
  category: 'tradicional' | 'especial' | 'doce';
  emoji: string;
  available: boolean;
}

export interface Drink {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: 'refrigerante' | 'suco' | 'agua' | 'outros';
  available: boolean;
  stock: number;
}

export interface Crust {
  id: string;
  name: string;
  price: number;
  emoji: string;
  available: boolean;
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
    available: true,
  },
  {
    id: 'calabresa',
    name: 'Calabresa',
    description: 'Sabor que todos amam',
    ingredients: 'Molho de tomate, mussarela, calabresa e cebola',
    prices: { P: 30, M: 40, G: 52 },
    category: 'tradicional',
    emoji: '🌶️',
    available: true,
  },
  {
    id: 'portuguesa',
    name: 'Portuguesa',
    description: 'Tradicional e completa',
    ingredients: 'Molho de tomate, mussarela, presunto, ovo, cebola, azeitona e ervilha',
    prices: { P: 32, M: 42, G: 54 },
    category: 'tradicional',
    emoji: '🥚',
    available: true,
  },
  {
    id: 'frango-catupiry',
    name: 'Frango c/ Catupiry',
    description: 'Cremosa e deliciosa',
    ingredients: 'Molho de tomate, mussarela, frango desfiado e catupiry',
    prices: { P: 32, M: 44, G: 56 },
    category: 'tradicional',
    emoji: '🐔',
    available: true,
  },
  {
    id: 'quatro-queijos',
    name: 'Quatro Queijos',
    description: 'Para os amantes de queijo',
    ingredients: 'Molho de tomate, mussarela, provolone, parmesão e catupiry',
    prices: { P: 34, M: 46, G: 58 },
    category: 'tradicional',
    emoji: '🧀',
    available: true,
  },
  {
    id: 'napolitana',
    name: 'Napolitana',
    description: 'Simples e saborosa',
    ingredients: 'Molho de tomate, mussarela, tomate, parmesão e alho',
    prices: { P: 28, M: 38, G: 50 },
    category: 'tradicional',
    emoji: '🍅',
    available: true,
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
    available: true,
  },
  {
    id: 'bacon',
    name: 'Bacon Crocante',
    description: 'Irresistível',
    ingredients: 'Molho de tomate, mussarela, bacon crocante e cebola caramelizada',
    prices: { P: 36, M: 48, G: 62 },
    category: 'especial',
    emoji: '🥓',
    available: true,
  },
  {
    id: 'vegetariana',
    name: 'Vegetariana',
    description: 'Leve e saudável',
    ingredients: 'Molho de tomate, mussarela, brócolis, milho, palmito, tomate e azeitona',
    prices: { P: 34, M: 46, G: 58 },
    category: 'especial',
    emoji: '🥦',
    available: true,
  },
  {
    id: 'lombo',
    name: 'Lombo c/ Catupiry',
    description: 'Combinação perfeita',
    ingredients: 'Molho de tomate, mussarela, lombo canadense e catupiry',
    prices: { P: 38, M: 50, G: 64 },
    category: 'especial',
    emoji: '🥩',
    available: true,
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
    available: true,
  },
  {
    id: 'banana-canela',
    name: 'Banana c/ Canela',
    description: 'Doce e aromática',
    ingredients: 'Leite condensado, banana, canela e açúcar',
    prices: { P: 28, M: 38, G: 48 },
    category: 'doce',
    emoji: '🍌',
    available: true,
  },
  {
    id: 'romeu-julieta',
    name: 'Romeu e Julieta',
    description: 'Clássico mineiro',
    ingredients: 'Goiabada e queijo minas',
    prices: { P: 30, M: 40, G: 52 },
    category: 'doce',
    emoji: '🍬',
    available: true,
  },
];

export const drinks: Drink[] = [
  { id: 'coca-2l', name: 'Coca-Cola 2L', price: 12, emoji: '🥤', category: 'refrigerante', available: true, stock: 20 },
  { id: 'coca-lata', name: 'Coca-Cola Lata', price: 6, emoji: '🥤', category: 'refrigerante', available: true, stock: 30 },
  { id: 'guarana-2l', name: 'Guaraná 2L', price: 10, emoji: '🥤', category: 'refrigerante', available: true, stock: 15 },
  { id: 'guarana-lata', name: 'Guaraná Lata', price: 5, emoji: '🥤', category: 'refrigerante', available: true, stock: 25 },
  { id: 'sprite-2l', name: 'Sprite 2L', price: 10, emoji: '🥤', category: 'refrigerante', available: true, stock: 15 },
  { id: 'suco-laranja', name: 'Suco de Laranja', price: 8, emoji: '🍊', category: 'suco', available: true, stock: 10 },
  { id: 'suco-uva', name: 'Suco de Uva', price: 8, emoji: '🍇', category: 'suco', available: true, stock: 10 },
  { id: 'agua-sem', name: 'Água sem gás', price: 4, emoji: '💧', category: 'agua', available: true, stock: 40 },
  { id: 'agua-com', name: 'Água com gás', price: 5, emoji: '💧', category: 'agua', available: true, stock: 30 },
];

export const crusts: Crust[] = [
  { id: 'sem-borda', name: 'Sem borda', price: 0, emoji: '⭕', available: true },
  { id: 'catupiry-borda', name: 'Borda de Catupiry', price: 8, emoji: '🧀', available: true },
  { id: 'cheddar-borda', name: 'Borda de Cheddar', price: 8, emoji: '🧀', available: true },
  { id: 'chocolate-borda', name: 'Borda de Chocolate', price: 10, emoji: '🍫', available: true },
  { id: 'nutella-borda', name: 'Borda de Nutella', price: 12, emoji: '🍫', available: true },
];

export const sizes = {
  P: { label: 'Pequena', slices: '4 fatias', diameter: '25cm' },
  M: { label: 'Média', slices: '6 fatias', diameter: '30cm' },
  G: { label: 'Grande', slices: '8 fatias', diameter: '35cm' },
};

export const deliveryFee = 5;

export const coupons: Record<string, number> = {
  'BEMVINDO': 10,
  'PROMO15': 15,
  'VIP20': 20,
};

export const estimatedTime = {
  min: 30,
  max: 45,
  label: '30-45 min',
  novo: '~45 min',
  preparando: '~25 min',
  pronto: '~10 min',
};
