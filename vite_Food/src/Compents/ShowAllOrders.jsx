import React, { useEffect, useState } from 'react';
import { Base_url } from '../utils/Base_url';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ShowAllOrders() {
  const { RestaurantId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [paymentFilter, setPaymentFilter] = useState('All');

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState(getTodayDate());

useEffect(() => {
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `${Base_url}/orders/${RestaurantId}`;
      if (selectedDate) {
        url = `${Base_url}/orders/${RestaurantId}/by-date/${selectedDate}`;
      }

      const res = await axios.get(url, {
        withCredentials: true,
      });

      setOrders(res.data || []);

    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (RestaurantId) {
    fetchOrders();
  }
}, [RestaurantId, selectedDate]);


  const filteredOrders = orders.filter(order => {
    if (paymentFilter === 'All') return true;
    return order.paymentMethod === paymentFilter;
  });

  const grandTotal = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8"> {/* Responsive padding */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"> {/* Responsive header layout */}
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">All Orders</h1>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"> {/* Responsive filter layout */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out"
              aria-label="Select date"
            />

            <button
              onClick={() => setSelectedDate('')}
              className="flex-shrink-0 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-200 ease-in-out"
              aria-label="Clear date filter"
            >
              Clear Date
            </button>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out cursor-pointer uppercase"
              aria-label="Filter by payment method"
            >
              <option value="All">All Payments</option>
              <option value="Online">Online</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="ml-4 text-lg text-gray-600">Loading orders...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {!loading && !error && filteredOrders.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-lg">
            <p>No orders found for the selected criteria.</p>
            <p className="mt-2 text-sm">Try adjusting the date or payment filter.</p>
          </div>
        )}

        {!loading && !error && filteredOrders.length > 0 && (
          <div className="overflow-x-auto rounded-lg shadow-xl border border-gray-200"> {/* Essential for table responsiveness */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r text-white bg-orange-400 sticky top-0 z-10">
                <tr>
                  {/* Applied `text-xs` to all table headers to ensure they fit on smaller screens. 
                      Larger screens naturally have more space. */}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">SI. No</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Phone</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Table</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Payment</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Cooking</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Total</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Items</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredOrders.map((order, idx) => (
                  <tr
                    key={order._id}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.tableNumber || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.paymentMethod === 'Online' ? 'bg-green-100 text-green-800' : 'bg-orange-400 text-white'}`}>
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.paymentStatuscheck}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.cookingStatus}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      ₹{order.total ? order.total.toFixed(2) : '0.00'}
                    </td>
                    <td className="px-6 py-4">
                      {order.items && order.items.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                          {order.items.map((item) => (
                            <li key={item.menuItemId}>
                              <span className="font-medium text-gray-900">{item.itemName}</span> &mdash; Qty: {item.quantity}, ₹{item.price}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400 italic">No items</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className='flex justify-end p-6 bg-gray-50 border-t border-gray-200'>
              <div className="text-xl font-extrabold text-gray-900">
                Grand Total: <span className="text-orange-600">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShowAllOrders;


