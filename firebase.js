/*************************
 * FIREBASE - SIRMED
 *************************/

import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    getDoc,
    query,
    where,
    orderBy,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

/*************************
 * CONFIGURAÇÃO FIREBASE
 *************************/

const firebaseConfig = {

    apiKey: "AIzaSyCIZ5nDYZWOabPWsikUJm06qk0hg_uObE8",

    authDomain: "sirmed3gacap.firebaseapp.com",

    projectId: "sirmed3gacap",

    storageBucket: "sirmed3gacap.firebasestorage.app",

    messagingSenderId: "529913526905",

    appId: "1:529913526905:web:6edbec562fa8324f11f2a8"

};

/*************************
 * INICIALIZAÇÃO
 *************************/

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

console.log("🏥 SIRMED conectado ao Firebase");

/*************************
 * AUTH
 *************************/

window.auth = auth;

window.signInWithEmailAndPassword =
    signInWithEmailAndPassword;

window.signOut =
    signOut;

window.onAuthStateChanged =
    onAuthStateChanged;

/*************************
 * FIRESTORE
 *************************/

window.db = db;

window.collection =
    collection;

window.addDoc =
    addDoc;

window.getDocs =
    getDocs;

window.deleteDoc =
    deleteDoc;

window.updateDoc =
    updateDoc;

window.doc =
    doc;

window.getDoc =
    getDoc;

window.query =
    query;

window.where =
    where;

window.orderBy =
    orderBy;

window.serverTimestamp =
    serverTimestamp;

/*************************
 * TESTE
 *************************/

console.log("🔥 Firestore pronto");
console.log("🔐 Authentication pronto");
