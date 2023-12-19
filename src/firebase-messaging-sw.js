// import { initializeApp } from "firebase/app";

importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js'); 
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "xxxxxxx",
  authDomain: "hearme-xxxxx.firebaseapp.com",
  databaseURL: "https://hearme-xxxx.firebaseio.com",
  projectId: "hearme-xxxxx",
  storageBucket: "hearme-xxxxxx.appspot.com",
  messagingSenderId: "xxxxx",
  appId: "xxxxxxxx"
};

// Initialize Firebase
if (firebase.messaging.isSupported()) {
  const app = firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();
}

