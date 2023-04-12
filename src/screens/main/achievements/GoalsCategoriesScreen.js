import { View, Text, SafeAreaView, ScrollView, Modal, TouchableOpacity } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import DatePicker, { getToday } from 'react-native-modern-datepicker'
import { Ionicons } from '@expo/vector-icons'

import ThemeContext from '../../../context/ThemeContext'
import { UserContext } from '../../../context/UserContext'
import { firebase } from '../../../config/firebase'
import { GoalsCategoryModal, GoalsCategoriesCard, IconButton } from '../../../components'
import { setRightCurrency } from '../../../utils/setRightCurrency'

const GoalsCategoriesScreen = () => {
    const theme = useContext(ThemeContext)
    const [user] = useContext(UserContext)
    const [modalVisible, setModalVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)

    const [goalsCategories, setGoalsCategories] = useState([])
    const goalsCategoriesRef = firebase.firestore().collection("users").doc(user.uid).collection('goalsCategories')

    useEffect(() => {
        goalsCategoriesRef
            .onSnapshot(
                querySnapshot => {
                    const newGoalsCategories = []
                    querySnapshot.forEach(doc => {
                        const {name, color, icon, goals, totalBalance} = doc.data()
                        newGoalsCategories.push({
                            id: doc.id,
                            name,
                            color,
                            icon,
                            goals,
                            totalBalance
                        })
                    })
                    setGoalsCategories(newGoalsCategories)
                },
                error => {
                    alert(error)
                }
            )
    }, [])

    const budgetsRef = firebase.firestore().collection("users").doc(user.uid).collection('budgets')
    const [budgets, setBudgets] = useState([])

    useEffect(() => {
        budgetsRef
            .onSnapshot(
                querySnapshot => {
                    const newBudgets = []
                    querySnapshot.forEach(doc => {
                        const {money, monthly, date, type} = doc.data()
                        newBudgets.push({
                            id: doc.id,
                            money,
                            monthly,
                            date,
                            type
                        })
                    })
                    setBudgets(newBudgets)
                },
                error => {
                    alert(error)
                }
            )
    }, [])

    const currentMonth = getToday().toString().substring(0, 4) + " " + getToday().toString().substring(5, 7)
    const monthlyBudgets = budgets.filter(budget => budget.monthly === true || budget.date === currentMonth)

    const [totalBudget, setTotalBudget] = useState(0)

    useEffect(() => {
        let totalIncome = 0
        let totalExpense = 0
        monthlyBudgets.forEach(budget => {
            if (budget.type === "incomes") {
                totalIncome += budget.money
            } else {
                totalExpense += budget.money
            }
        })
        setTotalBudget(totalIncome - totalExpense)
    }, [monthlyBudgets])

    return (
        <SafeAreaView className="flex-1"
            style={{ backgroundColor: theme.background }}
        >
            <Modal animationType="slide" visible={modalVisible}>
                <GoalsCategoryModal closeModal={() => setModalVisible(false)} />
            </Modal>
            
            <View className="my-4 px-6 flex flex-row items-center justify-between">
                <Text className="text-2xl font-bold" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>Goals 
                    <Text className="text-2xl font-bold" style={{ color: theme.primary, fontFamily: "Montserrat-Regular" }}> Categories</Text>
                </Text>

                <IconButton
                    onPress={() => setEditVisible(!editVisible)}
                    icon="create-outline"
                />
            </View>

            <View 
                className="flex flex-row items-center justify-between pl-6 pr-12 py-4 mx-6 mb-4 mt-2 rounded-2xl shadow-sm"
                style={{ backgroundColor: theme.accent }}
            >
                <View className="flex flex-row items-center justify-center">
                    <Text className="ml-2 text-sm" style={{ color: theme.primary, fontFamily: "Montserrat-Light" }}>Monthly Balance:</Text>
                </View>

                <View className="flex flex-row items-center justify-center">
                    <Text className="mr-2 text-2xl" style={{ color: theme.primary, fontFamily: "Montserrat-Bold" }}>
                        {setRightCurrency(user, totalBudget)}
                    </Text>
                </View>
            </View>

            <ScrollView className="flex mx-auto w-11/12">
                <View className="flex flex-row items-center justify-start flex-wrap">
                    {goalsCategories.map((category, index) => (
                        <GoalsCategoriesCard key={index} category={category} edit={editVisible} totalBudget={totalBudget} />
                    ))}
                </View>
            </ScrollView>

            <View className="absolute bottom-0 right-0 m-4">
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Ionicons name="add-circle" size={60} color={theme.primary} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default GoalsCategoriesScreen