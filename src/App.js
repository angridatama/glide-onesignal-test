import React, { useEffect, useState } from 'react';
import './App.css';
import Lottie from 'lottie-react';
import animationData from './assets/animation.json';

const App = () => {
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get('email');
    setEmail(userEmail);

    const waitForOneSignal = async () => {
      if (!window.OneSignalDeferred) return;

      window.OneSignalDeferred.push(async function (OneSignal) {
        try {
          // Wait until OneSignal is ready
          const id = await OneSignal.getUserId();
          setUserId(id);

          // Also send to Glide if email exists
          if (userEmail && id) {
            fetch("https://go.glideapps.com/api/container/plugin/webhook-trigger/nyEQtv7S4N1E2SfxTuax/80a82896-f99a-40e0-a71c-c35eeb5f11a2", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer fda014a4-0721-45b2-a1d8-4691500ae2da",
              },
              body: JSON.stringify({ email: userEmail, userId: id }),
            })
              .then((res) => res.json())
              .then((data) => console.log("✅ Sent to Glide:", data))
              .catch((err) => console.error("❌ Error sending to Glide:", err));
          }
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
