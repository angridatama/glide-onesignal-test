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

    const refreshUserId = async () => {
      try {
        if (window.OneSignalDeferred) {
          window.OneSignalDeferred.push(async function (OneSignal) {
            const id = await OneSignal.User.getId();
            setUserId(id);
          });
        }
      } catch (error) {
        console.error("Error getting OneSignal User ID:", error);
      }
    };

    refreshUserId();

    const interval = setInterval(refreshUserId, 5000); // Refresh every 5s
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
