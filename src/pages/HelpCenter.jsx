import { Link } from 'react-router-dom';
import { ChevronRight, Mail, Phone, MessageCircle, Package, CreditCard, Truck, RefreshCw, Ruler } from 'lucide-react';

const HelpCenter = () => {
  const helpTopics = [
    {
      icon: <Package size={24} />,
      title: 'Orders & Tracking',
      description: 'Track your order, view order history, and manage deliveries',
      link: '/shipping-info'
    },
    {
      icon: <Truck size={24} />,
      title: 'Shipping Information',
      description: 'Delivery times, shipping costs, and available locations',
      link: '/shipping-info'
    },
    {
      icon: <RefreshCw size={24} />,
      title: 'Returns & Exchanges',
      description: 'Return policy, exchange process, and refund information',
      link: '/returns-exchanges'
    },
    {
      icon: <Ruler size={24} />,
      title: 'Size Guide',
      description: 'Find your perfect fit with our comprehensive size charts',
      link: '/size-guide'
    },
    {
      icon: <CreditCard size={24} />,
      title: 'Payment Methods',
      description: 'Accepted payment options and secure checkout',
      link: '#'
    },
    {
      icon: <MessageCircle size={24} />,
      title: 'Contact Us',
      description: 'Get in touch with our customer support team',
      link: '#contact'
    },
  ];

  const faqs = [
    {
      question: 'How can I track my order?',
      answer: 'Once your order is shipped, you will receive an email with tracking information. You can also track your order from your account under "My Orders".'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 7-day return policy for all unworn items with original tags attached. Items must be in their original condition. We do not offer cash refunds - instead, you will receive store credit valid for 3 months.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days within India. Express shipping is available for 2-3 business days delivery.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Currently, we only ship within India. We are working on expanding our shipping to other countries soon.'
    },
    {
      question: 'How do I find my size?',
      answer: 'Visit our Size Guide page for detailed measurements and fitting advice. If you\'re between sizes, we recommend sizing up.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept Credit/Debit cards, UPI, and Cash on Delivery (COD) for orders within India.'
    },
  ];

  return (
    <div className="pt-20 bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-black text-white py-16 md:py-24">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Help Center</span>
          </nav>
          <h1 className="font-display text-4xl md:text-6xl tracking-tight mb-4">Help Center</h1>
          <p className="text-neutral-400 text-lg max-w-xl">
            Find answers to common questions and get the support you need.
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        {/* Help Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {helpTopics.map((topic, index) => (
            <Link
              key={index}
              to={topic.link}
              className="group p-6 border border-neutral-200 hover:border-black transition-colors"
            >
              <div className="text-neutral-400 group-hover:text-black transition-colors mb-4">
                {topic.icon}
              </div>
              <h3 className="font-display text-xl mb-2">{topic.title}</h3>
              <p className="text-neutral-500 text-sm">{topic.description}</p>
            </Link>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-neutral-200 pb-6">
                <h3 className="font-medium text-lg mb-3">{faq.question}</h3>
                <p className="text-neutral-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div id="contact" className="mt-20 bg-neutral-50 p-8 md:p-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-3xl mb-4">Still Need Help?</h2>
            <p className="text-neutral-600 mb-8">
              Our customer support team is here to assist you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a href="mailto:info@navigatorclothing.in" className="flex items-center justify-center gap-3 px-6 py-4 bg-black text-white hover:bg-neutral-800 transition-colors">
                <Mail size={20} />
                <span className="font-medium">info@navigatorclothing.in</span>
              </a>
              <a href="tel:+919876543210" className="flex items-center justify-center gap-3 px-6 py-4 border border-black hover:bg-black hover:text-white transition-colors">
                <Phone size={20} />
                <span className="font-medium">+91 98765 43210</span>
              </a>
            </div>
            <p className="text-sm text-neutral-500 mt-6">
              Available Monday - Saturday, 10:00 AM - 7:00 PM IST
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
