import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { pizzas as defaultPizzas, drinks as defaultDrinks, crusts as defaultCrusts, Pizza, Drink, Crust } from '../data/menu';

interface MenuContextType {
  pizzas: Pizza[];
  drinks: Drink[];
  crusts: Crust[];
  addPizza: (pizza: Omit<Pizza, 'id'>) => void;
  updatePizza: (id: string, pizza: Partial<Pizza>) => void;
  removePizza: (id: string) => void;
  addDrink: (drink: Omit<Drink, 'id'>) => void;
  updateDrink: (id: string, drink: Partial<Drink>) => void;
  removeDrink: (id: string) => void;
  addCrust: (crust: Omit<Crust, 'id'>) => void;
  updateCrust: (id: string, crust: Partial<Crust>) => void;
  removeCrust: (id: string) => void;
  resetMenu: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const PIZZAS_KEY = 'bella-massa-pizzas';
const DRINKS_KEY = 'bella-massa-drinks';
const CRUSTS_KEY = 'bella-massa-crusts';

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error(`Error loading ${key}:`, e);
  }
  return fallback;
}

function saveToStorage<T>(key: string, data: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key}:`, e);
  }
}

export function MenuProvider({ children }: { children: ReactNode }) {
  const [pizzas, setPizzas] = useState<Pizza[]>(() => loadFromStorage(PIZZAS_KEY, defaultPizzas));
  const [drinks, setDrinks] = useState<Drink[]>(() => loadFromStorage(DRINKS_KEY, defaultDrinks));
  const [crusts, setCrusts] = useState<Crust[]>(() => loadFromStorage(CRUSTS_KEY, defaultCrusts));

  useEffect(() => { saveToStorage(PIZZAS_KEY, pizzas); }, [pizzas]);
  useEffect(() => { saveToStorage(DRINKS_KEY, drinks); }, [drinks]);
  useEffect(() => { saveToStorage(CRUSTS_KEY, crusts); }, [crusts]);

  // Pizza CRUD
  const addPizza = (pizza: Omit<Pizza, 'id'>) => {
    const newPizza: Pizza = { ...pizza, id: `pizza-${Date.now()}` };
    setPizzas((prev) => [...prev, newPizza]);
  };

  const updatePizza = (id: string, updates: Partial<Pizza>) => {
    setPizzas((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const removePizza = (id: string) => {
    setPizzas((prev) => prev.filter((p) => p.id !== id));
  };

  // Drink CRUD
  const addDrink = (drink: Omit<Drink, 'id'>) => {
    const newDrink: Drink = { ...drink, id: `drink-${Date.now()}` };
    setDrinks((prev) => [...prev, newDrink]);
  };

  const updateDrink = (id: string, updates: Partial<Drink>) => {
    setDrinks((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const removeDrink = (id: string) => {
    setDrinks((prev) => prev.filter((d) => d.id !== id));
  };

  // Crust CRUD
  const addCrust = (crust: Omit<Crust, 'id'>) => {
    const newCrust: Crust = { ...crust, id: `crust-${Date.now()}` };
    setCrusts((prev) => [...prev, newCrust]);
  };

  const updateCrust = (id: string, updates: Partial<Crust>) => {
    setCrusts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const removeCrust = (id: string) => {
    setCrusts((prev) => prev.filter((c) => c.id !== id));
  };

  const resetMenu = () => {
    setPizzas(defaultPizzas);
    setDrinks(defaultDrinks);
    setCrusts(defaultCrusts);
    localStorage.removeItem(PIZZAS_KEY);
    localStorage.removeItem(DRINKS_KEY);
    localStorage.removeItem(CRUSTS_KEY);
  };

  return (
    <MenuContext.Provider
      value={{
        pizzas, drinks, crusts,
        addPizza, updatePizza, removePizza,
        addDrink, updateDrink, removeDrink,
        addCrust, updateCrust, removeCrust,
        resetMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within a MenuProvider');
  return context;
}
