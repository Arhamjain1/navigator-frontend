import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Account created successfully!');
      // Navigate to redirect path or home page
      navigate(redirect === '/' ? '/' : redirect, { replace: true });
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"
          alt="Fashion"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/70 mb-3">Join the</p>
          <h2 className="font-display text-5xl text-white tracking-tight">NAVIGATOR</h2>
          <p className="text-white/60 text-sm mt-4 max-w-sm">Create an account and unlock exclusive access to new arrivals, member-only deals, and more.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white pt-24 lg:pt-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="font-display text-3xl md:text-4xl tracking-tight mb-3">Create Account</h1>
            <p className="text-neutral-500 text-sm">Join the Navigator journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-400 mb-3">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-neutral-200 px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-400 mb-3">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-neutral-200 px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-400 mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border border-neutral-200 px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors pr-12"
                  placeholder="••••••••"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-400 mb-3">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full border border-neutral-200 px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="••••••••"
              />
            </div>

            <label className="flex items-start gap-3 text-sm pt-2">
              <input type="checkbox" required className="mt-0.5 w-4 h-4 accent-black" />
              <span className="text-neutral-500 text-xs leading-relaxed">
                I agree to the{' '}
                <a href="#" className="text-black hover:opacity-70 underline underline-offset-2">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-black hover:opacity-70 underline underline-offset-2">
                  Privacy Policy
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? 'Creating Account...' : (
                <>
                  Create Account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-neutral-500">
            Already have an account?{' '}
            <Link
              to={`/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
              className="text-black font-medium hover:opacity-70 transition-opacity underline underline-offset-2"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
