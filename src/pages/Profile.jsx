import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, authAPI } from '../utils/api';
import { formatPrice, formatDate, getStatusColor } from '../utils/helpers';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
    },
  });

  useEffect(() => {
    // Wait for auth to finish loading before redirecting
    if (authLoading) return;
    
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await ordersAPI.getMyOrders();
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, authLoading, navigate]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.updateProfile(profileData);
      updateUser(response.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  // Show loading while auth is being checked
  if (authLoading) return <Loading fullScreen />;
  if (!user) return null;

  return (
    <div className="pt-24 md:pt-28 min-h-screen bg-gray-50">
      <div className="container-custom py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-gray-600" />
                </div>
                <h2 className="font-medium text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Package size={20} />
                  My Orders
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <User size={20} />
                  Profile Settings
                </button>
                <button
                  onClick={() => setActiveTab('address')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-colors ${
                    activeTab === 'address'
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <MapPin size={20} />
                  Address
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white p-6 rounded-2xl">
                <h2 className="font-display text-2xl mb-6 text-gray-900">My Orders</h2>

                {loading ? (
                  <Loading />
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
                    <Link to="/shop" className="btn-primary">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="border border-gray-100 p-4 rounded-xl hover:border-gray-300 transition-colors"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <div>
                            <p className="font-medium text-gray-900">{order.orderNumber}</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{formatPrice(order.totalAmount)}</p>
                            <span
                              className={`inline-block px-3 py-1 text-xs rounded-full capitalize ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-2">
                          {order.items.slice(0, 4).map((item, index) => (
                            <img
                              key={index}
                              src={item.image || 'https://via.placeholder.com/60x80'}
                              alt={item.name}
                              className="w-16 h-20 object-cover flex-shrink-0 rounded-lg"
                            />
                          ))}
                          {order.items.length > 4 && (
                            <div className="w-16 h-20 bg-gray-100 flex items-center justify-center flex-shrink-0 text-sm text-gray-600 rounded-lg">
                              +{order.items.length - 4}
                            </div>
                          )}
                        </div>

                        <Link
                          to={`/order-success/${order._id}`}
                          className="mt-4 flex items-center justify-end gap-1 text-sm text-gray-600 hover:text-black"
                        >
                          View Details
                          <ChevronRight size={16} />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white p-6 rounded-2xl">
                <h2 className="font-display text-2xl mb-6 text-gray-900">Profile Settings</h2>

                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                      className="input"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === 'address' && (
              <div className="bg-white p-6 rounded-2xl">
                <h2 className="font-display text-2xl mb-6 text-gray-900">Address</h2>

                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900">Street Address</label>
                    <input
                      type="text"
                      value={profileData.address.street}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          address: { ...profileData.address, street: e.target.value },
                        })
                      }
                      className="input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900">City</label>
                      <input
                        type="text"
                        value={profileData.address.city}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            address: { ...profileData.address, city: e.target.value },
                          })
                        }
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900">State</label>
                      <input
                        type="text"
                        value={profileData.address.state}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            address: { ...profileData.address, state: e.target.value },
                          })
                        }
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900">PIN Code</label>
                      <input
                        type="text"
                        value={profileData.address.zipCode}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            address: { ...profileData.address, zipCode: e.target.value },
                          })
                        }
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900">Country</label>
                      <input
                        type="text"
                        value={profileData.address.country}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            address: { ...profileData.address, country: e.target.value },
                          })
                        }
                        className="input"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary">
                    Save Address
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
