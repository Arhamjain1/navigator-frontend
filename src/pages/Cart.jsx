import { Link } from 'react-router-dom';
import { Minus, Plus, X, ShoppingBag, ArrowRight, ChevronRight, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();
  const { isAuthenticated } = useAuth();

  const shippingThreshold = 2999;
  const freeShipping = cart.totalAmount >= shippingThreshold;
  const amountToFreeShipping = shippingThreshold - cart.totalAmount;

  if (cart.items.length === 0) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag size={40} strokeWidth={1} className="text-neutral-400" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl mb-4 tracking-tight">Your Cart is Empty</h1>
          <p className="text-neutral-500 mb-10 text-sm leading-relaxed">
            Looks like you haven't added anything to your cart yet. Explore our collection and find something you love.
          </p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            Start Shopping
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-100">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-xs text-neutral-400">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-neutral-600">Shopping Cart</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-10 md:py-14">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-2">Your Selection</p>
            <h1 className="font-display text-3xl md:text-4xl tracking-tight">Shopping Cart</h1>
          </div>
          <p className="text-sm text-neutral-500">{cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}</p>
        </div>

        {/* Free Shipping Progress */}
        {!freeShipping && (
          <div className="mb-10 p-5 bg-neutral-50">
            <div className="flex items-center justify-between text-sm mb-3">
              <div className="flex items-center gap-2">
                <Truck size={16} strokeWidth={1.5} />
                <span className="text-neutral-600">
                  Add <span className="font-semibold text-black">{formatPrice(amountToFreeShipping)}</span> more for free shipping
                </span>
              </div>
              <span className="text-neutral-400">{Math.round((cart.totalAmount / shippingThreshold) * 100)}%</span>
            </div>
            <div className="h-1 bg-neutral-200 overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-500"
                style={{ width: `${(cart.totalAmount / shippingThreshold) * 100}%` }}
              />
            </div>
          </div>
        )}

        {freeShipping && (
          <div className="mb-10 p-4 bg-emerald-50 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <Truck size={16} className="text-white" />
            </div>
            <p className="text-sm text-emerald-800 font-medium">You've qualified for free shipping!</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-neutral-200 text-[11px] uppercase tracking-[0.15em] text-neutral-400">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="divide-y divide-neutral-100">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                >
                  {/* Product Info */}
                  <div className="md:col-span-6 flex gap-5">
                    <Link
                      to={`/product/${item.product?._id}`}
                      className="w-24 h-32 bg-neutral-100 flex-shrink-0 overflow-hidden"
                    >
                      <img
                        src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80'}
                        alt={item.product?.name}
                        className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                      />
                    </Link>
                    <div className="flex flex-col justify-between py-1">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">
                          {item.product?.category}
                        </p>
                        <Link
                          to={`/product/${item.product?._id}`}
                          className="text-sm font-medium text-black hover:opacity-70 transition-opacity line-clamp-2"
                        >
                          {item.product?.name}
                        </Link>
                        <p className="text-xs text-neutral-500 mt-2">
                          Size: {item.size}
                          {item.color && ` • ${item.color.name}`}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-xs text-neutral-400 hover:text-black transition-colors text-left underline underline-offset-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2 flex justify-center">
                    <div className="flex items-center border border-neutral-200">
                      <button
                        onClick={() => item.quantity === 1 ? removeFromCart(item._id) : updateQuantity(item._id, item.quantity - 1)}
                        className="p-2.5 hover:bg-neutral-50 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => {
                          const stockBySize = item.product?.stockBySize || {};
                          const maxStock = stockBySize instanceof Map 
                            ? stockBySize.get(item.size) || item.product?.stock || 99
                            : stockBySize[item.size] || item.product?.stock || 99;
                          updateQuantity(item._id, item.quantity + 1, maxStock);
                        }}
                        className="p-2.5 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={(() => {
                          const stockBySize = item.product?.stockBySize || {};
                          const maxStock = stockBySize instanceof Map 
                            ? stockBySize.get(item.size) || item.product?.stock || 99
                            : stockBySize[item.size] || item.product?.stock || 99;
                          return item.quantity >= maxStock;
                        })()}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Unit Price */}
                  <div className="md:col-span-2 text-center hidden md:block">
                    <span className="text-sm text-neutral-600">{formatPrice(item.price)}</span>
                  </div>

                  {/* Total Price */}
                  <div className="md:col-span-2 text-right">
                    <span className="text-sm font-semibold text-black">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-between items-center">
              <Link to="/shop" className="text-sm text-neutral-500 hover:text-black transition-colors flex items-center gap-2">
                <ArrowRight size={14} className="rotate-180" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-50 p-6 sticky top-28">
              <h2 className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-6">Order Summary</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="text-black font-medium">{formatPrice(cart.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Shipping</span>
                  <span className={freeShipping ? 'text-emerald-600 font-medium' : 'text-black'}>
                    {freeShipping ? 'FREE' : formatPrice(199)}
                  </span>
                </div>
                <div className="border-t border-neutral-200 pt-4 flex justify-between">
                  <span className="text-black font-medium">Total</span>
                  <span className="text-black font-semibold text-lg">
                    {formatPrice(cart.totalAmount + (freeShipping ? 0 : 199))}
                  </span>
                </div>
              </div>

              {isAuthenticated ? (
                <Link 
                  to="/checkout" 
                  className="w-full mt-8 bg-black text-white py-4 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                >
                  Checkout
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <div className="mt-8 space-y-3">
                  <Link 
                    to="/login?redirect=checkout" 
                    className="w-full bg-black text-white py-4 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                  >
                    Login to Checkout
                    <ArrowRight size={16} />
                  </Link>
                  <Link 
                    to="/checkout?guest=true" 
                    className="w-full bg-white text-black border-2 border-black py-4 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    Checkout as Guest
                    <ArrowRight size={16} />
                  </Link>
                  <p className="text-center text-xs text-neutral-400">
                    New here?{' '}
                    <Link to="/register?redirect=checkout" className="underline underline-offset-2 hover:text-black transition-colors">
                      Create an account
                    </Link>
                  </p>
                </div>
              )}

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-neutral-200 space-y-3">
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <Shield size={14} />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <RotateCcw size={14} />
                  <span>30-day returns</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <Truck size={14} />
                  <span>Free shipping over ₹2,999</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
