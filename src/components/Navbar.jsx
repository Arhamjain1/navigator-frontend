import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User, Search, ChevronDown, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();

  const categories = [
    { name: 'T-Shirts', slug: 't-shirts' },
    { name: 'Shirts', slug: 'shirts' },
    { name: 'Sweatshirts', slug: 'sweatshirts' },
    { name: 'Jeans', slug: 'jeans' },
    { name: 'Trousers', slug: 'trousers' },
    { name: 'Jackets', slug: 'jackets' },
  ];

  // Check if we're on homepage
  const isHomepage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic navbar styling based on scroll and page
  const navBg = isScrolled || !isHomepage 
    ? 'bg-white shadow-sm' 
    : 'bg-transparent';
  
  const textColor = isScrolled || !isHomepage 
    ? 'text-black' 
    : 'text-white';

  const logoColor = isScrolled || !isHomepage
    ? 'text-black'
    : 'text-white';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
      style={{ top: isHomepage && !isScrolled ? '40px' : '0' }}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/shop?tag=new-arrivals"
              className={`text-[13px] font-medium tracking-wide ${textColor} hover:opacity-70 transition-opacity`}
            >
              New Arrivals
            </Link>
            
            {/* Shop Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <Link
                to="/shop"
                className={`text-[13px] font-medium tracking-wide ${textColor} hover:opacity-70 transition-opacity flex items-center gap-1`}
              >
                Shop
                <ChevronDown className="w-3.5 h-3.5" />
              </Link>
              
              {showCategories && (
                <div className="absolute top-full left-0 pt-4 w-56">
                  <div className="bg-white shadow-xl py-4">
                    <Link 
                      to="/shop" 
                      className="block px-6 py-2.5 text-sm text-neutral-900 hover:bg-neutral-50 transition-colors font-medium"
                    >
                      View All
                    </Link>
                    <div className="my-2 border-t border-neutral-100" />
                    {categories.map((cat) => (
                      <Link 
                        key={cat.slug}
                        to={`/shop?category=${cat.slug}`} 
                        className="block px-6 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/shop?tag=bestseller"
              className={`text-[13px] font-medium tracking-wide ${textColor} hover:opacity-70 transition-opacity`}
            >
              Bestsellers
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden p-2 ${textColor}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo - Center */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <span className={`font-display text-3xl md:text-4xl tracking-tight ${logoColor} transition-colors duration-300`}>
              NAVIGATOR
            </span>
          </Link>

          {/* Right Icons */}
          <div className="flex items-center space-x-1 md:space-x-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2.5 ${textColor} hover:opacity-70 transition-opacity`}
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            <Link
              to={user ? '/profile' : '/login'}
              className={`hidden md:flex p-2.5 ${textColor} hover:opacity-70 transition-opacity`}
              aria-label="Account"
            >
              <User size={20} strokeWidth={1.5} />
            </Link>

            <Link
              to="/wishlist"
              className={`p-2.5 ${textColor} hover:opacity-70 transition-opacity relative`}
              aria-label="Wishlist"
            >
              <Heart size={20} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] min-w-[16px] h-4 px-1 flex items-center justify-center font-medium">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className={`p-2.5 ${textColor} hover:opacity-70 transition-opacity relative`}
              aria-label="Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="hidden lg:block text-xs bg-black text-white px-4 py-2 ml-2 hover:bg-neutral-800 transition-colors font-medium tracking-wider"
              >
                ADMIN
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-6 px-4 bg-white border-t border-neutral-100 animate-slide-down">
            <form action="/shop" className="flex gap-3 max-w-2xl mx-auto">
              <input
                type="text"
                name="search"
                placeholder="What are you looking for?"
                className="input flex-1 text-base"
                autoFocus
              />
              <button type="submit" className="btn-primary">
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden fixed inset-0 top-0 bg-white z-[60] overflow-y-auto animate-fade-in">
            {/* Mobile Header with Close Button */}
            <div className="sticky top-0 bg-white border-b border-neutral-100 h-16 flex items-center justify-between px-4 z-10">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-black"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
              <span className="font-display text-2xl">NAVIGATOR</span>
              <div className="w-10" /> {/* Spacer for centering */}
            </div>
            <div className="container-custom py-8">
              <div className="flex flex-col space-y-1">
                <Link
                  to="/shop?tag=new-arrivals"
                  className="text-2xl py-3 text-black font-display"
                  onClick={() => setIsOpen(false)}
                >
                  New Arrivals
                </Link>
                <Link
                  to="/shop"
                  className="text-2xl py-3 text-black font-display"
                  onClick={() => setIsOpen(false)}
                >
                  Shop All
                </Link>
                
                <div className="py-4">
                  <p className="text-xs uppercase tracking-widest text-neutral-400 mb-3">Categories</p>
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/shop?category=${cat.slug}`}
                      className="block text-lg py-2 text-neutral-600 hover:text-black transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>

                <Link
                  to="/shop?tag=bestseller"
                  className="text-2xl py-3 text-black font-display"
                  onClick={() => setIsOpen(false)}
                >
                  Bestsellers
                </Link>
                
                <div className="pt-8 mt-4 border-t border-neutral-200">
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        className="block text-lg py-2 text-neutral-600"
                        onClick={() => setIsOpen(false)}
                      >
                        My Account
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block text-lg py-2 text-neutral-600"
                          onClick={() => setIsOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="text-lg py-2 text-neutral-400"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="block text-lg py-2 text-neutral-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In / Register
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
