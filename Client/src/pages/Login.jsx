import React from "react";
import { HiOutlineSparkles, HiOutlineMicrophone } from "react-icons/hi";
import { HiOutlineBolt, HiOutlineCodeBracket } from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/logo.png";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/Firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const Login = ({setUser}) => {
  const navigate = useNavigate();
  const FEATURES = [
    {
      icon: <HiOutlineMicrophone />,
      title: "Voice AI",
      desc: "Natural real-time voice conversations.",
    },
    {
      icon: <HiOutlineSparkles />,
      title: "Smart Navigation",
      desc: "Navigate pages using voice commands.",
    },
    {
      icon: <HiOutlineCodeBracket />,
      title: "Easy Embed",
      desc: "Add assistant using one script tag.",
    },
    {
      icon: <HiOutlineBolt />,
      title: "Fast Responses",
      desc: "Optimized Gemini AI responses.",
    },
  ];

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // Destructuring name and email
      const { displayName, email } = result.user;

      // Sending POST request for SignIn
      const res = await axios.post(
        `${serverUrl}/api/auth/google`,
        { name: displayName, email },
        { withCredentials: true },
      );

      // Setuser using Props
      setUser(res.data.user);

      // Toast for success message
      toast.success("Login successfully");

      // Navigate to Home
      navigate("/");

    } catch (error) {
      // Toast for error message
      toast.error("Login failed...");

      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gardient-to-br from-purple-50 via-white to-emerald-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">

        {/*  */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* left side*/}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 bg-purple-100 text-purple-600 text-sm font-medium">
              <HiOutlineSparkles />
              AI Voice Assistant Platform
            </div>

            <h1 className="mt-8 text-5xl lg:text-7xl font-black leading-tight text-[#081028]">
              Build AI Assistant
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-emerald-500">
                For Any Website
              </span>
            </h1>

            <p className="mt-8 text-lg text-[#475569] leading-8 max-w-2xl">
              Create customizable AI assistant that talk, guide users, and
              integrate into any website instantly.
            </p>

            {/* SignIn Button */}
            <button
              onClick={handleLogin}
              className="flex items-center gap-4 mt-10 h-16 px-8 rounded-2xl bg-linear-to-r from-purple-500 to-emerald-500 text-white text-lg font-semibold  shadow-[0_20px_80px_rgba(139, 92, 246, 0.25)] hover:scale-[1.02] transition cursor-pointer"
            >
              <FcGoogle className="text-3xl bg-white rounded-full " />
              Continue with Google
            </button>

            <p className="mt-4 text-sm text-[#64748b]">
              Free plan includes 200 AI responses
            </p>
          </div>

          {/* right side*/}
          <div className="relative">
            <div className="absolute insert-0 bg-linear-to-r from-purple-200/50 to-emerald-200/40 blur-[120px]" />

            <div className="relative rounded-[40px] border border-black/5 bg-white shadow-[0_20px_80px_rgba(0,0,0,0.060] p-8 overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className=" mt-2 text-3xl font-bold text-[#091742]">
                    Features
                  </h2>
                </div>
                <div>
                  <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-linear-to-r from-purple-500 to-emerald-500 shadow-[0_10px_40px_rgba(139,92,246,0.25)] p-3">
                    <img
                      src={logo}
                      alt="logo"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* DIV for features */}
              <div className="mt-10 space-y-5">
                {/* Mapping the features */}
                {FEATURES.map(({ icon, title, desc }, index) => (
                  <div
                    key={index}
                    className="flex gap-5 rounded-3xl border border-black/5 bg-[#f8fafc] p-5"
                  >
                    {/* Icon */}
                    <div className="flex items-center justify-center min-w-\[60px\] h-\[60px\] rounded-2xl bg-linear-to-r from-purple-500 to-emerald-500 text-white text-2xl shadow-[0_10px_30px_rgba(139,92,246,0.20)]">
                      {icon}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-[#081028] text-lg font-semibold">
                        {title}
                      </h3>
                      <p className="text-[#64748b] text-sm mt-2 leading-7">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
