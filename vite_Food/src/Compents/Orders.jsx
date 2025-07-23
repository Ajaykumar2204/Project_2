import React, { useEffect, useState, useCallback } from 'react'; // Added useCallback
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Base_url } from '../utils/Base_url';
import InfoBg from '../assets/Info.jpg';

function Orders() {
  const { RestaurantId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Memoize fetchOrders using useCallback
  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(
        `${Base_url}/menu/${RestaurantId}/orders/view`,
        { withCredentials: true }
      );
      setOrders(res.data.orders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [RestaurantId]); // Add RestaurantId as a dependency for fetchOrders

  const Updatepay = async (id, cookingStatus, paymentStatus) => {
    try {
      await axios.post(
        `${Base_url}/menu/${RestaurantId}/orders/view/${id}/${cookingStatus}/${paymentStatus}`,
        {},
        { withCredentials: true }
      );
      console.log('Order updated!');
      fetchOrders();
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]); // Now fetchOrders is a stable dependency

  if (loading) {
    return (
      <p className="p-8 text-center text-xl font-semibold text-white">
        Loading orders...
      </p>
    );
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.cookingStatus === 'cooking' ||
      (order.cookingStatus === 'completed' &&
        order.paymentStatuscheck === 'Pending' &&
        order.paymentMethod === 'Cash')
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-start justify-center py-12"
      style={{ backgroundImage: `url(${InfoBg})` }}
    >
      <div className="backdrop-brightness-100  rounded-2xl shadow-xl p-5 max-w-5xl w-full ">
        <h2 className="text-3xl overflow-x-auto  font-extrabold mb-8 text-center text-white uppercase">
          Orders - Restaurant ID: <span className="text-white text-sm md:text-3xl ">{RestaurantId}</span>
        </h2>

        {filteredOrders.length === 0 ? (
          <p className="text-gray-700 text-center text-2xl">No active orders found.</p>
        ) : (
          <div className="space-y-8">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-300 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-200 bg-white"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <h3 className="text-xl overflow-x-auto font-bold text-gray-900 mb-2 md:mb-0">
                    Order ID: <span className='text-sm md:text-xl'>{order._id} </span>
                  </h3>
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold ${
                      order.paymentMethod === 'Online'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-gray-800">
                  <p><span className="font-bold">Customer:</span> {order.name}</p>
                  <p><span className="font-bold">Phone:</span> {order.phone}</p>
                  <p><span className="font-bold">Table:</span> {order.tableNumber}</p>
                  <p><span className="font-bold">Note:</span> {order.Note}</p>
                </div>

                <h4 className="font-bold text-gray-900 mb-2">Items Ordered:</h4>
                <ul className="mb-4">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between py-2 border-b last:border-none">
                      <span>
                        {item.itemName}
                        <span className="ml-3 inline-block bg-yellow-200 text-yellow-800 rounded-full px-2 py-0.5 text-xs">
                          × {item.quantity}
                        </span>
                      </span>
                      <span className="font-medium">₹{item.price}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between items-center font-extrabold mb-4 text-lg">
                  <span>Total:</span>
                  <span>₹{order.total}</span>
                </div>

                <div className="flex flex-col md:flex-row md:space-x-4 w-full gap-4">
                  {order.cookingStatus === 'cooking' && (
                    <button
                      className="w-full md: bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 rounded-lg shadow hover:shadow-xl transition"
                      onClick={() =>
                        Updatepay(order._id, 'completed', order.paymentStatuscheck)
                      }
                    >
                      FOOD COOKED
                    </button>
                  )}

                  {order.paymentStatuscheck === 'Pending' && order.paymentMethod === 'Cash' && (
                    <button
                      className="w-full md bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-lg shadow hover:shadow-xl transition"
                      onClick={() =>
                        Updatepay(order._id, order.cookingStatus, 'Paid')
                      }
                    >
                      CASH PAID
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;


