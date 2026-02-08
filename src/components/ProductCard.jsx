import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { formatPrice, calculateDiscount } from '../utils/helpers';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product, variant = 'default' }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist, isProcessing } = useWishlist();
  const discount = calculateDiscount(product.originalPrice, product.price);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const images = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'];

  // Get second image for hover effect
  const hoverImage = images.length > 1 ? images[1] : images[0];

  // Handle image navigation
  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Handle wishlist toggle with protection against double-clicks
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing(product._id)) {
      toggleWishlist(product._id);
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

  // Consistent aspect ratio across all variants
  const aspectRatio = 'aspect-[3/4]';


  return (
    <div
      className="group product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product._id}`} className="block">
        {/* Image Container */}
        <div className={`relative ${aspectRatio} overflow-hidden bg-neutral-100 mb-5`}>
          {/* Primary image */}
          <img
            src={images[currentImageIndex]}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ${isHovered && images.length > 1 ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
          />

          {/* Hover image (second image) - NUDE Project style swap */}
          {images.length > 1 && (
            <img
              src={hoverImage}
              alt={`${product.name} alternate`}
              className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            />
          )}

          {/* Image Navigation Arrows - only show if multiple images */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={16} strokeWidth={2} />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white z-10"
                aria-label="Next image"
              >
                <ChevronRight size={16} strokeWidth={2} />
              </button>
              {/* Image Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
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

          {/* Action Buttons - Right Side (Desktop only) */}
          <div className="absolute top-4 right-4 hidden md:flex flex-col gap-2">
            <button
              className={`p-2.5 backdrop-blur-sm opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 disabled:opacity-50 ${isInWishlist(product._id) ? 'bg-red-500 text-white' : 'bg-white/90 hover:bg-black hover:text-white'}`}
              aria-label="Add to wishlist"
              onClick={handleWishlist}
              disabled={isProcessing(product._id)}
            >
              {isProcessing(product._id) ? (
                <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
              ) : (
                <Heart size={16} strokeWidth={1.5} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
              )}
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

          {/* Product Name with Mobile Wishlist Button */}
          <div className="flex items-start gap-2">
            <h3 className="text-sm font-medium text-black leading-snug group-hover:opacity-70 transition-opacity duration-300 line-clamp-2 flex-1">
              {product.name}
            </h3>
            {/* Mobile Wishlist Button - Always visible on mobile */}
            <button
              className={`md:hidden p-1.5 flex-shrink-0 transition-colors ${isInWishlist(product._id) ? 'text-red-500' : 'text-neutral-400 hover:text-black'
                }`}
              aria-label="Add to wishlist"
              onClick={handleWishlist}
              disabled={isProcessing(product._id)}
            >
              {isProcessing(product._id) ? (
                <Loader2 size={18} strokeWidth={1.5} className="animate-spin" />
              ) : (
                <Heart size={18} strokeWidth={1.5} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
              )}
            </button>
          </div>

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
