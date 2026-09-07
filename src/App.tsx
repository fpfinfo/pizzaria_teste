import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import HomePage from './pages/HomePage';
import CustomerPage from './pages/CustomerPage';
import KitchenPage from './pages/KitchenPage';
import TrackingPage from './pages/TrackingPage';

function App() {
  return (
    <OrderProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cliente" element={<CustomerPage />} />
          <Route path="/cozinha" element={<KitchenPage />} />
          <Route path="/rastrear" element={<TrackingPage />} />
        </Routes>
      </Router>
    </OrderProvider>
  );
}

export default App;
