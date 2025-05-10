import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize OneSignal using Deferred
window.OneSignalDeferred.push(async function (OneSignal) {
  await OneSignal.init({
    appId: "fcf28885-6e95-4401-8235-e8223ab2e898",
    notifyButton: { enable: true },
    serviceWorkerPath: "/push/OneSignalSDKWorker.js",
    serviceWorkerParam: { scope: "/push/" },
    promptOptions: {
      slidedown: { enabled: true },
    },
  });
  console.log('OneSignal Initialized');
  window.OneSignalInitialized = true;
});


  // Show permission prompt
  OneSignal.showSlidedownPrompt();

  // Wait for user to subscribe
  OneSignal.on("subscriptionChange", async function (isSubscribed) {
    if (isSubscribed) {
      const userId = await OneSignal.getUserId();
      console.log("✅ User subscribed. OneSignal ID:", userId);

      // Get email from URL
      const params = new URLSearchParams(window.location.search);
      const userEmail = params.get("email");

      // Send to Glide
      if (userEmail && userId) {
        fetch(
          "https://go.glideapps.com/api/container/plugin/webhook-trigger/nyEQtv7S4N1E2SfxTuax/80a82896-f99a-40e0-a71c-c35eeb5f11a2",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer fda014a4-0721-45b2-a1d8-4691500ae2da",
            },
            body: JSON.stringify({ email: userEmail, userId }),
          }
        )
          .then((res) => res.json())
          .then((data) => console.log("✅ Sent to Glide:", data))
          .catch((err) => console.error("❌ Error sending to Glide:", err));
      }
    }
  });

  window.OneSignalInitialized = true;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
