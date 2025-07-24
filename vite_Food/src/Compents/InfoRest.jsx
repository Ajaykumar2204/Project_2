import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Base_url } from "../utils/Base_url";
import { useDispatch, useSelector } from 'react-redux';
import { setRestaurant } from '../Reducers/Restaurantslice';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import InfoBg from "../assets/Info.jpg";

const InfoRest = () => {
  const dispatch = useDispatch();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const restaurant = useSelector((store) => store.restaurant);

  // Memoize fetchInfo using useCallback
  const fetchInfo = useCallback(async () => {
    try {
      const res = await axios.get(`${Base_url}/restaurant/view`, { 
        withCredentials: true,
      });
      dispatch(setRestaurant(res.data.Restaurant));
    } catch (err) {
      console.log('Fetch error:', err.message || err);
    }
  }, [dispatch]); // dispatch is stable, but technically a dependency if you want to be exhaustive

  // Memoize generateQRCode using useCallback
  const generateQRCode = useCallback(async () => {
    try {
      if (!restaurant || !restaurant._id) {
        throw new Error('No restaurant ID found');
      }
      const url = `http://localhost:5173/menu/view/${restaurant._id}`;
      const qr = await QRCode.toDataURL(url);
      setQrCodeUrl(qr);
    } catch (err) {
      console.log('QR generation error:', err.message);
    }
  }, [restaurant]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]); // Now fetchInfo is a stable dependency

  useEffect(() => {
    if (restaurant && restaurant._id) {
      generateQRCode();
    }
  }, [restaurant, generateQRCode]);

  if (!restaurant || Object.keys(restaurant).length === 0) {
    return (
      <p className="text-gray-500 text-center mt-10">
        No restaurant data found.
      </p>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative uppercase px-4 py-8"
      style={{ backgroundImage: `url(${InfoBg})` }}
    >
      <div className="absolute inset-0 rounded-3xl"></div>

      <div className="relative z-10 max-w-5xl w-full mx-auto flex flex-col md:flex-row gap-8 rounded-3xl overflow-hidden shadow-2xl border border-white/20">
        {/* LEFT */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 bg-white text-black flex flex-col justify-between rounded-2xl border border-gray-200">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-orange-500 text-white text-2xl sm:text-3xl font-bold shadow-md">
                {restaurant.Restaurantname?.charAt(0)}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase">
                {restaurant.Restaurantname}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm sm:text-md font-semibold">Owner :</p>
                <p className="text-base sm:text-lg ">{restaurant.ownername}</p>
              </div>
              <div>
                <p className="text-sm sm:text-md font-semibold">Contact :</p>
                <p className="text-base sm:text-lg">{restaurant.Phone}</p>
              </div>
              <div>
                <p className="text-sm sm:text-md font-semibold">Restaurant ID :</p>
                <p className="text-base sm:text-lg break-all">{restaurant._id}</p>
              </div>
              <div>
                <p className="text-sm sm:text-md font-semibold">Created On :</p>
                <p className="text-base sm:text-lg">
                  {new Date(restaurant.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4">
            <Link
              to={`/menu/view/edit/${restaurant._id}`}
              className="w-full text-center text-white bg-orange-500 font-semibold py-3 rounded-full shadow hover:shadow-md transition"
            >
              View Menu
            </Link>
            <Link
              to="/menu/ItemsAdd"
              className="w-full text-center text-white bg-orange-500 font-semibold py-3 rounded-full shadow hover:shadow-md transition"
            >
              Add Items
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 bg-white bg-opacity-10  flex flex-col items-center justify-center rounded-2xl border border-gray-200">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white text-center">
            Scan to View Menu
          </h3>
          {qrCodeUrl ? (
            <>
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-40 h-40 sm:w-52 sm:h-52 rounded-2xl border border-white shadow-lg p-2 bg-white"
              />
              <a
                href={qrCodeUrl}
                download={`restaurant-${restaurant._id}-QR.png`}
                className="mt-4 w-full text-center bg-orange-500 text-white px-4 py-3 rounded-full shadow hover:bg-orange-600 transition"
              >
                Download QR Code
              </a>
            </>
          ) : (
            <p className="text-white">Generating QR code...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoRest;

