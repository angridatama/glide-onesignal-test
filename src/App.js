import React, { useEffect, useState } from "react";
import "./App.css";
import Lottie from "lottie-react";
import animationData from "./assets/animation.json";

const App = () => {
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get("email");
    setEmail(userEmail);

    const getUserId = async () => {
      try {
        if (window.OneSignal && typeof window.OneSignal.getUserId === "function") {
          const id = await window.OneSignal.getUserId();
          if (id) setUserId(id);
        }
      } catch (err) {
        console.error("❌ Error getting OneSignal user ID:", err);
      }
    };

    // Initial check
    getUserId();

    // Auto-refresh every 5 seconds
    const interval = setInterval(getUserId, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <div className="content">
        <h1>Notifications</h1>
        <Lottie animationData={animationData} style={{ height: 200 }} />
        <p>Your OneSignal User ID will appear here:</p>
        {userId ? (
          <>
            <p className="user-id">User ID: {userId}</p>
            <p className="user-email">Email: {email}</p>
          </>
        ) : (
          <p>Please allow notifications to get your User ID.</p>
        )}
      </div>
    </div>
  );
};

export default App;
