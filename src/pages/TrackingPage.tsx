import { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { estimatedTime } from '../data/menu';

export default function TrackingPage() {
  const { orders } = useOrders();
  const [searchId, setSearchId] = useState('');
  const [foundOrder, setFoundOrder] = useState<string | null>(null);

  const handleSearch = () => {
    const order = orders.find(
      (o) => o.id.toLowerCase() === searchId.toLowerCase() || o.id === searchId.toUpperCase()
    );
    if (order) {
      setFoundOrder(order.id);
    } else {
      setFoundOrder(null);
    }
  };

  const order = foundOrder ? orders.find((o) => o.id === foundOrder) : null;

  const statusSteps = [
    { key: 'novo', label: 'Pedido Recebido', icon: '📋', description: 'Seu pedido foi recebido pela cozinha' },
    { key: 'preparando', label: 'Em Preparação', icon: '👨‍🍳', description: 'O pizzaiolo está preparando seu pedido' },
    { key: 'pronto', label: 'Pronto!', icon: '✅', description: 'Seu pedido está pronto para entrega' },
    { key: 'entregue', label: 'Entregue', icon: '🎉', description: 'Pedido entregue. Bom apetite!' },
  ];

  const currentStepIndex = order
    ? statusSteps.findIndex((s) => s.key === order.status)
    : -1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 text-center">
          <h1 className="text-xl font-bold text-gray-800">📍 Rastrear Pedido</h1>
          <p className="text-sm text-gray-500">Acompanhe o status do seu pedido em tempo real</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="font-bold text-gray-700 mb-3">Digite o número do pedido:</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all uppercase font-mono"
              placeholder="PED-XXXXXX"
            />
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg"
            >
              🔍 Buscar
            </button>
          </div>

          {/* Quick access to recent orders */}
          {orders.length > 0 && !foundOrder && (
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">Pedidos recentes:</p>
              <div className="flex flex-wrap gap-2">
                {orders.slice(0, 5).map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      setSearchId(o.id);
                      setFoundOrder(o.id);
                    }}
                    className="bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-600 px-3 py-1 rounded-lg text-xs font-mono transition-colors"
                  >
                    {o.id}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Not Found */}
        {searchId && !order && foundOrder === null && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <span className="text-5xl block mb-4">🤔</span>
            <h3 className="text-lg font-bold text-gray-700">Pedido não encontrado</h3>
            <p className="text-gray-500 text-sm mt-2">
              Verifique o número do pedido e tente novamente.
            </p>
          </div>
        )}

        {/* Order Tracking */}
        {order && (
          <div className="space-y-6">
            {/* Order Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Pedido</p>
                  <p className="text-2xl font-bold text-orange-600 font-mono">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold text-gray-800">R$ {order.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                <p className="text-sm text-gray-600">👤 {order.customerName}</p>
                <p className="text-sm text-gray-500">📍 {order.address}</p>
                <p className="text-xs text-gray-400">
                  📅 {new Date(order.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Status Tracker */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-700 mb-6">Status do Pedido</h3>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200" />
                <div
                  className="absolute left-6 top-6 w-0.5 bg-gradient-to-b from-orange-500 to-green-500 transition-all duration-500"
                  style={{ height: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                />

                {/* Steps */}
                <div className="space-y-8">
                  {statusSteps.map((step, index) => {
                    const isActive = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                      <div key={step.key} className="relative flex items-start gap-4">
                        <div
                          className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                            isCurrent
                              ? 'bg-orange-500 shadow-lg shadow-orange-200 scale-110'
                              : isActive
                              ? 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        >
                          {isActive && !isCurrent ? '✓' : step.icon}
                        </div>
                        <div className="flex-1 pt-1">
                          <p
                            className={`font-bold ${
                              isCurrent ? 'text-orange-600' : isActive ? 'text-green-600' : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                            {isCurrent && (
                              <span className="ml-2 inline-block animate-pulse">•••</span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500">{step.description}</p>
                          {isCurrent && (
                            <p className="text-sm text-orange-500 mt-1 font-medium">
                              ⏱️ Tempo estimado: {estimatedTime[order.status as keyof typeof estimatedTime]}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-700 mb-4">📦 Itens do Pedido</h3>
              <div className="space-y-3">
                {order.pizzaItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-700">🍕 {item.name}</p>
                      <p className="text-xs text-gray-400">Qtd: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-600">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                {order.drinkItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-700">🥤 {item.name}</p>
                      <p className="text-xs text-gray-400">Qtd: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-600">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 space-y-1">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>R$ {order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>🚚 Entrega</span>
                  <span>R$ {order.deliveryFee.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>🎟️ Desconto</span>
                    <span>- R$ {order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg text-gray-800 pt-2">
                  <span>Total</span>
                  <span className="text-orange-600">R$ {order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
              <div className="flex items-center gap-2">
                <span className="text-xl">💵</span>
                <div>
                  <p className="font-semibold text-green-700">Pagamento em dinheiro na entrega</p>
                  <p className="text-sm text-green-600">
                    Valor: R$ {order.cashPaid.toFixed(2)} | Troco: R$ {order.change.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No orders at all */}
        {!order && !searchId && orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <span className="text-5xl block mb-4">🍕</span>
            <h3 className="text-lg font-bold text-gray-700">Nenhum pedido ainda</h3>
            <p className="text-gray-500 text-sm mt-2">
              Faça seu primeiro pedido e acompanhe aqui!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
