import { View, Text, TouchableOpacity, Image, Animated, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Emoji from 'react-native-emoji'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'

import ThemeContext from '../../../context/ThemeContext'
import { UserContext } from '../../../context/UserContext'
import env from '../../../config/env'

const HomeScreen = () => {
    const API_KEY = env.QUOTES_API_KEY

    const theme = useContext(ThemeContext)
    const navigation = useNavigation()
    const [user] = useContext(UserContext)
    const [showMessage, setShowMessage] = useState(false)
    const [quote, setQuote] = useState("")

    const show = new Animated.Value(0)

    useEffect(() => {
        if (user) {
            setTimeout(() => {
                setShowMessage(true)
            }, 3000)
        }
    }, [user])

    useEffect(() => {
        if (showMessage) {
            Animated.timing(show, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }).start()
        }
    }, [showMessage])

    const options = {
        method: 'GET',
        url: 'https://quotes-by-api-ninjas.p.rapidapi.com/v1/quotes',
        params: {category: 'inspirational'},
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'quotes-by-api-ninjas.p.rapidapi.com'
        }
    };

    useEffect(() => {
        axios.request(options).then(function (response) {
            setQuote(response.data[0])
        }).catch(function (error) {
            console.error(error);
        });
    }, [])

    return (
        <View  className="flex-1" style={{ backgroundColor: theme.background }}>
            <View 
                className="h-1/5 w-full flex justify-end items-start py-4 px-6"
                style={{ backgroundColor: theme.primary }}
            >
                <View className="flex flex-row items-center justify-between w-full">
                    <View className="flex flex-col items-start">
                        <View className="flex flex-row items-center justify-center">
                            <Text className="text-white text-sm text-center mr-1" style={{ fontFamily: "Montserrat-Regular" }}>Welcome back!</Text>
                            <Emoji name="wave" style={{ fontSize: 14 }} />
                        </View>
                        <Text className="text-white text-2xl text-center" style={{ fontFamily: "Montserrat-SemiBold" }}>{user.fullname}</Text>
                    </View>

                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Settings')}
                        className="bg-gray-200 w-14 h-14 rounded-full self-center overflow-hidden"
                    >
                        {user.profilePicture !== "default" ? (
                            <Image source={{ uri: user.profilePicture }} className="flex-1" />
                        ) : (
                            <View className="items-center justify-center flex-1">
                                <Ionicons name="add" size={48} color="lightgray" />
                            </View>
                        )}
                    </TouchableOpacity>

                    <View className="absolute -top-1 -right-1 bg-white w-5 h-5 rounded-full items-center justify-center">
                        <Ionicons name="settings" size={12} color={theme.primary} />
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 flex flex-col px-6 py-8">
                {
                    quote && (
                        <View className="flex flex-col">
                            <Text 
                                className="text-9xl -mb-28"
                                style={{ 
                                    fontFamily: "Montserrat-SemiBold" ,
                                    color: theme.secondary
                                }}
                            >“</Text>

                            <View className="px-4">
                                <Text className="text-sm" style={{ color: theme.text, fontFamily: "Montserrat-MediumItalic" }}>
                                    {quote.quote}
                                </Text>

                                <View className="w-8 h-0.5 rounded-full mt-1" style={{ backgroundColor: theme.secondary }} />
                            
                                <Text className="text-xs mt-1" style={{ color: theme.secondary, fontFamily: "Montserrat-Medium" }}>
                                    {quote.author}
                                </Text>
                            </View>
                        </View>
                    )
                }
            </ScrollView>

            <View className="flex-1 flex flex-row items-center justify-center absolute bottom-5 right-5">
                {showMessage && (
                    <Animated.View
                        className="flex flex-col items-center justify-center p-3 rounded-md shadow-sm mr-3 z-10"
                        style={{
                            backgroundColor: theme.primary,
                            transform: [
                                {
                                    translateY: show.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [100, 0]
                                    })
                                }
                            ]
                        }}
                    >
                        <Text className="text-xs text-center text-white" style={{ fontFamily: "Montserrat-Medium" }}>Need some financial tips?</Text>
                    </Animated.View>
                )}

                <TouchableOpacity
                    className="p-3 rounded-full shadow-sm"
                    style={{ backgroundColor: theme.primary }}
                    onPress={() => navigation.navigate('Message')}
                >
                    <Image
                        className="w-10 h-10 rounded-full"
                        source={require('../../../../assets/images/robot-placeholder.png')}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default HomeScreen