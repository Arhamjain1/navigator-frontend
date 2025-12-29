import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { cartAPI } from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

// CartProvider component
function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const prevAuthState = useRef(isAuthenticated);

  // Load cart on initial mount from localStorage (for guests)
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart && !isAuthenticated) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Handle auth state changes - merge guest cart on login
  useEffect(() => {
    const handleAuthChange = async () => {
      // User just logged in (was not authenticated, now is)
      if (isAuthenticated && !prevAuthState.current) {
        const guestCart = localStorage.getItem('cart');
        if (guestCart) {
          const parsedGuestCart = JSON.parse(guestCart);
          // Merge guest cart items to server cart
          if (parsedGuestCart.items && parsedGuestCart.items.length > 0) {
            try {
              for (const item of parsedGuestCart.items) {
                await cartAPI.add({
                  productId: item.product._id,
                  quantity: item.quantity,
                  size: item.size,
                  color: item.color,
                });
              }
              localStorage.removeItem('cart');
              toast.success('Your cart items have been saved!');
            } catch (error) {
              console.error('Error merging cart:', error);
            }
          }
        }
        fetchCart();
      }
      // User just logged out
      else if (!isAuthenticated && prevAuthState.current) {
        setCart({ items: [], totalAmount: 0 });
        localStorage.removeItem('cart');
      }
      // Update previous auth state
      prevAuthState.current = isAuthenticated;
    };

    handleAuthChange();
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      setCart(response.data);
    } catch (error) {
      // Silently fail - don't show error toast for cart fetch issues
      console.error('Error fetching cart:', error);
      // Reset to empty cart on error
      setCart({ items: [], totalAmount: 0 });
    } finally {
      setLoading(false);
    }
  };

  const saveLocalCart = (cartData) => {
    localStorage.setItem('cart', JSON.stringify(cartData));
    setCart(cartData);
  };

  // Save cart to localStorage whenever it changes (for guests)
  useEffect(() => {
    if (!isAuthenticated && cart.items.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  const addToCart = async (product, quantity, size, color) => {
    try {
      // Get available stock for this size
      const getStockForSize = (sz) => {
        if (product?.stockBySize && typeof product.stockBySize === 'object') {
          if (product.stockBySize instanceof Map) {
            return product.stockBySize.get(sz) || 0;
          }
          return product.stockBySize[sz] || 0;
        }
        return product?.stock || 0;
      };
      
      const maxStock = getStockForSize(size);
      
      // Check existing quantity in cart for this product/size
      const existingItem = cart.items.find(
        (item) =>
          item.product?._id === product._id &&
          item.size === size &&
          item.color?.name === color?.name
      );
      const currentQtyInCart = existingItem ? existingItem.quantity : 0;
      const newTotalQty = currentQtyInCart + quantity;
      
      if (newTotalQty > maxStock) {
        if (currentQtyInCart >= maxStock) {
          toast.error(`Maximum quantity (${maxStock}) already in cart for size ${size}`);
          return;
        } else {
          toast.error(`Only ${maxStock - currentQtyInCart} more available for size ${size}`);
          return;
        }
      }

      if (isAuthenticated) {
        const response = await cartAPI.add({
          productId: product._id,
          quantity,
          size,
          color,
        });
        setCart(response.data);
        toast.success('Added to cart!');
      } else {
        // Handle local cart for non-authenticated users
        const existingItemIndex = cart.items.findIndex(
          (item) =>
            item.product?._id === product._id &&
            item.size === size &&
            item.color?.name === color?.name
        );

        let newItems;
        if (existingItemIndex > -1) {
          newItems = [...cart.items];
          newItems[existingItemIndex].quantity += quantity;
        } else {
          newItems = [
            ...cart.items,
            {
              _id: Date.now().toString(),
              product,
              quantity,
              size,
              color,
              price: product.price,
            },
          ];
        }

        const totalAmount = newItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );

        saveLocalCart({ items: newItems, totalAmount });
        toast.success('Added to cart!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const updateQuantity = useCallback(async (itemId, quantity, maxStock = null, suppressToast = false) => {
    // Check if quantity exceeds stock
    if (maxStock !== null && quantity > maxStock) {
      if (!suppressToast) toast.error(`Only ${maxStock} available`);
      return;
    }
    
    // Optimistic UI update - update state immediately
    setCart(prevCart => {
      const newItems = prevCart.items
        .map((item) =>
          item._id === itemId ? { ...item, quantity } : item
        )
        .filter((item) => item.quantity > 0);

      const totalAmount = newItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      // Also update localStorage for guests immediately
      if (!isAuthenticated) {
        localStorage.setItem('cart', JSON.stringify({ items: newItems, totalAmount }));
      }

      return { items: newItems, totalAmount };
    });
    
    // Then sync with server for authenticated users
    if (isAuthenticated) {
      try {
        await cartAPI.update(itemId, { quantity });
      } catch (error) {
        console.error('Error updating cart:', error);
        if (!suppressToast) toast.error('Failed to update cart');
        // Refetch cart to get correct state on error
        fetchCart();
      }
    }
  }, [isAuthenticated]);

  const removeFromCart = async (itemId, suppressToast = false) => {
    try {
      if (isAuthenticated) {
        const response = await cartAPI.remove(itemId);
        setCart(response.data);
        if (!suppressToast) toast.success('Removed from cart');
      } else {
        const newItems = cart.items.filter((item) => item._id !== itemId);
        const totalAmount = newItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        saveLocalCart({ items: newItems, totalAmount });
        if (!suppressToast) toast.success('Removed from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      if (!suppressToast) toast.error('Failed to remove from cart');
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await cartAPI.clear();
      }
      setCart({ items: [], totalAmount: 0 });
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use cart context
function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export { CartProvider, useCart };
