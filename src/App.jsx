import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import HelpCenter from './pages/HelpCenter';
import ShippingInfo from './pages/ShippingInfo';
import ReturnsExchanges from './pages/ReturnsExchanges';
import SizeGuide from './pages/SizeGuide';

// Scroll to top on route change (only pathname, not search params)
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on any route change including search params
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname, location.search]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success/:id" element={<OrderSuccess />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/shipping-info" element={<ShippingInfo />} />
                <Route path="/returns-exchanges" element={<ReturnsExchanges />} />
                <Route path="/size-guide" element={<SizeGuide />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-center"
            containerStyle={{
              top: 80,
            }}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#000',
                color: '#fff',
                padding: '16px 24px',
                borderRadius: '0',
                fontSize: '14px',
                fontWeight: '500',
                maxWidth: '400px',
                textAlign: 'center',
              },
              success: {
                iconTheme: {
                  primary: '#fff',
                  secondary: '#000',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#fff',
                  secondary: '#000',
                },
                style: {
                  background: '#dc2626',
                },
              },
            }}
          />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
