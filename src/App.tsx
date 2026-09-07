import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import { MenuProvider } from './context/MenuContext';
import HomePage from './pages/HomePage';
import CustomerPage from './pages/CustomerPage';
import KitchenPage from './pages/KitchenPage';
import TrackingPage from './pages/TrackingPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <MenuProvider>
      <OrderProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cliente" element={<CustomerPage />} />
            <Route path="/cozinha" element={<KitchenPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/rastrear/:orderId" element={<TrackingPage />} />
          </Routes>
        </BrowserRouter>
      </OrderProvider>
    </MenuProvider>
  );
}

export default App;
