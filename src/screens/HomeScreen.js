import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const HomeScreen = () => {
    const clearOnBoarding = async () => {
        try {
            await AsyncStorage.removeItem('@viewedOnBoarding')
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-2xl font-bold">Home Screen</Text>

            <TouchableOpacity
                className="bg-indigo-500 px-4 py-2 rounded-lg mt-4"
                onPress={clearOnBoarding}
            >
                <Text className="text-white font-bold text-center">Clear OnBoarding</Text>
            </TouchableOpacity>
        </View>
    )
}

export default HomeScreen