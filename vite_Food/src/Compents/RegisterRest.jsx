import axios from 'axios';
import React, { useState } from 'react';
import { Base_url } from '../utils/Base_url';
import bgImage from '../assets/Register.jpg';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setRestaurant } from '../Reducers/Restaurantslice';

function RegisterRest() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [Register, SetRegister] = useState({
    Restaurantname: '',
    ownername: '',
    Address: {
      area: '',
      city: '',
      state: '',
      country: '',
      PinCode: ''
    },
    Phone: '',
    NumberOfTables: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    const { Restaurantname, ownername, Address, Phone, NumberOfTables } = Register;
    const { area, city, state, country, PinCode } = Address;

    if (
      !Restaurantname ||
      !ownername ||
      !Phone ||
      !NumberOfTables ||
      !area ||
      !city ||
      !state ||
      !country ||
      !PinCode
    ) {
      alert('Please fill all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${Base_url}/restaurant/register`,
        Register,
        { withCredentials: true }
      );
      alert('Restaurant registered successfully!');
      dispatch(setRestaurant(response.data.Restaurant));
      navigate('/restaurant/view');
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Error while registering restaurant.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Used by inputs below
  const handleChange = (path) => (e) => {
    const value = e.target.value;
    if (path.startsWith('Address.')) {
      const key = path.split('.')[1];
      SetRegister((prev) => ({
        ...prev,
        Address: {
          ...prev.Address,
          [key]: value
        }
      }));
    } else {
      SetRegister((prev) => ({
        ...prev,
        [path]: value
      }));
    }
  };

  return (
    <div
      className="flex items-center min-h-screen bg-cover bg-center py-10 lg:pl-15"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white bg-opacity-90 backdrop-blur-sm shadow-xl rounded-2xl p-8 w-full max-w-2xl mx-4">
        <h2 className="text-3xl font-extrabold text-black/85 mb-8 text-center">
          Register Your Restaurant
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Restaurant Name */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-900 font-medium mb-1">Restaurant Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black-400"
              placeholder="Spice Villa"
              value={Register.Restaurantname}
              onChange={handleChange('Restaurantname')}
            />
          </div>

          {/* Owner Name */}
          <div>
            <label className="block text-gray-900 font-medium mb-1">Owner Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Ajay Kumar"
              value={Register.ownername}
              onChange={handleChange('ownername')}
            />
          </div>

          {/* Area */}
          <div>
            <label className="block text-gray-900 font-medium mb-1">Area / Address</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="MG Road, Shivaji Nagar"
              value={Register.Address.area}
              onChange={handleChange('Address.area')}
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-gray-900 font-medium mb-1">City</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Mumbai"
              value={Register.Address.city}
              onChange={handleChange('Address.city')}
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-gray-900 font-medium mb-1">State</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Maharashtra"
              value={Register.Address.state}
              onChange={handleChange('Address.state')}
            />
          </div>

          {/* PIN Code */}
          <div>
            <label className="block text-gray-900 font-medium mb-1">PIN Code</label>
            <input
              type="text"
              maxLength={6}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="400001"
              value={Register.Address.PinCode}
              onChange={handleChange('Address.PinCode')}
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-gray-900 font-medium mb-1">Country</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="India"
              value={Register.Address.country}
              onChange={handleChange('Address.country')}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-900 font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="+919876543210"
              value={Register.Phone}
              onChange={handleChange('Phone')}
            />
          </div>

          {/* Number Of Tables */}
          <div>
            <label className="block text-gray-900 font-medium mb-1">Number Of Tables</label>
            <input
              type="number"
              required
              min={1}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="10"
              value={Register.NumberOfTables}
              onChange={handleChange('NumberOfTables')}
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            disabled={isSubmitting}
            onClick={handleRegister}
            className="px-6 py-3 w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {isSubmitting ? 'Registering...' : 'Register Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterRest;








