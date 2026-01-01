import { Link } from 'react-router-dom';
import { ChevronRight, RefreshCw, Package, CheckCircle, XCircle, Clock, Wallet, Gift } from 'lucide-react';

const ReturnsExchanges = () => {
  return (
    <div className="pt-20 bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-black text-white py-16 md:py-24">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/help-center" className="hover:text-white transition-colors">Help Center</Link>
            <ChevronRight size={14} />
            <span className="text-white">Returns & Exchanges</span>
          </nav>
          <h1 className="font-display text-4xl md:text-6xl tracking-tight mb-4">Returns & Exchanges</h1>
          <p className="text-neutral-400 text-lg max-w-xl">
            Easy returns within 7 days. Get store credit for your next purchase.
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          {/* Important Notice */}
          <section className="mb-12">
            <div className="bg-amber-50 border border-amber-200 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <Wallet className="text-amber-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-display text-lg mb-2 text-amber-800">Store Credit Policy</h3>
                  <p className="text-amber-700">
                    We do not offer cash refunds. All eligible returns will receive <strong>store credit</strong> that can be used for any future purchase within <strong>3 months</strong> of issue.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Return Policy Overview */}
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-8 border border-neutral-200">
                <Clock size={40} className="mx-auto mb-4 text-neutral-700" />
                <h3 className="font-display text-xl mb-2">7-Day Returns</h3>
                <p className="text-neutral-500 text-sm">Return any item within 7 days of delivery</p>
              </div>
              <div className="text-center p-8 border border-neutral-200">
                <Gift size={40} className="mx-auto mb-4 text-neutral-700" />
                <h3 className="font-display text-xl mb-2">Store Credit</h3>
                <p className="text-neutral-500 text-sm">Receive credit valid for 3 months</p>
              </div>
              <div className="text-center p-8 border border-neutral-200">
                <RefreshCw size={40} className="mx-auto mb-4 text-neutral-700" />
                <h3 className="font-display text-xl mb-2">Free Exchanges</h3>
                <p className="text-neutral-500 text-sm">Exchange for different size or color</p>
              </div>
            </div>
          </section>

          {/* Eligible Items */}
          <section className="mb-16">
            <h2 className="font-display text-2xl mb-8">Return Eligibility</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-green-50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="text-green-600" size={24} />
                  <h3 className="font-medium text-lg">Eligible for Return</h3>
                </div>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Unworn items with original tags attached</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Items in original packaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Items returned within 7 days of delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Defective or damaged items (report within 48 hours)</span>
                  </li>
                </ul>
              </div>
              <div className="bg-red-50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="text-red-600" size={24} />
                  <h3 className="font-medium text-lg">Not Eligible for Return</h3>
                </div>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Worn, washed, or altered items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Items without original tags</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Items marked as "Final Sale"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Undergarments and swimwear (for hygiene reasons)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* How to Return */}
          <section className="mb-16">
            <h2 className="font-display text-2xl mb-8">How to Initiate a Return</h2>
            <div className="space-y-6">
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center flex-shrink-0 font-display">1</div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Contact Us</h3>
                  <p className="text-neutral-600">Email us at <a href="mailto:info@navigatorclothing.in" className="text-black underline">info@navigatorclothing.in</a> with your order number and reason for return.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center flex-shrink-0 font-display">2</div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Get Return Approval</h3>
                  <p className="text-neutral-600">Our team will review your request and send you return instructions within 24-48 hours.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center flex-shrink-0 font-display">3</div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Ship the Item</h3>
                  <p className="text-neutral-600">Pack the item securely with all original tags and packaging. Ship to the address provided.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center flex-shrink-0 font-display">4</div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Receive Store Credit</h3>
                  <p className="text-neutral-600">Once we receive and inspect the item, you'll receive store credit via email within 3-5 business days.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Store Credit Information */}
          <section className="mb-16">
            <h2 className="font-display text-2xl mb-8">Store Credit Information</h2>
            <div className="bg-neutral-50 p-6 md:p-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b border-neutral-200">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">₹</div>
                  <div>
                    <h3 className="font-medium mb-1">Credit Value</h3>
                    <p className="text-neutral-600 text-sm">Store credit will be issued for the full value of the returned item(s), excluding original shipping charges.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-4 border-b border-neutral-200">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">⏱</div>
                  <div>
                    <h3 className="font-medium mb-1">Validity Period</h3>
                    <p className="text-neutral-600 text-sm">Store credit is valid for <strong>3 months</strong> from the date of issue. Unused credit will expire after this period.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-4 border-b border-neutral-200">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">✉</div>
                  <div>
                    <h3 className="font-medium mb-1">How to Use</h3>
                    <p className="text-neutral-600 text-sm">You'll receive a unique credit code via email. Apply this code at checkout to redeem your credit.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">∞</div>
                  <div>
                    <h3 className="font-medium mb-1">Stackable</h3>
                    <p className="text-neutral-600 text-sm">Store credits can be combined with other promotions and discount codes.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Exchange Information */}
          <section className="mb-16">
            <h2 className="font-display text-2xl mb-8">Exchange Policy</h2>
            <div className="bg-blue-50 border border-blue-100 p-6 md:p-8">
              <p className="text-blue-900 mb-4">
                Need a different size or color? We're happy to help with exchanges!
              </p>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Exchanges are subject to availability of the desired item</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>No additional shipping charges for exchanges within India</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Price difference (if any) will be adjusted via store credit or additional payment</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-black text-white p-8 md:p-12 text-center">
            <h2 className="font-display text-2xl mb-4">Need Help with Your Return?</h2>
            <p className="text-neutral-400 mb-6">Our support team is ready to assist you.</p>
            <a href="mailto:info@navigatorclothing.in" className="inline-block bg-white text-black px-8 py-3 font-medium hover:bg-neutral-200 transition-colors">
              info@navigatorclothing.in
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReturnsExchanges;
