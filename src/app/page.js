"use client";

import { useState, useEffect } from "react";
import { subscribeUser, unsubscribeUser, sendNotification } from "./actions";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const VAPID_PUBLIC_KEY =
        "BA3P2KNoc2WMrd0L1ZRjL2pAdAd-hLA5gWqlvKcKVhPBeMBoR1egxxfix0XgckPCcylOkXWQJOoIxydYpCvFJLk";

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      setSubscription(sub);
      await subscribeUser(sub.toJSON());
    } catch (err) {
      console.error("Erro ao inscrever:", err);
      alert("Erro ao inscrever nas notificações.");
    }
  }

  async function unsubscribeFromPush() {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        await unsubscribeUser(subscription.endpoint);
        setSubscription(null);
      }
    } catch (err) {
      console.error("Erro ao desinscrever:", err);
      alert("Erro ao desinscrever das notificações.");
    }
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message);
      setMessage("");
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  return (
    <div>
      <h3>Push Notifications</h3>
      {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>
          <button onClick={unsubscribeFromPush}>Unsubscribe</button>
          <input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendTestNotification}>Send Test</button>
        </>
      ) : (
        <>
          <p>You are not subscribed to push notifications.</p>
          <button onClick={subscribeToPush}>Subscribe</button>
        </>
      )}
    </div>
  );
}

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsIOS(
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !!window.MSStream
      );

      setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
    }
  }, []);

  if (isStandalone) {
    return null; // Don't show install button if already installed
  }

  return (
    <div>
      <h3>Install App</h3>
      <button>Add to Home Screen</button>
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            {" "}
            ⎋{" "}
          </span>
          and then "Add to Home Screen"
          <span role="img" aria-label="plus icon">
            {" "}
            ➕{" "}
          </span>
          .
        </p>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <div>
      <PushNotificationManager />
      <InstallPrompt />
    </div>
  );
}
