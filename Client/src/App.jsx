import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Builder from "./pages/Builder";
import Billing from "./pages/Billing";
import {Toaster} from "react-hot-toast";
import { serverUrl } from "./config";

const App = () => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current user
    const fetchMe = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/user/current-user`, {
          withCredentials: true,
        });

        // Set current user
        setUser(res.data);

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  return (
    <>
    {/* Toaster used for showing messages in frontend */}
    <Toaster position="top-right"/>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* Protectect all Routes */}
        <Route
          path="/*"
          element={

            <ProtectedRoute user={user} loading={loading}>

              {/* children */}
              <Navbar user={user} setUser={setUser} />

              <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route
                  path="/builder"
                  element={<Builder user={user} setUser={setUser} />}
                />
                <Route path="/billing" element={<Billing user={user} />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
