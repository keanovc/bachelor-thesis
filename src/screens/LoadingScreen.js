import { View, Text } from 'react-native'
import React, { useEffect, useContext } from 'react'
import LotteView from 'lottie-react-native'

import { UserContext } from '../context/UserContext'
import { FireBaseContext } from '../context/FireBaseContext'

const LoadingScreen = () => {
    const [_, setUser] = useContext(UserContext)
    const firebase = useContext(FireBaseContext)

    useEffect(() => {
        setTimeout(async () => {
            const user = await firebase.getCurrentUser()

            if (user) {
                const userInfo = await firebase.getUserInfo(user.uid)

                setUser({
                    isLoggedIn: true,
                    email: userInfo.email,
                    username: userInfo.username,
                    uid: user.uid,
                    profilePicture: userInfo.profilePicture,
                })
            } else {
                setUser(state => ({ ...state, isLoggedIn: false }))
            }
        }, 1500)
    }, [])

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-indigo-500 text-4xl font-bold tracking-wider uppercase mb-10">Financer</Text>
        
            <LotteView
                source={require('../../assets/animations/loading.json')}
                autoPlay
                loop
                style={{
                    width: 100,
                    height: 100,
                }}
            />
        </View>
    )
}

export default LoadingScreen