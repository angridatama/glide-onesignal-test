import React, { useEffect, useState } from 'react';
import './App.css';
import Lottie from 'lottie-react';
import animationData from './assets/animation.json';

const App = () => {
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);

  // Fetch email from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get('email');
    setEmail(userEmail);

    // If the user is already subscribed, get the userId
    const checkUserId = async () => {
      if (window.OneSignal && window.OneSignal.getUserId) {
        const id = await window.OneSignal.getUserId();
        setUserId(id);
      }
    };
    checkUserId();
  }, []);

  // Handle user click to trigger the notification prompt
  const handleSubscribe = () => {
    console.log("Button clicked"); // Add this to verify the button is clicked
    if (window.OneSignal) {
      window.OneSignal.showSlidedownPrompt(); // Trigger prompt
    }
  };
  

  return (
    <div className="app-container">
      <div className="content">
        <h1>Notification Activation</h1>
        <Lottie animationData={animationData} style={{ height: 200 }} />
        <p>Your OneSignal User ID will be shown here:</p>
        {userId ? (
          <div>
            <p className="user-id">User ID: {userId}</p>
            <p className="user-email">Email: {email}</p>
          </div>
        ) : (
          <p>Click the button to enable notifications and get your user ID.</p>
        )}

        {/* Manual trigger button */}
        <button className="send-button" onClick={handleSubscribe}>
          Enable Notifications
        </button>
      </div>
    </div>
  );
};

export default App;
