import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Plus,
  Edit,
  Trash2,
  X,
  ChevronDown,
  Upload,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { productsAPI, ordersAPI, uploadAPI } from '../utils/api';
import { formatPrice, formatDate, getStatusColor } from '../utils/helpers';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 't-shirts',
    subcategory: '',
    images: [''],
    sizes: [],
    colors: [{ name: '', hex: '' }],
    stockBySize: {},
    featured: false,
    isNew: true,
    tags: '',
  });

  useEffect(() => {
    // Wait for auth to finish loading before redirecting
    if (authLoading) return;

    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }

    fetchData();
  }, [user, isAdmin, authLoading, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, productsRes, ordersRes] = await Promise.all([
        ordersAPI.getStats(),
        productsAPI.getAll({ limit: 100 }),
        ordersAPI.getAll({ limit: 100 }),
      ]);
      setStats(statsRes.data);
      setProducts(productsRes.data.products);
      setOrders(ordersRes.data.orders);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: 't-shirts',
      subcategory: '',
      images: [''],
      sizes: [],
      colors: [{ name: '', hex: '' }],
      stockBySize: {},
      featured: false,
      isNew: true,
      tags: '',
    });
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    // Convert stockBySize Map to plain object if needed
    const stockBySizeObj = product.stockBySize
      ? (typeof product.stockBySize === 'object' ? { ...product.stockBySize } : {})
      : {};
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category,
      subcategory: product.subcategory || '',
      images: product.images?.length > 0 ? product.images : [''],
      sizes: product.sizes || [],
      colors: product.colors?.length > 0 ? product.colors : [{ name: '', hex: '' }],
      stockBySize: stockBySizeObj,
      featured: product.featured,
      isNew: product.isNew,
      tags: product.tags?.join(', ') || '',
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productsAPI.delete(productId);
      setProducts(products.filter((p) => p._id !== productId));
      toast.success('Product deleted');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    // Calculate total stock from stockBySize
    const stockBySize = {};
    productForm.sizes.forEach(size => {
      stockBySize[size] = Number(productForm.stockBySize[size]) || 0;
    });
    const totalStock = Object.values(stockBySize).reduce((sum, qty) => sum + qty, 0);

    const productData = {
      ...productForm,
      price: Number(productForm.price),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
      stockBySize,
      stock: totalStock,
      images: productForm.images.filter((img) => img.trim()),
      colors: productForm.colors.filter((c) => c.name && c.hex),
      tags: productForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (editingProduct) {
        const response = await productsAPI.update(editingProduct._id, productData);
        setProducts(products.map((p) => (p._id === editingProduct._id ? response.data : p)));
        toast.success('Product updated');
      } else {
        const response = await productsAPI.create(productData);
        setProducts([response.data, ...products]);
        toast.success('Product created');
      }
      setShowProductModal(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
      // Refresh stats if order is cancelled
      if (newStatus === 'cancelled') {
        const statsRes = await ordersAPI.getStats();
        setStats(statsRes.data);
      }
      toast.success('Order status updated');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;

    try {
      await ordersAPI.delete(orderId);
      setOrders(orders.filter((o) => o._id !== orderId));
      // Refresh stats
      const statsRes = await ordersAPI.getStats();
      setStats(statsRes.data);
      toast.success('Order deleted');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40'];
  const categories = ['polo-shirts', 'knit-polo-shirts', 'zip-polo-shirts', 't-shirts', 'shirts'];
  const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  // Show loading while auth is being checked
  if (authLoading) return <Loading fullScreen />;
  if (!isAdmin) return null;

  return (
    <div className="pt-24 md:pt-28 min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="font-display text-xl tracking-widest text-gray-900">NAVIGATOR</span>
          <span className="text-gray-400">|</span>
          <h1 className="font-display text-3xl text-gray-900">Admin Panel</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-white p-4 space-y-2 rounded-2xl">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-colors ${activeTab === 'dashboard'
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-100 text-gray-700'
                  }`}
              >
                <LayoutDashboard size={20} />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-colors ${activeTab === 'products'
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-100 text-gray-700'
                  }`}
              >
                <Package size={20} />
                Products
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-colors ${activeTab === 'orders'
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-100 text-gray-700'
                  }`}
              >
                <ShoppingCart size={20} />
                Orders
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <Loading />
            ) : (
              <>
                {/* Dashboard */}
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white p-6 rounded-2xl">
                        <p className="text-gray-500 text-sm">Total Orders</p>
                        <p className="text-3xl font-display mt-2 text-gray-900">{stats?.totalOrders || 0}</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl">
                        <p className="text-gray-500 text-sm">Pending Orders</p>
                        <p className="text-3xl font-display mt-2 text-gray-900">{stats?.pendingOrders || 0}</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl">
                        <p className="text-gray-500 text-sm">Shipped Orders</p>
                        <p className="text-3xl font-display mt-2 text-gray-900">{stats?.shippedOrders || 0}</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl">
                        <p className="text-gray-500 text-sm">Total Revenue</p>
                        <p className="text-3xl font-display mt-2 text-gray-900">
                          {formatPrice(stats?.totalRevenue || 0)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl">
                      <h3 className="font-medium mb-4 text-gray-900">Recent Orders</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Order</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Customer</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.slice(0, 5).map((order) => (
                              <tr key={order._id} className="border-b border-gray-50">
                                <td className="py-3 px-4 text-sm text-gray-900">{order.orderNumber}</td>
                                <td className="py-3 px-4 text-sm text-gray-900">{order.user?.name}</td>
                                <td className="py-3 px-4 text-sm text-gray-900">{formatPrice(order.totalAmount)}</td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(
                                      order.status
                                    )}`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Products */}
                {activeTab === 'products' && (
                  <div className="bg-white p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="font-display text-xl text-gray-900">Products ({products.length})</h2>
                      <button onClick={handleAddProduct} className="btn-primary flex items-center gap-2">
                        <Plus size={18} />
                        Add Product
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Product</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Category</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Price</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Stock by Size</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr key={product._id} className="border-b border-gray-50">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={product.images?.[0] || 'https://via.placeholder.com/50'}
                                    alt={product.name}
                                    className="w-12 h-14 object-cover object-top"
                                  />
                                  <span className="text-sm">{product.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm capitalize">{product.category}</td>
                              <td className="py-3 px-4 text-sm">{formatPrice(product.price)}</td>
                              <td className="py-3 px-4 text-sm">
                                {product.stockBySize && Object.keys(product.stockBySize).length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {Object.entries(product.stockBySize).map(([size, qty]) => (
                                      <span
                                        key={size}
                                        className={`inline-block px-2 py-0.5 text-xs rounded ${qty <= 5 ? 'bg-red-100 text-red-700' :
                                          qty <= 10 ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-green-100 text-green-700'
                                          }`}
                                      >
                                        {size}: {qty}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-gray-500">Total: {product.stock}</span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditProduct(product)}
                                    className="p-2 hover:bg-gray-100 transition-colors rounded-lg"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(product._id)}
                                    className="p-2 hover:bg-red-50 text-red-600 transition-colors rounded-lg"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Orders */}
                {activeTab === 'orders' && (
                  <div className="bg-white p-6 rounded-2xl">
                    <h2 className="font-display text-xl mb-6 text-gray-900">Orders ({orders.length})</h2>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Order</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Customer</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Payment</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order._id} className="border-b border-gray-50">
                              <td className="py-3 px-4 text-sm text-gray-900">{order.orderNumber}</td>
                              <td className="py-3 px-4 text-sm text-gray-900">{order.user?.name}</td>
                              <td className="py-3 px-4 text-sm text-gray-900">{formatDate(order.createdAt)}</td>
                              <td className="py-3 px-4 text-sm text-gray-900">{formatPrice(order.totalAmount)}</td>
                              <td className="py-3 px-4 text-sm">
                                <span className={order.isPaid ? 'text-green-600' : 'text-yellow-600'}>
                                  {order.isPaid ? 'Paid' : 'Pending'}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="relative">
                                  <select
                                    value={order.status}
                                    onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                    className={`appearance-none px-3 py-1 pr-8 text-xs rounded-full cursor-pointer ${getStatusColor(
                                      order.status
                                    )}`}
                                  >
                                    {statusOptions.map((status) => (
                                      <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown
                                    size={12}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                                  />
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => handleDeleteOrder(order._id)}
                                  className="p-2 hover:bg-red-50 text-red-600 transition-colors rounded-lg"
                                  title="Delete order"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8">
          <div className="bg-white w-full max-w-2xl mx-4 my-8 rounded-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="font-display text-xl text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-gray-500 hover:text-gray-900">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900">Price *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900">Original Price</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Category *</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="input"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Product Images</label>

                {/* Upload Button */}
                <div className="mb-3">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                    {uploading ? (
                      <><Loader2 size={16} className="animate-spin" /> Uploading...</>
                    ) : (
                      <><Upload size={16} /> Upload Image</>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setUploading(true);
                        try {
                          const response = await uploadAPI.uploadImage(file);
                          const newImages = [...productForm.images.filter(img => img.trim()), response.data.url];
                          setProductForm({ ...productForm, images: newImages });
                          toast.success('Image uploaded!');
                        } catch (error) {
                          console.error('Upload failed:', error);
                          toast.error('Failed to upload image');
                        } finally {
                          setUploading(false);
                          e.target.value = '';
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Image Previews */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {productForm.images.filter(img => img.trim()).map((img, index) => (
                    <div key={index} className="relative group">
                      <img src={img} alt={`Product ${index + 1}`} className="w-20 h-24 object-cover rounded-lg border" />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = productForm.images.filter((_, i) => i !== index);
                          setProductForm({ ...productForm, images: newImages.length ? newImages : [''] });
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Manual URL Input */}
                <p className="text-xs text-gray-500 mb-2">Or add image URL manually:</p>
                {productForm.images.map((img, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={img}
                      onChange={(e) => {
                        const newImages = [...productForm.images];
                        newImages[index] = e.target.value;
                        setProductForm({ ...productForm, images: newImages });
                      }}
                      className="input"
                      placeholder="https://..."
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = productForm.images.filter((_, i) => i !== index);
                          setProductForm({ ...productForm, images: newImages });
                        }}
                        className="px-3 text-red-600"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setProductForm({ ...productForm, images: [...productForm.images, ''] })
                  }
                  className="text-sm text-black hover:text-gray-600"
                >
                  + Add another URL
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        const newSizes = productForm.sizes.includes(size)
                          ? productForm.sizes.filter((s) => s !== size)
                          : [...productForm.sizes, size];
                        // Also update stockBySize when sizes change
                        const newStockBySize = { ...productForm.stockBySize };
                        if (!newSizes.includes(size)) {
                          delete newStockBySize[size];
                        }
                        setProductForm({ ...productForm, sizes: newSizes, stockBySize: newStockBySize });
                      }}
                      className={`px-3 py-1 border rounded-lg transition-colors ${productForm.sizes.includes(size)
                        ? 'bg-black text-white border-black'
                        : 'border-gray-200 hover:border-black'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock by Size */}
              {productForm.sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900">Stock by Size *</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {productForm.sizes.map((size) => (
                      <div key={size} className="flex flex-col">
                        <label className="text-xs text-gray-500 mb-1 text-center">{size}</label>
                        <input
                          type="number"
                          min="0"
                          value={productForm.stockBySize[size] || ''}
                          onChange={(e) => {
                            setProductForm({
                              ...productForm,
                              stockBySize: {
                                ...productForm.stockBySize,
                                [size]: e.target.value,
                              },
                            });
                          }}
                          className="input text-center"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Total Stock: {Object.values(productForm.stockBySize).reduce((sum, qty) => sum + (Number(qty) || 0), 0)}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={productForm.tags}
                  onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                  className="input"
                  placeholder="casual, summer, cotton"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="accent-black"
                  />
                  <span className="text-sm">Featured</span>
                </label>
                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    checked={productForm.isNew}
                    onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                    className="accent-black"
                  />
                  <span className="text-sm">New Arrival</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
