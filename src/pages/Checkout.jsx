import { useState, useMemo } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { CreditCard, Truck, Check, Mail } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../utils/api';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isGuestCheckout = searchParams.get('guest') === 'true';
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [guestEmail, setGuestEmail] = useState('');
  
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

  // Calculate tax for each item based on price slab
  // If price > 2500: 18% tax (price is inclusive)
  // If price <= 2500: 5% tax (price is inclusive)
  const taxCalculation = useMemo(() => {
    let totalBasePrice = 0;
    let totalTax = 0;
    
    const itemsWithTax = cart.items.map(item => {
      const itemTotal = item.price * item.quantity;
      const taxRate = item.price > 2500 ? 0.18 : 0.05;
      // Price is inclusive of tax, so: price = basePrice + tax = basePrice * (1 + taxRate)
      // basePrice = price / (1 + taxRate)
      const basePrice = itemTotal / (1 + taxRate);
      const tax = itemTotal - basePrice;
      
      totalBasePrice += basePrice;
      totalTax += tax;
      
      return {
        ...item,
        basePrice: basePrice,
        tax: tax,
        taxRate: taxRate * 100
      };
    });
    
    return {
      itemsWithTax,
      subtotal: totalBasePrice,
      totalTax: totalTax,
      displayTotal: cart.totalAmount
    };
  }, [cart.items, cart.totalAmount]);

  const shippingPrice = cart.totalAmount >= 2999 ? 0 : 199;
  const totalAmount = cart.totalAmount + shippingPrice;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (isGuestCheckout && !guestEmail) {
      toast.error('Please enter your email address');
      return;
    }
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
        itemsTotal: taxCalculation.subtotal,
        shippingPrice,
        taxPrice: taxCalculation.totalTax,
        totalAmount,
      };

      let response;
      if (isGuestCheckout && !isAuthenticated) {
        orderData.guestEmail = guestEmail;
        response = await ordersAPI.createGuest(orderData);
      } else {
        response = await ordersAPI.create(orderData);
      }
      
      // Clear cart from localStorage for guest users
      if (isGuestCheckout && !isAuthenticated) {
        localStorage.removeItem('guestCart');
      }
      await clearCart();
      
      toast.success('Order placed successfully!');
      
      // Redirect to order success page with guest flag if needed
      if (isGuestCheckout && !isAuthenticated) {
        navigate(`/order-success/${response.data._id}?guest=true`);
      } else {
        navigate(`/order-success/${response.data._id}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      
      // Handle stock errors specifically
      if (error.response?.data?.stockErrors) {
        const stockErrors = error.response.data.stockErrors;
        const errorMessages = stockErrors.map(err => err.error).join('\n');
        toast.error(errorMessages, { duration: 5000 });
        // Redirect back to cart so user can update quantities
        navigate('/cart');
      } else {
        toast.error(error.response?.data?.message || 'Failed to place order');
      }
    } finally {
      setLoading(false);
    }
  };

  // Redirect non-authenticated users without guest flag to cart
  if (!isAuthenticated && !isGuestCheckout) {
    return (
      <div className="pt-24 md:pt-28 min-h-[70vh] flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="font-display text-2xl mb-4 text-gray-900">Please login or checkout as guest</h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login?redirect=checkout" className="btn-primary">
              Login
            </Link>
            <Link to="/checkout?guest=true" className="btn-secondary">
              Checkout as Guest
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                {/* Guest Email Field */}
                {isGuestCheckout && !isAuthenticated && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
                    <h3 className="font-display text-lg flex items-center gap-2 mb-4">
                      <Mail size={20} />
                      Guest Checkout
                    </h3>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="Enter your email for order confirmation"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="input"
                      />
                      <p className="text-xs text-gray-500 mt-2">We'll send your order confirmation to this email</p>
                    </div>
                  </div>
                )}

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
                          className="w-16 h-20 object-cover object-top rounded-lg"
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
                    Subtotal ({cart.items.reduce((a, b) => a + b.quantity, 0)} items)
                  </span>
                  <span className="text-gray-900">{formatPrice(taxCalculation.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-900">{formatPrice(taxCalculation.totalTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className={shippingPrice === 0 ? 'text-green-600' : 'text-gray-900'}>
                    {shippingPrice === 0 ? 'FREE' : formatPrice(shippingPrice)}
                  </span>
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
