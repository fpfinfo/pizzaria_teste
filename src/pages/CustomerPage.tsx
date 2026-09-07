import { useState } from 'react';
import { sizes, deliveryFee, coupons } from '../data/menu';
import { useOrders } from '../context/OrderContext';
import { useMenu } from '../context/MenuContext';

type Size = 'P' | 'M' | 'G';
type Tab = 'pizzas' | 'bebidas';

interface CartPizzaItem {
  type: 'pizza';
  pizza: { id: string; name: string; emoji: string; prices: { P: number; M: number; G: number } };
  size: Size;
  quantity: number;
  crust: { id: string; name: string; price: number } | null;
}

interface CartDrinkItem {
  type: 'drink';
  drink: { id: string; name: string; emoji: string; price: number };
  quantity: number;
}

type CartItem = CartPizzaItem | CartDrinkItem;

export default function CustomerPage() {
  const { addOrder } = useOrders();
  const { pizzas, drinks, crusts, decrementDrinkStock } = useMenu();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('pizzas');
  const [selectedCategory, setSelectedCategory] = useState<'tradicional' | 'especial' | 'doce'>('tradicional');
  const [drinkCategory, setDrinkCategory] = useState<'refrigerante' | 'suco' | 'agua' | 'outros'>('refrigerante');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Pizza selection modal
  const [selectedPizza, setSelectedPizza] = useState<typeof pizzas[0] | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size>('M');
  const [selectedCrust, setSelectedCrust] = useState<typeof crusts[0] | null>(null);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [cashPaid, setCashPaid] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const filteredPizzas = pizzas.filter((p) => p.category === selectedCategory && p.available);
  const filteredDrinks = drinks.filter((d) => d.category === drinkCategory && d.available);
  const availableCrusts = crusts.filter((c) => c.available);

  const addToCart = () => {
    if (!selectedPizza) return;
    const existing = cart.find(
      (item) =>
        item.type === 'pizza' &&
        item.pizza.id === selectedPizza.id &&
        item.size === selectedSize &&
        item.crust?.id === selectedCrust?.id
    ) as CartPizzaItem | undefined;

    if (existing) {
      setCart((prev) =>
        prev.map((item) =>
          item.type === 'pizza' &&
          item.pizza.id === selectedPizza.id &&
          item.size === selectedSize &&
          item.crust?.id === selectedCrust?.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          type: 'pizza' as const,
          pizza: { id: selectedPizza.id, name: selectedPizza.name, emoji: selectedPizza.emoji, prices: selectedPizza.prices },
          size: selectedSize,
          quantity: 1,
          crust: selectedCrust && selectedCrust.price > 0 ? { id: selectedCrust.id, name: selectedCrust.name, price: selectedCrust.price } : null,
        },
      ]);
    }
    setSelectedPizza(null);
    setSelectedSize('M');
    setSelectedCrust(null);
  };

  const addDrinkToCart = (drink: { id: string; name: string; emoji: string; price: number }) => {
    const existing = cart.find(
      (item) => item.type === 'drink' && item.drink.id === drink.id
    ) as CartDrinkItem | undefined;

    if (existing) {
      setCart((prev) =>
        prev.map((item) =>
          item.type === 'drink' && item.drink.id === drink.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart((prev) => [...prev, { type: 'drink' as const, drink, quantity: 1 }]);
    }
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item, i) => {
          if (i === index) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const getItemPrice = (item: CartItem) => {
    if (item.type === 'pizza') {
      const base = item.pizza.prices[item.size];
      const crust = item.crust?.price || 0;
      return (base + crust) * item.quantity;
    }
    return item.drink.price * item.quantity;
  };

  const getSubtotal = () => cart.reduce((sum, item) => sum + getItemPrice(item), 0);

  const getDiscount = () => {
    if (!appliedCoupon) return 0;
    return (getSubtotal() * appliedCoupon.discount) / 100;
  };

  const getTotal = () => getSubtotal() + deliveryFee - getDiscount();

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = () => {
    const code = couponInput.toUpperCase();
    if (coupons[code]) {
      setAppliedCoupon({ code, discount: coupons[code] });
      setCouponError('');
    } else {
      setCouponError('Cupom inválido');
      setAppliedCoupon(null);
    }
  };

  const handleSubmitOrder = () => {
    if (!customerName || !customerPhone || !address || !cashPaid) return;

    const total = getTotal();
    const paid = parseFloat(cashPaid);
    if (paid < total) {
      alert('Valor insuficiente! O total é R$ ' + total.toFixed(2));
      return;
    }

    const pizzaItems = cart
      .filter((item): item is CartPizzaItem => item.type === 'pizza')
      .map((item) => ({
        id: `${item.pizza.id}-${item.size}`,
        name: `${item.pizza.name} (${item.size})${item.crust ? ` + ${item.crust.name}` : ''}`,
        size: item.size,
        price: item.pizza.prices[item.size] + (item.crust?.price || 0),
        quantity: item.quantity,
        crust: item.crust?.name,
        crustPrice: item.crust?.price,
      }));

    const drinkItems = cart
      .filter((item): item is CartDrinkItem => item.type === 'drink')
      .map((item) => ({
        id: item.drink.id,
        name: item.drink.name,
        price: item.drink.price,
        quantity: item.quantity,
      }));

    const id = addOrder({
      customerName,
      customerPhone,
      address,
      pizzaItems,
      drinkItems,
      subtotal: getSubtotal(),
      deliveryFee,
      discount: getDiscount(),
      total,
      cashPaid: paid,
      change: paid - total,
      notes,
      couponCode: appliedCoupon?.code,
    });

    // Decrementa estoque das bebidas
    cart
      .filter((item): item is CartDrinkItem => item.type === 'drink')
      .forEach((item) => {
        decrementDrinkStock(item.drink.id, item.quantity);
      });

    setOrderId(id);
    setOrderSuccess(true);
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setAddress('');
    setNotes('');
    setCashPaid('');
    setCouponInput('');
    setAppliedCoupon(null);
    setShowCheckout(false);
    setShowCart(false);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center animate-fade-in">
          <div className="text-6xl mb-4 animate-bounce-slow">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido Realizado!</h2>
          <p className="text-gray-600 mb-4">Seu pedido foi enviado para a cozinha.</p>
          <div className="bg-orange-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-500">Número do pedido</p>
            <p className="text-xl font-bold text-orange-600">{orderId}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500">Tempo estimado</p>
            <p className="text-lg font-bold text-blue-600">🕐 30-45 minutos</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">💰 Pagamento em dinheiro na entrega</p>
          <div className="flex gap-3">
            <a
              href={`/rastrear/${orderId}`}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-colors text-center text-sm"
            >
              📍 Rastrear
            </a>
            <button
              onClick={() => setOrderSuccess(false)}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm"
            >
              Novo Pedido
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🍕</span>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Pizzaria Bella Massa</h1>
              <p className="text-xs text-gray-500">💵 Pagamento somente em dinheiro</p>
            </div>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="relative bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2"
          >
            <span>🛒</span>
            <span className="hidden sm:inline">Carrinho</span>
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold animate-bounce-slow">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Tabs */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="flex gap-2 bg-white rounded-2xl p-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab('pizzas')}
            className={`flex-1 py-2.5 rounded-xl font-semibold transition-all ${
              activeTab === 'pizzas'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-orange-50'
            }`}
          >
            🍕 Pizzas
          </button>
          <button
            onClick={() => setActiveTab('bebidas')}
            className={`flex-1 py-2.5 rounded-xl font-semibold transition-all ${
              activeTab === 'bebidas'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-orange-50'
            }`}
          >
            🥤 Bebidas
          </button>
        </div>
      </div>

      {/* Pizza Content */}
      {activeTab === 'pizzas' && (
        <>
          <div className="max-w-6xl mx-auto px-4 pt-4">
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

          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPizzas.map((pizza) => (
                <div
                  key={pizza.id}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-orange-200 cursor-pointer"
                  onClick={() => setSelectedPizza(pizza)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{pizza.emoji}</span>
                        <h3 className="font-bold text-gray-800">{pizza.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{pizza.description}</p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{pizza.ingredients}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-2">
                      {(['P', 'M', 'G'] as Size[]).map((s) => (
                        <span key={s} className="text-xs text-gray-500">
                          {s}: <span className="font-semibold text-orange-600">R${pizza.prices[s]}</span>
                        </span>
                      ))}
                    </div>
                    <button className="bg-orange-100 hover:bg-orange-200 text-orange-600 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                      + Adicionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {filteredPizzas.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <div className="text-5xl mb-3">🍕</div>
                <p>Nenhuma pizza disponível nesta categoria</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Drinks Content */}
      {activeTab === 'bebidas' && (
        <>
          <div className="max-w-6xl mx-auto px-4 pt-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(['refrigerante', 'suco', 'agua', 'outros'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setDrinkCategory(cat)}
                  className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                    drinkCategory === cat
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                      : 'bg-white text-gray-600 hover:bg-orange-100'
                  }`}
                >
                  {cat === 'refrigerante' && '🥤 '}
                  {cat === 'suco' && '🍊 '}
                  {cat === 'agua' && '💧 '}
                  {cat === 'outros' && '🍺 '}
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredDrinks.map((drink) => {
                const isOutOfStock = drink.stock === 0;
                return (
                  <div
                    key={drink.id}
                    className={`bg-white rounded-2xl p-4 shadow-sm transition-all border text-center relative ${
                      isOutOfStock ? 'border-gray-200 opacity-60' : 'border-gray-100 hover:border-orange-200 hover:shadow-lg'
                    }`}
                  >
                    {isOutOfStock && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        ESGOTADO
                      </div>
                    )}
                    {!isOutOfStock && drink.stock <= 5 && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        Últimas {drink.stock}
                      </div>
                    )}
                    <span className="text-4xl">{drink.emoji}</span>
                    <h3 className="font-bold text-gray-800 mt-2 text-sm">{drink.name}</h3>
                    <p className="font-bold text-orange-600 mt-2">R$ {drink.price.toFixed(2)}</p>
                    <button
                      onClick={() => addDrinkToCart(drink)}
                      disabled={isOutOfStock}
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
              })}
            </div>
            {filteredDrinks.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <div className="text-5xl mb-3">🥤</div>
                <p>Nenhuma bebida disponível</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Pizza Selection Modal */}
      {selectedPizza && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedPizza(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedPizza.emoji} {selectedPizza.name}
                </h2>
                <button onClick={() => setSelectedPizza(null)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
              </div>

              <p className="text-sm text-gray-500 mb-4">{selectedPizza.ingredients}</p>

              {/* Size Selection */}
              <div className="mb-4">
                <p className="font-semibold text-gray-700 mb-2">📏 Tamanho</p>
                <div className="grid grid-cols-3 gap-2">
                  {(['P', 'M', 'G'] as Size[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        selectedSize === s
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <p className="font-bold text-gray-800">{s}</p>
                      <p className="text-xs text-gray-500">{sizes[s].diameter}</p>
                      <p className="text-sm font-bold text-orange-600 mt-1">R${selectedPizza.prices[s]}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Crust Selection */}
              <div className="mb-6">
                <p className="font-semibold text-gray-700 mb-2">🧀 Borda</p>
                <div className="space-y-2">
                  {availableCrusts.map((crust) => (
                    <button
                      key={crust.id}
                      onClick={() => setSelectedCrust(crust)}
                      className={`w-full p-3 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                        selectedCrust?.id === crust.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <span className="font-medium text-gray-700">
                        {crust.emoji} {crust.name}
                      </span>
                      <span className="font-bold text-orange-600">
                        {crust.price > 0 ? `+R$${crust.price}` : 'Grátis'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={addToCart}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)} />
          <div className="relative ml-auto w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-800">🛒 Seu Pedido</h2>
              <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>

            {cart.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <div className="text-5xl mb-4">🍕</div>
                <p>Seu carrinho está vazio</p>
                <p className="text-sm">Adicione pizzas e bebidas!</p>
              </div>
            ) : (
              <>
                <div className="p-4 space-y-3">
                  {cart.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {item.type === 'pizza' ? (
                            <>
                              <p className="font-semibold text-gray-800">
                                {item.pizza.emoji} {item.pizza.name} ({item.size})
                              </p>
                              {item.crust && (
                                <p className="text-xs text-orange-600">+ {item.crust.name} (R${item.crust.price.toFixed(2)})</p>
                              )}
                              <p className="text-sm text-gray-500">Tamanho {sizes[item.size].label}</p>
                            </>
                          ) : (
                            <>
                              <p className="font-semibold text-gray-800">
                                {item.drink.emoji} {item.drink.name}
                              </p>
                            </>
                          )}
                        </div>
                        <button onClick={() => removeFromCart(index)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(index, -1)}
                            className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold hover:bg-orange-200 transition-colors"
                          >-</button>
                          <span className="font-bold text-gray-700 w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(index, 1)}
                            className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold hover:bg-orange-200 transition-colors"
                          >+</button>
                        </div>
                        <p className="font-bold text-orange-600">R$ {getItemPrice(item).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sticky bottom-0 bg-white border-t p-4">
                  <div className="space-y-1 mb-3 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>R$ {getSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Taxa de entrega</span>
                      <span>R$ {deliveryFee.toFixed(2)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto ({appliedCoupon.code})</span>
                        <span>-R$ {getDiscount().toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center mb-4 pt-2 border-t">
                    <span className="text-lg font-bold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-orange-600">R$ {getTotal().toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => { setShowCart(false); setShowCheckout(true); }}
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
                <button onClick={() => setShowCheckout(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Telefone *</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Endereço *</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    placeholder="Rua, número, bairro"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Observações</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none"
                    rows={2}
                    placeholder="Ex: sem cebola, ponto bem assado..."
                  />
                </div>

                {/* Coupon */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">🎟️ Cupom de desconto</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all uppercase"
                      placeholder="Código do cupom"
                    />
                    <button
                      onClick={applyCoupon}
                      className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-3 rounded-xl font-semibold transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                  {appliedCoupon && (
                    <p className="text-green-600 text-xs mt-1">✅ {appliedCoupon.code} - {appliedCoupon.discount}% de desconto</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Teste: BEMVINDO, PROMO15, VIP20</p>
                </div>

                {/* Cash Payment */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">💵 Valor em dinheiro *</label>
                  <input
                    type="number"
                    value={cashPaid}
                    onChange={(e) => setCashPaid(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                  {cashPaid && parseFloat(cashPaid) >= getTotal() && (
                    <p className="text-green-600 text-sm mt-1">
                      Troco: R$ {(parseFloat(cashPaid) - getTotal()).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleSubmitOrder}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors mt-6 text-lg"
              >
                ✅ Confirmar Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button (Mobile) */}
      {getTotalItems() > 0 && !showCart && !showCheckout && (
        <div className="fixed bottom-4 left-4 right-4 z-30 md:hidden">
          <button
            onClick={() => setShowCart(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-xl flex items-center justify-between px-6 transition-colors"
          >
            <span>🛒 Ver Carrinho ({getTotalItems()})</span>
            <span>R$ {getTotal().toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
