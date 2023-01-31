import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'

const firebaseConfig = {
    apiKey: "AIzaSyAz9BKwQ9LeKvlqo-B3TLEgiVaNTH6RlD8",
    authDomain: "bachelorthesis-e377a.firebaseapp.com",
    projectId: "bachelorthesis-e377a",
    storageBucket: "bachelorthesis-e377a.appspot.com",
    messagingSenderId: "285831959690",
    appId: "1:285831959690:web:0b79a6bba8724184440973"
}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export { firebase }