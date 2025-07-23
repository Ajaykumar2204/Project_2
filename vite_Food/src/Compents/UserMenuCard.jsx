import React, { useEffect, useState } from 'react';
import UserMenu from './UserMenu';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Base_url } from "../utils/Base_url";
import BgImage from '../assets/Login_imge.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { addToUserMenu } from '../Reducers/UserMenuslice';
import Card from './Card';

const UserMenuCard = () => {
  const { RestaurantId } = useParams();
  const dispatch = useDispatch();

  const menuItems = useSelector((store) => store.UserMenu.items) || [];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCart, setShowCart] = useState(false);

  const toggleCart = () => setShowCart(prev => !prev);

 useEffect(() => {
  const getMenu = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${Base_url}/menu/view/${RestaurantId}`, {
        withCredentials: true,
      });
      dispatch(addToUserMenu(res.data.items));
    } catch (err) {
      console.error('Error fetching menu:', err);
      setError('Failed to load menu.');
    } finally {
      setLoading(false);
    }
  };

  getMenu();
}, [RestaurantId, dispatch]); // ✅ clean, no lint error


  if (loading) {
    return <p className="text-center text-gray-200 text-xl">Loading menu...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-xl">{error}</p>;
  }

  if (menuItems.length === 0) {
    return <p className="text-center text-gray-200 text-xl">No menu items available.</p>;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${BgImage})` }}
    >
      <div className="absolute inset-0"></div>

      {/* Navbar */}
      <nav className="w-full h-16 text-black bg-white font-bold px-4 md:px-6 py-2 rounded-md transition duration-300 flex justify-between items-center shadow-lg fixed top-0 left-0 right-0 z-50">
        {/* Left: Restaurant Info */}
        <div className="flex items-center gap-1 font-medium">
          <span className='text-2xl md:text-3xl font-medium'>☏</span>
          {/* Phone number hidden on small screens, visible on medium and up */}
          <span className="text-sm md:text-xl text-black bg-white pl-1 hidden md:inline">
            {menuItems[0]?.RestaurantId?.Phone || 'Phone Number'}
          </span>
        </div>

        <div className='flex items-center gap-1 md:gap-2 uppercase text-center'>
          <h1 className="text-sm md:text-lg font-bold">
            {menuItems[0]?.RestaurantId?.Restaurantname || 'Restaurant Name'}
          </h1>
          <h1 className='font-extrabold hidden md:inline'>-</h1>
          <p className="text-sm md:text-lg font-bold text-black bg-white">
            {menuItems[0]?.RestaurantId?.ownername || 'Owner Name'}
          </p>
        </div>

        {/* Right: Cart toggle or hamburger */}
        <div className="flex items-center">
          <label className="swap swap-rotate cursor-pointer">
            <input
              type="checkbox"
              checked={showCart}
              onChange={toggleCart}
              className="hidden"
            />

            {/* hamburger icon */}
            <svg
              className="swap-off fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 512 512"
            >
              <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </svg>

            {/* close icon */}
            <svg
              className="swap-on fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 512 512"
            >
              <polygon
                points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"
              />
            </svg>
          </label>
        </div>
      </nav>

      {/* Backdrop */}
      {showCart && (
        <div
          onClick={toggleCart}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Cart Drawer */}
      <div
        className={`fixed top-[4.5rem] right-2 h-[calc(100vh-6rem)] w-[96%] md:w-[32%] pb-8 rounded-2xl bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          showCart ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="pt-5 px-4 h-full flex flex-col">
          <Card menuItems={menuItems} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative pt-20 z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {menuItems.map((item) => (
          <UserMenu key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default UserMenuCard;
