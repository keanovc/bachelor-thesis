import React, { createContext } from 'react';
import { initializeApp } from 'firebase/app';

import config from '../config/firebase';

const app = initializeApp(config);

const FireBaseContext = createContext(app);

const FireBaseProvider = ({ children }) => {
    return (
        <FireBaseContext.Provider value={app}>
            {children}
        </FireBaseContext.Provider>
    )
}

export { FireBaseContext, FireBaseProvider }

// import firebase from 'firebase/app'
// import 'firebase/auth';
// import 'firebase/firestore';

// import config from '../config/firebase';

// const FireBaseContext = createContext({})

// if (!firebase.apps.length) {
//     firebase.initializeApp(config);
// }

// const db = firebase.firestore();

// const FireBase = {}

// const FireBaseProvider = ({ props }) => {
//     return (
//         <FireBaseContext.Provider value={{ FireBase }}>
//             {props.children}
//         </FireBaseContext.Provider>
//     )
// }

// export { FireBaseContext, FireBaseProvider }