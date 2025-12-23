import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirectPath = redirect === '/' ? '/' : `/${redirect}`;
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, redirect]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      if (result && result.token) {
        toast.success('Welcome back!');
        // Redirect to home or specified page
        const redirectPath = redirect === '/' ? '/' : `/${redirect}`;
        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid credentials';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="pt-20 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-neutral-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80"
          alt="Fashion"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/70 mb-3">Welcome to</p>
          <h2 className="font-display text-5xl text-white tracking-tight">NAVIGATOR</h2>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden font-display text-3xl tracking-tight text-black mb-10 block text-center">
            NAVIGATOR
          </Link>

          <div className="mb-10">
            <h1 className="font-display text-3xl md:text-4xl tracking-tight mb-3">Welcome Back</h1>
            <p className="text-neutral-500 text-sm">Sign in to continue shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2.5 text-neutral-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 border-neutral-300 accent-black" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-neutral-500 hover:text-black transition-colors text-xs underline underline-offset-2">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Signing in...' : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-5 bg-neutral-50 text-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400 mb-3">Demo Credentials</p>
            <p className="text-neutral-600 mb-1">
              <span className="font-medium text-black">Admin:</span> admin@navigator.com / admin123
            </p>
            <p className="text-neutral-600">
              <span className="font-medium text-black">User:</span> user@test.com / user123
            </p>
          </div>

          <p className="text-center mt-8 text-sm text-neutral-500">
            Don't have an account?{' '}
            <Link
              to={`/register${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
              className="text-black font-medium hover:opacity-70 transition-opacity underline underline-offset-2"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
