import { Link } from 'react-router-dom';
import { ChevronRight, Ruler } from 'lucide-react';
import { useState } from 'react';

const SizeGuide = () => {
  const [activeTab, setActiveTab] = useState('tops');

  const topsSizes = [
    { size: 'XS', chest: '34-36', shoulder: '16', length: '26' },
    { size: 'S', chest: '36-38', shoulder: '17', length: '27' },
    { size: 'M', chest: '38-40', shoulder: '18', length: '28' },
    { size: 'L', chest: '40-42', shoulder: '19', length: '29' },
    { size: 'XL', chest: '42-44', shoulder: '20', length: '30' },
    { size: 'XXL', chest: '44-46', shoulder: '21', length: '31' },
  ];

  const bottomsSizes = [
    { size: '28', waist: '28', hip: '36', inseam: '30' },
    { size: '30', waist: '30', hip: '38', inseam: '30' },
    { size: '32', waist: '32', hip: '40', inseam: '32' },
    { size: '34', waist: '34', hip: '42', inseam: '32' },
    { size: '36', waist: '36', hip: '44', inseam: '32' },
    { size: '38', waist: '38', hip: '46', inseam: '32' },
  ];

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
            <span className="text-white">Size Guide</span>
          </nav>
          <h1 className="font-display text-4xl md:text-6xl tracking-tight mb-4">Size Guide</h1>
          <p className="text-neutral-400 text-lg max-w-xl">
            Find your perfect fit with our comprehensive size charts.
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          {/* How to Measure */}
          <section className="mb-16">
            <h2 className="font-display text-2xl mb-8 flex items-center gap-3">
              <Ruler size={28} />
              How to Measure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-neutral-50 p-6">
                <h3 className="font-medium text-lg mb-4">For Tops</h3>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">Chest:</span>
                    <span>Measure around the fullest part of your chest, keeping the tape horizontal.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">Shoulder:</span>
                    <span>Measure from one shoulder point to the other across your back.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">Length:</span>
                    <span>Measure from the highest point of the shoulder to the desired length.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-neutral-50 p-6">
                <h3 className="font-medium text-lg mb-4">For Bottoms</h3>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">Waist:</span>
                    <span>Measure around your natural waistline, keeping the tape comfortably loose.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">Hip:</span>
                    <span>Measure around the fullest part of your hips.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">Inseam:</span>
                    <span>Measure from the crotch to the bottom of the leg.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Size Charts */}
          <section className="mb-16">
            <h2 className="font-display text-2xl mb-8">Size Charts</h2>
            
            {/* Tabs */}
            <div className="flex border-b border-neutral-200 mb-8">
              <button
                onClick={() => setActiveTab('tops')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'tops'
                    ? 'text-black border-b-2 border-black'
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                Tops & Jackets
              </button>
              <button
                onClick={() => setActiveTab('bottoms')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'bottoms'
                    ? 'text-black border-b-2 border-black'
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                Jeans & Trousers
              </button>
            </div>

            {/* Tops Size Chart */}
            {activeTab === 'tops' && (
              <div className="overflow-x-auto">
                <table className="w-full border border-neutral-200">
                  <thead>
                    <tr className="bg-black text-white">
                      <th className="p-4 text-left font-medium">Size</th>
                      <th className="p-4 text-left font-medium">Chest (inches)</th>
                      <th className="p-4 text-left font-medium">Shoulder (inches)</th>
                      <th className="p-4 text-left font-medium">Length (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topsSizes.map((row, index) => (
                      <tr key={row.size} className={index % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}>
                        <td className="p-4 font-medium">{row.size}</td>
                        <td className="p-4">{row.chest}</td>
                        <td className="p-4">{row.shoulder}</td>
                        <td className="p-4">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Bottoms Size Chart */}
            {activeTab === 'bottoms' && (
              <div className="overflow-x-auto">
                <table className="w-full border border-neutral-200">
                  <thead>
                    <tr className="bg-black text-white">
                      <th className="p-4 text-left font-medium">Size</th>
                      <th className="p-4 text-left font-medium">Waist (inches)</th>
                      <th className="p-4 text-left font-medium">Hip (inches)</th>
                      <th className="p-4 text-left font-medium">Inseam (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bottomsSizes.map((row, index) => (
                      <tr key={row.size} className={index % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}>
                        <td className="p-4 font-medium">{row.size}</td>
                        <td className="p-4">{row.waist}</td>
                        <td className="p-4">{row.hip}</td>
                        <td className="p-4">{row.inseam}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="text-sm text-neutral-500 mt-6">
              All measurements are in inches. If you're between sizes, we recommend sizing up for a more comfortable fit.
            </p>
          </section>

          {/* Fit Guide */}
          <section className="mb-16">
            <h2 className="font-display text-2xl mb-8">Fit Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-neutral-200 p-6">
                <h3 className="font-medium text-lg mb-3">Slim Fit</h3>
                <p className="text-neutral-600 text-sm">
                  Tailored close to the body with minimal ease. Best for a modern, streamlined silhouette.
                </p>
              </div>
              <div className="border border-neutral-200 p-6">
                <h3 className="font-medium text-lg mb-3">Regular Fit</h3>
                <p className="text-neutral-600 text-sm">
                  Classic fit with comfortable room through the body. Our most versatile fit option.
                </p>
              </div>
              <div className="border border-neutral-200 p-6">
                <h3 className="font-medium text-lg mb-3">Relaxed Fit</h3>
                <p className="text-neutral-600 text-sm">
                  Generous cut for maximum comfort and ease of movement. Ideal for a laid-back style.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-black text-white p-8 md:p-12 text-center">
            <h2 className="font-display text-2xl mb-4">Still Not Sure About Your Size?</h2>
            <p className="text-neutral-400 mb-6">Contact our styling team for personalized assistance.</p>
            <Link to="/help-center" className="inline-block bg-white text-black px-8 py-3 font-medium hover:bg-neutral-200 transition-colors">
              Get Help
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
