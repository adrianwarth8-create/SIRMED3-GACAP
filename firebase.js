import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
getAuth,
signInWithEmailAndPassword,
signOut
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {

apiKey: "AIzaSyCIZ5nDYZWOabPWsikUJm06qk0hg_uObE8",

authDomain: "sirmed3gacap.firebaseapp.com",

projectId: "sirmed3gacap",

storageBucket: "sirmed3gacap.firebasestorage.app",

messagingSenderId: "529913526905",

appId: "1:529913526905:web:6edbec562fa8324f11f2a8"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

window.auth = auth;
window.signInWithEmailAndPassword =
signInWithEmailAndPassword;
window.signOut = signOut;
