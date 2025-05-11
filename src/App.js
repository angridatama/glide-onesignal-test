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

    // Wait for OneSignal and subscribe to updates
    if (window.OneSignalDeferred) {
      window.OneSignalDeferred.push(async (OneSignal) => {
        try {
          const id = await OneSignal.getUserId();
          if (id) {
            console.log("✅ OneSignal User ID (initial):", id);
            setUserId(id);
          }

          OneSignal.on("subscriptionChange", async (isSubscribed) => {
            if (isSubscribed) {
              const newId = await OneSignal.getUserId();
              console.log("🔄 Subscribed, got new ID:", newId);
              setUserId(newId);
            }
          });
        } catch (err) {
          console.error("❌ Error in OneSignal setup:", err);
        }
      });
    }
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
