import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ThemeContext from '../../../context/ThemeContext'
import { useNavigation } from '@react-navigation/native'

const HomeScreen = () => {
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()

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
            style={{ backgroundColor: theme.background }}
        >
            <Text
                className="text-2xl font-bold"
                style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}
            >
                Home Screen
            </Text>
            
            <TouchableOpacity
                className="px-4 py-2 rounded-lg mt-4"
                style={{ backgroundColor: theme.primary }}
                onPress={clearOnBoarding}
            >
                <Text className="text-white font-bold text-center" style={{ fontFamily: "Montserrat-SemiBold" }}>Clear OnBoarding</Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="px-4 py-2 rounded-lg mt-4"
                style={{ backgroundColor: theme.primary }}
                onPress={() => navigation.navigate('Message')}
            >
                <Text className="text-white font-bold text-center" style={{ fontFamily: "Montserrat-SemiBold" }}>Go to Message</Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="px-4 py-2 rounded-lg mt-4"
                style={{ backgroundColor: theme.primary }}
                onPress={() => navigation.navigate('Settings')}
            >
                <Text className="text-white font-bold text-center" style={{ fontFamily: "Montserrat-SemiBold" }}>Go to Settings</Text>
            </TouchableOpacity>
        </View>
    )
}

export default HomeScreen