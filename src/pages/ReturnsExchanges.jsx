import { Link } from 'react-router-dom';
import { ChevronRight, RefreshCw, Package, CheckCircle, XCircle, Clock } from 'lucide-react';

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
            Easy returns within 7 days. Your satisfaction is our priority.
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          {/* Return Policy Overview */}
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-8 border border-neutral-200">
                <Clock size={40} className="mx-auto mb-4 text-neutral-700" />
                <h3 className="font-display text-xl mb-2">7-Day Returns</h3>
                <p className="text-neutral-500 text-sm">Return any item within 7 days of delivery</p>
              </div>
              <div className="text-center p-8 border border-neutral-200">
                <RefreshCw size={40} className="mx-auto mb-4 text-neutral-700" />
                <h3 className="font-display text-xl mb-2">Free Exchanges</h3>
                <p className="text-neutral-500 text-sm">Exchange for a different size or color at no extra cost</p>
              </div>
              <div className="text-center p-8 border border-neutral-200">
                <Package size={40} className="mx-auto mb-4 text-neutral-700" />
                <h3 className="font-display text-xl mb-2">Easy Process</h3>
                <p className="text-neutral-500 text-sm">Simple online return request and doorstep pickup</p>
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
                  <h3 className="font-medium text-lg mb-2">Log into Your Account</h3>
                  <p className="text-neutral-600">Go to "My Orders" and select the order containing the item you wish to return.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center flex-shrink-0 font-display">2</div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Select Items to Return</h3>
                  <p className="text-neutral-600">Choose the item(s) you want to return and select a reason for the return.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center flex-shrink-0 font-display">3</div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Schedule Pickup</h3>
                  <p className="text-neutral-600">Choose a convenient date and time for our courier partner to pick up the item.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center flex-shrink-0 font-display">4</div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Receive Refund</h3>
                  <p className="text-neutral-600">Once we receive and inspect the item, your refund will be processed within 5-7 business days.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Refund Information */}
          <section className="mb-16">
            <h2 className="font-display text-2xl mb-8">Refund Information</h2>
            <div className="bg-neutral-50 p-6 md:p-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-300">
                    <th className="text-left py-4 font-medium">Original Payment Method</th>
                    <th className="text-left py-4 font-medium">Refund Method</th>
                    <th className="text-left py-4 font-medium">Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-200">
                    <td className="py-4">Credit/Debit Card</td>
                    <td className="py-4">Original Card</td>
                    <td className="py-4">5-7 Business Days</td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="py-4">UPI</td>
                    <td className="py-4">Original UPI ID</td>
                    <td className="py-4">3-5 Business Days</td>
                  </tr>
                  <tr>
                    <td className="py-4">Cash on Delivery</td>
                    <td className="py-4">Bank Transfer / Store Credit</td>
                    <td className="py-4">5-7 Business Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-black text-white p-8 md:p-12 text-center">
            <h2 className="font-display text-2xl mb-4">Need Help with Your Return?</h2>
            <p className="text-neutral-400 mb-6">Our support team is ready to assist you.</p>
            <Link to="/help-center" className="inline-block bg-white text-black px-8 py-3 font-medium hover:bg-neutral-200 transition-colors">
              Contact Support
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReturnsExchanges;
