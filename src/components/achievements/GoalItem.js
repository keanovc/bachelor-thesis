import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import Emoji from 'react-native-emoji';
import { useNavigation } from '@react-navigation/native'

import ThemeContext from '../../context/ThemeContext'
import GoalModal from './GoalModal'

const GoalItem = ({ goal, category, edit, totalBudget }) => {
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()
    const [editVisible, setEditVisible] = useState(false)

    return (
        <TouchableOpacity 
            className="flex flex-row items-center justify-between mx-6 my-2 px-12 py-2 rounded-xl shadow-sm"
            onPress={
                edit ?
                    () => setEditVisible(!editVisible)
                :
                    () => navigation.navigate('IndGoal', { goal, category, totalBudget })
            }
            onLongPress={() => setEditVisible(!editVisible)}
            style={
                edit ? 
                    { opacity: 0.5, backgroundColor: "lightgray" } 
                : 
                    { backgroundColor: theme.accent }
            }
        >
            <View className="flex flex-row items-center justify-center">
                {
                    edit &&
                        <View 
                            className="flex flex-row items-center justify-center py-2 px-6 rounded-full absolute z-10"
                            style={{ backgroundColor: theme.primary }}
                        >
                            <Text className="text-xs text-white" style={{ fontFamily: "Montserrat-Bold" }}>
                                Edit
                            </Text>
                        </View>
                }

                <Modal animationType="slide" visible={editVisible}>
                    <GoalModal closeModal={() => setEditVisible(false)} category={category} goal={goal} />
                </Modal>

                <Emoji name={goal.icon} style={{ fontSize: 30 }} />

                <View className="flex flex-col ml-6">
                    <Text className="text-sm font-bold" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>{goal.name}</Text>

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
                        <Text className="text-xs" style={{ color: theme.text, fontFamily: "Montserrat-Light" }}>
                            {goal.date}    
                        </Text>
                        <Text className="text-xs" style={{ color: "lightgray", fontFamily: "Montserrat-Light" }}>$ {goal.money}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default GoalItem