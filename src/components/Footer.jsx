import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube, ArrowRight, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      {/* Newsletter Section */}
      <div className="border-b border-neutral-800">
        <div className="container-custom py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="font-display text-3xl md:text-5xl tracking-tight mb-4">
                JOIN THE MOVEMENT
              </h3>
              <p className="text-neutral-400 text-sm md:text-base max-w-md">
                Subscribe to our newsletter and get 15% off your first order. Stay updated with new arrivals and exclusive offers.
              </p>
            </div>
            <div>
              <form className="flex gap-0">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 bg-transparent border border-neutral-700 px-6 py-4 text-sm focus:outline-none focus:border-white transition-colors placeholder:text-neutral-500"
                />
                <button 
                  type="submit"
                  className="bg-white text-black px-8 py-4 text-sm font-semibold tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-2"
                >
                  SUBSCRIBE
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-display text-3xl tracking-tight">
              NAVIGATOR
            </Link>
            <p className="text-neutral-500 text-sm mt-4 leading-relaxed">
              Redefining men's fashion with timeless style and contemporary design.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-9 h-9 border border-neutral-700 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                <Instagram size={16} strokeWidth={1.5} />
              </a>
              <a href="#" className="w-9 h-9 border border-neutral-700 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                <Twitter size={16} strokeWidth={1.5} />
              </a>
              <a href="#" className="w-9 h-9 border border-neutral-700 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                <Facebook size={16} strokeWidth={1.5} />
              </a>
              <a href="#" className="w-9 h-9 border border-neutral-700 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                <Youtube size={16} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-6">Shop</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/shop?tag=new-arrivals" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/shop?tag=bestseller" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop?sale=true" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-6">Categories</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/shop?category=t-shirts" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/shop?category=shirts" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  Shirts
                </Link>
              </li>
              <li>
                <Link to="/shop?category=jeans" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  Jeans
                </Link>
              </li>
              <li>
                <Link to="/shop?category=jackets" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  Jackets
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-6">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-neutral-500 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-300 text-sm">Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-neutral-500 flex-shrink-0" />
                <span className="text-neutral-300 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-neutral-500 flex-shrink-0" />
                <span className="text-neutral-300 text-sm">hello@navigator.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-500 text-xs tracking-wide">
              © {currentYear} NAVIGATOR. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-neutral-500 hover:text-white text-xs tracking-wide transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-neutral-500 hover:text-white text-xs tracking-wide transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-neutral-500 hover:text-white text-xs tracking-wide transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
