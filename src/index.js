import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

// Legacy v15-style OneSignal queue
window.OneSignalDeferred = window.OneSignalDeferred || [];

window.OneSignalDeferred.push(function (OneSignal) {
  OneSignal.init({
    appId: "fcf28885-6e95-4401-8235-e8223ab2e898",
    serviceWorkerPath: "/push/OneSignalSDKWorker.js",
    serviceWorkerParam: { scope: "/push/" },
    promptOptions: {
      slidedown: { enabled: true },
    },
  });

  console.log("✅ OneSignal Initialized");

  OneSignal.showSlidedownPrompt();

  OneSignal.on("subscriptionChange", function (isSubscribed) {
    if (isSubscribed) {
      OneSignal.getUserId().then((userId) => {
        const params = new URLSearchParams(window.location.search);
        const email = params.get("email");

        if (email && userId) {
          fetch("https://go.glideapps.com/api/container/plugin/webhook-trigger/nyEQtv7S4N1E2SfxTuax/80a82896-f99a-40e0-a71c-c35eeb5f11a2", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer fda014a4-0721-45b2-a1d8-4691500ae2da",
            },
            body: JSON.stringify({ email, userId }),
          })
            .then((res) => res.json())
            .then((data) => console.log("✅ Sent to Glide:", data))
            .catch((err) => console.error("❌ Error sending to Glide:", err));
        }
      });
    }
  });
});

// Old style render for React 17 and below
ReactDOM.render(<App />, document.getElementById("root"));
