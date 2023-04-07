import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import ThemeContext from '../../context/ThemeContext'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '../../context/UserContext'
import { firebase } from '../../config/firebase'

const GoalsCategories = ({ category }) => {
    const [user, setUser] = useContext(UserContext)
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()

    const goalsRef = firebase.firestore().collection('users').doc(user.uid).collection('goalsCategories').doc(category.id).collection('goals')
    const [goals, setGoals] = useState([])

    useEffect(() => {
        goalsRef
            .onSnapshot(
                querySnapshot => {
                    const newGoals = []
                    querySnapshot.forEach(doc => {
                        const {name, money, moneySaved, completed, date, icon} = doc.data()
                        newGoals.push({
                            id: doc.id,
                            name,
                            money,
                            moneySaved,
                            completed,
                            date,
                            icon
                        })
                    })
                    setGoals(newGoals)
                },
                error => {
                    alert(error)
                }
            )
    }, [])

    let completedGoals
    let totalGoals
    let totalBalance = 0

    if (goals.length === 0) {
        completedGoals = 0
        totalGoals = 0
    } else {
        completedGoals = goals.filter(goal => goal.completed).length
        totalGoals = goals.length
        totalBalance = goals.reduce((total, goal) => total + goal.money, 0)
    }

    return (
        <TouchableOpacity 
            className="flex flex-col items-center justify-center rounded-2xl shadow-sm w-[162px] h-48 m-2 bg-white"
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
                $ {totalBalance}
            </Text>
        </TouchableOpacity>
    )
}

export default GoalsCategories