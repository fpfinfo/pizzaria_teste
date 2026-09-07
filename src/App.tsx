import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import HomePage from './pages/HomePage';
import CustomerPage from './pages/CustomerPage';
import KitchenPage from './pages/KitchenPage';

function App() {
  return (
    <OrderProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cliente" element={<CustomerPage />} />
          <Route path="/cozinha" element={<KitchenPage />} />
        </Routes>
      </BrowserRouter>
    </OrderProvider>
  );
}

export default App;
