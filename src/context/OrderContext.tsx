import { createContext, useContext, useState, ReactNode } from 'react';

export interface PizzaItem {
  id: string;
  name: string;
  size: 'P' | 'M' | 'G';
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: PizzaItem[];
  total: number;
  cashPaid: number;
  change: number;
  status: 'novo' | 'preparando' | 'pronto' | 'entregue';
  createdAt: Date;
  notes: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  getNewOrders: () => Order[];
  getPreparingOrders: () => Order[];
  getReadyOrders: () => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (order: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
    const newOrder: Order = {
      ...order,
      id: `PED-${Date.now().toString(36).toUpperCase()}`,
      status: 'novo',
      createdAt: new Date(),
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  const getNewOrders = () => orders.filter((o) => o.status === 'novo');
  const getPreparingOrders = () => orders.filter((o) => o.status === 'preparando');
  const getReadyOrders = () => orders.filter((o) => o.status === 'pronto');

  return (
    <OrderContext.Provider
      value={{ orders, addOrder, updateOrderStatus, getNewOrders, getPreparingOrders, getReadyOrders }}
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
