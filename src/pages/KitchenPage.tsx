import { useOrders, Order } from '../context/OrderContext';
import { useState, useEffect } from 'react';

export default function KitchenPage() {
  const { orders, updateOrderStatus } = useOrders();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const newOrders = orders.filter((o) => o.status === 'novo');
  const preparingOrders = orders.filter((o) => o.status === 'preparando');
  const readyOrders = orders.filter((o) => o.status === 'pronto');
  const deliveredOrders = orders.filter((o) => o.status === 'entregue');

  const getTimeDiff = (date: Date) => {
    const diff = Math.floor((currentTime.getTime() - new Date(date).getTime()) / 60000);
    if (diff < 1) return 'Agora';
    if (diff === 1) return '1 min';
    return `${diff} min`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👨‍🍳</span>
            <div>
              <h1 className="text-xl font-bold">Cozinha - Pizzaria Bella Massa</h1>
              <p className="text-sm text-gray-400">
                {currentTime.toLocaleDateString('pt-BR')} • {currentTime.toLocaleTimeString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <StatusBadge label="Novos" count={newOrders.length} color="bg-yellow-500" />
            <StatusBadge label="Preparando" count={preparingOrders.length} color="bg-blue-500" />
            <StatusBadge label="Prontos" count={readyOrders.length} color="bg-green-500" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* New Orders Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
              <h2 className="text-lg font-bold text-yellow-400">
                Novos Pedidos ({newOrders.length})
              </h2>
            </div>
            <div className="space-y-4">
              {newOrders.length === 0 ? (
                <div className="bg-gray-800 rounded-xl p-6 text-center text-gray-500">
                  <p>Nenhum pedido novo</p>
                </div>
              ) : (
                newOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    timeDiff={getTimeDiff(order.createdAt)}
                    onAction={() => updateOrderStatus(order.id, 'preparando')}
                    actionLabel="Iniciar Preparo"
                    actionColor="bg-blue-500 hover:bg-blue-600"
                  />
                ))
              )}
            </div>
          </div>

          {/* Preparing Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              <h2 className="text-lg font-bold text-blue-400">
                Preparando ({preparingOrders.length})
              </h2>
            </div>
            <div className="space-y-4">
              {preparingOrders.length === 0 ? (
                <div className="bg-gray-800 rounded-xl p-6 text-center text-gray-500">
                  <p>Nenhum pedido em preparo</p>
                </div>
              ) : (
                preparingOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    timeDiff={getTimeDiff(order.createdAt)}
                    onAction={() => updateOrderStatus(order.id, 'pronto')}
                    actionLabel="Marcar como Pronto"
                    actionColor="bg-green-500 hover:bg-green-600"
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
                  <p>Nenhum pedido pronto</p>
                </div>
              ) : (
                readyOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    timeDiff={getTimeDiff(order.createdAt)}
                    onAction={() => updateOrderStatus(order.id, 'entregue')}
                    actionLabel="Marcar Entregue"
                    actionColor="bg-gray-600 hover:bg-gray-500"
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Delivered */}
        {deliveredOrders.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-400 mb-4">
              Entregues ({deliveredOrders.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {deliveredOrders.slice(0, 8).map((order) => (
                <div key={order.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-300">{order.id}</span>
                    <span className="text-xs text-green-400">✅ Entregue</span>
                  </div>
                  <p className="text-sm text-gray-400">{order.customerName}</p>
                  <p className="text-sm text-gray-500">{order.items.length} item(s)</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
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
  onAction,
  actionLabel,
  actionColor,
}: {
  order: Order;
  timeDiff: string;
  onAction: () => void;
  actionLabel: string;
  actionColor: string;
}) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-white">{order.id}</span>
          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
            ⏱️ {timeDiff}
          </span>
        </div>
        <span className="text-xs text-orange-400">💵 R$ {order.total.toFixed(2)}</span>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-300 font-medium">👤 {order.customerName}</p>
        <p className="text-xs text-gray-400">📍 {order.address}</p>
        <p className="text-xs text-gray-400">📞 {order.customerPhone}</p>
      </div>

      <div className="bg-gray-900/50 rounded-lg p-3 mb-3">
        <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Itens do pedido:</p>
        {order.items.map((item) => (
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

      {order.notes && (
        <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-2 mb-3">
          <p className="text-xs text-yellow-300">📝 {order.notes}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          💵 Dinheiro: R$ {order.cashPaid.toFixed(2)} | Troco: R$ {order.change.toFixed(2)}
        </span>
        <button
          onClick={onAction}
          className={`${actionColor} text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors`}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
