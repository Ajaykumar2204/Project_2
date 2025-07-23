import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector  } from 'react-redux';
import axios from 'axios';
import { Base_url } from '../utils/Base_url';
import { removeMenu } from '../Reducers/Menuslice';
import { clearRestaurant, setRestaurant } from '../Reducers/Restaurantslice';
import { removeloginuser } from '../Reducers/userslice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

const  restaurantredux = useSelector(store => store.restaurant)

 const [ restaurantDAta , SetrestaurantDAta  ] = useState()



useEffect(() => {
  const fetchInfo = async () => {
    try {
      const res = await axios.get(`${Base_url}/restaurant/view`, {
        withCredentials: true,
      });

      dispatch(setRestaurant(res.data.Restaurant));
      SetrestaurantDAta(res.data.Restaurant);
    } catch (err) {
      console.log('Fetch error:', err.message || err);
    }
  };

  fetchInfo();
}, [dispatch, SetrestaurantDAta]); 


  const handleLogout = async () => {
    try {
      await axios.post(`${Base_url}/logout`, {}, { withCredentials: true });
      dispatch(removeMenu());
      dispatch(clearRestaurant());
      dispatch(removeloginuser());
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="navbar bg-white  shadow-2xl px-4 ">
      {/* End: CTA */}
       <div className="navbar-start">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center justify-center text-black w-8 h-8 border-2 rounded-full font-bold hover:bg-gray-200 transition-colors"
      >
        ←
      </button>
    </div>

      {/* Center: Brand */}
      <div className="navbar-center">
        <Link to="/" className="text-2xl font-bold text-orange-600">
          QReats
        </Link>
      </div>

     
        {/* Start: Dropdown */}
      <div className="navbar-end">
        <div className="dropdown">
          <button tabIndex={0} className="btn btn-ghost btn-circle text-black ">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-2 p-2 right-0 top-15 shadow bg-white rounded-box w-60 "
          >
            <li>
              <Link to="/restaurant/view" className="hover:text-orange-500">
                Restaurant Info
              </Link>
            </li>
            <li>
              <Link to="/restaurant/register" className="hover:text-orange-500">
                Register Register
              </Link>
            </li>
             <li>
              <Link to={`/menu/view/edit/${restaurantDAta?._id || restaurantredux?._id}`} className="hover:text-orange-500">
                 Restaurant Menu
              </Link>
             </li>
              <li>
              <Link to={"/menu/ItemsAdd"} className="hover:text-orange-500">
                 Add Item To Menu
              </Link>
             </li>
              <li>
              <Link to={`/menu/${restaurantDAta?._id || restaurantredux?._id}/orders/view`} className="hover:text-orange-500">
                Orders List
              </Link>
             </li>
              <li>
              <Link to={`/orders/${restaurantDAta?._id || restaurantredux?._id}`} className="hover:text-orange-500">
                show All Today Orders  
              </Link>
             </li>
              
            <li>
              <button
                onClick={handleLogout}
                className="hover:text-orange-500 text-left w-full px-2 py-1"
              >
                Logout
              </button>
            </li>
              {/* <li>
              <Link to={`/menu/view/${restaurantDAta?._id || restaurantredux?._id}`} className="hover:text-orange-500">
                User Menu ( Only For Testing)
              </Link>
            </li> */}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
  


