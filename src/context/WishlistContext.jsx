import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { wishlistAPI } from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const prevAuthState = useRef(isAuthenticated);

  // Load wishlist on initial mount
  useEffect(() => {
    if (!isAuthenticated) {
      // Load from localStorage for guests
      const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      // Normalize - ensure all items are IDs
      const normalizedWishlist = savedWishlist
        .map(item => typeof item === 'object' && item._id ? item._id : item)
        .filter(id => typeof id === 'string' && id.length > 0);
      setWishlistItems(normalizedWishlist);
    }
  }, []);

  // Handle auth state changes
  useEffect(() => {
    const handleAuthChange = async () => {
      // User just logged in
      if (isAuthenticated && !prevAuthState.current) {
        const guestWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const normalizedWishlist = guestWishlist
          .map(item => typeof item === 'object' && item._id ? item._id : item)
          .filter(id => typeof id === 'string' && id.length > 0);
        
        // Merge guest wishlist to server
        if (normalizedWishlist.length > 0) {
          try {
            for (const productId of normalizedWishlist) {
              await wishlistAPI.add(productId);
            }
            localStorage.removeItem('wishlist');
          } catch (error) {
            console.error('Error merging wishlist:', error);
          }
        }
        fetchWishlist();
      }
      // User just logged out
      else if (!isAuthenticated && prevAuthState.current) {
        setWishlistItems([]);
      }

      prevAuthState.current = isAuthenticated;
    };

    handleAuthChange();
  }, [isAuthenticated]);

  // Fetch wishlist from server
  const fetchWishlist = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const response = await wishlistAPI.get();
      // Extract IDs from populated products
      const ids = response.data.map(product => product._id);
      setWishlistItems(ids);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  // Add to wishlist
  const addToWishlist = async (productId) => {
    try {
      if (isAuthenticated) {
        await wishlistAPI.add(productId);
        setWishlistItems(prev => [...prev, productId]);
      } else {
        const newWishlist = [...wishlistItems, productId];
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        setWishlistItems(newWishlist);
      }
      toast.success('Added to wishlist!');
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
      return false;
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      if (isAuthenticated) {
        await wishlistAPI.remove(productId);
        setWishlistItems(prev => prev.filter(id => id !== productId));
      } else {
        const newWishlist = wishlistItems.filter(id => id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        setWishlistItems(newWishlist);
      }
      toast.success('Removed from wishlist');
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
      return false;
    }
  };

  // Toggle wishlist
  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  // Clear wishlist
  const clearWishlist = async () => {
    try {
      if (isAuthenticated) {
        await wishlistAPI.clear();
      } else {
        localStorage.setItem('wishlist', JSON.stringify([]));
      }
      setWishlistItems([]);
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    }
  };

  const wishlistCount = wishlistItems.length;

  const value = {
    wishlistItems,
    wishlistCount,
    loading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    fetchWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
