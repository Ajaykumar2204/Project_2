import axios from 'axios';
import React, { useState } from 'react';
import { Base_url } from "../utils/Base_url";
import InfoBg from '../assets/Info.jpg';
import { useSelector } from 'react-redux';

const AddMenu = () => {
  const restaurant = useSelector((store) => store.restaurant);

  const [Itemsname, SetItemsname] = useState('');
  const [Description, SetDescription] = useState('');
  const [Category, SetCategory] = useState('');
  const [Price, SetPrice] = useState('');
  const [Image, SetImage] = useState(null);
  const [Serves, SetServes] = useState(1);
  const [Discount, SetDiscount] = useState(0);
  const [IsVeg, SetIsVeg] = useState(false);
  const [IsAvailable, SetIsAvailable] = useState('Available');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Itemsname || !Description || !Category || !Price || !Image) {
      setError('❌ Please fill all required fields.');
      setSuccess('');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('RestaurantId', restaurant._id);
      formData.append('Itemsname', Itemsname.trim());
      formData.append('Description', Description.trim());
      formData.append('Category', Category.trim());
      formData.append('Price', Price);
      formData.append('Serves', Serves);
      formData.append('Discount', Discount);
      formData.append('IsVeg', IsVeg);
      formData.append('IsAvailable', IsAvailable);
      formData.append('Image', Image);

      const res = await axios.post(
        `${Base_url}/menu/ItemsAdd`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(res);
      setSuccess('✅ Menu item added successfully!');
      setError('');
      setTimeout(() => setSuccess(''), 3000);

      SetItemsname('');
      SetDescription('');
      SetCategory('');
      SetPrice('');
      SetImage(null);
      SetServes(1);
      SetDiscount(0);
      SetIsVeg(false);
      SetIsAvailable('Available');

    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(`❌ ${message}`);
      setSuccess('');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row items-start md:items-center justify-center bg-cover bg-center relative px-4 py-8"
      style={{ backgroundImage: `url(${InfoBg})` }}
    >
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4">
        {(error || success) && (
          <div className="toast toast-top toast-center">
            {error && (
              <div className="alert alert-error shadow-lg">
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="alert alert-success shadow-lg">
                <span>{success}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl w-full md:bg-transparent p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl gap-8">
        <div className="w-full md:w-1/2 text-center md:text-right">
          <h1 className="text-orange-500 text-4xl md:text-6xl font-extrabold leading-tight drop-shadow mb-2 md:mb-0">
            Transform Your Menu
          </h1>
          <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight drop-shadow">
            Into a Smart QR Menu
          </h1>
        </div>

        <div className="w-full md:w-1/2 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-300">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-center text-orange-500">
            Add Menu Item
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Item Name"
              value={Itemsname}
              onChange={(e) => SetItemsname(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
            />

            <textarea
              placeholder="Description"
              value={Description}
              onChange={(e) => SetDescription(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
            />

            <input
              type="text"
              placeholder="Category (e.g., Maincourse)"
              value={Category}
              onChange={(e) => SetCategory(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
            />

            <input
              type="number"
              placeholder="Price"
              value={Price}
              onChange={(e) => SetPrice(e.target.value)}
              min={0}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => SetImage(e.target.files[0])}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
            />

            <div className="flex flex-col md:flex-row flex-wrap md:items-center gap-4 md:gap-6">
              <div className="flex flex-col md:flex-row md:items-center md:gap-2 w-full md:w-auto">
                <label className="mb-1 md:mb-0">Serves:</label>
                <input
                  type="number"
                  value={Serves}
                  onChange={(e) => SetServes(e.target.value)}
                  min={1}
                  max={20}
                  className="w-full md:w-84 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:gap-2 w-full md:w-auto">
                <label className="mb-1 md:mb-0">Discount (%):</label>
                <input
                  type="number"
                  value={Discount}
                  onChange={(e) => SetDiscount(e.target.value)}
                  min={0}
                  max={100}
                  className="w-full  md:w-38 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <label htmlFor="isVeg" className="flex items-center gap-3 w-full md:w-auto">
                <input
                  id="isVeg"
                  type="checkbox"
                  checked={IsVeg}
                  onChange={(e) => SetIsVeg(e.target.checked)}
                  className="accent-orange-500"
                />
                {IsVeg ? 'Veg' : 'Non-Veg'}
              </label>

              <div className="w-full md:w-auto">
                <select
                  value={IsAvailable}
                  onChange={(e) => SetIsAvailable(e.target.value)}
                  className="w-full md:w-100 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  <option value="Available">Available</option>
                  <option value="NotAvailable">Not Available</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
            >
              Add Menu Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMenu;



