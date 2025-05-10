import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Ensure the deferred array exists
window.OneSignalDeferred = window.OneSignalDeferred || [];

// Push your OneSignal init logic
window.OneSignalDeferred.push(async function (OneSignal) {
  await OneSignal.init({
    appId: "fcf28885-6e95-4401-8235-e8223ab2e898",
    notifyButton: { enable: false },
    serviceWorkerPath: "/push/OneSignalSDKWorker.js",
    serviceWorkerParam: { scope: "/push/" },
    promptOptions: {
      slidedown: {
        enabled: true,
        actionMessage: "We'd like to show you notifications for the latest updates.",
        acceptButtonText: "Allow",
        cancelButtonText: "No thanks"
      },
    },
  });

  console.log("✅ OneSignal Initialized");

  // Show the permission prompt right away
  OneSignal.showSlidedownPrompt();

  // When subscribed, send data to Glide
  OneSignal.on("subscriptionChange", async (isSubscribed) => {
    if (isSubscribed) {
      const userId = await OneSignal.getUserId();
      console.log("✅ Subscribed, ID:", userId);

      const params = new URLSearchParams(window.location.search);
      const email = params.get("email");

      if (userId && email) {
        fetch("https://go.glideapps.com/api/container/plugin/webhook-trigger/nyEQtv7S4N1E2SfxTuax/80a82896-f99a-40e0-a71c-c35eeb5f11a2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer fda014a4-0721-45b2-a1d8-4691500ae2da",
          },
          body: JSON.stringify({ email, userId }),
        })
          .then(res => res.json())
          .then(data => console.log("✅ Sent to Glide:", data))
          .catch(err => console.error("❌ Error sending to Glide:", err));
      }
    }
  });
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
