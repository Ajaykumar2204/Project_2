import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import InfoBg from '../assets/Info.jpg';
import { Base_url } from '../utils/Base_url';
import { updateMenuItem } from '../Reducers/Menuslice';

function EditMenuItem() {
  const { itemId , RestaurantId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = useSelector((state) => state.Menu.items);

  const selectedItem = menuItems.find((item) => item._id === itemId);

  const [formData, setFormData] = useState({
    Itemsname: '',
    Description: '',
    Category: '',
    Price: '',
    Discount: '',
    Serves: '',
    IsAvailable: 'Available',
    IsVeg: true,
    Image: null,
    previewImage: '', // ✅ local preview OR server image
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load from Redux
  useEffect(() => {
    if (selectedItem) {
      setFormData({
        Itemsname: selectedItem.Itemsname || '',
        Description: selectedItem.Description || '',
        Category: selectedItem.Category || '',
        Price: selectedItem.Price || '',
        Discount: selectedItem.Discount || '',
        Serves: selectedItem.Serves || '',
        IsAvailable: selectedItem.IsAvailable || 'Available',
        IsVeg: selectedItem.IsVeg ?? true,
        Image: null,
        previewImage: selectedItem.Image
          ? `${Base_url}/${selectedItem.Image}`
          : '',
      });
    }
  }, [selectedItem]);

  // Fallback API fetch if Redux empty
  useEffect(() => {
    if (!selectedItem) {
      const fetchItem = async () => {
        try {
          const res = await axios.get(`${Base_url}/menu/item/${itemId}`);
          const item = res.data.item;
          setFormData({
            Itemsname: item.Itemsname || '',
            Description: item.Description || '',
            Category: item.Category || '',
            Price: item.Price || '',
            Discount: item.Discount || '',
            Serves: item.Serves || '',
            IsAvailable: item.IsAvailable || 'Available',
            IsVeg: item.IsVeg ?? true,
            Image: null,
            previewImage: item.Image ? `${Base_url}/${item.Image}` : '',
          });
        } catch (err) {
          console.error('Failed to fetch item:', err);
        }
      };
      fetchItem();
    }
  }, [selectedItem, itemId]);

  // When user selects a new file — preview it locally
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          Image: file,
          previewImage: reader.result, // ✅ base64 preview
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) {
      setError('Selected item not found');
      return;
    }

    try {
      const updateData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'Image' && value) {
          updateData.append('Image', value);
        } else if (key !== 'previewImage') {
          updateData.append(key, value);
        }
      });

      // ✅ Use RestaurantId from selectedItem
      const res = await axios.put(
        `${Base_url}/menu/item/Update/${selectedItem.RestaurantId}/${itemId}`,
        updateData,
        { withCredentials: true }
      );

      // ✅ Update Redux
      dispatch(updateMenuItem(res.data.item));

      setSuccess('Item updated successfully!');
      setError('');
      navigate(`/menu/view/edit/${RestaurantId}`)
      // Optional: navigate back to menu list
      // navigate(`/menu/${selectedItem.RestaurantId}`);

    } catch (err) {
      console.error(err);
      setError('Failed to update item');
      setSuccess('');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row items-start justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${InfoBg})` }}
    >
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
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

      <div className="  flex flex-col md:flex-row gap-10 p-8 w-[50%] max-w-7xl z-10">
        {/* Card Preview */}
       {/* <div className="flex-1 flex items-center justify-center "> */}
          {/* <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-sm h-[400px] flex flex-col">
            {/* Image 50% */}
            {/* <div className="h-1/2 w-full">
              <img
                src={ 
                   formData.previewImage  
                    ? formData.previewImage
                    : 'https://via.placeholder.com/400x200?text=No+Image'
                }
                alt="Preview"
                className="w-full h-full object-cover border-1  rounded-2xl  "
              />
            </div> */}
            {/* Details */}
            {/* <div className="h-1/2 p-4 flex flex-col justify-between">
              <h2 className="text-xl font-bold">{formData.Itemsname || 'Item Name'}</h2>
              <p className="text-gray-600 flex-1 overflow-y-auto">
                {formData.Description || 'Description goes here...'}
              </p>
              <div className='flex  justify-between text-xl  '> 
                  <div className="text-gray-800 font-semibold ">
                ₹ {formData.Price || '--'} 
              </div>
               <div className="text-gray-800 font-semibold first-letter:uppercase ">
                  {formData.Category}
              </div>
              </div>
              <div className='flex justify-between text-md '>
                <div className=" text-gray-500">
               Discount: {formData.Discount || '0'}%<br />
             </div>
               <div className=" text-gray-500">
                Serves: {formData.Serves || '--'} 
             </div>
             </div>
             <div className='flex justify-between text-md '>
                <div className=" text-gray-500">
                    {formData.IsVeg ? 'Veg' : 'Non-Veg'} 
              </div>
               <div className=" text-gray-500">
                    {formData.IsAvailable}
              </div>
             </div>
             
        // //     </div> */}
        // {/* //   </div> 
        // // </div> 
        // */}

        {/* Form */}
        <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg border border-gray-300">
          <h2 className="text-3xl font-extrabold mb-4 text-center text-orange-500">
            Edit Menu Item
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Item Name"
              value={formData.Itemsname}
              onChange={(e) =>
                setFormData({ ...formData, Itemsname: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
            />

            <textarea
              placeholder="Description"
              rows={3}
              value={formData.Description}
              onChange={(e) =>
                setFormData({ ...formData, Description: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
            />

            <input
              type="text"
              placeholder="Category (e.g., Maincourse)"
              value={formData.Category}
              onChange={(e) =>
                setFormData({ ...formData, Category: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
            />

            <input
              type="number"
              placeholder="Price"
              value={formData.Price}
              onChange={(e) =>
                setFormData({ ...formData, Price: e.target.value })
              }
              min={0}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
            />

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <label>Serves:</label>
                <input
                  type="number"
                  value={formData.Serves}
                  onChange={(e) =>
                    setFormData({ ...formData, Serves: e.target.value })
                  }
                  min={1}
                  max={20}
                  className="w-28 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="flex  items-center gap-3">
                <label>Discount (%):</label>
                <input
                  type="number"
                  value={formData.Discount}
                  onChange={(e) =>
                    setFormData({ ...formData, Discount: e.target.value })
                  }
                  min={0}
                  max={100}
                  className="w-38 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <label htmlFor="isVeg" className="flex items-center gap-3 w-28 ">
                <input
                  id="isVeg"
                  type="checkbox"
                  checked={formData.IsVeg}
                  onChange={(e) =>
                    setFormData({ ...formData, IsVeg: e.target.checked })
                  }
                  className="accent-orange-500"
                />
                {formData.IsVeg ? 'Veg' : 'Non-Veg'}
              </label>

              <select
                value={formData.IsAvailable}
                onChange={(e) =>
                  setFormData({ ...formData, IsAvailable: e.target.value })
                }
                className="p-2 w-80 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option value="Available">Available</option>
                <option value="NotAvailable">Not Available</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
            >
              
              Update Menu Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditMenuItem;




