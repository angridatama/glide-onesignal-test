import React, { useState, useEffect } from "react";
import "./App.css";
import Lottie from "lottie-react";
import animationData from "./assets/animation.json";

const App = () => {
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    // Extract email from URL query parameters
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get("email");
    setEmail(userEmail);
    
    // Wait until OneSignal is initialized (through window.OneSignalDeferred)
    const waitForOneSignal = async () => {
      if (!window.OneSignal) return;
      
      window.OneSignal.push(async function () {
        try {
          // Get the OneSignal User ID
          const id = await window.OneSignal.getUserId();
          setUserId(id);
        } catch (error) {
          console.error("❌ Error retrieving user ID:", error);
        }
      });
    };

    waitForOneSignal();
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
