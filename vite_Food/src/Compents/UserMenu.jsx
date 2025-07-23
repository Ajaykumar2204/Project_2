import React, { useState } from 'react';
import { Base_url } from '../utils/Base_url';
import { useDispatch } from 'react-redux';
import { addcard } from '../Reducers/Cardslice';

const UserMenu = ({ item }) => {
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
    if (item.IsAvailable === 'Available') {
      dispatch(addcard(item));
    } else {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <div className="bg-white backdrop-blur-md shadow-lg rounded-xl  p-3 w-full hover:scale-105 hover:shadow-orange-400 transition-all duration-300 mx-aut">
   <div className=' w-full'> 
     {showToast && (
     <div className="toast toast-top toast-start">
      <div className="alert alert-error text-white">
      <span>{`${item.Itemsname} is not available right now (${item.IsAvailable}).`}</span>
     </div>
     </div>
    )}

   </div>
      
      <img
        src={`${Base_url}${item.Image}`}
        alt={item.Itemsname || "Menu item"}
        className="w-full h-28  object-cover rounded-lg shadow-sm"
      />
      <div className="mt-3">
        <h2 className="text-lg font-bold text-gray-800">{item.Itemsname}</h2>
        <p className="text-xs h-8 text-gray-600 mt-1 line-clamp-2">{item.Description}</p>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-base font-bold text-orange-600">
            ₹{item.FinalPrice.toLocaleString('en-IN')}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded ${
              item.IsAvailable === 'Available'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {item.IsAvailable}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
          <span>Serves: {item.Serves}</span>
          <span>Discount: {item.Discount}%</span>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={handleAddToCart}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-1.5 rounded-lg transition text-sm"
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;

