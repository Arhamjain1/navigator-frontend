import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart from localStorage for non-authenticated users or from API for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Clear cart when user logs out
      setCart({ items: [], totalAmount: 0 });
      localStorage.removeItem('cart');
    }
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

  const addToCart = async (product, quantity, size, color) => {
    try {
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

  const updateQuantity = async (itemId, quantity) => {
    try {
      if (isAuthenticated) {
        const response = await cartAPI.update(itemId, { quantity });
        setCart(response.data);
      } else {
        const newItems = cart.items
          .map((item) =>
            item._id === itemId ? { ...item, quantity } : item
          )
          .filter((item) => item.quantity > 0);

        const totalAmount = newItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );

        saveLocalCart({ items: newItems, totalAmount });
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      if (isAuthenticated) {
        const response = await cartAPI.remove(itemId);
        setCart(response.data);
        toast.success('Removed from cart');
      } else {
        const newItems = cart.items.filter((item) => item._id !== itemId);
        const totalAmount = newItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        saveLocalCart({ items: newItems, totalAmount });
        toast.success('Removed from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove from cart');
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
};
