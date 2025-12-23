import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck } from 'lucide-react';
import { ordersAPI } from '../utils/api';
import { formatPrice, formatDate } from '../utils/helpers';
import Loading from '../components/Loading';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await ordersAPI.getById(id);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <Loading fullScreen />;

  if (!order) {
    return (
      <div className="pt-32 text-center">
        <h2 className="text-2xl mb-4">Order not found</h2>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28 min-h-[70vh] bg-gray-50">
      <div className="container-custom py-8 md:py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle size={80} className="mx-auto text-green-500" />
          </div>

          <h1 className="font-display text-3xl md:text-4xl mb-4 text-gray-900">
            Thank You for Your Order!
          </h1>
          <p className="text-gray-500 mb-8">
            Your order has been placed successfully. We'll send you an email confirmation shortly.
          </p>

          {/* Order Info */}
          <div className="bg-white p-6 mb-8 text-left rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-medium text-gray-900">{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium text-gray-900">{formatDate(order.createdAt)}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500">Status</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full capitalize">
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Payment</span>
                <span className={order.isPaid ? 'text-green-600' : 'text-yellow-600'}>
                  {order.isPaid ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items Summary */}
          <div className="bg-white border border-gray-100 p-6 mb-8 text-left rounded-2xl">
            <h3 className="font-medium mb-4 text-gray-900">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.name} x {item.quantity}
                    <span className="text-gray-500 ml-2">(Size: {item.size})</span>
                  </span>
                  <span className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">{formatPrice(order.itemsTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-gray-900">{order.shippingPrice === 0 ? 'FREE' : formatPrice(order.shippingPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-900">{formatPrice(order.taxPrice)}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-gray-100">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-gray-100 p-6 mb-8 text-left rounded-2xl">
            <h3 className="font-medium mb-4 flex items-center gap-2 text-gray-900">
              <Truck size={20} />
              Shipping Address
            </h3>
            <p className="text-gray-600">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
              {order.shippingAddress.country}<br />
              Phone: {order.shippingAddress.phone}
            </p>
          </div>

          {/* What's Next */}
          <div className="bg-black text-white p-6 mb-8 text-left rounded-2xl">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Package size={20} />
              What's Next?
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>• You will receive an order confirmation email</li>
              <li>• We'll notify you when your order ships</li>
              <li>• Expected delivery in 5-7 business days</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/profile" className="btn-secondary">
              View Orders
            </Link>
            <Link to="/shop" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
