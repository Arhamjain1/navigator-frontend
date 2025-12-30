import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
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
  const [processingIds, setProcessingIds] = useState(new Set()); // Track which items are being processed
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
  const isInWishlist = useCallback((productId) => {
    return wishlistItems.includes(productId);
  }, [wishlistItems]);

  // Add to wishlist with debounce protection
  const addToWishlist = useCallback(async (productId) => {
    // Prevent duplicate clicks
    if (processingIds.has(productId)) return false;
    if (wishlistItems.includes(productId)) return false; // Already in wishlist
    
    setProcessingIds(prev => new Set(prev).add(productId));
    try {
      if (isAuthenticated) {
        await wishlistAPI.add(productId);
        setWishlistItems(prev => [...prev, productId]);
      } else {
        setWishlistItems(prev => {
          const newWishlist = [...prev, productId];
          localStorage.setItem('wishlist', JSON.stringify(newWishlist));
          return newWishlist;
        });
      }
      toast.success('Added to wishlist!');
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
      return false;
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  }, [isAuthenticated, wishlistItems, processingIds]);

  // Remove from wishlist with debounce protection
  const removeFromWishlist = useCallback(async (productId) => {
    // Prevent duplicate clicks
    if (processingIds.has(productId)) return false;
    if (!wishlistItems.includes(productId)) return false; // Not in wishlist
    
    setProcessingIds(prev => new Set(prev).add(productId));
    try {
      if (isAuthenticated) {
        await wishlistAPI.remove(productId);
        setWishlistItems(prev => prev.filter(id => id !== productId));
      } else {
        setWishlistItems(prev => {
          const newWishlist = prev.filter(id => id !== productId);
          localStorage.setItem('wishlist', JSON.stringify(newWishlist));
          return newWishlist;
        });
      }
      toast.success('Removed from wishlist');
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
      return false;
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  }, [isAuthenticated, wishlistItems, processingIds]);

  // Toggle wishlist with protection
  const toggleWishlist = useCallback(async (productId) => {
    if (processingIds.has(productId)) return false; // Already processing
    
    if (wishlistItems.includes(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  }, [processingIds, wishlistItems, addToWishlist, removeFromWishlist]);

  // Check if item is being processed
  const isProcessing = useCallback((productId) => {
    return processingIds.has(productId);
  }, [processingIds]);

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
    isProcessing,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    fetchWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
