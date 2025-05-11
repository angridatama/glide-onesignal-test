import React, { useState, useEffect } from "react";
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

    const initOneSignalListener = async () => {
      if (!window.OneSignal || !window.OneSignal.push) return;

      window.OneSignal.push(async () => {
        // Fetch user ID if already available
        try {
          const id = await window.OneSignal.getUserId();
          if (id) {
            setUserId(id);
          }
        } catch (err) {
          console.error("❌ Error getting initial user ID:", err);
        }

        // Listen for new subscriptions to update the UI
        window.OneSignal.on("subscriptionChange", async (isSubscribed) => {
          if (isSubscribed) {
            try {
              const id = await window.OneSignal.getUserId();
              setUserId(id);
              console.log("🔄 Updated User ID after subscription:", id);
            } catch (err) {
              console.error("❌ Error getting user ID after subscription:", err);
            }
          }
        });
      });
    };

    initOneSignalListener();
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
