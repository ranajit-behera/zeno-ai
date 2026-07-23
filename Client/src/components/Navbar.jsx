import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";
const serverUrl = import.meta.env.VITE_SERVER_URL;

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const[menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // Sending req to clear cookies of current user
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });

      // setUser to null
      setUser(null);

      // toast for success message
      toast.success("Logout Successfully");

      // Navigate to Login
      navigate("/login");

    } catch (error) {

      // toast for error message
      toast.error("Logout failed");
      console.log(error);
    }
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-orange-100">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 py-3 ">
        {/* left side */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <img
            src={logo}
            alt="logo"
            className="h-9 w-9 rounded-full  object-contain"
          />

          <h1 className="font-bold text-xl text-gray-700 leading-none">
            Zeno{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-emerald-500">
              AI
            </span>
          </h1>
        </div>

        {/* right side */}
        {user && (
          <div className="hidden md:flex items-center gap-3">
            {/* Navigate to Builder page */}
            <button
              onClick={() => navigate("/builder")}
              className="px-4 py-2 rounded-xl bg-linear-to-r from-purple-500 to-emerald-500 text-white text-sm font-medium shadow-md hover:scale-[1.02] transition-all cursor-pointer"
            >
              Builder
            </button>

            {/* Navigate to billing page */}
            <button
              onClick={() => navigate("/billing")}
              className="px-4 py-2 rounded-xl border border-orange-100 bg-white text-gray-700 text-sm font-medium hover:border-purple-300 transition-all cursor-pointer"
            >
              Billing
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-orange-100 shadow-sm">
              <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-linear-to-r from-purple-500 to-emerald-500">
                {/* User's first letter in Capital */}
                <span className="text-white text-sm font-bold">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* User's Name */}
              <div className="max-w-\[140px\] overflow-hidden">
                <p className="text-sm font-semibold to-gray-800 truncate">
                  {user.name}
                </p>

                {/* User's Email */}
                <p className="text-xs font-semibold to-gray-800 truncate">
                  {user.email}
                </p>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="ml-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                <FiLogOut size={18} />
              </button>
            </div>
          </div>
        )}

        {user && (
          // Toggle the hamburger icon
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-600 hover:text-purple-500 transition-colors cursor-pointer"
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        )}
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="bg-white rounded-2xl border-orange-100 shadow-lg p-4">
            <div className="flex items-center gap-3 pb-4 border-b border-orange-100">
              <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-linear-to-r from-purple-500 to-emerald-500">
                {/* User's first letter in Capital */}
                <span className="text-white text-sm font-bold">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* User's Name */}
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold to-gray-800 truncate">
                  {user.name}
                </p>

                {/* User's Email */}
                <p className="text-xs font-semibold to-gray-800 truncate">
                  {user.email}
                </p>
              </div>
            </div>


            {/* Button Div */}
            <div className="flex flex-col gap-3 mt-4">
              {/* Navigate to Builder page, setMenuOpen(false) */}
              <button
                onClick={() =>{ navigate("/builder"); setMenuOpen(false)}}
                className="w-full py-2.5 rounded-xl bg-linear-to-r from-purple-500 to-emerald-500 text-white text-sm font-medium"
              >
                Builder
              </button>

              {/* Navigate to Billing page, setMenuOpen(false) */}
              <button
                onClick={() => {navigate("/billing"); setMenuOpen(false)}}
                className="w-full py-2.5 rounded-xl border border-orange-100 bg-white text-gray-700 text-sm font-medium"
              >
                Billing
              </button>
            </div>

            {/* Logout Btn, setMenuOpen(false) */}
            <button onClick={()=>{setMenuOpen(false); handleLogout()}} className="flex items-center justify-center mt-4 w-full gap-2 py-2.5 rounded-xl  bg-red-50 text-red-500 hover:bg-red-100 transition-colors text-sm font-medium"><FiLogOut size={16}/>Logout</button>

          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
