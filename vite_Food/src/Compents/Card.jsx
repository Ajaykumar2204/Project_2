import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addcard,
  removecard,
  clearcard,
  updateCustomerInfo,
} from '../Reducers/Cardslice';
import axios from 'axios';
import { Base_url } from '../utils/Base_url';
import { useParams } from 'react-router-dom';

function Card({ menuItems }) {
  const cartItems = useSelector((store) => store.Card.items) || [];
  const customerInfo = useSelector((store) => store.Card.customerInfo) || {};
  const dispatch = useDispatch();
  const { RestaurantId } = useParams();

  const [stage, setStage] = useState('cart'); // 'cart' | 'form' | 'summary'
  const [localCustomerInfo, setLocalCustomerInfo] = useState({
    name: '',
    phone: '',
    tableNumber: '',
    Note: '',
  });
  const [toastMessage, setToastMessage] = useState('');

  const total = cartItems.reduce(
    (sum, item) => sum + item.Price * item.quantity,
    0
  );

  const sendOrderToBackend = async (orderData) => {
    try {
      const res = await axios.post(
        `${Base_url}/menu/view/${RestaurantId}/cart`,
        { orderData },
        { withCredentials: true }
      );
      return res.data; // success
    } catch (err) {
      console.error('Error sending order:', err);
      return null; // fail
    }
  };

  const handleCashPayment = async () => {
    const orderData = {
      customerInfo,
      cartItems,
      paymentStatus: 'Cash',
      total,
      createdAt: new Date().toISOString(),
    };
    return await sendOrderToBackend(orderData);
  };

  const handleOnlinePayment = async () => {
    const orderData = {
      customerInfo,
      cartItems,
      paymentStatus: 'Online',
      total,
      createdAt: new Date().toISOString(),
    };
    return await sendOrderToBackend(orderData);
  };

  const handleIncrement = (item) => {
    if (item.IsAvailable === 'Available') {
      dispatch(addcard(item));
    } else {
      setToastMessage(`${item.Itemsname} is not available (${item.IsAvailable})`);
    }
  };

  const handleDecrement = (item) => {
    if (item.quantity === 1) {
      dispatch(removecard(item._id));
    } else {
      dispatch({ type: 'Card/decrement', payload: item._id });
    }
  };

  const handleClearCart = () => dispatch(clearcard());

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalCustomerInfo({ ...localCustomerInfo, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const phoneLength = localCustomerInfo.phone.trim().length;

    if (phoneLength < 10) {
      setToastMessage('Phone number must be at least 10 digits.');
      return;
    }

    if (phoneLength > 10) {
      setToastMessage('Phone number must not be more than 10 digits.');
      return;
    }

    const tableNumber = Number(localCustomerInfo.tableNumber);
    // Ensure menuItems is not empty and has the expected structure
    const maxTables = menuItems && menuItems.length > 0 && menuItems[0]?.RestaurantId?.NumberOfTables ?
                      menuItems[0].RestaurantId.NumberOfTables : 0;

    if (tableNumber > maxTables) {
      setToastMessage(`Table number cannot be greater than ${maxTables}.`);
      return;
    }

    dispatch(updateCustomerInfo(localCustomerInfo));
    setStage('summary');
  };

  const handleCashPaymentClick = async () => {
    const result = await handleCashPayment();
    if (result) {
      alert(`Cash order placed! Thank you, ${customerInfo.name}.`);
      dispatch(clearcard());
      setStage('cart');
    } else {
      alert('Something went wrong! Order was NOT placed.');
    }
  };

  const handleOnlinePaymentClick = async () => {
    const result = await handleOnlinePayment();
    if (result) {
      alert(`Online payment flow started for ${customerInfo.name}.`);
      dispatch(clearcard());
      setStage('cart');
    } else {
      alert('Something went wrong! Payment failed.');
    }
  };

  const Toast = () =>
    toastMessage && (
      <div className="toast toast-top toast-center z-[100]">
        <div className="alert alert-error">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage('')}
            className="ml-4 text-white font-bold"
          >
            ✕
          </button>
        </div>
      </div>
    );

  if (stage === 'form') {
    return (
      <div className="max-w-md w-full mx-auto p-4 bg-white shadow rounded-lg md:p-6">
        <Toast />
        <h2 className="text-xl  font-bold  text-center md:text-2xl">Enter Customer Details</h2>
        <form onSubmit={handleFormSubmit} className="space-y-2 ">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={localCustomerInfo.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm md:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={localCustomerInfo.phone}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm md:text-base"
              required
              minLength={10}
              maxLength={10}
              pattern="[0-9]{10}"
              title="Phone number must be exactly 10 digits"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Table Number
            </label>
            <input
              type="number"
              name="tableNumber"
              value={localCustomerInfo.tableNumber}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm md:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Note</label>
            <input
              type="text"
              name="Note"
              value={localCustomerInfo.Note}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm md:text-base"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <button
              type="button"
              onClick={() => setStage('cart')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg text-sm md:text-base"
            >
              ← Back to Cart
            </button>

            <button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm md:text-base"
            >
              Confirm Order
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (stage === 'summary') {
    return (
      <div className="max-w-md  w-full mx-auto px-4 py-1 pb-28 flex flex-col h-screen md:px-6 md:pb-32">
        <Toast />
        <div className="bg-white  rounded-xl p-4 border  border-gray-200 mb-3 shadow-sm uppercase md:p-6">
          <h2 className="text-xl bg-orange-500 p-1 text-white rounded-2xl text-center font-bold mb-2 md:text-2xl md:p-2">
            Customer Info
          </h2>
          <div className="space-y-1 text-gray-700 text-sm md:text-base">
            <p>
              <span className="font-semibold">Name:</span> {customerInfo.name}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {customerInfo.phone}
            </p>
            <p>
              <span className="font-semibold">Table Number:</span>{' '}
              {customerInfo.tableNumber}
            </p>
            <p>
              <span className="font-semibold">Note:</span>{' '}
              {customerInfo.Note || 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex-1 max-h-96 mb-3 overflow-y-auto divide-y divide-gray-200 bg-white rounded-xl border border-gray-200 shadow-sm">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 p-4 md:p-5 "
            >
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20">
                <img
                  src={`${Base_url}${item.Image}`}
                  alt={item.Itemsname || "Menu item"}
                  className="w-full h-full object-cover rounded-lg shadow-sm"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm md:text-base">{item.Itemsname}</p>
                <p className="text-xs text-gray-500 md:text-sm">
                  ₹{item.Price} × {item.quantity}
                </p>
              </div>
              <div className="text-right font-semibold text-gray-800 text-sm md:text-base">
                ₹{(item.Price * item.quantity).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 border rounded-t-2xl mx-auto max-w-md border-gray-300 p-4 flex flex-col gap-3 z-50 bg-white md:rounded-2xl md:bottom-2 md:mx-8">
          <div className="flex items-center justify-between px-4 rounded-xl py-1 bg-orange-500 md:py-2">
            <h2 className="text-md font-bold text-white md:text-lg">Total:</h2>
            <h2 className="text-md font-bold text-white md:text-lg">
              ₹{total.toLocaleString('en-IN')}
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-2 w-full ">
            <button
              onClick={handleCashPaymentClick}
              className="w-full md:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-5 py-2 rounded-xl transition-all text-sm md:text-base"
            >
              💵 Pay Cash
            </button>
            <button
              onClick={handleOnlinePaymentClick}
              className="w-full md:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-5 py-2 rounded-xl transition-all text-sm md:text-base"
            >
              💳 Pay Online
            </button>
            <button
              onClick={() => setStage('form')}
              className="w-full md:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-5 py-2 rounded-xl transition-all text-sm md:text-base"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-6">
      <Toast />
      <h2 className="text-xl font-bold mb-4 px-4 py-2 rounded-full text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md tracking-wide md:text-2xl">
        Your Cart
      </h2>

      {cartItems.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center text-gray-500 text-base md:text-lg">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <>
          <ul className="flex-1  space-y-3 pr-2 md:space-y-4">
            {cartItems.map((item) => (
              <li
                key={item._id}
                className="flex items-center gap-3 bg-white shadow rounded-xl p-3 border border-gray-200 md:gap-4 md:p-4"
              >
                <img
                  src={`${Base_url}${item.Image}`}
                  alt={item.Itemsname}
                  className="w-14 h-14 object-cover rounded-lg border md:w-16 md:h-16"
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm md:text-base">{item.Itemsname}</p>
                  <p className="text-xs text-gray-500 md:text-sm">
                    ₹{item.Price.toLocaleString('en-IN')} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={() => handleDecrement(item)}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm md:px-3 md:py-1"
                  >
                    -
                  </button>
                  <span className="text-sm md:text-base">{item.quantity}</span>
                  <button
                    onClick={() => handleIncrement(item)}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm md:px-3 md:py-1"
                  >
                    +
                  </button>
                </div>
                <div className="w-auto text-right font-semibold text-gray-700 text-sm md:text-base">
                  ₹{(item.Price * item.quantity).toLocaleString('en-IN')}
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between mb-4">
              <span className="text-lg font-bold md:text-xl">Total:</span>
              <span className="text-lg font-bold text-orange-600 md:text-xl">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <button
                onClick={handleClearCart}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg text-sm md:text-base"
              >
                Clear Cart
              </button>
              <button
                onClick={() => setStage('form')}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm md:text-base"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Card;



