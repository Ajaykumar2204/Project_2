import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Base_url } from "../utils/Base_url";
import BgImage from '../assets/Login_imge.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { addMenu } from '../Reducers/Menuslice';
import { deleteMenuItem } from '../Reducers/Menuslice';

const MenuCard = () => {
  const { RestaurantId } = useParams();
 
   const dispatch = useDispatch();

const menuItems = useSelector((state) => state.Menu.items);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 

  useEffect(() => {
     const getMenu = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${Base_url}/menu/view/edit/${RestaurantId}` , { withCredentials: true });
     
      dispatch(addMenu(res.data.items)); // ✅ Store in Redux
    } catch (err) {
      console.error('Error fetching menu:', err);
      setError('Failed to load menu.');
    } finally {
      setLoading(false);
    }
  };
    getMenu();
  }, [RestaurantId , dispatch ]);

  if (loading) {
    return <p className="text-center text-gray-200 text-xl">Loading menu...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-xl">{error}</p>;
  }

  if (menuItems.length == 0) {
    return <p className="text-center text-gray-200 text-xl">No menu items available.</p>;
  }
 const handleDelete = async (id, restaurantId) => {
    try {
      await axios.delete(`${Base_url}/menu/item/Delete/${restaurantId}/${id}` ,{withCredentials:true});
      dispatch(deleteMenuItem(id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
       style={{ backgroundImage: `url(${BgImage})` }}
    >
      <div className="absolute inset-0"></div>
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {menuItems.map((item) => (
          <Menu key={item._id} item={item} RestaurantId={item.RestaurantId} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default MenuCard;
