import { View, Text, Image, Animated } from 'react-native'
import React, { useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventRegister } from 'react-native-event-listeners'

import { UserContext } from '../../context/UserContext'
import { FireBaseContext } from '../../context/FireBaseContext'

const LoadingScreen = () => {
    const [_, setUser] = useContext(UserContext)
    const firebase = useContext(FireBaseContext)

    const fadeInAnimation = new Animated.Value(0)
    const fadeOutAnimation = new Animated.Value(1)

    useEffect(() => {
        setTimeout(async () => {
            // const user = await AsyncStorage.getItem('user').then((user) => {
            //     return user ? JSON.parse(user) : null
            // })

            const user = await firebase.getCurrentUser()

            if (user) {
                const userInfo = await firebase.getUserInfo(user.uid)

                // EventRegister.emit('toggleTheme', userInfo.darkMode)

                setUser({
                    isLoggedIn: true,
                    symbol: userInfo.symbol,
                    symbolBefore: userInfo.symbolBefore,
                    valuta: userInfo.valuta,
                    fullname: userInfo.fullname,
                    email: userInfo.email,
                    username: userInfo.username,
                    uid: user.uid,
                    profilePicture: userInfo.profilePicture,
                })
            } else {
                setUser(state => ({ ...state, isLoggedIn: false }))
            }
        }, 1000)

        Animated.timing(fadeInAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start()

        Animated.timing(fadeOutAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start()
    }, [])

    return (
        <View 
            className="flex-1 items-center justify-center bg-[#F5F8FE]"
        >
            <Animated.View
                style={{
                    opacity: fadeInAnimation,
                    transform: [
                        {
                            scale: fadeInAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.5, 1],
                            }),
                        },
                    ],
                }}
            >
                <Image
                    source={require('../../../assets/images/logo.png')}
                    style={{
                        width: 200,
                        height: 67,
                    }}
                />
            </Animated.View>
        </View>
    )
}

export default LoadingScreen