import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

window.OneSignalDeferred = window.OneSignalDeferred || [];

window.OneSignalDeferred.push(async function (OneSignal) {
  await OneSignal.init({
    appId: "fcf28885-6e95-4401-8235-e8223ab2e898",
    serviceWorkerPath: "/push/onesignal/OneSignalSDKWorker.js",
    serviceWorkerParam: { scope: "/push/onesignal/" },
    promptOptions: {
      slidedown: { enabled: true },
    },
  });

  console.log("✅ OneSignal Initialized");

  await OneSignal.showSlidedownPrompt();

  OneSignal.Notifications.addEventListener("permissionChange", async () => {
    const isSubscribed = await OneSignal.User.PushSubscription.optedIn;
    if (isSubscribed) {
      const userId = await OneSignal.User.getId();
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
    }
  });
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
