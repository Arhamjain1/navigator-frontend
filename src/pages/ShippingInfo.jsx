import { Link } from 'react-router-dom';
import { ChevronRight, Truck, Clock, MapPin, Package } from 'lucide-react';

const ShippingInfo = () => {
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
            <span className="text-white">Shipping Info</span>
          </nav>
          <h1 className="font-display text-4xl md:text-6xl tracking-tight mb-4">Shipping Information</h1>
          <p className="text-neutral-400 text-lg max-w-xl">
            Everything you need to know about delivery times, costs, and tracking.
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          {/* Delivery Options */}
          <section className="mb-16">
            <h2 className="font-display text-2xl mb-8 flex items-center gap-3">
              <Truck size={28} />
              Delivery Options
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-neutral-200">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="text-left p-4 font-medium border-b">Shipping Method</th>
                    <th className="text-left p-4 font-medium border-b">Delivery Time</th>
                    <th className="text-left p-4 font-medium border-b">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">Standard Shipping</td>
                    <td className="p-4">5-7 Business Days</td>
                    <td className="p-4">₹199 (Free on orders above ₹2,999)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Express Shipping</td>
                    <td className="p-4">2-3 Business Days</td>
                    <td className="p-4">₹399</td>
                  </tr>
                  <tr>
                    <td className="p-4">Same Day Delivery*</td>
                    <td className="p-4">Same Day</td>
                    <td className="p-4">₹599</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-neutral-500 mt-4">
              *Same day delivery available only in select metro cities for orders placed before 12 PM.
            </p>
          </section>

          {/* Processing Time */}
          <section className="mb-16">
            <h2 className="font-display text-2xl mb-8 flex items-center gap-3">
              <Clock size={28} />
              Processing Time
            </h2>
            <div className="bg-neutral-50 p-6 md:p-8">
              <ul className="space-y-4 text-neutral-700">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></span>
                  <span>Orders are typically processed within 1-2 business days.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></span>
                  <span>Orders placed on weekends or holidays will be processed on the next business day.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></span>
                  <span>You will receive a confirmation email once your order has been shipped with tracking details.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Delivery Areas */}
          <section className="mb-16">
            <h2 className="font-display text-2xl mb-8 flex items-center gap-3">
              <MapPin size={28} />
              Delivery Areas
            </h2>
            <div className="prose prose-neutral max-w-none">
              <p className="text-neutral-700 mb-4">
                We currently deliver to all major cities and towns across India. Our delivery network covers:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {['Maharashtra', 'Delhi NCR', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'West Bengal', 'Telangana'].map((state) => (
                  <div key={state} className="bg-neutral-50 p-4 text-center">
                    <span className="font-medium">{state}</span>
                  </div>
                ))}
              </div>
              <p className="text-neutral-500 text-sm mt-6">
                For remote areas, delivery may take an additional 2-3 business days.
              </p>
            </div>
          </section>

          {/* Order Tracking */}
          <section className="mb-16">
            <h2 className="font-display text-2xl mb-8 flex items-center gap-3">
              <Package size={28} />
              Order Tracking
            </h2>
            <div className="border border-neutral-200 p-6 md:p-8">
              <h3 className="font-medium text-lg mb-4">How to Track Your Order</h3>
              <ol className="list-decimal list-inside space-y-3 text-neutral-700">
                <li>Once your order is shipped, you'll receive an email with your tracking number.</li>
                <li>Click the tracking link in the email or visit our partner courier's website.</li>
                <li>Enter your tracking number to see real-time updates on your delivery.</li>
                <li>You can also track your order by logging into your account and visiting "My Orders".</li>
              </ol>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-black text-white p-8 md:p-12 text-center">
            <h2 className="font-display text-2xl mb-4">Have Questions About Your Delivery?</h2>
            <p className="text-neutral-400 mb-6">Our support team is ready to help you.</p>
            <Link to="/help-center" className="inline-block bg-white text-black px-8 py-3 font-medium hover:bg-neutral-200 transition-colors">
              Contact Support
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
