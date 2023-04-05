import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { Ionicons } from '@expo/vector-icons'
import ThemeContext from '../../context/ThemeContext'

const SettingsItem = (
    { 
        title,
        onPress,
        iconBackgroundColor,
        iconColor,
        icon
    }
) => {
    const theme = useContext(ThemeContext)

    return (
        <TouchableOpacity 
            onPress={onPress}
            className="flex-row items-center justify-between px-4"
        >
            <View className="flex-row items-center">
                <View 
                    className="
                        flex-row items-center justify-center
                        w-12 h-12 rounded-lg
                        shadow-sm
                    "
                    style={{ backgroundColor: iconBackgroundColor }}
                >
                    <Ionicons name={icon} size={20} color={iconColor} />
                </View>

                <View className="ml-4">
                    <Text style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>{title}</Text>
                </View>
            </View>

            <View 
                className="
                    flex-row items-center justify-center
                    w-9 h-9 rounded-full
                "
                style={{ backgroundColor: theme.accent }}
            >
                <Ionicons name="chevron-forward" size={20} color="gray" />
            </View>
        </TouchableOpacity>
    )
}

export default SettingsItem