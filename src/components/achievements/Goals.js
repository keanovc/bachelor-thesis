import { View, Text } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import ThemeContext from '../../context/ThemeContext'

const Goals = ({ goal }) => {
    const theme = useContext(ThemeContext)

    return (
        <View className="flex flex-row items-center justify-between mx-5 my-2 h-16 px-4 rounded-xl shadow-sm bg-white">
            <View className="flex flex-row items-center justify-center">
                <Text className="ml-2 text-sm" style={{ color: theme.primary, fontFamily: "Montserrat-Light" }}>{goal.name}</Text>
            </View>
        </View>
    )
}

export default Goals