import { useState } from 'react';
import { pizzas, drinks, crusts, sizes, deliveryFee, coupons, Pizza, Drink } from '../data/menu';
import { useOrders, PizzaItem, DrinkItem } from '../context/OrderContext';

type Size = 'P' | 'M' | 'G';
type Tab = 'pizzas' | 'bebidas';

interface CartPizzaItem {
  type: 'pizza';
  pizza: Pizza;
  size: Size;
  crust: string;
  crustPrice: number;
  quantity: number;
}

interface CartDrinkItem {
  type: 'drink';
  drink: Drink;
  quantity: number;
}

type CartItem = CartPizzaItem | CartDrinkItem;

export default function CustomerPage() {
  const { addOrder } = useOrders();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('pizzas');
  const [selectedCategory, setSelectedCategory] = useState<'tradicional' | 'especial' | 'doce'>('tradicional');
  const [drinkCategory, setDrinkCategory] = useState<'refrigerante' | 'suco' | 'agua'>('refrigerante');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size>('M');
  const [selectedCrust, setSelectedCrust] = useState('normal');

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [cashPaid, setCashPaid] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const filteredPizzas = pizzas.filter((p) => p.category === selectedCategory);
  const filteredDrinks = drinks.filter((d) => d.category === drinkCategory);

  const getCrustPrice = () => {
    const crust = crusts.find((c) => c.id === selectedCrust);
    return crust ? crust.price : 0;
  };

  const addPizzaToCart = () => {
    if (!selectedPizza) return;
    const crustPrice = getCrustPrice();
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.type === 'pizza' &&
          item.pizza.id === selectedPizza.id &&
          item.size === selectedSize &&
          item.crust === selectedCrust
      );
      if (existing) {
        return prev.map((item) =>
          item.type === 'pizza' &&
          item.pizza.id === selectedPizza.id &&
          item.size === selectedSize &&
          item.crust === selectedCrust
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          type: 'pizza' as const,
          pizza: selectedPizza,
          size: selectedSize,
          crust: selectedCrust,
          crustPrice,
          quantity: 1,
        },
      ];
    });
    setSelectedPizza(null);
  };

  const addDrinkToCart = (drink: Drink) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.type === 'drink' && item.drink.id === drink.id
      );
      if (existing) {
        return prev.map((item) =>
          item.type === 'drink' && item.drink.id === drink.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { type: 'drink' as const, drink, quantity: 1 }];
    });
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

  const getSubtotal = () => {
    return cart.reduce((sum, item) => {
      if (item.type === 'pizza') {
        return sum + (item.pizza.prices[item.size] + item.crustPrice) * item.quantity;
      }
      return sum + item.drink.price * item.quantity;
    }, 0);
  };

  const getDiscount = () => {
    if (!appliedCoupon) return 0;
    return (getSubtotal() * appliedCoupon.discount) / 100;
  };

  const getTotal = () => {
    return getSubtotal() + deliveryFee - getDiscount();
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const applyCoupon = () => {
    const coupon = coupons.find((c) => c.code === couponInput.toUpperCase());
    if (coupon) {
      setAppliedCoupon({ code: coupon.code, discount: coupon.discount });
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

    const pizzaItems: PizzaItem[] = cart
      .filter((item): item is CartPizzaItem => item.type === 'pizza')
      .map((item) => ({
        id: `${item.pizza.id}-${item.size}-${item.crust}`,
        name: `${item.pizza.name} (${item.size})${item.crust !== 'normal' ? ` + Borda ${crusts.find(c => c.id === item.crust)?.name}` : ''}`,
        size: item.size,
        price: item.pizza.prices[item.size] + item.crustPrice,
        quantity: item.quantity,
        crust: item.crust,
        crustPrice: item.crustPrice,
      }));

    const drinkItems: DrinkItem[] = cart
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
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center animate-bounce-in">
          <div className="text-6xl mb-4 animate-bounce">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido Realizado!</h2>
          <p className="text-gray-600 mb-4">Seu pedido foi enviado para a cozinha.</p>
          <div className="bg-orange-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-500">Número do pedido</p>
            <p className="text-2xl font-bold text-orange-600">{orderId}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-500">⏱️ Tempo estimado</p>
            <p className="text-lg font-bold text-blue-600">40-50 minutos</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 mb-6">
            <p className="text-sm text-gray-600">
              💰 Pagamento: <span className="font-bold">R$ {getTotal().toFixed(2)}</span> em dinheiro na entrega
            </p>
          </div>
          <button
            onClick={() => setOrderSuccess(false)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            Fazer Novo Pedido 🍕
          </button>
        </div>
      </div>
    );
  }

  // Pizza Detail Modal
  if (selectedPizza) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-6 max-w-lg w-full">
          <div className="text-center mb-6">
            <span className="text-6xl">{selectedPizza.emoji}</span>
            <h2 className="text-2xl font-bold text-gray-800 mt-2">{selectedPizza.name}</h2>
            <p className="text-gray-500 text-sm">{selectedPizza.ingredients}</p>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">📏 Escolha o tamanho:</h3>
            <div className="grid grid-cols-3 gap-2">
              {(['P', 'M', 'G'] as Size[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedSize === size
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <p className="font-bold text-lg">{size}</p>
                  <p className="text-xs text-gray-500">{sizes[size].label}</p>
                  <p className="text-xs text-gray-400">{sizes[size].diameter}</p>
                  <p className="font-bold text-orange-600 mt-1">
                    R$ {selectedPizza.prices[size].toFixed(2)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Crust Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">🧀 Borda recheada:</h3>
            <div className="grid grid-cols-2 gap-2">
              {crusts.map((crust) => (
                <button
                  key={crust.id}
                  onClick={() => setSelectedCrust(crust.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    selectedCrust === crust.id
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <span className="text-lg">{crust.emoji}</span>
                  <p className="font-medium text-sm text-gray-700">{crust.name}</p>
                  <p className="text-xs text-orange-600 font-semibold">
                    {crust.price > 0 ? `+ R$ ${crust.price.toFixed(2)}` : 'Grátis'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Total & Add */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total do item:</span>
              <span className="text-xl font-bold text-orange-600">
                R$ {(selectedPizza.prices[selectedSize] + getCrustPrice()).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setSelectedPizza(null)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={addPizzaToCart}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              Adicionar 🛒
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
            className="relative bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg"
          >
            <span>🛒</span>
            <span className="hidden sm:inline">Carrinho</span>
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold animate-pulse">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Tabs */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('pizzas')}
            className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
              activeTab === 'pizzas'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-orange-50'
            }`}
          >
            🍕 Pizzas
          </button>
          <button
            onClick={() => setActiveTab('bebidas')}
            className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
              activeTab === 'bebidas'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-orange-50'
            }`}
          >
            🥤 Bebidas
          </button>
        </div>
      </div>

      {activeTab === 'pizzas' ? (
        <>
          {/* Category Tabs */}
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

          {/* Pizza Grid */}
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPizzas.map((pizza) => (
                <div
                  key={pizza.id}
                  onClick={() => setSelectedPizza(pizza)}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100 hover:border-orange-200 group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-4xl group-hover:scale-110 transition-transform">{pizza.emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{pizza.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{pizza.description}</p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{pizza.ingredients}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-400">A partir de</span>
                      <p className="font-bold text-orange-600">R$ {pizza.prices.P.toFixed(2)}</p>
                    </div>
                    <button className="bg-orange-100 hover:bg-orange-200 text-orange-600 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                      Escolher +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Drinks Tab */
        <>
          <div className="max-w-6xl mx-auto px-4 pt-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(['refrigerante', 'suco', 'agua'] as const).map((cat) => (
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
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredDrinks.map((drink) => (
                <div
                  key={drink.id}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-orange-200 text-center"
                >
                  <span className="text-4xl">{drink.emoji}</span>
                  <h3 className="font-bold text-gray-800 mt-2 text-sm">{drink.name}</h3>
                  <p className="text-xs text-gray-500">{drink.description}</p>
                  <p className="font-bold text-orange-600 mt-2">R$ {drink.price.toFixed(2)}</p>
                  <button
                    onClick={() => addDrinkToCart(drink)}
                    className="mt-2 w-full bg-orange-100 hover:bg-orange-200 text-orange-600 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Adicionar +
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Floating Cart Button */}
      {getTotalItems() > 0 && !showCart && (
        <div className="fixed bottom-4 left-4 right-4 max-w-6xl mx-auto z-30">
          <button
            onClick={() => setShowCart(true)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-6 rounded-2xl shadow-2xl flex items-center justify-between transition-all transform hover:scale-[1.02]"
          >
            <span className="flex items-center gap-2">
              🛒 {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'}
            </span>
            <span className="text-lg">R$ {getTotal().toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className="relative ml-auto w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-800">🛒 Seu Pedido</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <div className="text-5xl mb-4">🍕</div>
                <p className="font-medium">Seu carrinho está vazio</p>
                <p className="text-sm">Adicione pizzas e bebidas deliciosas!</p>
              </div>
            ) : (
              <>
                <div className="p-4 space-y-3">
                  {cart.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          {item.type === 'pizza' ? (
                            <>
                              <p className="font-semibold text-gray-800">
                                {item.pizza.emoji} {item.pizza.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Tamanho {item.size} - {sizes[item.size].label}
                              </p>
                              {item.crust !== 'normal' && (
                                <p className="text-xs text-orange-600">
                                  + Borda {crusts.find(c => c.id === item.crust)?.name}
                                </p>
                              )}
                            </>
                          ) : (
                            <>
                              <p className="font-semibold text-gray-800">
                                {item.drink.emoji} {item.drink.name}
                              </p>
                              <p className="text-sm text-gray-500">{item.drink.description}</p>
                            </>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-red-400 hover:text-red-600 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(index, -1)}
                            className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold hover:bg-orange-200 transition-colors"
                          >
                            -
                          </button>
                          <span className="font-bold text-gray-700 w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(index, 1)}
                            className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold hover:bg-orange-200 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-bold text-orange-600">
                          R$ {item.type === 'pizza'
                            ? ((item.pizza.prices[item.size] + item.crustPrice) * item.quantity).toFixed(2)
                            : (item.drink.price * item.quantity).toFixed(2)
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="px-4 pb-4">
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>R$ {getSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>🚚 Taxa de entrega</span>
                      <span>R$ {deliveryFee.toFixed(2)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>🎟️ Cupom {appliedCoupon.code} (-{appliedCoupon.discount}%)</span>
                        <span>- R$ {getDiscount().toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Total:</span>
                      <span className="text-2xl font-bold text-orange-600">R$ {getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white border-t p-4 space-y-3">
                  <button
                    onClick={() => {
                      setShowCart(false);
                      setShowCheckout(true);
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCheckout(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">📋 Finalizar Pedido</h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    👤 Nome completo
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    📱 Telefone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    📍 Endereço de entrega
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-none"
                    rows={2}
                    placeholder="Rua, número, bairro, complemento..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    📝 Observações (opcional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                    placeholder="Ex: sem cebola, portão azul..."
                  />
                </div>

                {/* Coupon */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    🎟️ Cupom de desconto
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all uppercase"
                      placeholder="Digite o cupom"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-3 bg-orange-100 hover:bg-orange-200 text-orange-600 font-semibold rounded-xl transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                  {appliedCoupon && (
                    <p className="text-sm text-green-600 mt-1">✅ {appliedCoupon.code} aplicado! (-{appliedCoupon.discount}%)</p>
                  )}
                  {couponError && (
                    <p className="text-sm text-red-500 mt-1">{couponError}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Teste: BEMVINDO10, PROMO20</p>
                </div>

                {/* Cash Payment */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    💵 Valor em dinheiro que vai pagar
                  </label>
                  <input
                    type="number"
                    value={cashPaid}
                    onChange={(e) => setCashPaid(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                    placeholder="R$ 0,00"
                    min={getTotal()}
                    step="0.01"
                  />
                  {cashPaid && parseFloat(cashPaid) >= getTotal() && (
                    <p className="text-sm text-green-600 mt-1">
                      💰 Troco: R$ {(parseFloat(cashPaid) - getTotal()).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={!customerName || !customerPhone || !address || !cashPaid || parseFloat(cashPaid) < getTotal()}
                className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg disabled:shadow-none disabled:cursor-not-allowed"
              >
                Confirmar Pedido 🍕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
