import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import * as orderService from '../services/orderService';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [updating, setUpdating] = React.useState(false);

  const ORDER_STATUSES = ['Pending', 'Completed', 'Cancelled'];

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getAllOrders(user._id);
        setOrders(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      await orderService.orderStatus(orderId, {status :newStatus});
      console.log(orders);
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
    } catch (err) {
      setError('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      Pending: 'bg-yellow-200 text-yellow-800',
      Completed: 'bg-gray-200 text-gray-800',
      Cancelled: 'bg-red-200 text-red-800',
    };
    return statusColors[status] || 'bg-gray-200 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">Error loading orders: {error}</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      {orders.length === 0 ? (
        <div className="border rounded-lg shadow-sm p-6 text-center text-gray-500">
          No orders found
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-lg font-semibold">Order #{order._id}</h2>
              {user.usertype ? (
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(order.status)}`}>
                    Current: {order.status}
                  </span>
                  <select
                    className="px-3 py-1 border rounded-md bg-white disabled:opacity-50"
                    disabled={updating}
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              )}
            </div>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Items</h3>
                <ul className="space-y-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.menuItem.name}</span>
                      <span className="text-gray-600">
                        ${item.menuItem.price.toFixed(2)} x {item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-medium">Total Amount:</span>
                <span className="text-lg font-bold">${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="text-sm text-gray-500">
                Ordered at: {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;