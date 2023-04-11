import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import Emoji from 'react-native-emoji';

import ThemeContext from '../../context/ThemeContext'
import { UserContext } from '../../context/UserContext'
import { firebase } from '../../config/firebase'
import { GoalsCategoryModal } from '../../components'

const GoalsCategoriesCard = ({ category, edit, totalBudget }) => {
    const [user, setUser] = useContext(UserContext)
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()
    
    const [editVisible, setEditVisible] = useState(false)

    const goalsRef = firebase.firestore().collection('users').doc(user.uid).collection('goalsCategories').doc(category.id).collection('goals')
    const [goals, setGoals] = useState([])

    const [completedGoals, setCompletedGoals] = useState(0)
    const [totalGoals, setTotalGoals] = useState(0)
    const [totalBalance, setTotalBalance] = useState(0)

    useEffect(() => {
        setCompletedGoals(goals.filter(goal => goal.completed).length)
        setTotalGoals(goals.length)
        setTotalBalance(goals.reduce((total, goal) => total + goal.money, 0))
    }, [goals])

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

    return (
        <TouchableOpacity 
            className="flex flex-col items-center justify-center rounded-2xl shadow-sm w-[162px] h-48 m-2"
            onPress={
                edit ?
                    () => setEditVisible(!editVisible)
                :
                    () => navigation.navigate('Goals', { category, totalBudget })
            }
            onLongPress={() => setEditVisible(!editVisible)}
            style={
                edit ? 
                    { opacity: 0.5, backgroundColor: "lightgray" } 
                : 
                    { backgroundColor: theme.accent }
            }
        >
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
                <GoalsCategoryModal closeModal={() => setEditVisible(false)} category={category}  />
            </Modal>

            <View className="absolute top-0 left-0 m-4">
                <Text className="text-xs" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>
                    {completedGoals}/{totalGoals}
                </Text>
            </View>

            <View className="flex flex-row items-center justify-center w-16 h-16 rounded-full" style={{ backgroundColor: category.color }}>
                <Emoji name={category.icon} style={{ fontSize: 24 }} />
            </View>

            <Text className="mt-2 text-lg" style={{ color: theme.primary, fontFamily: "Montserrat-SemiBold" }}>
                {category.name}
            </Text>

            <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>
                $ {totalBalance}
            </Text>
        </TouchableOpacity>
    )
}

export default GoalsCategoriesCard