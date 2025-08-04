// firebase.js
// Firebase App (the core Firebase SDK) is always required and must be listed first
// These scripts should be included in your HTML before this file:
// <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js"></script>

const firebaseConfig = {
  apiKey: "AIzaSyBJqVavJpv6YaHvzJi49-fI2LsvTYGqijw",
  authDomain: "smsphising.firebaseapp.com",
  projectId: "smsphising",
  storageBucket: "smsphising.firebasestorage.app",
  messagingSenderId: "92088698439",
  appId: "1:92088698439:web:bae163a42c9996ee6e5362",
  measurementId: "G-72619E1HYY"
};

// Initialize Firebase only if it hasn't been initialized yet
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.database();