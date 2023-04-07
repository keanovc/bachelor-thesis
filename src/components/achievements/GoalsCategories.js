import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React, { useContext, useState } from 'react'
import ThemeContext from '../../context/ThemeContext'
import { Ionicons } from '@expo/vector-icons'
import Goals from './Goals'
import { useNavigation } from '@react-navigation/native'

const GoalsCategories = ({ category }) => {
    const theme = useContext(ThemeContext)
    // const [modalVisible, setModalVisible] = useState(false)
    const navigation = useNavigation()

    let completedGoals
    let totalGoals

    if (category.goals === undefined) {
        completedGoals = 0
        totalGoals = 0
    } else {
        completedGoals = category.goals.filter(goal => goal.completed).length
        totalGoals = category.goals.length
    }

    return (
        <View style={{ backgroundColor: theme.background }}>
            {/* <Modal visible={modalVisible} animationType="none">
                <Goals category={category} closeModal={() => setModalVisible(false)} />
            </Modal> */}

            <TouchableOpacity 
                className="flex flex-col items-center justify-center rounded-2xl shadow-sm w-40 h-48 m-2 bg-white"
                onPress={() => navigation.navigate('Goals', { category })}
            >
                <View className="absolute top-0 right-0 m-4">
                    <Text className="text-xs" style={{ fontFamily: "Montserrat-Bold" }}>
                        {completedGoals}/{totalGoals}
                    </Text>
                </View>

                <View className="flex flex-row items-center justify-center w-16 h-16 rounded-full" style={{ backgroundColor: category.color }}>
                    <Ionicons name={category.icon} size={24} color="white" />
                </View>

                <Text className="mt-2 text-lg " style={{ color: theme.primary, fontFamily: "Montserrat-Medium" }}>
                    {category.name}
                </Text>

                <Text className="mt-4 text-sm" style={{ fontFamily: "Montserrat-Bold" }}>
                    $ {category.totalBalance}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default GoalsCategories