import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ThemeContext from '../context/ThemeContext'

const HomeScreen = () => {
    const theme = useContext(ThemeContext)

    const clearOnBoarding = async () => {
        try {
            await AsyncStorage.removeItem('@viewedOnBoarding')
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <View 
            className="flex-1 items-center justify-center"
            style={{
                backgroundColor: theme.background,
            }}
        >
            <Text className="text-2xl font-bold" style={{ color: theme.text }}>Home Screen</Text>

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