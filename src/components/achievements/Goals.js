import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import ThemeContext from '../../context/ThemeContext'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const Goals = ({ goal, category, filter }) => {
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()

    return (
        <TouchableOpacity 
            className="flex flex-row items-center justify-between mx-6 my-2 px-12 py-2 rounded-xl shadow-sm bg-white"
            onPress={() => navigation.navigate('IndGoal', { goal, category })}
        >
            <View className="flex flex-row items-center justify-center">
                <Ionicons name={goal.icon} size={24} color={theme.primary} />

                <View className="flex flex-col ml-6">
                    <Text className="text-sm font-bold" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>{goal.name}</Text>

                    <Text className="text-xs mt-2" style={{ color: theme.primary, fontFamily: "Montserrat-Bold" }}>$ {goal.moneySaved}</Text>

                    <View className="flex flex-row items-center justify-center h-1">
                        <View 
                            className="h-full rounded-full"
                            style={{ 
                                backgroundColor: theme.primary,
                                width: `${goal.moneySaved / goal.money * 100}%`
                            }}
                        ></View>

                        <View
                            className="h-full rounded-full"
                            style={{
                                backgroundColor: theme.background,
                                width: `${100 - goal.moneySaved / goal.money * 100}%`
                            }}
                        ></View>
                    </View>

                    <View className="flex flex-row items-center justify-between mt-1">
                        <Text className="text-xs" style={{ color: "lightgray", fontFamily: "Montserrat-Regular" }}>
                            {goal.date}    
                        </Text>
                        <Text className="text-xs" style={{ color: "lightgray", fontFamily: "Montserrat-Regular" }}>$ {goal.money}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default Goals