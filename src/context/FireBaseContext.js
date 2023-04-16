import { createContext } from 'react';
import { firebase } from '../config/firebase';

const FireBaseContext = createContext();

const FireBase = {
    getCurrentUser: () => {
        return firebase.auth().currentUser;
    },

    createUserWithEmailAndPassword: async (user) => {
        let profilePictureUrl = "default"

        if (user.profilePicture !== undefined) {
            const profilePicture = await FireBase.uploadProfilePicture(user.profilePicture);
            profilePictureUrl = await profilePicture.ref.getDownloadURL();
        }
        
        await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            .then(async () => {
                const uid = FireBase.getCurrentUser().uid;

                await firebase.firestore().collection('users').doc(uid).set({
                    symbol: user.symbol,
                    symbolBefore: user.symbolBefore,
                    valuta: user.valuta,
                    fullname: user.fullname,
                    username: user.username,
                    email: user.email,
                    profilePicture: profilePictureUrl,
                });

                return {
                    symbol: user.symbol,
                    symbolBefore: user.symbolBefore,
                    valuta: user.valuta,
                    fullname: user.fullname,
                    username: user.username,
                    email: user.email,
                    uid,
                    profilePicture: profilePictureUrl,
                }
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    alert('That email address is already in use!');
                }
            
                if (error.code === 'auth/invalid-email') {
                    alert('That email address is invalid!');
                }
            });
    },

    uploadProfilePicture: async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const filename = new Date().getTime();

        var ref = await firebase.storage().ref().child('profilePictures/' + filename).put(blob);
        return ref;
    },

    getUserInfo: async (uid) => {
        try {
            const user = await firebase.firestore().collection('users').doc(uid).get();
            
            if (user.exists) {
                return user.data();
            }
        } catch (error) {
            console.log(error);
        }
    },

    logOut: async () => {
        try {
            await firebase.auth().signOut();

            return true;
        } catch (error) {
            console.log(error);
        }

        return false;
    },

    signInWithEmailAndPassword: async (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password)
    },

    updateProfile: async (user) => {
        try {
            const uid = FireBase.getCurrentUser().uid;
            const profilePicture = await FireBase.uploadProfilePicture(user.profilePicture);
            const profilePictureUrl = await profilePicture.ref.getDownloadURL();

            await FireBase.getCurrentUser().updateEmail(user.email).then(async () => {
                await firebase.firestore().collection('users').doc(uid).update({
                    ...user,
                });
            }).catch((error) => {
                console.log(error);
            });

            return {
                ...user,
                uid,
                profilePicture: profilePictureUrl,
            }
        } catch (error) {
            console.log(error);
        }
    },

    updateCurrency: async (user) => {
        try {
            const uid = FireBase.getCurrentUser().uid;

            await firebase.firestore().collection('users').doc(uid).update({
                ...user,
            });

            return {
                ...user,
                uid,
            }
        } catch (error) {
            console.log(error);
        }
    },

    forgotPassword: async (email) => {
        try {
            await firebase.auth().sendPasswordResetEmail(email);
        } catch (error) {
            console.log(error);
        }
    },

    deleteAccount: async () => {
        try {
            const uid = FireBase.getCurrentUser().uid;

            await firebase.firestore().collection('users').doc(uid).delete();
            await FireBase.getCurrentUser().delete();
        } catch (error) {
            console.log(error);
        }
    }
};

const FireBaseProvider = (props) => {
    return (
        <FireBaseContext.Provider value={FireBase}>
            {props.children}
        </FireBaseContext.Provider>
    )
}

export { FireBaseContext, FireBaseProvider }