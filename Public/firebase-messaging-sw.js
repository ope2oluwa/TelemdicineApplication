importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDdYVvvdI0hXGizD-_O-vsw17BhI_1Fr4A",
  authDomain: "mental-health-platform-3de06.firebaseapp.com",
  projectId: "mental-health-platform-3de06",
  storageBucket: "mental-health-platform-3de06.firebasestorage.app",
  messagingSenderId: "597668214283",
  appId: "1:597668214283:web:cf1dc3a7f0034201fd390e",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message: ",
    payload
  );

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png", // You can replace this
  });
});
