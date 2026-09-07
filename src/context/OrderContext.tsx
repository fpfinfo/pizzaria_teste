import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PizzaItem {
  id: string;
  name: string;
  size: 'P' | 'M' | 'G';
  price: number;
  quantity: number;
  crust?: string;
  crustPrice?: number;
}

export interface DrinkItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
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

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt'>) => string;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  getStats: () => {
    totalOrders: number;
    totalRevenue: number;
    avgTicket: number;
    activeOrders: number;
  };
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const STORAGE_KEY = 'bella-massa-orders';

function loadOrders(): Order[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading orders:', e);
  }
  return [];
}

function saveOrders(orders: Order[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving orders:', e);
  }
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(loadOrders);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  const addOrder = (order: Omit<Order, 'id' | 'status' | 'createdAt'>): string => {
    const id = `PED-${Date.now().toString(36).toUpperCase()}`;
    const newOrder: Order = {
      ...order,
      id,
      status: 'novo',
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return id;
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  const getStats = () => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(
      (o) => new Date(o.createdAt).toDateString() === today
    );
    const totalRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
    const activeOrders = orders.filter((o) => o.status !== 'entregue').length;
    const avgTicket = todayOrders.length > 0 ? totalRevenue / todayOrders.length : 0;

    return {
      totalOrders: todayOrders.length,
      totalRevenue,
      avgTicket,
      activeOrders,
    };
  };

  return (
    <OrderContext.Provider
      value={{ orders, addOrder, updateOrderStatus, getStats }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
