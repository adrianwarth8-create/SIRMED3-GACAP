/*************************************************
          FIREBASE.JS - SIRMED V4.5
*************************************************/


/*************************************************
              FIREBASE APP
*************************************************/

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";


/*************************************************
              AUTHENTICATION
*************************************************/

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";


/*************************************************
                  FIRESTORE
*************************************************/

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
    serverTimestamp,
    writeBatch
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";


/*************************************************
              CONFIGURAÇÃO FIREBASE
*************************************************/

const firebaseConfig = {

    apiKey:
        "AIzaSyCIZ5nDYZWOabPWsikUJm06qk0hg_uObE8",

    authDomain:
        "sirmed3gacap.firebaseapp.com",

    projectId:
        "sirmed3gacap",

    storageBucket:
        "sirmed3gacap.firebasestorage.app",

    messagingSenderId:
        "529913526905",

    appId:
        "1:529913526905:web:6edbec562fa8324f11f2a8"

};


/*************************************************
              INICIALIZAR FIREBASE
*************************************************/

const app =
    initializeApp(
        firebaseConfig
    );


/*************************************************
              AUTHENTICATION
*************************************************/

const auth =
    getAuth(
        app
    );


/*************************************************
                  FIRESTORE
*************************************************/

const db =
    getFirestore(
        app
    );


/*************************************************
                  EXPORTAÇÕES
*************************************************/

export {

    /*************************************************
                    FIREBASE
    *************************************************/

    app,

    auth,

    db,


    /*************************************************
                  AUTHENTICATION
    *************************************************/

    signInWithEmailAndPassword,

    signOut,

    onAuthStateChanged,


    /*************************************************
                    FIRESTORE
    *************************************************/

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

    serverTimestamp,

    writeBatch

};


/*************************************************
                    LOGS
*************************************************/

console.log(
    "🔥 Firebase do SIRMED inicializado."
);

console.log(
    "🔐 Authentication pronto."
);

console.log(
    "🗄️ Firestore pronto."
);
