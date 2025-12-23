import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, Heart, ChevronRight, Check, Truck, RotateCcw, Shield, Share2 } from 'lucide-react';
import { productsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, calculateDiscount } from '../utils/helpers';
import Loading from '../components/Loading';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await productsAPI.getById(id);
        setProduct(response.data);
        
        // Set default selections
        if (response.data.sizes?.length > 0) {
          setSelectedSize(response.data.sizes[0]);
        }
        if (response.data.colors?.length > 0) {
          setSelectedColor(response.data.colors[0]);
        }

        // Fetch related products
        const relatedRes = await productsAPI.getAll({
          category: response.data.category,
          limit: 4,
        });
        setRelatedProducts(
          relatedRes.data.products.filter((p) => p._id !== id).slice(0, 4)
        );
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  if (loading) return <Loading fullScreen />;

  if (!product) {
    return (
      <div className="pt-32 text-center min-h-screen flex flex-col items-center justify-center">
        <h2 className="font-display text-3xl mb-4">Product not found</h2>
        <Link to="/shop" className="btn-primary">
          Back to Shop
        </Link>
      </div>
    );
  }

  const discount = calculateDiscount(product.originalPrice, product.price);

  return (
    <div className="pt-20 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-100">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-xs text-neutral-400">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
            <ChevronRight size={12} />
            <Link to={`/shop?category=${product.category}`} className="hover:text-black transition-colors capitalize">
              {product.category}
            </Link>
            <ChevronRight size={12} />
            <span className="text-neutral-600 truncate max-w-[150px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[3/4] bg-neutral-100 overflow-hidden relative group">
              <img
                src={product.images?.[selectedImage] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'}
                alt={product.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Badges */}
              <div className="absolute top-5 left-5 flex flex-col gap-2">
                {product.isNew && (
                  <span className="text-[10px] tracking-widest bg-white text-black px-4 py-2 font-semibold uppercase">
                    New
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-[10px] tracking-widest bg-black text-white px-4 py-2 font-semibold uppercase">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Share button */}
              <button className="absolute top-5 right-5 p-3 bg-white/90 backdrop-blur-sm hover:bg-black hover:text-white transition-all duration-300">
                <Share2 size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-24 bg-neutral-100 overflow-hidden transition-all duration-300 ${
                      selectedImage === index ? 'ring-2 ring-black ring-offset-2' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:py-4">
            {/* Category */}
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-3">
              {product.category}
            </p>

            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight text-black mb-5">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-2xl font-semibold text-black">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-neutral-400 line-through text-lg">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest bg-black text-white px-3 py-1.5 font-medium">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-neutral-600 mb-10 leading-relaxed text-sm">
              {product.description}
            </p>

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-[11px] font-semibold mb-4 text-neutral-400 uppercase tracking-[0.15em]">
                  Color: <span className="text-black ml-1">{selectedColor?.name}</span>
                </h3>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${
                        selectedColor?.name === color.name
                          ? 'ring-2 ring-black ring-offset-2 scale-110'
                          : 'ring-1 ring-neutral-200 hover:ring-neutral-400'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor?.name === color.name && (
                        <Check
                          size={16}
                          strokeWidth={2}
                          className={color.hex === '#FFFFFF' || color.hex === '#ffffff' ? 'text-black' : 'text-white'}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.15em]">Select Size</h3>
                  <button className="text-xs text-neutral-500 hover:text-black underline underline-offset-4 transition-colors">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[56px] h-12 px-5 text-sm font-medium transition-all duration-300 ${
                        selectedSize === size
                          ? 'bg-black text-white'
                          : 'border border-neutral-200 hover:border-black text-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-[11px] font-semibold mb-4 text-neutral-400 uppercase tracking-[0.15em]">Quantity</h3>
              <div className="flex items-center border border-neutral-200 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-4 hover:bg-neutral-50 transition-colors"
                >
                  <Minus size={16} strokeWidth={1.5} />
                </button>
                <span className="w-14 text-center font-medium text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-4 hover:bg-neutral-50 transition-colors"
                >
                  <Plus size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3 mb-10">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white py-4 px-8 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button 
                onClick={() => toggleWishlist(product._id)}
                className={`p-4 border transition-all duration-300 ${
                  isInWishlist(product._id)
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'border-neutral-200 hover:border-black hover:bg-black hover:text-white'
                }`}
              >
                <Heart 
                  size={20} 
                  strokeWidth={1.5} 
                  fill={isInWishlist(product._id) ? 'currentColor' : 'none'}
                />
              </button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 text-sm mb-8 pb-8 border-b border-neutral-100">
              <span
                className={`w-2 h-2 rounded-full ${
                  product.stock > 10
                    ? 'bg-emerald-500'
                    : product.stock > 0
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
              />
              <span className="text-neutral-600">
                {product.stock > 10
                  ? 'In Stock — Ready to ship'
                  : product.stock > 0
                  ? `Low Stock — Only ${product.stock} left`
                  : 'Out of Stock'}
              </span>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-neutral-50">
                <Truck size={20} strokeWidth={1.5} className="text-black" />
                <div>
                  <p className="text-sm font-medium text-black">Free Shipping</p>
                  <p className="text-xs text-neutral-500">On orders over ₹2,999</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-neutral-50">
                <RotateCcw size={20} strokeWidth={1.5} className="text-black" />
                <div>
                  <p className="text-sm font-medium text-black">Easy Returns</p>
                  <p className="text-xs text-neutral-500">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-neutral-50">
                <Shield size={20} strokeWidth={1.5} className="text-black" />
                <div>
                  <p className="text-sm font-medium text-black">Authentic Products</p>
                  <p className="text-xs text-neutral-500">100% genuine guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 pt-16 border-t border-neutral-100">
          <div className="flex gap-8 border-b border-neutral-200 mb-8">
            <button 
              onClick={() => setActiveTab('details')}
              className={`pb-4 text-sm font-medium tracking-wide transition-colors ${
                activeTab === 'details' 
                  ? 'text-black border-b-2 border-black' 
                  : 'text-neutral-400 hover:text-black'
              }`}
            >
              DETAILS
            </button>
            <button 
              onClick={() => setActiveTab('care')}
              className={`pb-4 text-sm font-medium tracking-wide transition-colors ${
                activeTab === 'care' 
                  ? 'text-black border-b-2 border-black' 
                  : 'text-neutral-400 hover:text-black'
              }`}
            >
              CARE
            </button>
            <button 
              onClick={() => setActiveTab('shipping')}
              className={`pb-4 text-sm font-medium tracking-wide transition-colors ${
                activeTab === 'shipping' 
                  ? 'text-black border-b-2 border-black' 
                  : 'text-neutral-400 hover:text-black'
              }`}
            >
              SHIPPING
            </button>
          </div>
          
          <div className="max-w-3xl">
            {activeTab === 'details' && (
              <div className="text-neutral-600 text-sm leading-relaxed space-y-4">
                <p>{product.description}</p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>Premium quality fabric</li>
                  <li>Regular fit design</li>
                  <li>Comfortable for all-day wear</li>
                  <li>Durable construction</li>
                </ul>
              </div>
            )}
            {activeTab === 'care' && (
              <div className="text-neutral-600 text-sm leading-relaxed space-y-4">
                <p>To maintain the quality and longevity of your garment:</p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>Machine wash cold with similar colors</li>
                  <li>Do not bleach</li>
                  <li>Tumble dry low</li>
                  <li>Warm iron if needed</li>
                  <li>Do not dry clean</li>
                </ul>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="text-neutral-600 text-sm leading-relaxed space-y-4">
                <p>We offer fast and reliable shipping across India:</p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>Free shipping on orders over ₹2,999</li>
                  <li>Standard delivery: 5-7 business days</li>
                  <li>Express delivery: 2-3 business days (additional charges apply)</li>
                  <li>Same-day delivery available in select cities</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-16 border-t border-neutral-100">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-2">Complete the Look</p>
                <h2 className="font-display text-3xl md:text-4xl tracking-tight">You May Also Like</h2>
              </div>
              <Link to="/shop" className="text-sm text-neutral-500 hover:text-black underline underline-offset-4 transition-colors hidden md:block">
                View All Products
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
