/**
 * 🍕 Componentes Reutilizáveis - Pizzaria Bella Massa
 * 
 * Este arquivo contém componentes extraídos da aplicação que podem ser
 * reutilizados em outros projetos de delivery/pedidos.
 * 
 * Como usar:
 * 1. Copie o componente desejado para seu projeto
 * 2. Ajuste as props e estilos conforme necessário
 * 3. Instale as dependências (Tailwind CSS recomendado)
 */

import { useState, useEffect, ReactNode } from 'react';

// ============================================
// 1. BADGE DE STATUS
// ============================================

interface StatusBadgeProps {
  status: 'novo' | 'preparando' | 'pronto' | 'entregue';
  showTime?: boolean;
  timeDiff?: string;
}

export function StatusBadge({ status, showTime, timeDiff }: StatusBadgeProps) {
  const config = {
    novo: { color: 'bg-yellow-100 text-yellow-800', icon: '🆕', label: 'Novo' },
    preparando: { color: 'bg-blue-100 text-blue-800', icon: '🔥', label: 'Preparando' },
    pronto: { color: 'bg-green-100 text-green-800', icon: '✅', label: 'Pronto' },
    entregue: { color: 'bg-gray-100 text-gray-800', icon: '📦', label: 'Entregue' },
  };

  const { color, icon, label } = config[status];

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${color}`}>
      <span>{icon}</span>
      <span>{label}</span>
      {showTime && timeDiff && <span className="ml-1 opacity-75">({timeDiff})</span>}
    </span>
  );
}

// ============================================
// 2. CARD DE PRODUTO COM ESTOQUE
// ============================================

interface ProductCardProps {
  name: string;
  emoji: string;
  price: number;
  stock?: number;
  onAdd?: () => void;
  disabled?: boolean;
}

export function ProductCard({ name, emoji, price, stock, onAdd, disabled }: ProductCardProps) {
  const isOutOfStock = stock !== undefined && stock === 0;
  const isLowStock = stock !== undefined && stock > 0 && stock <= 5;

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm transition-all border text-center relative ${
      isOutOfStock ? 'border-gray-200 opacity-60' : 'border-gray-100 hover:border-orange-200 hover:shadow-lg'
    }`}>
      {isOutOfStock && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          ESGOTADO
        </div>
      )}
      {isLowStock && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          Últimas {stock}
        </div>
      )}
      <span className="text-4xl">{emoji}</span>
      <h3 className="font-bold text-gray-800 mt-2 text-sm">{name}</h3>
      <p className="font-bold text-orange-600 mt-2">R$ {price.toFixed(2)}</p>
      <button
        onClick={onAdd}
        disabled={isOutOfStock || disabled}
        className={`mt-2 w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
          isOutOfStock
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-orange-100 hover:bg-orange-200 text-orange-600'
        }`}
      >
        {isOutOfStock ? 'Indisponível' : '+ Adicionar'}
      </button>
    </div>
  );
}

// ============================================
// 3. CONTROLE DE QUANTIDADE
// ============================================

interface QuantityControlProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function QuantityControl({ value, min = 0, max = 999, onChange, size = 'md' }: QuantityControlProps) {
  const sizeClasses = {
    sm: { button: 'w-6 h-6 text-xs', input: 'w-10 text-xs', quick: 'px-1.5 h-6 text-xs' },
    md: { button: 'w-8 h-8 text-sm', input: 'w-12 text-sm', quick: 'px-2 h-8 text-xs' },
    lg: { button: 'w-10 h-10 text-base', input: 'w-16 text-base', quick: 'px-3 h-10 text-sm' },
  };

  const s = sizeClasses[size];

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`${s.button} rounded bg-white hover:bg-red-100 text-red-600 font-bold transition-colors flex items-center justify-center disabled:opacity-50`}
      >
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Math.max(min, Math.min(max, parseInt(e.target.value) || 0)))}
        className={`${s.input} text-center bg-white rounded py-1 font-bold text-gray-800 border-0 outline-none`}
        min={min}
        max={max}
      />
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`${s.button} rounded bg-white hover:bg-green-100 text-green-600 font-bold transition-colors flex items-center justify-center disabled:opacity-50`}
      >
        +
      </button>
      {size !== 'sm' && (
        <button
          onClick={() => onChange(Math.min(max, value + 10))}
          className={`${s.quick} rounded bg-white hover:bg-blue-100 text-blue-600 font-bold transition-colors`}
          title="Adicionar 10"
        >
          +10
        </button>
      )}
    </div>
  );
}

// ============================================
// 4. TIMELINE DE STATUS
// ============================================

interface TimelineStep {
  status: string;
  label: string;
  icon: string;
}

interface OrderTimelineProps {
  steps: TimelineStep[];
  currentStatus: string;
}

export function OrderTimeline({ steps, currentStatus }: OrderTimelineProps) {
  const currentStepIndex = steps.findIndex((step) => step.status === currentStatus);

  return (
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
  );
}

// ============================================
// 5. MODAL GENÉRICO
// ============================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-3xl shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto`}>
        {title && (
          <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between rounded-t-3xl">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ============================================
// 6. DRAWER (PAINEL LATERAL)
// ============================================

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  position?: 'left' | 'right';
  maxWidth?: string;
}

export function Drawer({ isOpen, onClose, title, children, position = 'right', maxWidth = 'max-w-md' }: DrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative ${position === 'right' ? 'ml-auto' : 'mr-auto'} w-full ${maxWidth} bg-white h-full overflow-y-auto shadow-2xl`}>
        {title && (
          <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}

// ============================================
// 7. TOAST / NOTIFICAÇÃO
// ============================================

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  isVisible: boolean;
  onClose?: () => void;
}

export function Toast({ message, type = 'info', isVisible, onClose }: ToastProps) {
  if (!isVisible) return null;

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${colors[type]} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-up`}>
      <span className="text-xl">{icons[type]}</span>
      <span className="font-semibold">{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-2 text-white/80 hover:text-white">
          ✕
        </button>
      )}
    </div>
  );
}

// ============================================
// 8. HOOK: USE TIMER
// ============================================

export function useTimer(interval = 1000) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), interval);
    return () => clearInterval(timer);
  }, [interval]);

  return currentTime;
}

// ============================================
// 9. HOOK: USE LOCAL STORAGE
// ============================================

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}

// ============================================
// 10. HOOK: USE DEBOUNCE
// ============================================

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================
// 11. FORMATAÇÃO DE MOEDA
// ============================================

export function formatCurrency(value: number, locale = 'pt-BR', currency = 'BRL'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

// ============================================
// 12. FORMATAÇÃO DE DATA
// ============================================

export function formatDate(date: string | Date, locale = 'pt-BR'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date, locale = 'pt-BR'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getTimeDiff(date: string | Date, currentTime: Date = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = Math.floor((currentTime.getTime() - d.getTime()) / 60000);
  if (diff < 1) return 'Agora';
  if (diff === 1) return '1 min';
  if (diff < 60) return `${diff} min`;
  const hours = Math.floor(diff / 60);
  if (hours === 1) return '1 hora';
  return `${hours} horas`;
}

// ============================================
// 13. VALIDAÇÕES
// ============================================

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
}

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validateCEP(cep: string): boolean {
  const cleaned = cep.replace(/\D/g, '');
  return cleaned.length === 8;
}

// ============================================
// 14. EXPORTAÇÃO CSV
// ============================================

export function exportToCSV(data: any[], filename: string, headers?: string[]) {
  if (data.length === 0) return;

  const csvHeaders = headers || Object.keys(data[0]);
  const csvRows = data.map(row =>
    csvHeaders.map(header => {
      const value = row[header];
      const escaped = ('' + value).replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(',')
  );

  const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}

// ============================================
// 15. NOTIFICAÇÃO SONORA
// ============================================

export function playNotificationSound() {
  // Som de notificação em base64 (beep curto)
  const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWS57OigTBEKUqXh8LdlHAU2j9XzzHksBSR3x/DdkEAKFF606eupVRQK');
  audio.play().catch(e => console.log('Audio play failed:', e));
}

// ============================================
// EXEMPLOS DE USO
// ============================================

/*
// Exemplo 1: ProductCard
<ProductCard
  name="Coca-Cola 2L"
  emoji="🥤"
  price={12.00}
  stock={5}
  onAdd={() => console.log('Adicionado!')}
/>

// Exemplo 2: QuantityControl
<QuantityControl
  value={quantity}
  min={1}
  max={99}
  onChange={setQuantity}
  size="md"
/>

// Exemplo 3: OrderTimeline
<OrderTimeline
  steps={[
    { status: 'novo', label: 'Recebido', icon: '📝' },
    { status: 'preparando', label: 'Preparando', icon: '👨‍🍳' },
    { status: 'pronto', label: 'Pronto', icon: '✅' },
    { status: 'entregue', label: 'Entregue', icon: '🎉' },
  ]}
  currentStatus="preparando"
/>

// Exemplo 4: useLocalStorage
const [cart, setCart] = useLocalStorage<CartItem[]>('my-cart', []);

// Exemplo 5: formatCurrency
formatCurrency(1234.56); // "R$ 1.234,56"

// Exemplo 6: exportToCSV
exportToCSV(
  orders,
  'relatorio-vendas',
  ['id', 'customerName', 'total', 'status']
);
*/
