import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Check, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ isOpen, onClose, addedItem }) => {
  const navigate = useNavigate();
  const { cart } = useCart();
  
  const shippingThreshold = 2999;
  const freeShipping = cart.totalAmount >= shippingThreshold;
  const amountToFreeShipping = shippingThreshold - cart.totalAmount;

  // Close on escape key and manage body scroll
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    onClose();
  };

  if (!isOpen || !addedItem) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[70] transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[80] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <Check size={16} className="text-white" strokeWidth={3} />
            </div>
            <div>
              <p className="text-sm font-semibold text-black">Added to Cart</p>
              <p className="text-xs text-neutral-500">{cart.items.length} item(s) in cart</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 transition-colors"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Added Item Details */}
        <div className="p-5 border-b border-neutral-100">
          <div className="flex gap-4">
            {/* Product Image */}
            <div className="w-24 h-32 bg-neutral-100 flex-shrink-0 overflow-hidden">
              <img
                src={addedItem.product?.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80'}
                alt={addedItem.product?.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            
            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">
                {addedItem.product?.category}
              </p>
              <h3 className="text-sm font-medium text-black mb-2 line-clamp-2">
                {addedItem.product?.name}
              </h3>
              <div className="space-y-1 text-xs text-neutral-600">
                <p>Size: <span className="font-medium text-black">{addedItem.size}</span></p>
                {addedItem.color && (
                  <p className="flex items-center gap-2">
                    Color: 
                    <span 
                      className="w-4 h-4 rounded-full border border-neutral-200" 
                      style={{ backgroundColor: addedItem.color.hex }}
                    />
                    <span className="font-medium text-black">{addedItem.color.name}</span>
                  </p>
                )}
                <p>Qty: <span className="font-medium text-black">{addedItem.quantity}</span></p>
              </div>
              <p className="text-sm font-semibold text-black mt-3">
                {formatPrice(addedItem.product?.price * addedItem.quantity)}
              </p>
            </div>
          </div>
        </div>

        {/* Free Shipping Progress */}
        <div className="p-5 bg-neutral-50">
          {!freeShipping ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Truck size={16} className="text-neutral-500" />
                <span className="text-xs text-neutral-600">
                  Add <span className="font-semibold text-black">{formatPrice(amountToFreeShipping)}</span> more for free shipping
                </span>
              </div>
              <div className="h-1.5 bg-neutral-200 overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-500"
                  style={{ width: `${Math.min(100, (cart.totalAmount / shippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                <Check size={12} className="text-white" strokeWidth={3} />
              </div>
              <span className="text-xs font-medium">You've qualified for free shipping!</span>
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <div className="p-5 border-b border-neutral-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-neutral-600">Subtotal ({cart.items.reduce((t, i) => t + i.quantity, 0)} items)</span>
            <span className="text-lg font-semibold text-black">{formatPrice(cart.totalAmount)}</span>
          </div>
          <p className="text-xs text-neutral-500">Shipping & taxes calculated at checkout</p>
        </div>

        {/* Action Buttons */}
        <div className="p-5 space-y-3 mt-auto">
          <button
            onClick={handleCheckout}
            className="w-full bg-black text-white py-4 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
          >
            Checkout
            <ArrowRight size={16} />
          </button>
          <button
            onClick={handleViewCart}
            className="w-full border border-black text-black py-4 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} />
            View Cart
          </button>
          <button
            onClick={handleContinueShopping}
            className="w-full text-sm text-neutral-500 hover:text-black transition-colors py-2 underline underline-offset-4"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
