import { useOrders, Order } from '../context/OrderContext';
import { useState, useEffect, useRef } from 'react';
import { estimatedTime } from '../data/menu';

export default function KitchenPage() {
  const { orders, updateOrderStatus, getStats } = useOrders();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const prevNewCount = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const newOrders = orders.filter((o) => o.status === 'novo');
  const preparingOrders = orders.filter((o) => o.status === 'preparando');
  const readyOrders = orders.filter((o) => o.status === 'pronto');
  const deliveredOrders = orders.filter((o) => o.status === 'entregue');
  const stats = getStats();

  // Sound notification for new orders
  useEffect(() => {
    if (newOrders.length > prevNewCount.current && soundEnabled) {
      playNotificationSound();
    }
    prevNewCount.current = newOrders.length;
  }, [newOrders.length, soundEnabled]);

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      oscillator.start();
      setTimeout(() => {
        oscillator.frequency.value = 1000;
      }, 150);
      setTimeout(() => {
        oscillator.frequency.value = 1200;
      }, 300);
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 500);
    } catch (e) {
      console.log('Audio not available');
    }
  };

  const getTimeDiff = (dateStr: string) => {
    const diff = Math.floor((currentTime.getTime() - new Date(dateStr).getTime()) / 60000);
    if (diff < 1) return 'Agora';
    if (diff === 1) return '1 min';
    return `${diff} min`;
  };

  const isUrgent = (dateStr: string) => {
    const diff = Math.floor((currentTime.getTime() - new Date(dateStr).getTime()) / 60000);
    return diff > 20;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👨‍🍳</span>
            <div>
              <h1 className="text-xl font-bold">Cozinha - Pizzaria Bella Massa</h1>
              <p className="text-sm text-gray-400">
                {currentTime.toLocaleDateString('pt-BR')} • {currentTime.toLocaleTimeString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge label="Novos" count={newOrders.length} color="bg-yellow-500" />
            <StatusBadge label="Preparando" count={preparingOrders.length} color="bg-blue-500" />
            <StatusBadge label="Prontos" count={readyOrders.length} color="bg-green-500" />
            <button
              onClick={() => setShowStats(!showStats)}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              📊 Stats
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                soundEnabled
                  ? 'bg-green-700 hover:bg-green-600 text-green-200'
                  : 'bg-red-700 hover:bg-red-600 text-red-200'
              }`}
            >
              🔔 {soundEnabled ? 'Som ON' : 'Som OFF'}
            </button>
          </div>
        </div>

        {/* Stats Panel */}
        {showStats && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Pedidos Hoje" value={stats.totalOrders.toString()} icon="📦" color="bg-blue-900/50 border-blue-700" />
            <StatCard label="Faturamento" value={`R$ ${stats.totalRevenue.toFixed(2)}`} icon="💰" color="bg-green-900/50 border-green-700" />
            <StatCard label="Ticket Médio" value={`R$ ${stats.avgTicket.toFixed(2)}`} icon="📊" color="bg-purple-900/50 border-purple-700" />
            <StatCard label="Pedidos Ativos" value={stats.activeOrders.toString()} icon="🔥" color="bg-orange-900/50 border-orange-700" />
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* New Orders Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-3 h-3 rounded-full bg-yellow-500 ${newOrders.length > 0 ? 'animate-pulse' : ''}`} />
              <h2 className="text-lg font-bold text-yellow-400">
                Novos Pedidos ({newOrders.length})
              </h2>
            </div>
            <div className="space-y-4">
              {newOrders.length === 0 ? (
                <div className="bg-gray-800 rounded-xl p-6 text-center text-gray-500">
                  <span className="text-3xl block mb-2">😴</span>
                  <p>Nenhum pedido novo</p>
                  <p className="text-xs mt-1">Aguardando...</p>
                </div>
              ) : (
                newOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    timeDiff={getTimeDiff(order.createdAt)}
                    isUrgent={isUrgent(order.createdAt)}
                    onAction={() => updateOrderStatus(order.id, 'preparando')}
                    actionLabel="🔥 Iniciar Preparo"
                    actionColor="bg-blue-500 hover:bg-blue-600"
                    estimatedTime={estimatedTime.novo}
                  />
                ))
              )}
            </div>
          </div>

          {/* Preparing Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-3 h-3 rounded-full bg-blue-500 ${preparingOrders.length > 0 ? 'animate-pulse' : ''}`} />
              <h2 className="text-lg font-bold text-blue-400">
                Preparando ({preparingOrders.length})
              </h2>
            </div>
            <div className="space-y-4">
              {preparingOrders.length === 0 ? (
                <div className="bg-gray-800 rounded-xl p-6 text-center text-gray-500">
                  <span className="text-3xl block mb-2">🍳</span>
                  <p>Nenhum pedido em preparo</p>
                </div>
              ) : (
                preparingOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    timeDiff={getTimeDiff(order.createdAt)}
                    isUrgent={isUrgent(order.createdAt)}
                    onAction={() => updateOrderStatus(order.id, 'pronto')}
                    actionLabel="✅ Marcar como Pronto"
                    actionColor="bg-green-500 hover:bg-green-600"
                    estimatedTime={estimatedTime.preparando}
                  />
                ))
              )}
            </div>
          </div>

          {/* Ready Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <h2 className="text-lg font-bold text-green-400">
                Prontos ({readyOrders.length})
              </h2>
            </div>
            <div className="space-y-4">
              {readyOrders.length === 0 ? (
                <div className="bg-gray-800 rounded-xl p-6 text-center text-gray-500">
                  <span className="text-3xl block mb-2">📦</span>
                  <p>Nenhum pedido pronto</p>
                </div>
              ) : (
                readyOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    timeDiff={getTimeDiff(order.createdAt)}
                    isUrgent={false}
                    onAction={() => updateOrderStatus(order.id, 'entregue')}
                    actionLabel="🚀 Marcar Entregue"
                    actionColor="bg-gray-600 hover:bg-gray-500"
                    estimatedTime={estimatedTime.pronto}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Delivered */}
        {deliveredOrders.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-400 mb-4 flex items-center gap-2">
              <span>✅</span> Entregues Hoje ({deliveredOrders.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {deliveredOrders.slice(0, 8).map((order) => (
                <div key={order.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-300">{order.id}</span>
                    <span className="text-xs text-green-400">✅ Entregue</span>
                  </div>
                  <p className="text-sm text-gray-400">👤 {order.customerName}</p>
                  <p className="text-sm text-gray-500">
                    🍕 {order.pizzaItems.reduce((s, i) => s + i.quantity, 0)} pizza(s)
                    {order.drinkItems.length > 0 && ` • 🥤 ${order.drinkItems.reduce((s, i) => s + i.quantity, 0)} bebida(s)`}
                  </p>
                  <p className="text-sm text-orange-400 font-semibold mt-1">
                    💵 R$ {order.total.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className={`${color} border rounded-xl p-3 text-center`}>
      <span className="text-xl">{icon}</span>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}

function StatusBadge({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-lg">
      <div className={`${color} w-2.5 h-2.5 rounded-full`} />
      <span className="text-sm text-gray-300">
        {label}: <span className="font-bold text-white">{count}</span>
      </span>
    </div>
  );
}

function OrderCard({
  order,
  timeDiff,
  isUrgent,
  onAction,
  actionLabel,
  actionColor,
  estimatedTime,
}: {
  order: Order;
  timeDiff: string;
  isUrgent: boolean;
  onAction: () => void;
  actionLabel: string;
  actionColor: string;
  estimatedTime: string;
}) {
  return (
    <div className={`bg-gray-800 rounded-xl p-4 border transition-colors ${
      isUrgent ? 'border-red-500 shadow-lg shadow-red-900/30' : 'border-gray-700 hover:border-gray-600'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-white">{order.id}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            isUrgent ? 'bg-red-900/50 text-red-300' : 'bg-gray-700 text-gray-300'
          }`}>
            ⏱️ {timeDiff}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-orange-400 block">💵 R$ {order.total.toFixed(2)}</span>
          <span className="text-xs text-gray-500">🕐 {estimatedTime}</span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-3 bg-gray-900/30 rounded-lg p-2">
        <p className="text-sm text-gray-300 font-medium">👤 {order.customerName}</p>
        <p className="text-xs text-gray-400">📍 {order.address}</p>
        <p className="text-xs text-gray-400">📞 {order.customerPhone}</p>
      </div>

      {/* Pizza Items */}
      {order.pizzaItems.length > 0 && (
        <div className="bg-gray-900/50 rounded-lg p-3 mb-2">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-2">🍕 Pizzas:</p>
          {order.pizzaItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-200">
                {item.quantity}x {item.name}
              </span>
              <span className="text-xs text-gray-400">
                R$ {(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Drink Items */}
      {order.drinkItems.length > 0 && (
        <div className="bg-gray-900/50 rounded-lg p-3 mb-2">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-2">🥤 Bebidas:</p>
          {order.drinkItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-200">
                {item.quantity}x {item.name}
              </span>
              <span className="text-xs text-gray-400">
                R$ {(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Notes */}
      {order.notes && (
        <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-2 mb-3">
          <p className="text-xs text-yellow-300">📝 {order.notes}</p>
        </div>
      )}

      {/* Coupon */}
      {order.couponCode && (
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-2 mb-3">
          <p className="text-xs text-purple-300">🎟️ Cupom: {order.couponCode} (-{((order.discount / order.subtotal) * 100).toFixed(0)}%)</p>
        </div>
      )}

      {/* Payment & Action */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          <p>💵 Pago: R$ {order.cashPaid.toFixed(2)}</p>
          <p>💰 Troco: <span className="text-orange-400 font-bold">R$ {order.change.toFixed(2)}</span></p>
        </div>
        <button
          onClick={onAction}
          className={`${actionColor} text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all transform hover:scale-105 shadow-lg`}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
