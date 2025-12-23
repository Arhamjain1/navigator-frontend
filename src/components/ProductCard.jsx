import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatPrice, calculateDiscount } from '../utils/helpers';
import toast from 'react-hot-toast';

const ProductCard = ({ product, variant = 'default' }) => {
  const navigate = useNavigate();
  const discount = calculateDiscount(product.originalPrice, product.price);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Check if product is in wishlist on mount
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsWishlisted(wishlist.some(item => item._id === product._id));
  }, [product._id]);

  // Handle wishlist toggle
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isWishlisted) {
      const newWishlist = wishlist.filter(item => item._id !== product._id);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      setIsWishlisted(false);
      toast.success('Removed from wishlist');
    } else {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsWishlisted(true);
      toast.success('Added to wishlist!');
    }
  };

  // Handle quick view - redirect to product page
  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product._id}`);
  };

  // Handle add to cart - redirect to product page to select size/color
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product._id}`);
  };

  // Different sizes for different contexts
  const aspectRatio = variant === 'featured' ? 'aspect-[4/5]' : 'aspect-[3/4]';

  return (
    <div className="group product-card">
      <Link to={`/product/${product._id}`} className="block">
        {/* Image Container */}
        <div className={`relative ${aspectRatio} overflow-hidden bg-neutral-100 mb-5`}>
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />
          
          {/* Second image on hover */}
          {product.images?.[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100"
            />
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-white text-black text-[10px] px-3 py-1.5 font-semibold uppercase tracking-widest">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="bg-black text-white text-[10px] px-3 py-1.5 font-semibold tracking-wide">
                -{discount}%
              </span>
            )}
          </div>

          {/* Action Buttons - Right Side */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              className={`p-2.5 backdrop-blur-sm opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 hover:bg-black hover:text-white'}`}
              aria-label="Add to wishlist"
              onClick={handleWishlist}
            >
              <Heart size={16} strokeWidth={1.5} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
            <button
              className="p-2.5 bg-white/90 backdrop-blur-sm opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-75 hover:bg-black hover:text-white"
              aria-label="Quick view"
              onClick={handleQuickView}
            >
              <Eye size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* Quick Add Button - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <button
              className="w-full bg-white/95 backdrop-blur-sm text-black py-3.5 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
              aria-label="Add to cart"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
              Quick View
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          {/* Category/Brand */}
          {product.category && (
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
              {product.category}
            </p>
          )}
          
          {/* Product Name */}
          <h3 className="text-sm font-medium text-black leading-snug group-hover:opacity-70 transition-opacity duration-300 line-clamp-2">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-black">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-neutral-400 line-through text-xs">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Color Swatches (placeholder) */}
          <div className="flex gap-1.5 pt-1">
            <span className="w-3 h-3 rounded-full bg-black border border-neutral-200"></span>
            <span className="w-3 h-3 rounded-full bg-neutral-200 border border-neutral-200"></span>
            <span className="w-3 h-3 rounded-full bg-neutral-500 border border-neutral-200"></span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
