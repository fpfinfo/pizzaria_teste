import { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import { sizes } from '../data/menu';

type AdminTab = 'pizzas' | 'bebidas' | 'bordas';

export default function AdminPage() {
  const {
    pizzas, drinks, crusts,
    addPizza, updatePizza, removePizza,
    addDrink, updateDrink, removeDrink,
    addCrust, updateCrust, removeCrust,
    resetMenu,
  } = useMenu();

  const [activeTab, setActiveTab] = useState<AdminTab>('pizzas');
  const [editingPizza, setEditingPizza] = useState<string | null>(null);
  const [editingDrink, setEditingDrink] = useState<string | null>(null);
  const [editingCrust, setEditingCrust] = useState<string | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Pizza form state
  const [pizzaForm, setPizzaForm] = useState({
    name: '', description: '', ingredients: '',
    priceP: '', priceM: '', priceG: '',
    category: 'tradicional' as 'tradicional' | 'especial' | 'doce',
    emoji: '🍕', available: true,
  });

  // Drink form state
  const [drinkForm, setDrinkForm] = useState({
    name: '', price: '', emoji: '🥤',
    category: 'refrigerante' as 'refrigerante' | 'suco' | 'agua' | 'outros',
    available: true, stock: '',
  });

  // Crust form state
  const [crustForm, setCrustForm] = useState({
    name: '', price: '', emoji: '🧀', available: true,
  });

  const resetPizzaForm = () => {
    setPizzaForm({ name: '', description: '', ingredients: '', priceP: '', priceM: '', priceG: '', category: 'tradicional', emoji: '🍕', available: true });
    setEditingPizza(null);
  };

  const resetDrinkForm = () => {
    setDrinkForm({ name: '', price: '', emoji: '🥤', category: 'refrigerante', available: true, stock: '' });
    setEditingDrink(null);
  };

  const resetCrustForm = () => {
    setCrustForm({ name: '', price: '', emoji: '🧀', available: true });
    setEditingCrust(null);
  };

  const handlePizzaSubmit = () => {
    if (!pizzaForm.name || !pizzaForm.priceP || !pizzaForm.priceM || !pizzaForm.priceG) return;

    const data = {
      name: pizzaForm.name,
      description: pizzaForm.description,
      ingredients: pizzaForm.ingredients,
      prices: { P: parseFloat(pizzaForm.priceP), M: parseFloat(pizzaForm.priceM), G: parseFloat(pizzaForm.priceG) },
      category: pizzaForm.category,
      emoji: pizzaForm.emoji,
      available: pizzaForm.available,
    };

    if (editingPizza) {
      updatePizza(editingPizza, data);
    } else {
      addPizza(data);
    }
    resetPizzaForm();
  };

  const handleDrinkSubmit = () => {
    if (!drinkForm.name || !drinkForm.price) return;

    const data = {
      name: drinkForm.name,
      price: parseFloat(drinkForm.price),
      emoji: drinkForm.emoji,
      category: drinkForm.category,
      available: drinkForm.available,
      stock: drinkForm.stock ? parseInt(drinkForm.stock) : 0,
    };

    if (editingDrink) {
      updateDrink(editingDrink, data);
    } else {
      addDrink(data);
    }
    resetDrinkForm();
  };

  const handleCrustSubmit = () => {
    if (!crustForm.name || !crustForm.price) return;

    const data = {
      name: crustForm.name,
      price: parseFloat(crustForm.price),
      emoji: crustForm.emoji,
      available: crustForm.available,
    };

    if (editingCrust) {
      updateCrust(editingCrust, data);
    } else {
      addCrust(data);
    }
    resetCrustForm();
  };

  const startEditPizza = (pizza: typeof pizzas[0]) => {
    setPizzaForm({
      name: pizza.name,
      description: pizza.description,
      ingredients: pizza.ingredients,
      priceP: pizza.prices.P.toString(),
      priceM: pizza.prices.M.toString(),
      priceG: pizza.prices.G.toString(),
      category: pizza.category,
      emoji: pizza.emoji,
      available: pizza.available,
    });
    setEditingPizza(pizza.id);
  };

  const startEditDrink = (drink: typeof drinks[0]) => {
    setDrinkForm({
      name: drink.name,
      price: drink.price.toString(),
      emoji: drink.emoji,
      category: drink.category,
      available: drink.available,
      stock: drink.stock.toString(),
    });
    setEditingDrink(drink.id);
  };

  const startEditCrust = (crust: typeof crusts[0]) => {
    setCrustForm({
      name: crust.name,
      price: crust.price.toString(),
      emoji: crust.emoji,
      available: crust.available,
    });
    setEditingCrust(crust.id);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚙️</span>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Painel Administrativo</h1>
              <p className="text-xs text-gray-500">Gerencie o cardápio da pizzaria</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <a
              href="/relatorios"
              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-xl font-semibold transition-colors text-sm"
            >
              📊 Relatórios
            </a>
            <button
              onClick={() => setShowConfirmReset(true)}
              className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-xl font-semibold transition-colors text-sm"
            >
              🔄 Restaurar Padrão
            </button>
            <a
              href="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold transition-colors text-sm"
            >
              ← Voltar
            </a>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="flex gap-2 bg-white rounded-2xl p-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab('pizzas')}
            className={`flex-1 py-2.5 rounded-xl font-semibold transition-all ${
              activeTab === 'pizzas' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-600 hover:bg-orange-50'
            }`}
          >
            🍕 Pizzas ({pizzas.length})
          </button>
          <button
            onClick={() => setActiveTab('bebidas')}
            className={`flex-1 py-2.5 rounded-xl font-semibold transition-all ${
              activeTab === 'bebidas' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-600 hover:bg-orange-50'
            }`}
          >
            🥤 Bebidas ({drinks.length})
          </button>
          <button
            onClick={() => setActiveTab('bordas')}
            className={`flex-1 py-2.5 rounded-xl font-semibold transition-all ${
              activeTab === 'bordas' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-600 hover:bg-orange-50'
            }`}
          >
            🧀 Bordas ({crusts.length})
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* PIZZAS TAB */}
        {activeTab === 'pizzas' && (
          <div className="space-y-6">
            {/* Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {editingPizza ? '✏️ Editar Pizza' : '➕ Nova Pizza'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nome *</label>
                  <input
                    type="text"
                    value={pizzaForm.name}
                    onChange={(e) => setPizzaForm({ ...pizzaForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    placeholder="Ex: Margherita"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Emoji</label>
                  <input
                    type="text"
                    value={pizzaForm.emoji}
                    onChange={(e) => setPizzaForm({ ...pizzaForm, emoji: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    placeholder="🍕"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição</label>
                  <input
                    type="text"
                    value={pizzaForm.description}
                    onChange={(e) => setPizzaForm({ ...pizzaForm, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    placeholder="Breve descrição"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Categoria</label>
                  <select
                    value={pizzaForm.category}
                    onChange={(e) => setPizzaForm({ ...pizzaForm, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                  >
                    <option value="tradicional">Tradicional</option>
                    <option value="especial">Especial</option>
                    <option value="doce">Doce</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ingredientes</label>
                  <textarea
                    value={pizzaForm.ingredients}
                    onChange={(e) => setPizzaForm({ ...pizzaForm, ingredients: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none resize-none"
                    rows={2}
                    placeholder="Lista de ingredientes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Preço P (R$) *</label>
                  <input
                    type="number"
                    value={pizzaForm.priceP}
                    onChange={(e) => setPizzaForm({ ...pizzaForm, priceP: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    placeholder="28.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Preço M (R$) *</label>
                  <input
                    type="number"
                    value={pizzaForm.priceM}
                    onChange={(e) => setPizzaForm({ ...pizzaForm, priceM: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    placeholder="38.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Preço G (R$) *</label>
                  <input
                    type="number"
                    value={pizzaForm.priceG}
                    onChange={(e) => setPizzaForm({ ...pizzaForm, priceG: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    placeholder="48.00"
                    step="0.01"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pizza-available"
                    checked={pizzaForm.available}
                    onChange={(e) => setPizzaForm({ ...pizzaForm, available: e.target.checked })}
                    className="w-5 h-5 rounded accent-orange-500"
                  />
                  <label htmlFor="pizza-available" className="text-sm font-semibold text-gray-700">Disponível</label>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handlePizzaSubmit}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-xl transition-colors"
                >
                  {editingPizza ? '💾 Salvar Alterações' : '➕ Adicionar Pizza'}
                </button>
                {editingPizza && (
                  <button
                    onClick={resetPizzaForm}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2.5 px-6 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Pizzas Cadastradas</h2>
              <div className="space-y-2">
                {pizzas.map((pizza) => (
                  <div key={pizza.id} className={`flex items-center justify-between p-3 rounded-xl border ${pizza.available ? 'border-gray-200 bg-white' : 'border-red-200 bg-red-50 opacity-60'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{pizza.emoji}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{pizza.name}</p>
                        <p className="text-xs text-gray-500">
                          {pizza.category} • P: R${pizza.prices.P} | M: R${pizza.prices.M} | G: R${pizza.prices.G}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updatePizza(pizza.id, { available: !pizza.available })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          pizza.available ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {pizza.available ? '✅ Ativo' : '❌ Inativo'}
                      </button>
                      <button
                        onClick={() => startEditPizza(pizza)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => { if (confirm('Remover esta pizza?')) removePizza(pizza.id); }}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BEBIDAS TAB */}
        {activeTab === 'bebidas' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {editingDrink ? '✏️ Editar Bebida' : '➕ Nova Bebida'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nome *</label>
                  <input
                    type="text"
                    value={drinkForm.name}
                    onChange={(e) => setDrinkForm({ ...drinkForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    placeholder="Ex: Coca-Cola 2L"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Emoji</label>
                  <input
                    type="text"
                    value={drinkForm.emoji}
                    onChange={(e) => setDrinkForm({ ...drinkForm, emoji: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    placeholder="🥤"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    value={drinkForm.price}
                    onChange={(e) => setDrinkForm({ ...drinkForm, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    placeholder="10.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Categoria</label>
                  <select
                    value={drinkForm.category}
                    onChange={(e) => setDrinkForm({ ...drinkForm, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                  >
                    <option value="refrigerante">Refrigerante</option>
                    <option value="suco">Suco</option>
                    <option value="agua">Água</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Estoque *</label>
                  <input
                    type="number"
                    value={drinkForm.stock}
                    onChange={(e) => setDrinkForm({ ...drinkForm, stock: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    placeholder="20"
                    min="0"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="drink-available"
                    checked={drinkForm.available}
                    onChange={(e) => setDrinkForm({ ...drinkForm, available: e.target.checked })}
                    className="w-5 h-5 rounded accent-orange-500"
                  />
                  <label htmlFor="drink-available" className="text-sm font-semibold text-gray-700">Disponível</label>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleDrinkSubmit}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-xl transition-colors"
                >
                  {editingDrink ? '💾 Salvar Alterações' : '➕ Adicionar Bebida'}
                </button>
                {editingDrink && (
                  <button onClick={resetDrinkForm} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2.5 px-6 rounded-xl transition-colors">
                    Cancelar
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Bebidas Cadastradas</h2>
              <div className="space-y-2">
                {drinks.map((drink) => {
                  const lowStock = drink.stock <= 5 && drink.stock > 0;
                  const noStock = drink.stock === 0;
                  return (
                    <div key={drink.id} className={`flex flex-col md:flex-row md:items-center justify-between p-3 rounded-xl border gap-3 ${
                      noStock ? 'border-red-300 bg-red-50' : lowStock ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-white'
                    }`}>
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{drink.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-800">{drink.name}</p>
                            {noStock && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">ESGOTADO</span>}
                            {lowStock && <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full font-bold">ESTOQUE BAIXO</span>}
                          </div>
                          <p className="text-xs text-gray-500">{drink.category} • R$ {drink.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Stock Control */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => updateDrink(drink.id, { stock: Math.max(0, drink.stock - 1) })}
                            className="w-7 h-7 rounded bg-white hover:bg-red-100 text-red-600 font-bold text-sm transition-colors flex items-center justify-center"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={drink.stock}
                            onChange={(e) => updateDrink(drink.id, { stock: Math.max(0, parseInt(e.target.value) || 0) })}
                            className="w-12 text-center bg-white rounded py-1 text-sm font-bold text-gray-800 border-0 outline-none"
                            min="0"
                          />
                          <button
                            onClick={() => updateDrink(drink.id, { stock: drink.stock + 1 })}
                            className="w-7 h-7 rounded bg-white hover:bg-green-100 text-green-600 font-bold text-sm transition-colors flex items-center justify-center"
                          >
                            +
                          </button>
                          <button
                            onClick={() => updateDrink(drink.id, { stock: drink.stock + 10 })}
                            className="px-2 h-7 rounded bg-white hover:bg-blue-100 text-blue-600 font-bold text-xs transition-colors"
                            title="Adicionar 10"
                          >
                            +10
                          </button>
                        </div>
                        <button
                          onClick={() => updateDrink(drink.id, { available: !drink.available })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            drink.available ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {drink.available ? '✅ Ativo' : '❌ Inativo'}
                        </button>
                        <button onClick={() => startEditDrink(drink)} className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => { if (confirm('Remover esta bebida?')) removeDrink(drink.id); }}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* BORDAS TAB */}
        {activeTab === 'bordas' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {editingCrust ? '✏️ Editar Borda' : '➕ Nova Borda'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nome *</label>
                  <input
                    type="text"
                    value={crustForm.name}
                    onChange={(e) => setCrustForm({ ...crustForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    placeholder="Ex: Borda de Catupiry"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Emoji</label>
                  <input
                    type="text"
                    value={crustForm.emoji}
                    onChange={(e) => setCrustForm({ ...crustForm, emoji: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    placeholder="🧀"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    value={crustForm.price}
                    onChange={(e) => setCrustForm({ ...crustForm, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    placeholder="8.00"
                    step="0.01"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="crust-available"
                    checked={crustForm.available}
                    onChange={(e) => setCrustForm({ ...crustForm, available: e.target.checked })}
                    className="w-5 h-5 rounded accent-orange-500"
                  />
                  <label htmlFor="crust-available" className="text-sm font-semibold text-gray-700">Disponível</label>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleCrustSubmit}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-xl transition-colors"
                >
                  {editingCrust ? '💾 Salvar Alterações' : '➕ Adicionar Borda'}
                </button>
                {editingCrust && (
                  <button onClick={resetCrustForm} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2.5 px-6 rounded-xl transition-colors">
                    Cancelar
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Bordas Cadastradas</h2>
              <div className="space-y-2">
                {crusts.map((crust) => (
                  <div key={crust.id} className={`flex items-center justify-between p-3 rounded-xl border ${crust.available ? 'border-gray-200 bg-white' : 'border-red-200 bg-red-50 opacity-60'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{crust.emoji}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{crust.name}</p>
                        <p className="text-xs text-gray-500">{crust.price > 0 ? `R$ ${crust.price.toFixed(2)}` : 'Grátis'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateCrust(crust.id, { available: !crust.available })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          crust.available ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {crust.available ? '✅ Ativo' : '❌ Inativo'}
                      </button>
                      <button onClick={() => startEditCrust(crust)} className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => { if (confirm('Remover esta borda?')) removeCrust(crust.id); }}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowConfirmReset(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Restaurar Cardápio Padrão?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Isso irá remover todas as suas alterações e restaurar os produtos originais. Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2.5 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => { resetMenu(); setShowConfirmReset(false); }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-colors"
                >
                  Restaurar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
