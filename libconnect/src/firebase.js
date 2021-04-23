import firebase from "firebase/app";
import "firebase/auth";

const app = firebase.initializeApp({
    apiKey: "AIzaSyBF3lkG3EeG_GbeWGhOrHI79i_RujX1LaM",
    authDomain: "libconnect-3399d.firebaseapp.com",
    databaseURL: "https://libconnect-3399d-default-rtdb.firebaseio.com",
    projectId: "libconnect-3399d",
    storageBucket: "libconnect-3399d.appspot.com",
    messagingSenderId: "387838064284",
    appId: "1:387838064284:web:722fbe73bdb0157879df59",
    measurementId: "G-75RSMDZBVP"
});

export const auth = app.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export default app;