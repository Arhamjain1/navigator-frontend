import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../utils/api';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');

  const shippingPrice = cart.totalAmount >= 2999 ? 0 : 199;
  const taxPrice = 0; // Prices are inclusive of GST
  const totalAmount = cart.totalAmount + shippingPrice;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderItems = cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images?.[0],
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price,
      }));

      const orderData = {
        items: orderItems,
        shippingAddress,
        paymentMethod,
        itemsTotal: cart.totalAmount,
        shippingPrice,
        taxPrice,
        totalAmount,
      };

      const response = await ordersAPI.create(orderData);
      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${response.data._id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="pt-24 md:pt-28 min-h-[70vh] flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="font-display text-2xl mb-4 text-gray-900">Your cart is empty</h1>
          <Link to="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28 bg-white">
      <div className="container-custom py-8 md:py-12">
        <h1 className="font-display text-3xl md:text-4xl mb-8 text-gray-900">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step > 1 ? <Check size={20} /> : '1'}
            </div>
            <span className="ml-2 hidden sm:inline text-gray-700">Shipping</span>
          </div>
          <div className={`w-16 md:w-24 h-1 mx-2 rounded-full ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`} />
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step > 2 ? <Check size={20} /> : '2'}
            </div>
            <span className="ml-2 hidden sm:inline text-gray-700">Payment</span>
          </div>
          <div className={`w-16 md:w-24 h-1 mx-2 rounded-full ${step >= 3 ? 'bg-black' : 'bg-gray-200'}`} />
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              3
            </div>
            <span className="ml-2 hidden sm:inline text-gray-700">Confirm</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <h2 className="font-display text-xl flex items-center gap-2">
                  <Truck size={24} />
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.fullName}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                      }
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, phone: e.target.value })
                      }
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Street Address</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.street}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, street: e.target.value })
                    }
                    className="input"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, city: e.target.value })
                      }
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, state: e.target.value })
                      }
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">PIN Code</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.zipCode}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, zipCode: e.target.value })
                      }
                      className="input"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full md:w-auto">
                  Continue to Payment
                </button>
              </form>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-display text-xl flex items-center gap-2">
                  <CreditCard size={24} />
                  Payment Method
                </h2>

                <div className="space-y-4">
                  <label
                    className={`block p-4 border rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <CreditCard size={24} />
                      <div>
                        <p className="font-medium text-gray-900">Credit / Debit Card</p>
                        <p className="text-sm text-gray-500">
                          Pay securely with your card (Mock payment)
                        </p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`block p-4 border rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === 'upi'
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">UPI</p>
                        <p className="text-sm text-gray-500">
                          Pay using UPI apps (Mock payment)
                        </p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`block p-4 border rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <Truck size={24} />
                      <div>
                        <p className="font-medium text-gray-900">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">
                          Pay when your order arrives
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="btn-primary"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-display text-xl text-gray-900">Review Your Order</h2>

                {/* Shipping Info */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium mb-2 text-gray-900">Shipping Address</h3>
                      <p className="text-sm text-gray-600">
                        {shippingAddress.fullName}<br />
                        {shippingAddress.street}<br />
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
                        Phone: {shippingAddress.phone}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="text-sm underline text-gray-500 hover:text-black"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium mb-2 text-gray-900">Payment Method</h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod.toUpperCase()}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      className="text-sm underline text-gray-500 hover:text-black"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-medium mb-4 text-gray-900">Order Items</h3>
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item._id} className="flex gap-4">
                        <img
                          src={item.product?.images?.[0] || 'https://via.placeholder.com/80x100'}
                          alt={item.product?.name}
                          className="w-16 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.product?.name}</p>
                          <p className="text-sm text-gray-500">
                            Size: {item.size} | Qty: {item.quantity}
                          </p>
                          <p className="font-medium mt-1 text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="btn-primary flex-1"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 sticky top-32 rounded-2xl">
              <h2 className="font-display text-xl mb-6 text-gray-900">Order Summary</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Items ({cart.items.reduce((a, b) => a + b.quantity, 0)})
                  </span>
                  <span className="text-gray-900">{formatPrice(cart.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className={shippingPrice === 0 ? 'text-green-600' : 'text-gray-900'}>
                    {shippingPrice === 0 ? 'FREE' : formatPrice(shippingPrice)}
                  </span>
                </div>
                <div className="text-xs text-gray-400 italic">
                  * Prices are inclusive of GST
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between text-base font-medium">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
