import { View, Text, SafeAreaView, TouchableOpacity, FlatList, Modal, Keyboard } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import ThemeContext from '../../../context/ThemeContext'
import { UserContext } from '../../../context/UserContext'
import { firebase } from '../../../config/firebase'
import { GoalModal, GoalItem, IconButton } from '../../../components'

const GoalsScreen = ({ route }) => {
    const [user] = useContext(UserContext)
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()

    const { category, totalBudget } = route.params

    const [goals, setGoals] = useState([])
    const goalsRef = firebase.firestore().collection('users').doc(user.uid).collection('goals')
    const [modalVisible, setModalVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)

    let completedGoals
    let totalGoals

    if (goals === undefined || goals.length === 0) {
        completedGoals = 0
        totalGoals = 0
    } else {
        completedGoals = goals.filter(goal => goal.completed).length
        totalGoals = goals.length
    }

    const filter = [
        {
            id: 1,
            name: "All",
            icon: "list",
        },
        {
            id: 2,
            name: "New",
            icon: "add-circle",
        },
        {
            id: 3,
            name: "In Progress",
            icon: "time",
        },
        {
            id: 4,
            name: "Completed",
            icon: "checkmark-circle",
        }
    ]

    const [filterGoals, setFilterGoals] = useState(filter[0])

    useEffect(() => {
        goalsRef
            .orderBy("createdAt", "desc")
            .where("categoryId", "==", category.id)
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
                    console.log(error)
                }
            )
    }, [])

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
            <Modal animationType="slide" visible={modalVisible}>
                <GoalModal category={category} closeModal={() => setModalVisible(false)} />
            </Modal>

            <View className="flex flex-row items-center justify-between mx-5 pt-5">
                <View className="flex flex-row items-center">
                    <IconButton
                        onPress={() => navigation.goBack()}
                        icon="chevron-back-outline"
                    />

                    <View className="flex flex-col">
                        <Text className="text-lg ml-4" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>
                            {category.name}
                        </Text>

                        <Text className="text-xs ml-4" style={{ color: theme.text, fontFamily: "Montserrat-Light" }}>
                            {completedGoals} of {totalGoals} goals completed
                        </Text>
                    </View>
                </View>

                <IconButton
                    onPress={() => setEditVisible(!editVisible)}
                    icon="create-outline"
                />
            </View>

            <View className="flex flex-row items-center justify-between mx-5 pt-2">
                <View className="flex flex-row items-center justify-center">
                    <FlatList
                        data={filter}
                        renderItem={({ item }) => 
                            <TouchableOpacity 
                                className="flex flex-row items-center justify-center rounded-full py-2 px-4 shadow-sm m-1"
                                onPress={() => {
                                    setFilterGoals(item)
                                    Keyboard.dismiss()
                                }}
                                style={{ backgroundColor: filterGoals.id === item.id ? theme.primary : theme.accent }}
                            >
                                <Ionicons name={item.icon} size={18} color={filterGoals.id === item.id ? "white" : theme.primary} />
                                <Text className="ml-1 text-sm" style={{ color: filterGoals.id === item.id ? "white" : theme.text,  fontFamily: filterGoals.id === item.id ? "Montserrat-Bold" : "Montserrat-Light" }}>{item.name}</Text>
                            </TouchableOpacity>
                        }
                        keyExtractor={(item) => item.id}
                        className="mt-4"
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </View>

            {
                goals.length > 0 ? (
                    <FlatList
                        data={
                            filterGoals.id === 1 ? goals :
                            filterGoals.id === 2 ? goals.filter(goal => goal.moneySaved === 0) :
                            filterGoals.id === 3 ? goals.filter(goal => goal.moneySaved > 0 && goal.moneySaved < goal.money) :
                            filterGoals.id === 4 ? goals.filter(goal => goal.moneySaved === goal.money) :
                            goals
                        }
                        numColumns={1}
                        renderItem={({ item }) => <GoalItem goal={item} category={category} edit={editVisible} totalBudget={totalBudget} />}
                        keyExtractor={(item) => item.id}
                        className="mt-4"
                    />
                ) : (
                    <View className="flex flex-col items-center justify-center mt-4">
                        <Text style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>
                            No goals yet
                        </Text>
                    </View>
                )
            }
            

            <View className="absolute bottom-10 right-5 m-4">
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Ionicons name="add-circle" size={60} color={theme.primary} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default GoalsScreen