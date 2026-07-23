import React from "react";
import { useNavigate } from "react-router-dom";
import AssistantPreview from "../components/AssistantPreview";
import logo from "../assets/logo.png";

const STEPS = [
  {
    step: "01",
    title: "Sign up free",
    desc: "Continue with Google and create your assistant instantly.",
  },

  {
    step: "02",
    title: "Customize assistant" ,
    desc: "Set your business name, tone, voice and theme.",
  },

  {
    step: "03",
    title: "Train your assistant",
    desc: "Add business details and personalize responses.",
  },

  {
    step: "04",
    title: "Embed anywhere",
    desc: "Copy one script tag and add it to your websites",
  }

]

const Home = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] overflow-hidden">

      {/* Hero section start */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-20">
        {/* Background  start*/}
        <div className="absolute inset-0 bg-linear-to-r from-purple-50 via-white to-emerald-50" />

        <div className="absolute top-0 left-1/4 w-[320px] h-\[320px\] bg-purple-200/40 blur-3xl rounded-full" />

        <div className="absolute bottom-0 right-1/4 w-[320px] h-\[320px\] bg-purple-200/40 blur-3xl rounded-full" />
        {/* Background end */}

        <div className="relative max-w-6xl mx-auto">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 bg-white border border-purple-100 shadow-sm text-purple-600 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              AI Voice for modern websites
            </span>
          </div>

          <div className="text-center mt-10 sm:mt-12">
            {/* Heading */}
            <h1 className="max-w-5xl mx-auto text-[42px] leading-\[52px\] sm:text-6xl sm:leading-\[72px\] lg:text-7xl lg:leading-\[88px\] font-black tracking-[-0.04em] text-[#081028]">
              Add a{" "}
              <span className="inline-block px-2">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-emerald-500">
                  Virtual Assistant
                </span>
              </span>
              <br className="hidden sm:block" />
              to your website
            </h1>
            {/* heading end */}

            {/* Paragraph */}
            <p className="max-w-2xl mx-auto mt-7 text-sm sm:text-lg lg:text-xl text-[#64748b] leading-relaxed px-2">
              Create a smart voice-enabled assistant that talks to visitors,
              answers questions and helps users navigate your website instantly.
            </p>
            {/* Paragraph end*/}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              {/* Button for navigate to builder */}
              <button
                onClick={() => navigate("/builder")}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-linear-to-r from-purple-500 to-emerald-500 text-white font-semibold text-sm sm:text-base shadow-[0_12px_40px_rgba(168, 85, 247, 0.25)] hover:scale-[1.02] transition-all cursor-pointer"
              >
                Build Your Assistant
              </button>

            </div>

            <p className="mt-5 text-xs sm:text-sm text-gray-400">
              Free plan includes 200 AI responses
            </p>

          </div>

            {/* Using AssistantPreview Component */}
            <AssistantPreview />
        </div>
      </section>
      {/* Hero section end */}

      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">

            <h2 className="text-3xl sm:text-4xl font-bold text-[#081028]">
              Get started in minutes
            </h2>

            <p className="text-gray-500 mt-3 text-sm sm:text-base">
              Simple setup. No complicated integration
            </p>

          </div>

          {/* Mapping the STEPS */}
          <div className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-4 gap-6">
            {STEPS.map((s, idx)=>(
              <div key={idx} className="group bg-[#f8fafc] hover;bg-white border border-gray-100 rounded-[28px] p-7 transition-all hover:shadow-[0_15px_rgba(0,0,0,0.06)]">

                {/* Step */}
                <span className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-emerald-500">{s.step}</span>

                {/* Title */}
                <h3 className="mt-5 text-lg font-semibold text-[#081028]">{s.title}</h3>

                {/* Description */}
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{s.desc}</p>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Footer Start */}
      <footer className="bg-[#081028] px-6 py-10">
        <div className="flex flex-col items-center justify-between mx-auto max-w-6xl  sm:flex-row gap-5 text-center sm:text-left">

          <div>
            <div onClick={() => navigate("/")} className="flex items-center gap-2.5 cursor-pointer">
              <img
                src={logo}
                alt="logo"
                className="h-9 w-9 rounded-full  object-contain"
              />
    
              <h1 className="font-bold text-xl text-gray-100 leading-none">
                Zeno{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-emerald-500">
                  AI
                </span>
              </h1>
            </div>

            <p className="text-gray-400 text-sm mt-1">
              Voice AI assistant for websites
            </p>

          </div>

          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ZenoAI. All rights reserved.
          </p>

        </div>
      </footer>
      {/* Footer end */}
    </div>
  );
};

export default Home;
