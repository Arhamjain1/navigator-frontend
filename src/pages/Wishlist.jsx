import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ChevronRight } from 'lucide-react';
import { productsAPI } from '../utils/api';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/helpers';
import Loading from '../components/Loading';

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlistItems.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      
      try {
        const productPromises = wishlistItems.map(id => 
          productsAPI.getById(id).catch(() => null)
        );
        const responses = await Promise.all(productPromises);
        const validProducts = responses
          .filter(res => res && res.data)
          .map(res => res.data);
        setProducts(validProducts);
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlistItems]);

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
    setProducts(products.filter(p => p._id !== productId));
  };

  const handleClearAll = async () => {
    await clearWishlist();
    setProducts([]);
  };

  if (loading) return <Loading fullScreen />;

  if (products.length === 0) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Heart size={40} strokeWidth={1} className="text-neutral-400" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl mb-4 tracking-tight">Your Wishlist is Empty</h1>
          <p className="text-neutral-500 mb-10 text-sm leading-relaxed">
            Save items you love by clicking the heart icon on any product.
          </p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            Start Shopping
            <ChevronRight size={16} />
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
            <span className="text-neutral-600">Wishlist</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-10 md:py-14">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-2">Your Favorites</p>
            <h1 className="font-display text-3xl md:text-4xl tracking-tight">Wishlist</h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-neutral-500">{products.length} {products.length === 1 ? 'item' : 'items'}</p>
            {products.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product._id} className="group relative">
              {/* Product Image */}
              <Link to={`/product/${product._id}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-4">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  
                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(product._id);
                    }}
                    className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>

                  {/* Tags */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.isNew && (
                      <span className="bg-black text-white text-[10px] px-2 py-1 uppercase tracking-wider font-medium">
                        New
                      </span>
                    )}
                    {product.discount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] px-2 py-1 uppercase tracking-wider font-medium">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              {/* Product Info */}
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400">
                  {product.category}
                </p>
                <Link to={`/product/${product._id}`}>
                  <h3 className="text-sm font-medium text-neutral-900 leading-snug line-clamp-1 group-hover:underline">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-neutral-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-neutral-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                
                {/* Add to Cart Button */}
                <Link 
                  to={`/product/${product._id}`}
                  className="mt-3 w-full bg-black text-white py-2.5 text-xs font-medium uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={14} />
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
