import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutGrid, ChevronRight } from 'lucide-react';
import { productsAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [gridCols, setGridCols] = useState(4);

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 't-shirts', label: 'T-Shirts' },
    { value: 'shirts', label: 'Shirts' },
    { value: 'sweatshirts', label: 'Sweatshirts' },
    { value: 'jeans', label: 'Jeans' },
    { value: 'trousers', label: 'Trousers' },
    { value: 'jackets', label: 'Jackets' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name A-Z' },
  ];

  const priceRanges = [
    { min: 0, max: 1500, label: 'Under ₹1,500' },
    { min: 1500, max: 2500, label: '₹1,500 - ₹2,500' },
    { min: 2500, max: 4000, label: '₹2,500 - ₹4,000' },
    { min: 4000, max: 6000, label: '₹4,000 - ₹6,000' },
    { min: 6000, max: 999999, label: 'Over ₹6,000' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          category: searchParams.get('category') || undefined,
          search: searchParams.get('search') || undefined,
          sort: searchParams.get('sort') || 'newest',
          minPrice: searchParams.get('minPrice') || undefined,
          maxPrice: searchParams.get('maxPrice') || undefined,
          featured: searchParams.get('featured') || undefined,
          tag: searchParams.get('tag') || undefined,
          page: searchParams.get('page') || 1,
          limit: 12,
        };

        const response = await productsAPI.getAll(params);
        setProducts(response.data.products);
        setPagination({
          page: response.data.page,
          pages: response.data.pages,
          total: response.data.total,
        });
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const activeFiltersCount = Array.from(searchParams.entries()).filter(
    ([key]) => !['page', 'sort'].includes(key)
  ).length;

  const getPageTitle = () => {
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    
    if (search) return `Search Results`;
    if (tag === 'new-arrivals') return 'New Arrivals';
    if (tag === 'bestseller') return 'Bestsellers';
    if (category) {
      const cat = categories.find(c => c.value === category);
      return cat ? cat.label : 'Shop';
    }
    return 'All Products';
  };

  const getPageSubtitle = () => {
    const search = searchParams.get('search');
    if (search) return `${pagination.total} results for "${search}"`;
    return 'Discover our curated collection of premium men\'s fashion';
  };

  // Hero image based on category
  const getHeroImage = () => {
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    
    if (tag === 'new-arrivals') return 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80';
    if (tag === 'bestseller') return 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=1920&q=80';
    if (category === 'jackets') return 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1920&q=80';
    if (category === 't-shirts') return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1920&q=80';
    if (category === 'jeans') return 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=1920&q=80';
    return 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80';
  };

  return (
    <div className="pt-20 bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img 
          src={getHeroImage()}
          alt={getPageTitle()}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-custom pb-12 md:pb-16">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-4">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={14} />
              <span className="text-white">Shop</span>
              {searchParams.get('category') && (
                <>
                  <ChevronRight size={14} />
                  <span className="text-white capitalize">{searchParams.get('category')}</span>
                </>
              )}
            </nav>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white tracking-tight mb-3">
              {getPageTitle()}
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-xl">
              {getPageSubtitle()}
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-10 md:py-14">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2.5 px-5 py-3 border border-neutral-200 hover:border-black bg-white transition-colors text-sm"
            >
              <SlidersHorizontal size={16} strokeWidth={1.5} />
              <span className="font-medium tracking-wide">FILTERS</span>
              {activeFiltersCount > 0 && (
                <span className="bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center font-medium">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-neutral-500 hover:text-black flex items-center gap-1.5 transition-colors"
              >
                <X size={14} />
                Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-5">
            <span className="text-neutral-500 text-sm">
              {pagination.total} products
            </span>
            
            {/* Grid Toggle */}
            <div className="hidden md:flex items-center gap-1 border border-neutral-200 p-1 bg-white">
              <button 
                onClick={() => setGridCols(2)}
                className={`p-2 transition-colors ${gridCols === 2 ? 'bg-black text-white' : 'text-neutral-400 hover:text-black'}`}
              >
                <LayoutGrid size={14} />
              </button>
              <button 
                onClick={() => setGridCols(3)}
                className={`p-2 transition-colors ${gridCols === 3 ? 'bg-black text-white' : 'text-neutral-400 hover:text-black'}`}
              >
                <Grid3X3 size={14} />
              </button>
              <button 
                onClick={() => setGridCols(4)}
                className={`p-2 transition-colors ${gridCols === 4 ? 'bg-black text-white' : 'text-neutral-400 hover:text-black'}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="4" height="4" />
                  <rect x="10" y="3" width="4" height="4" />
                  <rect x="17" y="3" width="4" height="4" />
                  <rect x="3" y="10" width="4" height="4" />
                  <rect x="10" y="10" width="4" height="4" />
                  <rect x="17" y="10" width="4" height="4" />
                  <rect x="3" y="17" width="4" height="4" />
                  <rect x="10" y="17" width="4" height="4" />
                  <rect x="17" y="17" width="4" height="4" />
                </svg>
              </button>
            </div>
            
            <div className="relative">
              <select
                value={searchParams.get('sort') || 'newest'}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="appearance-none bg-white border border-neutral-200 px-5 py-3 pr-12 focus:outline-none focus:border-black text-sm font-medium tracking-wide cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters Sidebar */}
          <aside
            className={`lg:w-56 flex-shrink-0 ${
              filtersOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="space-y-8 sticky top-28">
              {/* Categories */}
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-5">Categories</h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => updateFilter('category', cat.value)}
                      className={`block w-full text-left py-2 transition-colors text-sm ${
                        (searchParams.get('category') || 'all') === cat.value
                          ? 'text-black font-medium'
                          : 'text-neutral-500 hover:text-black'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-5">Price Range</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('minPrice');
                      newParams.delete('maxPrice');
                      newParams.delete('page');
                      setSearchParams(newParams);
                    }}
                    className={`block w-full text-left py-2 transition-colors text-sm ${
                      !searchParams.get('minPrice')
                        ? 'text-black font-medium'
                        : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    All Prices
                  </button>
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set('minPrice', range.min.toString());
                        newParams.set('maxPrice', range.max.toString());
                        newParams.delete('page');
                        setSearchParams(newParams);
                      }}
                      className={`block w-full text-left py-2 transition-colors text-sm ${
                        searchParams.get('minPrice') === range.min.toString()
                          ? 'text-black font-medium'
                          : 'text-neutral-500 hover:text-black'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-5">Collections</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => updateFilter('tag', 'new-arrivals')}
                    className={`block w-full text-left py-2 transition-colors text-sm ${
                      searchParams.get('tag') === 'new-arrivals'
                        ? 'text-black font-medium'
                        : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    New Arrivals
                  </button>
                  <button
                    onClick={() => updateFilter('tag', 'bestseller')}
                    className={`block w-full text-left py-2 transition-colors text-sm ${
                      searchParams.get('tag') === 'bestseller'
                        ? 'text-black font-medium'
                        : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    Bestsellers
                  </button>
                  <button
                    onClick={() => updateFilter('featured', 'true')}
                    className={`block w-full text-left py-2 transition-colors text-sm ${
                      searchParams.get('featured') === 'true'
                        ? 'text-black font-medium'
                        : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    Featured
                  </button>
                </div>
              </div>

              {/* Promo Banner */}
              <div className="relative overflow-hidden mt-8">
                <img 
                  src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80"
                  alt="New Collection"
                  className="w-full aspect-[3/4] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[10px] text-white/70 uppercase tracking-widest mb-1">New Season</p>
                  <h4 className="font-display text-xl text-white mb-3">Fall Collection</h4>
                  <Link to="/shop?tag=new-arrivals" className="text-xs text-white underline underline-offset-4 hover:no-underline">
                    Explore Now
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <Loading />
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <h3 className="font-display text-2xl text-black mb-3">No products found</h3>
                <p className="text-neutral-500 mb-8">Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className={`grid grid-cols-2 ${
                  gridCols === 4 ? 'lg:grid-cols-4' : gridCols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
                } gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14`}>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-16 pt-10 border-t border-neutral-100">
                    <button
                      onClick={() => updateFilter('page', Math.max(1, pagination.page - 1).toString())}
                      disabled={pagination.page === 1}
                      className="px-5 py-2.5 border border-neutral-200 text-sm font-medium tracking-wide disabled:opacity-30 disabled:cursor-not-allowed hover:border-black transition-colors"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => updateFilter('page', page.toString())}
                        className={`w-10 h-10 flex items-center justify-center text-sm transition-colors ${
                          pagination.page === page
                            ? 'bg-black text-white'
                            : 'border border-neutral-200 hover:border-black text-neutral-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => updateFilter('page', Math.min(pagination.pages, pagination.page + 1).toString())}
                      disabled={pagination.page === pagination.pages}
                      className="px-5 py-2.5 border border-neutral-200 text-sm font-medium tracking-wide disabled:opacity-30 disabled:cursor-not-allowed hover:border-black transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
