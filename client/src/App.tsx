import { Routes, Route } from 'react-router-dom';
import Checkout from './Checkout';
import Confirmation from './Confirmation';
import NotFound from './NotFound';
import CartProvider from './context/CartContext';

const App = () => {
  return (
    <CartProvider>
    <Routes>
      <Route path="/" element={<Checkout />} />
      <Route path="/confirmation" element={<Confirmation />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </CartProvider>
  );
}

export default App;
