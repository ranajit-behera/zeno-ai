import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { serverUrl } from "../config";

function Billing({ user, setUser }) {
  const navigate = useNavigate();

  // Navigate if Assistant setup is not complete
  useEffect(() => {
    if (user && !user.isSetupComplete) {
      toast.error("Setup your assistant first");
      navigate("/builder");
    }
  }, []);

  // Count Remaining Message left
  const remainingMessages = Math.max(
    0,
    (user?.requestLimit || 0) - (user?.totalMessages || 0),
  );

  // Count Remaining Days left
  const RemainingDays = user?.proExpiresAt
    ? Math.max(
        0,
        Math.ceil(
          (new Date(user?.proExpiresAt) - new Date()) / (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  // Function to handle Payment
  const handlePay = async () => {
    try {
      // Create payment order on the server
      const res = await axios.post(
        serverUrl + "/api/billing/order",
        { plan: "pro" },
        { withCredentials: true },
      );

      // Get order details from the server
      const order = res.data.order;

      // Razorpay checkout configuration
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Zeno AI",
        description: "Pro Plan",
        order_id: order.id,

        // Handle successful payment
        handler: async (response) => {
          try {
            // Verify payment on the server
            const verifyRes = await axios.post(
              serverUrl + "/api/billing/verify",
              response,
              { withCredentials: true },
            );

            // Check if payment verification succeeded
            if (verifyRes.data.success) {
              toast.success("Payment successfully");

              // Update user with new plan details
              setUser(verifyRes.data.user);
            }
          } catch (error) {
            toast.error("Payment verification failed");
            console.log( "Verification error:",error.response?.data || error.message);
          }
        },
        // Customize Razorpay checkout theme
        theme: {
          color: "#7c3aed",
        },
      };

      // Open Razorpay payment window
      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      toast.error("Payment Failed");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#081028]">
            Billing & Subscription
          </h2>
          <p className="text-gray-500 mt-1">
            Manage your AI assistant plan and usage
          </p>
        </div>

{/* Show assistant plan, Gemini status, and usage details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {/* Show the user's current subscription plan */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-400">Current Plan</p>
            <h2 className="text-xl font-bold text-[#081028] mt-1 capitalize">
              {user?.plan}
            </h2>
          </div>

{/* Show Gemini API status with dynamic status color */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-400">Gemini Status</p>

            <h2
              className={`text-xl font-bold text-[#081028] mt-1 capitalize ${
                user?.geminiStatus === "active"
                  ? "text-emerald-600"
                  : user?.geminiStatus === "invalid"
                    ? "text-red-500"
                    : "text-amber-500"
              }`}
            >
              {user?.geminiStatus}
            </h2>
          </div>

{/* Free plan: show remaining messages | Paid plan: show remaining expiry days */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-400">
              {user?.plan === "free" ? "Messages Left" : "Plan Expiry"}
            </p>
            <h2 className="text-xl font-bold text-[#081028] mt-1 capitalize">
              {user?.plan === "free"
                ? remainingMessages
                : `${RemainingDays} Days`}
            </h2>
          </div>
        </div>

{/* Plans Container  start*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          
          {/* free plan start*/}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-[#081028]">Free Plan</h2>

            <h3 className="text-5xl font-bold mt-5 text-[#081028]">₹0</h3>

            <ul className="mt-6 space-y-4 text-gray-600">
              <li>200 AI messages</li>
              <li>Voice assistant</li>
              <li>Navigation support</li>
              <li>Basic customization</li>
            </ul>
          </div>
          {/* free plan end*/}

          {/* Pro plan start*/}
          <div className="rounded-3xl p-8 bg-linear-to-r from-purple-600 to-emerald-600 text-white shadow-lg">
            <h2 className="text-2xl font-bold text-[#081028]">Pro Plan</h2>

            <h3 className="text-5xl font-bold mt-5 text-[#081028]">₹699</h3>

            <p className="mt-8 opacity-80">3 Months Access</p>

            <ul className="mt-6 space-y-4 opacity-90">
              <li>Unlimited AI messages</li>
              <li>Advanced AI assistant</li>
              <li>Priority performance</li>
              <li>Unlimited navigation</li>
              <li>Premium support</li>
            </ul>

            <button
              onClick={handlePay}
              disabled={user?.plan === "pro"}
              className={`mt-8 h-14 w-full rounded-2xl font-semibold transition ${
                user?.plan === "pro"
                  ? "bg-emerald-200 text-black cursor-default"
                  : "bg-white text-[#011028] cursor-pointer"
              }`}
            >
              {user?.plan === "pro" ? "Active Plan" : "Upgrade Now"}
            </button>
          </div>
          {/* Pro plan end*/}
        </div>

{/* Plans Container  start*/}
      </div>
    </div>
  );
}

export default Billing;
