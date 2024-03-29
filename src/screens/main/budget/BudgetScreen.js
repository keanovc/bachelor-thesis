import { View, Text, Modal, TouchableOpacity, FlatList, RefreshControl } from 'react-native'
import React, { useContext, useState, useEffect, useCallback } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import { UserContext } from '../../../context/UserContext'
import ThemeContext from '../../../context/ThemeContext'
import { firebase } from '../../../config/firebase'
import { BudgetModal, BudgetItem, IconButton } from '../../../components'
import { calculateDateRange } from '../../../utils'

const BudgetScreen = ({ route }) => {
    const { category, date } = route.params
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()
    const [user] = useContext(UserContext)

    const [modalVisible, setModalVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    const budgetsRef = firebase.firestore().collection("users").doc(user.uid).collection("budgets")
    const [budgets, setBudgets] = useState([])

    const [loading, setLoading] = useState(false)

    async function getIsDateOrMonthlyIsTrue() {
        const isDate = budgetsRef.where("date", "==", date ? date : getToday().toString().substring(0, 4) + " " + getToday().toString().substring(5, 7)).where("type", "==", category.type).where("categoryId", "==", category.id).get();
        const isMonthly = budgetsRef.where("monthly", "==", true).where("type", "==", category.type).where("categoryId", "==", category.id).get();

        const [dateQuerySnapshot, monthlyQuerySnapshot] = await Promise.all([
            isDate, 
            isMonthly
        ]);

        const dateBudgetsArray = dateQuerySnapshot.docs;
        const monthlyBudgetArray = monthlyQuerySnapshot.docs;

        const budgetsArray = dateBudgetsArray.concat(monthlyBudgetArray);

        return budgetsArray;
    }

    const getBudgets = () => {
        getIsDateOrMonthlyIsTrue()
            .then((querySnapshot) => {
                const newBudgets = []
                querySnapshot.forEach((doc) => {
                    const budget = doc.data()
                    if (budget.monthly) {
                        const dateRange = calculateDateRange(budget.startDate, budget.endDate)
                        if (dateRange.includes(date)) {
                            budget.id = doc.id
                            newBudgets.push(budget)
                        }
                    } else {
                        budget.id = doc.id
                        newBudgets.push(budget)
                    }
                })
                setBudgets(newBudgets)
            })
            .catch((error) => {
                alert(error)
            })
    }

    useEffect(() => {
        getBudgets()
    }, [loading])

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        getBudgets()
        setRefreshing(false)
    }, [])

    return (
        <View className="flex-1" style={{ backgroundColor: theme.background }}>
            <Modal animationType="slide" visible={modalVisible}>
                <BudgetModal 
                    category={category} 
                    date={date} 
                    closeModal={() => setModalVisible(false)} 
                    loading={() => setLoading(!loading)}
                />
            </Modal>

            <View 
                className="flex-col px-4 pt-20 pb-8"
                style={{ 
                    backgroundColor: theme.primary,
                }}
            >
                <View className="flex-row justify-between items-center px-4">
                    <IconButton
                        onPress={() => navigation.goBack()}
                        icon="chevron-back-outline"
                    />
                    
                    <Text className="text-xl" style={{ color: "#fff", fontFamily: "Montserrat-Medium" }}>
                        {category.name}
                    </Text>

                    {
                        category.id !== "goals" ? (
                            <IconButton
                                onPress={() => setEditVisible(!editVisible)}
                                icon="create-outline"
                            />
                        ) : (
                            <View />
                        )
                    }
                </View>

                <View className="flex-row justify-between items-center px-4 pt-8">
                    <View className="flex-col">
                        <Text className="text-xs" style={{ color: "#fff", fontFamily: "Montserrat-Light" }}>
                            {
                                category.type == "incomes" ? `TOTAL INCOMES (${user.symbol})` : `TOTAL EXPENSES (${user.symbol})`
                            }
                        </Text>
                        <Text className="text-3xl pt-2" style={{ color: "#fff", fontFamily: "Montserrat-Medium" }}>
                            {
                                budgets.reduce((acc, curr) => {
                                    return acc + curr.money
                                }, 0)
                            }
                        </Text>
                    </View>
                </View>
            </View>

            <View className="flex-1 px-6 pt-4">
                {
                    budgets.length > 0 ? (
                        <FlatList
                            data={budgets}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <BudgetItem
                                    item={item}
                                    category={category}
                                    loading={() => setLoading(!loading)}
                                    edit={editVisible}
                                    date={date}
                                    user={user}
                                />
                            )}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                />
                            }
                        />
                    ) : (
                        <View className="flex justify-center items-center mt-6">
                            <Text style={{ color: theme.text, fontFamily: "Montserrat-Medium" }}>
                                No {category.type} added
                            </Text>
                        </View>
                    )
                }

                {
                    category.id !== "goals" ? (
                        <View className="absolute bottom-10 right-5 m-4">
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <Ionicons name="add-circle" size={60} color={theme.primary} />
                        </TouchableOpacity>
                    </View>
                    ) : (
                        <View />
                    )
                }
            </View>
        </View>
    )
}

export default BudgetScreen