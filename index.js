const check = () => {
  if (!("serviceWorker" in navigator)) {
    throw new Error("No Service Worker support!");
  }
  if (!("PushManager" in window)) {
    throw new Error("No Push API Support!");
  }
};

const registerServiceWorker = async () => {
  const swRegistration = await navigator.serviceWorker.register("service.js");
  return swRegistration;
};

const requestNotificationPermission = async () => {
  const permission = await window.Notification.requestPermission();
  // value of permission can be 'granted', 'default', 'denied'
  // granted: user has accepted the request
  // default: user has dismissed the notification permission popup by clicking on x
  // denied: user has denied the request.
  if (permission !== "granted") {
    throw new Error("Permission not granted for Notification");
  }
};

const main = async () => {
  check();
  const swRegistration = await registerServiceWorker();
  const permission = await requestNotificationPermission();
};
// main(); we will not call main in the beginning.

function subscribeUserToPush() {
  return navigator.serviceWorker.register('service.js')
  .then(function(registration) {
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        'BGWuux8Z6nqqlKaHB4agadTRHi9MXPFfi64KWS1saEZ2sgbRsmhZtvdxUyPuTYhoiStjnq9UuWAapkU8O64BF3A'
      )
    };

    return registration.pushManager.subscribe(subscribeOptions);
  })
  .then(function(pushSubscription) {
    console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
	document.getElementById("token").innerHTML =JSON.stringify(pushSubscription);
    return pushSubscription;
  });
}

const urlBase64ToUint8Array= base64String => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

