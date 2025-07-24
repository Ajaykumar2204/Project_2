import React, { useState } from "react";
import { Base_url } from "../utils/Base_url";
import axios from "axios";
import { useDispatch } from "react-redux";
import bgImage from "../assets/Login_imge.jpg";
import { loginuser } from '../Reducers/userslice';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [FromData, SetFromData] = useState({ FullName: '', Email: '', Password: '', Phone: '' });
  const [Sign, SetSign] = useState(false);
  const [Error, SetError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const Handlelogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(Base_url + "/login",
        { Email: FromData.Email, Password: FromData.Password },
        { withCredentials: true }
      );
      if (!response.data?.user) throw new Error("Login failed!");
    
      dispatch(loginuser(response.data.user));
      navigate('/restaurant/view');
    } catch (err) {
      if (err.response) {
        SetError(err.response.data.error || err.response.data.message || "Login failed");
      }
    }
  };

  const Handlesignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(Base_url + "/signup",
        { Email: FromData.Email, Password: FromData.Password, FullName: FromData.FullName, Phone: FromData.Phone },
        { withCredentials: true }
      );
      if (!response.data?.user) throw new Error("Signup failed!");
      dispatch(loginuser(response.data.user));
      navigate('/restaurant/register');
    } catch (err) {
      if (err.response) {
        SetError(err.response.data.message || "Signup failed");
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      {/* Text Section */}
      <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-2 mb-10 md:mb-0 md:mr-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
          Transform Your Restaurant
        </h1>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
          With
        </h1>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-orange-500 tracking-tight">
          Smart QR Eats
        </h1>
      </div>

      {/* Form Section */}
      <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-2 text-center">
          {Sign ? "Join Us!" : "Hello Again!"}
        </h2>
        <p className="text-center mb-6 text-base sm:text-lg font-medium text-gray-700">
          {Sign ? "Sign up for your restaurant dashboard" : "Log in to your restaurant dashboard"}
        </p>
        <form className="space-y-5" onSubmit={Sign ? Handlesignup : Handlelogin}>
          {Sign && (
            <>
              <div>
                <label htmlFor="fullName" className="block text-gray-800 mb-1 font-semibold">Full Name</label>
                <input id="fullName" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1" value={FromData.FullName} onChange={(e) => SetFromData({ ...FromData, FullName: e.target.value })} autoComplete="name" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-800 mb-1 font-semibold">Phone</label>
                <input id="phone" type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1" value={FromData.Phone} onChange={(e) => SetFromData({ ...FromData, Phone: e.target.value })} autoComplete="tel" />
              </div>
            </>
          )}
          <div>
            <label htmlFor="email" className="block text-gray-800 mb-1 font-semibold">Email</label>
            <input id="email" type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1" value={FromData.Email} onChange={(e) => SetFromData({ ...FromData, Email: e.target.value })} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-800 mb-1 font-semibold">Password</label>
            <input id="password" type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1" value={FromData.Password} onChange={(e) => SetFromData({ ...FromData, Password: e.target.value })} autoComplete={Sign ? "new-password" : "current-password"} />
          </div>
          <p className="text-red-400 text-center font-medium">{Error}</p>
          <button type="submit" className="w-full py-2 mt-2 bg-orange-500 text-white font-bold rounded-lg transition-colors hover:bg-orange-600">
            {Sign ? "Sign Up" : "Log In"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-700">
          {Sign ? "Already have an account? " : "Don’t have an account? "}
          <button onClick={() => { SetSign(!Sign); SetError(""); }} className="text-orange-500 hover:underline font-semibold">
            {Sign ? "Log In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;