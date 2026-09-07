import { useState } from 'react';
import { pizzas, sizes, Pizza } from '../data/menu';
import { useOrders, PizzaItem } from '../context/OrderContext';

type Size = 'P' | 'M' | 'G';

interface CartItem {
  pizza: Pizza;
  size: Size;
  quantity: number;
}

export default function CustomerPage() {
  const { addOrder } = useOrders();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'tradicional' | 'especial' | 'doce'>('tradicional');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [cashPaid, setCashPaid] = useState('');

  const filteredPizzas = pizzas.filter((p) => p.category === selectedCategory);

  const addToCart = (pizza: Pizza, size: Size) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.pizza.id === pizza.id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item.pizza.id === pizza.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { pizza, size, quantity: 1 }];
    });
  };

  const removeFromCart = (pizzaId: string, size: Size) => {
    setCart((prev) => prev.filter((item) => !(item.pizza.id === pizzaId && item.size === size)));
  };

  const updateQuantity = (pizzaId: string, size: Size, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.pizza.id === pizzaId && item.size === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.pizza.prices[item.size] * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleSubmitOrder = () => {
    if (!customerName || !customerPhone || !address || !cashPaid) return;

    const total = getTotal();
    const paid = parseFloat(cashPaid);
    if (paid < total) {
      alert('Valor insuficiente! O total é R$ ' + total.toFixed(2));
      return;
    }

    const items: PizzaItem[] = cart.map((item) => ({
      id: `${item.pizza.id}-${item.size}`,
      name: `${item.pizza.name} (${item.size})`,
      size: item.size,
      price: item.pizza.prices[item.size],
      quantity: item.quantity,
    }));

    addOrder({
      customerName,
      customerPhone,
      address,
      items,
      total,
      cashPaid: paid,
      change: paid - total,
      notes,
    });

    setOrderId(`PED-${Date.now().toString(36).toUpperCase()}`);
    setOrderSuccess(true);
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setAddress('');
    setNotes('');
    setCashPaid('');
    setShowCheckout(false);
    setShowCart(false);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido Realizado!</h2>
          <p className="text-gray-600 mb-4">Seu pedido foi enviado para a cozinha.</p>
          <div className="bg-orange-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500">Número do pedido</p>
            <p className="text-xl font-bold text-orange-600">{orderId}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            💰 Pagamento em dinheiro na entrega
          </p>
          <button
            onClick={() => setOrderSuccess(false)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Fazer Novo Pedido
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🍕</span>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Pizzaria Bella Massa</h1>
              <p className="text-xs text-gray-500">Pagamento somente em dinheiro 💵</p>
            </div>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="relative bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2"
          >
            <span>🛒</span>
            <span>Carrinho</span>
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['tradicional', 'especial', 'doce'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                  : 'bg-white text-gray-600 hover:bg-orange-100'
              }`}
            >
              {cat === 'tradicional' && '🍕 '}
              {cat === 'especial' && '⭐ '}
              {cat === 'doce' && '🍫 '}
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Pizza Grid */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPizzas.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} onAdd={addToCart} />
          ))}
        </div>
      </div>

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)} />
          <div className="relative ml-auto w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">🛒 Seu Pedido</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <div className="text-5xl mb-4">🍕</div>
                <p>Seu carrinho está vazio</p>
                <p className="text-sm">Adicione pizzas deliciosas!</p>
              </div>
            ) : (
              <>
                <div className="p-4 space-y-3">
                  {cart.map((item) => (
                    <div key={`${item.pizza.id}-${item.size}`} className="bg-gray-50 rounded-xl p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.pizza.emoji} {item.pizza.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Tamanho {item.size} - {sizes[item.size].label}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.pizza.id, item.size)}
                          className="text-red-400 hover:text-red-600 text-sm"
                        >
                          Remover
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.pizza.id, item.size, -1)}
                            className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold hover:bg-orange-200 transition-colors"
                          >
                            -
                          </button>
                          <span className="font-bold text-gray-700 w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.pizza.id, item.size, 1)}
                            className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold hover:bg-orange-200 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-bold text-orange-600">
                          R$ {(item.pizza.prices[item.size] * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sticky bottom-0 bg-white border-t p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-orange-600">R$ {getTotal().toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowCart(false);
                      setShowCheckout(true);
                    }}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                  >
                    Finalizar Pedido 💰
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCheckout(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Finalizar Pedido</h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="bg-orange-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">💵 Pagamento somente em dinheiro</p>
                <p className="text-2xl font-bold text-orange-600">Total: R$ {getTotal().toFixed(2)}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nome *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Telefone *</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Endereço de entrega *</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua, número, bairro, complemento..."
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Observações</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: sem cebola, ponto da massa..."
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    💵 Valor pago em dinheiro *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                      R$
                    </span>
                    <input
                      type="number"
                      value={cashPaid}
                      onChange={(e) => setCashPaid(e.target.value)}
                      placeholder="0.00"
                      min={getTotal()}
                      step="0.01"
                      className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                    />
                  </div>
                  {cashPaid && parseFloat(cashPaid) >= getTotal() && (
                    <p className="text-sm text-green-600 mt-1">
                      Troco: R$ {(parseFloat(cashPaid) - getTotal()).toFixed(2)}
                    </p>
                  )}
                  {cashPaid && parseFloat(cashPaid) < getTotal() && (
                    <p className="text-sm text-red-500 mt-1">
                      Valor insuficiente! Total: R$ {getTotal().toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={!customerName || !customerPhone || !address || !cashPaid || parseFloat(cashPaid) < getTotal()}
                className="w-full mt-6 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg"
              >
                Confirmar Pedido ✅
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PizzaCard({
  pizza,
  onAdd,
}: {
  pizza: Pizza;
  onAdd: (pizza: Pizza, size: Size) => void;
}) {
  const [selectedSize, setSelectedSize] = useState<Size>('M');

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-2xl mr-2">{pizza.emoji}</span>
          <span className="font-bold text-gray-800">{pizza.name}</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-1">{pizza.description}</p>
      <p className="text-xs text-gray-400 mb-3">{pizza.ingredients}</p>

      {/* Size selector */}
      <div className="flex gap-1 mb-3">
        {(['P', 'M', 'G'] as Size[]).map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              selectedSize === size
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-orange-600">
          R$ {pizza.prices[selectedSize].toFixed(2)}
        </span>
        <button
          onClick={() => onAdd(pizza, selectedSize)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors text-sm"
        >
          + Adicionar
        </button>
      </div>
    </div>
  );
}
