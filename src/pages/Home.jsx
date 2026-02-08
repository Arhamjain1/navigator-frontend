import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Truck, RotateCcw, Shield, Headphones, ChevronRight } from 'lucide-react';
import { productsAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const heroSlides = [
    {
      title: 'WINTER',
      subtitle: 'COLLECTION',
      description: 'Discover the latest trends in winter fashion',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1920&q=80',
      cta: 'Shop Winter',
      link: '/shop?tag=winter'
    }
  ];

  const categories = [
    {
      name: 'New Arrivals',
      slug: 'new-arrivals',
      tag: 'new-arrivals',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
      description: 'Just Dropped'
    },
    {
      name: 'Polo Shirts',
      slug: 'polo-shirts',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
      description: 'Classic Style'
    },
    {
      name: 'Knit Polos',
      slug: 'knit-polo-shirts',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
      description: 'Premium Knits'
    },
    {
      name: 'Zip Polos',
      slug: 'zip-polo-shirts',
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
      description: 'Modern Edge'
    },
  ];

  const collectionBanners = [
    {
      title: 'Street Style',
      subtitle: 'Urban Edge Collection',
      image: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=800&h=1000&fit=crop&crop=top&q=80',
      link: '/shop?style=street'
    },
    {
      title: 'Premium Basics',
      subtitle: 'Everyday Essentials',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=1000&fit=crop&crop=top&q=80',
      link: '/shop?style=basics'
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featuredRes, newRes, bestRes] = await Promise.all([
          productsAPI.getAll({ featured: true, limit: 8 }),
          productsAPI.getAll({ sort: 'newest', limit: 8 }),
          productsAPI.getAll({ tag: 'bestseller', limit: 4 }),
        ]);
        setFeaturedProducts(featuredRes.data.products);
        setNewArrivals(newRes.data.products);
        setBestsellers(bestRes.data.products.length > 0 ? bestRes.data.products : featuredRes.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <Loading fullScreen />;

  return (
    <div>
      {/* Hero Section - Full Width Immersive with Video Option */}
      <section className="relative w-full h-screen md:h-[90vh] overflow-hidden bg-black -mt-[88px]">
        {/* Video/Image Background */}
        <div className="absolute inset-0">
          {/* Video background - using a fashion video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=90"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-a-young-man-walking-down-the-street-wearing-stylish-clothes-34470-large.mp4" type="video/mp4" />
          </video>
          {/* Fallback image if video doesn't load */}
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=90"
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        </div>

        {/* Hero Content - Centered Bold Typography */}
        <div className="relative h-full flex items-center justify-center text-center pt-20">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <p className="text-white/70 text-xs md:text-sm uppercase tracking-[0.4em] mb-6 animate-fade-in">
                New Season 2026
              </p>

              {/* Bold Display Typography - NUDE Project Style */}
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold text-white tracking-tight mb-4 animate-slide-up leading-[0.9]">
                NAVIGATOR
              </h1>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white/80 tracking-[0.2em] mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                PREMIUM MENSWEAR
              </h2>

              <div className="flex flex-wrap justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Link to="/shop" className="btn-white text-xs tracking-[0.2em]">
                  SHOP NOW
                  <ArrowRight className="ml-3" size={16} />
                </Link>
                <Link to="/shop?tag=new-arrivals" className="btn bg-transparent text-white border border-white/50 hover:bg-white hover:text-black text-xs tracking-[0.2em]">
                  NEW ARRIVALS
                </Link>
              </div>

              {/* Scroll indicator */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <ChevronRight size={24} className="text-white/50 rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Collection Banner - NUDE Project Style */}
      <section className="bg-black text-white py-6 overflow-hidden">
        <div className="flex animate-marquee-slow whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="text-2xl md:text-4xl font-display tracking-wider mx-8">NEW COLLECTION</span>
              <span className="text-white/30 mx-4">★</span>
              <span className="text-2xl md:text-4xl font-display tracking-wider mx-8">POLO SHIRTS</span>
              <span className="text-white/30 mx-4">★</span>
              <span className="text-2xl md:text-4xl font-display tracking-wider mx-8">PREMIUM KNITS</span>
              <span className="text-white/30 mx-4">★</span>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes marquee-slow {
            0% { transform: translateX(0); }
            100% { transform: translateX(-25%); }
          }
          .animate-marquee-slow {
            animation: marquee-slow 20s linear infinite;
          }
        `}</style>
      </section>

      {/* Category Grid - Nike Style */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm uppercase tracking-widest text-neutral-500 mb-2">Explore</p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl">Shop by Category</h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-sm font-medium hover:underline">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={cat.tag ? `/shop?tag=${cat.tag}` : `/shop?category=${cat.slug}`}
                className="category-card aspect-[3/4]"
              >
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover object-top" />
                <div className="category-card-overlay" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
                  <span className="text-white/70 text-xs uppercase tracking-widest mb-1">{cat.description}</span>
                  <h3 className="text-white font-display text-2xl md:text-3xl">{cat.name}</h3>
                  <div className="mt-4 flex items-center gap-2 text-white text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Shop Now <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm uppercase tracking-widest text-neutral-500 mb-2">What's Hot</p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl">Trending Now</h2>
            </div>
            <Link to="/shop?tag=bestseller" className="hidden md:flex items-center gap-2 text-sm font-medium hover:underline">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {bestsellers.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Split Banner Section - Ralph Lauren Style */}
      <section className="grid md:grid-cols-2">
        {collectionBanners.map((banner, index) => (
          <Link
            key={index}
            to={banner.link}
            className="relative aspect-[3/4] overflow-hidden group"
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
              <p className="text-white/80 text-sm uppercase tracking-widest mb-2">{banner.subtitle}</p>
              <h3 className="font-display text-4xl md:text-5xl text-white mb-6">{banner.title}</h3>
              <div className="flex items-center gap-2 text-white font-medium">
                <span className="border-b border-white pb-1">Shop Collection</span>
                <ArrowRight size={18} />
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* New Arrivals - Grid Layout */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm uppercase tracking-widest text-neutral-500 mb-2">Fresh Drops</p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl">New Arrivals</h2>
            </div>
            <Link to="/shop?sort=newest" className="hidden md:flex items-center gap-2 text-sm font-medium hover:underline">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {/* Grid Layout like Featured Products */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {newArrivals.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link to="/shop?sort=newest" className="text-sm font-medium hover:underline inline-flex items-center gap-2">
              View All New Arrivals <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Statement Banner */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
            alt="Brand"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative container-custom text-center">
          <h2 className="font-display text-5xl md:text-7xl lg:text-[100px] text-white leading-none mb-8">
            DEFINE YOUR<br />STYLE
          </h2>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Premium quality meets contemporary design. Discover pieces that speak to who you are.
          </p>
          <Link to="/shop" className="btn-white">
            Explore Collection
            <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm uppercase tracking-widest text-neutral-500 mb-2">Handpicked</p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl">Featured Picks</h2>
            </div>
            <Link to="/shop?featured=true" className="hidden md:flex items-center gap-2 text-sm font-medium hover:underline">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/shop" className="btn-secondary">
              Shop All Products
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Strip */}
      <section className="py-12 md:py-16 bg-black text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            <div className="flex flex-col items-center text-center">
              <Truck className="w-8 h-8 mb-4" strokeWidth={1.5} />
              <h3 className="font-medium mb-1">Free Shipping</h3>
              <p className="text-white/60 text-sm">On orders over ₹2,999</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <RotateCcw className="w-8 h-8 mb-4" strokeWidth={1.5} />
              <h3 className="font-medium mb-1">Easy Returns</h3>
              <p className="text-white/60 text-sm">7-day return policy</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="w-8 h-8 mb-4" strokeWidth={1.5} />
              <h3 className="font-medium mb-1">Secure Payment</h3>
              <p className="text-white/60 text-sm">100% secure checkout</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Headphones className="w-8 h-8 mb-4" strokeWidth={1.5} />
              <h3 className="font-medium mb-1">24/7 Support</h3>
              <p className="text-white/60 text-sm">Dedicated support team</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

