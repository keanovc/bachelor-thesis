import { createContext } from 'react';
import { firebase } from '../config/firebase';

const FireBaseContext = createContext();

const FireBase = {
    getCurrentUser: () => {
        return firebase.auth().currentUser;
    },

    createUserWithEmailAndPassword: async (user) => {
        try {
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then(async () => {
                    let profilePictureUrl = "default"

                    if (user.profilePicture !== undefined) {
                        const profilePicture = await FireBase.uploadProfilePicture(user.profilePicture);
                        profilePictureUrl = await profilePicture.ref.getDownloadURL();
                    }
                    
                    const uid = FireBase.getCurrentUser().uid;

                    await firebase.firestore().collection('users').doc(uid).set({
                        fullname: user.fullname,
                        username: user.username,
                        email: user.email,
                        profilePicture: profilePictureUrl,
                    });

                    return {
                        fullname: user.fullname,
                        username: user.username,
                        email: user.email,
                        uid,
                        profilePicture: profilePictureUrl,
                    }
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                      console.log('That email address is already in use!');
                    }
                
                    if (error.code === 'auth/invalid-email') {
                      console.log('That email address is invalid!');
                    }
                
                    console.error(error);
                });
        } catch (error) {
            console.log(error);
        }
    },

    uploadProfilePicture: async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const filename = image.substring(image.lastIndexOf('/') + 1);

        var ref = firebase.storage().ref().child('profilePictures/' + filename).put(blob);
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
                    fullname: user.fullname,
                    username: user.username,
                    email: user.email,
                    profilePicture: profilePictureUrl,
                });
            }).catch((error) => {
                console.log(error);
            });

            return {
                fullname: user.fullname,
                username: user.username,
                email: user.email,
                uid,
                profilePicture: profilePictureUrl,
            }
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