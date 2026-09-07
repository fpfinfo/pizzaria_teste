import { useState, useMemo } from 'react';
import { useOrders } from '../context/OrderContext';
import { Link } from 'react-router-dom';

type Period = 'today' | '7days' | '30days' | 'all' | 'custom';

export default function ReportsPage() {
  const { orders } = useOrders();
  const [period, setPeriod] = useState<Period>('today');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const filteredOrders = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);

      switch (period) {
        case 'today':
          return orderDate >= today;
        case '7days': {
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return orderDate >= sevenDaysAgo;
        }
        case '30days': {
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return orderDate >= thirtyDaysAgo;
        }
        case 'custom':
          if (!customStart || !customEnd) return true;
          const start = new Date(customStart);
          const end = new Date(customEnd);
          end.setHours(23, 59, 59, 999);
          return orderDate >= start && orderDate <= end;
        case 'all':
        default:
          return true;
      }
    });
  }, [orders, period, customStart, customEnd]);

  // KPIs
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalCashReceived = filteredOrders.reduce((sum, o) => sum + o.cashPaid, 0);
  const totalChange = filteredOrders.reduce((sum, o) => sum + o.change, 0);
  const totalOrders = filteredOrders.length;
  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalDiscount = filteredOrders.reduce((sum, o) => sum + o.discount, 0);
  const totalDeliveryFees = filteredOrders.reduce((sum, o) => sum + o.deliveryFee, 0);

  // Top pizzas
  const pizzaSales = useMemo(() => {
    const map = new Map<string, { name: string; quantity: number; revenue: number }>();
    filteredOrders.forEach((order) => {
      order.pizzaItems.forEach((item) => {
        const existing = map.get(item.id) || { name: item.name, quantity: 0, revenue: 0 };
        existing.quantity += item.quantity;
        existing.revenue += item.price * item.quantity;
        map.set(item.id, existing);
      });
    });
    return Array.from(map.values()).sort((a, b) => b.quantity - a.quantity);
  }, [filteredOrders]);

  // Top drinks
  const drinkSales = useMemo(() => {
    const map = new Map<string, { name: string; quantity: number; revenue: number }>();
    filteredOrders.forEach((order) => {
      order.drinkItems.forEach((item) => {
        const existing = map.get(item.id) || { name: item.name, quantity: 0, revenue: 0 };
        existing.quantity += item.quantity;
        existing.revenue += item.price * item.quantity;
        map.set(item.id, existing);
      });
    });
    return Array.from(map.values()).sort((a, b) => b.quantity - a.quantity);
  }, [filteredOrders]);

  // Sales by day (last 7 or 30 days)
  const dailySales = useMemo(() => {
    const days = period === '7days' ? 7 : period === '30days' ? 30 : 7;
    const now = new Date();
    const result: { date: string; label: string; revenue: number; orders: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayOrders = filteredOrders.filter((o) => o.createdAt.startsWith(dateStr));
      result.push({
        date: dateStr,
        label: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
        orders: dayOrders.length,
      });
    }
    return result;
  }, [filteredOrders, period]);

  const maxDailyRevenue = Math.max(...dailySales.map((d) => d.revenue), 1);

  // Status breakdown
  const statusBreakdown = {
    novo: filteredOrders.filter((o) => o.status === 'novo').length,
    preparando: filteredOrders.filter((o) => o.status === 'preparando').length,
    pronto: filteredOrders.filter((o) => o.status === 'pronto').length,
    entregue: filteredOrders.filter((o) => o.status === 'entregue').length,
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ['ID', 'Data', 'Cliente', 'Telefone', 'Endereço', 'Total', 'Pago', 'Troco', 'Status', 'Itens'];
    const rows = filteredOrders.map((o) => [
      o.id,
      new Date(o.createdAt).toLocaleString('pt-BR'),
      o.customerName,
      o.customerPhone,
      o.address,
      o.total.toFixed(2),
      o.cashPaid.toFixed(2),
      o.change.toFixed(2),
      o.status,
      [...o.pizzaItems.map((i) => `${i.quantity}x ${i.name}`), ...o.drinkItems.map((i) => `${i.quantity}x ${i.name}`)].join('; '),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-vendas-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gray-400 hover:text-gray-600 text-2xl">←</Link>
            <div>
              <h1 className="text-xl font-bold text-gray-800">📊 Relatórios de Vendas</h1>
              <p className="text-xs text-gray-500">Pizzaria Bella Massa</p>
            </div>
          </div>
          <button
            onClick={exportCSV}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors text-sm flex items-center gap-2"
          >
            📥 Exportar CSV
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Period Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-semibold text-gray-600 mr-2">Período:</span>
            {([
              { key: 'today', label: '📅 Hoje' },
              { key: '7days', label: '📆 7 dias' },
              { key: '30days', label: '🗓️ 30 dias' },
              { key: 'all', label: '📋 Tudo' },
              { key: 'custom', label: '🔧 Personalizado' },
            ] as const).map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  period === p.key
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          {period === 'custom' && (
            <div className="flex gap-3 mt-3 flex-wrap">
              <div>
                <label className="text-xs text-gray-500">De:</label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="block px-3 py-2 rounded-lg border border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Até:</label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="block px-3 py-2 rounded-lg border border-gray-200 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <KPICard icon="💰" label="Receita Total" value={`R$ ${totalRevenue.toFixed(2)}`} color="green" />
          <KPICard icon="🧾" label="Total Pedidos" value={totalOrders.toString()} color="blue" />
          <KPICard icon="📊" label="Ticket Médio" value={`R$ ${avgTicket.toFixed(2)}`} color="purple" />
          <KPICard icon="💵" label="Dinheiro Recebido" value={`R$ ${totalCashReceived.toFixed(2)}`} color="orange" />
          <KPICard icon="🔄" label="Troco Devolvido" value={`R$ ${totalChange.toFixed(2)}`} color="yellow" />
          <KPICard icon="🎟️" label="Descontos" value={`R$ ${totalDiscount.toFixed(2)}`} color="red" />
        </div>

        {/* Daily Sales Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📈 Vendas por Dia</h2>
          {dailySales.length === 0 || dailySales.every((d) => d.revenue === 0) ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-5xl mb-3">📊</div>
              <p>Nenhuma venda no período selecionado</p>
            </div>
          ) : (
            <div className="space-y-2">
              {dailySales.map((day) => (
                <div key={day.date} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-12 text-right font-mono">{day.label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                      style={{ width: `${(day.revenue / maxDailyRevenue) * 100}%`, minWidth: day.revenue > 0 ? '3rem' : '0' }}
                    >
                      {day.revenue > 0 && (
                        <span className="text-white text-xs font-bold">R$ {day.revenue.toFixed(0)}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 w-16 text-right">{day.orders} ped.</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pizzas */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">🍕 Pizzas Mais Vendidas</h2>
            {pizzaSales.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-5xl mb-3">🍕</div>
                <p>Nenhuma pizza vendida no período</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pizzaSales.slice(0, 8).map((pizza, idx) => {
                  const maxQty = pizzaSales[0].quantity;
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-400 w-5">#{idx + 1}</span>
                          <span className="text-sm font-semibold text-gray-800">{pizza.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-orange-600">{pizza.quantity}x</span>
                          <span className="text-xs text-gray-500 ml-2">R$ {pizza.revenue.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500"
                          style={{ width: `${(pizza.quantity / maxQty) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top Drinks */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">🥤 Bebidas Mais Vendidas</h2>
            {drinkSales.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-5xl mb-3">🥤</div>
                <p>Nenhuma bebida vendida no período</p>
              </div>
            ) : (
              <div className="space-y-3">
                {drinkSales.slice(0, 8).map((drink, idx) => {
                  const maxQty = drinkSales[0].quantity;
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-400 w-5">#{idx + 1}</span>
                          <span className="text-sm font-semibold text-gray-800">{drink.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-blue-600">{drink.quantity}x</span>
                          <span className="text-xs text-gray-500 ml-2">R$ {drink.revenue.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${(drink.quantity / maxQty) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Status Breakdown & Financial Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Status dos Pedidos</h2>
            <div className="grid grid-cols-2 gap-3">
              <StatusCard label="Novos" count={statusBreakdown.novo} color="yellow" icon="🆕" />
              <StatusCard label="Preparando" count={statusBreakdown.preparando} color="blue" icon="🔥" />
              <StatusCard label="Prontos" count={statusBreakdown.pronto} color="green" icon="✅" />
              <StatusCard label="Entregues" count={statusBreakdown.entregue} color="gray" icon="📦" />
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">💰 Resumo Financeiro</h2>
            <div className="space-y-3">
              <FinancialRow label="Vendas (produtos)" value={totalRevenue - totalDeliveryFees} />
              <FinancialRow label="Taxa de entrega" value={totalDeliveryFees} />
              <FinancialRow label="Descontos aplicados" value={-totalDiscount} negative />
              <div className="border-t pt-3 mt-3">
                <FinancialRow label="TOTAL RECEBIDO" value={totalCashReceived} bold />
              </div>
              <FinancialRow label="Troco devolvido" value={-totalChange} negative />
              <div className="border-t pt-3 mt-3 bg-green-50 -mx-2 px-2 py-2 rounded-lg">
                <FinancialRow label="RECEITA LÍQUIDA" value={totalRevenue} bold highlight />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🧾 Últimos Pedidos ({filteredOrders.length})</h2>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-5xl mb-3">📭</div>
              <p>Nenhum pedido no período</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-600">ID</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-600">Data</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-600">Cliente</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-600">Itens</th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-600">Total</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.slice(0, 20).map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 font-mono text-xs text-gray-600">{order.id}</td>
                      <td className="py-2 px-2 text-gray-600">
                        {new Date(order.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-2 px-2 font-medium text-gray-800">{order.customerName}</td>
                      <td className="py-2 px-2 text-gray-600">
                        {order.pizzaItems.length + order.drinkItems.length} item(s)
                      </td>
                      <td className="py-2 px-2 text-right font-bold text-green-600">R$ {order.total.toFixed(2)}</td>
                      <td className="py-2 px-2 text-center">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length > 20 && (
                <p className="text-center text-sm text-gray-400 mt-3">
                  Mostrando 20 de {filteredOrders.length} pedidos
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    green: 'from-green-50 to-green-100 border-green-200 text-green-700',
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-700',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-700',
    orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-700',
    yellow: 'from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700',
    red: 'from-red-50 to-red-100 border-red-200 text-red-700',
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-4`}>
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-xs text-gray-600 font-medium">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function StatusCard({ label, count, color, icon }: { label: string; count: number; color: string; icon: string }) {
  const colors: Record<string, string> = {
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  return (
    <div className={`border rounded-xl p-4 ${colors[color]}`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-2xl font-bold">{count}</span>
      </div>
      <p className="text-sm font-semibold mt-1">{label}</p>
    </div>
  );
}

function FinancialRow({ label, value, bold, negative, highlight }: { label: string; value: number; bold?: boolean; negative?: boolean; highlight?: boolean }) {
  const isNeg = value < 0;
  return (
    <div className={`flex justify-between items-center ${bold ? 'text-base' : 'text-sm'} ${highlight ? 'font-bold text-green-700' : ''}`}>
      <span className={bold ? 'font-bold text-gray-800' : 'text-gray-600'}>{label}</span>
      <span className={`font-bold ${highlight ? 'text-green-700' : isNeg || negative ? 'text-red-600' : 'text-gray-800'}`}>
        {isNeg ? '- ' : ''}R$ {Math.abs(value).toFixed(2)}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string }> = {
    novo: { label: 'Novo', color: 'bg-yellow-100 text-yellow-700' },
    preparando: { label: 'Preparando', color: 'bg-blue-100 text-blue-700' },
    pronto: { label: 'Pronto', color: 'bg-green-100 text-green-700' },
    entregue: { label: 'Entregue', color: 'bg-gray-100 text-gray-700' },
  };
  const c = config[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.color}`}>{c.label}</span>;
}
