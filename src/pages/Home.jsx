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
      image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80',
      description: 'Just Dropped'
    },
    {
      name: 'Jackets & Coats',
      slug: 'jackets',
      image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80',
      description: 'Stay Warm'
    },
    {
      name: 'T-Shirts',
      slug: 't-shirts',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
      description: 'Essentials'
    },
    {
      name: 'Jeans',
      slug: 'jeans',
      image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&q=80',
      description: 'Denim Edit'
    },
  ];

  const collectionBanners = [
    {
      title: 'Street Style',
      subtitle: 'Urban Edge Collection',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80',
      link: '/shop?style=street'
    },
    {
      title: 'Premium Basics',
      subtitle: 'Everyday Essentials',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80',
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
      {/* Announcement Bar */}
      <div className="bg-black text-white py-2.5 text-center text-sm overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex">
          <span className="mx-8">FREE SHIPPING ON ORDERS OVER ₹2,999</span>
          <span className="mx-8">•</span>
          <span className="mx-8">NEW ARRIVALS EVERY WEEK</span>
          <span className="mx-8">•</span>
          <span className="mx-8">30-DAY EASY RETURNS</span>
          <span className="mx-8">•</span>
          <span className="mx-8">FREE SHIPPING ON ORDERS OVER ₹2,999</span>
          <span className="mx-8">•</span>
          <span className="mx-8">NEW ARRIVALS EVERY WEEK</span>
          <span className="mx-8">•</span>
          <span className="mx-8">30-DAY EASY RETURNS</span>
        </div>
      </div>

      {/* Hero Section - Full Width Immersive */}
      <section className="relative h-[100vh] min-h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1920&h=1280&fit=crop&q=90"
            alt="Hero"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container-custom">
            <div className="max-w-2xl">
              <p className="text-white/80 text-sm md:text-base uppercase tracking-[0.3em] mb-4 animate-fade-in">
                {heroSlides[0].description}
              </p>
              <h1 className="hero-title text-white mb-2 animate-slide-up">
                {heroSlides[0].title}
              </h1>
              <h1 className="hero-title text-white/90 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {heroSlides[0].subtitle}
              </h1>
              <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Link to="/shop" className="btn-white">
                  {heroSlides[0].cta}
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link to="/shop?tag=new-arrivals" className="btn bg-transparent text-white border-2 border-white hover:bg-white hover:text-black">
                  New Arrivals
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </div>
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
            {categories.map((cat, index) => (
              <Link
                key={cat.slug}
                to={cat.tag ? `/shop?tag=${cat.tag}` : `/shop?category=${cat.slug}`}
                className="category-card aspect-[3/4] md:aspect-[4/5]"
              >
                <img src={cat.image} alt={cat.name} />
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
            className="relative h-[500px] md:h-[700px] overflow-hidden group"
          >
            <img
              src={`${banner.image}&fit=crop`}
              alt={banner.title}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
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

      {/* New Arrivals - Full Width Scroll */}
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
        </div>

        {/* Horizontal Scroll */}
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-4 md:gap-6 px-4 md:px-12 pb-4" style={{ width: 'max-content' }}>
            {newArrivals.map((product) => (
              <div key={product._id} className="w-[280px] md:w-[320px] flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <div className="container-custom mt-8 md:hidden">
          <Link to="/shop?sort=newest" className="flex items-center gap-2 text-sm font-medium hover:underline">
            View All New Arrivals <ChevronRight size={16} />
          </Link>
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
              <p className="text-white/60 text-sm">30-day return policy</p>
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

      {/* Newsletter Section */}
      <section className="py-20 md:py-32 bg-neutral-100">
        <div className="container-custom text-center">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">Stay in the Loop</h2>
          <p className="text-neutral-600 mb-8 max-w-md mx-auto">
            Subscribe to get special offers, free giveaways, and new arrivals updates.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="input flex-1"
            />
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
