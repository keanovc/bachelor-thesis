import { View, Text, SafeAreaView, FlatList, TouchableOpacity, ScrollView, Modal, RefreshControl } from 'react-native'
import React, { useContext, useState, useEffect, useCallback } from 'react'
import DatePicker, { getToday } from 'react-native-modern-datepicker'
import { ProgressChart } from 'react-native-chart-kit'
import { Ionicons } from '@expo/vector-icons'

import ThemeContext from '../../../context/ThemeContext'
import { UserContext } from '../../../context/UserContext'
import { firebase } from '../../../config/firebase'
import { BudgetCategoryModal, BudgetCategoriesCard, IconButton } from '../../../components'
import { calculateDateRange } from '../../../utils'

const BudgetCategoriesScreen = () => {
    const theme = useContext(ThemeContext)
    const [user] = useContext(UserContext)

    const [modalVisible, setModalVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    const [type, setType] = useState('')
    const [date, setDate] = useState(getToday().toString().substring(0, 4) + " " + getToday().toString().substring(5, 7))
    const [toggle, setToggle] = useState(false);
    const [totalPercentage, setTotalPercentage] = useState(0.5)

    const [budgetCategories, setBudgetCategories] = useState([])
    const budgetCategoriesRef = firebase.firestore().collection("users").doc(user.uid).collection("budgetCategories")
    const budgetsRef = firebase.firestore().collection("users").doc(user.uid).collection("budgets")

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]

    const getBudgetCategories = () => {
        budgetCategoriesRef
            .orderBy("createdAt", "desc")
            .onSnapshot(
                querySnapshot => {
                    const newBudgetCategories = []
                    querySnapshot.forEach(doc => {
                        const budgetCategory = doc.data()
                        budgetCategory.id = doc.id
                        newBudgetCategories.push(budgetCategory)
                    })
                    setBudgetCategories(newBudgetCategories)
                },
                error => {
                    console.log(error)
                }
            )
    }

    useEffect(() => {
        getBudgetCategories()
    }, [])

    async function getIsDateOrMonthlyIsTrue() {
        const isDate = budgetsRef.where("date", "==", date ? date : getToday().toString().substring(0, 4) + " " + getToday().toString().substring(5, 7)).get();
        const isMonthly = budgetsRef.where("monthly", "==", true).get();

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
        let totalIncomes = 0
        let totalExpenses = 0
        setTotalPercentage(0.5)

        getIsDateOrMonthlyIsTrue()
            .then(results => {
                results.forEach((doc) => {
                    const budget = doc.data()
                    if (budget.monthly) {
                        const dateRange = calculateDateRange(budget.startDate, budget.endDate)
                        if (dateRange.includes(date)) {
                            if (budget.type === 'incomes') {
                                totalIncomes += budget.money
                            } else {
                                totalExpenses += budget.money
                            }
                        }
                    } else {
                        if (budget.date === date) {
                            if (budget.type === 'incomes') {
                                totalIncomes += budget.money
                            } else {
                                totalExpenses += budget.money
                            }
                        }
                    }
                })

                if (totalIncomes && totalExpenses  !== NaN) {
                    setTotalPercentage(totalIncomes / (totalIncomes + totalExpenses))
                }
            },
            error => {
                console.log(error)
            }
        )
    }

    useEffect(() => {
        getBudgets()
    }, [date, budgetCategories])

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        getBudgetCategories()
        getBudgets()
        setRefreshing(false)
    }, [])

    return (
        <SafeAreaView className="flex-1"
            style={{ backgroundColor: theme.background }}
        >
            <Modal animationType="slide" visible={modalVisible}>
                <BudgetCategoryModal type={type} closeModal={() => setModalVisible(false)} />
            </Modal>

            <View className="my-4 px-6 flex flex-row items-center justify-between">
                <Text className="text-2xl font-bold" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>Budget 
                    <Text className="text-2xl font-bold" style={{ color: theme.primary, fontFamily: "Montserrat-Regular" }}> Overview</Text>
                </Text>

                <IconButton
                    onPress={() => setEditVisible(!editVisible)}
                    icon="create-outline"
                />
            </View>

            <View className="flex flex-row items-center justify-center px-12 pt-4 z-20">
                <TouchableOpacity
                    onPress={() => setToggle(!toggle)}
                    className="flex flex-row items-center justify-center"
                >
                    <Text className="text-lg font-bold mr-2" style={{ color: theme.primary, fontFamily: "Montserrat-Bold" }}>
                        {
                            date ? 
                                months[date.toString().substring(5, 8) - 1]
                            : 
                                months[getToday().toString().substring(5, 7) - 1]
                        }
                    </Text>

                    <Text className="text-lg font-bold mr-2" style={{ color: theme.primary, fontFamily: "Montserrat-Regular" }}>
                        {
                            date ? 
                                date.toString().substring(0, 4)
                            : 
                                getToday().toString().substring(0, 4)
                        }
                    </Text>

                    {
                        toggle ? (
                            <Ionicons name="chevron-up" size={24} color={theme.text} />
                        ) : (
                            <Ionicons name="chevron-down" size={24} color={theme.text} />
                        )
                    }
                </TouchableOpacity>
            </View>

            <View 
                className="absolute top-40 left-0 right-0 z-10"
                style={{ 
                    display: toggle ? "flex" : "none",
                }}
            >
                <View 
                    className="rounded-md px-4 items-center shadow m-6"
                    style={{ backgroundColor: theme.accent }}
                >
                    <DatePicker
                        mode="monthYear"
                        selectorStartingYear={2000}
                        onMonthYearChange={selectedDate => {
                            setDate(selectedDate)
                            setToggle(false)
                        }}
                        options={{
                            mainColor: theme.primary,
                            backgroundColor: theme.accent,
                            textDefaultColor: theme.text,
                            textHeaderColor: theme.text,
                        }}
                    />
                </View>
            </View>

            <View 
                className="flex flex-row items-center justify-around px-6 rounded-lg mx-8 mb-8 mt-4 shadow-sm"
                style={{ backgroundColor: theme.accent }}
            >
                <ProgressChart
                    data={{
                        labels: ["Progress"],
                        data: [totalPercentage]
                    }}
                    width={100}
                    height={120}
                    strokeWidth={16}
                    radius={32}
                    chartConfig={{
                        backgroundColor: theme.accent,
                        backgroundGradientFrom: theme.accent,
                        backgroundGradientTo: theme.accent,
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(77, 122, 128, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                    }}
                    hideLegend={true}
                />

                <View className="flex flex-row items-center justify-between">
                    <View className="flex flex-col space-y-3">
                        <View 
                            className="w-1 h-5 rounded-full"
                            style={
                                theme.theme === "light" ?
                                    { backgroundColor: "#8CA9AE" }
                                :
                                    { backgroundColor: "#466064" }
                            }
                        />
                        <View 
                            className="w-1 h-5 rounded-full" 
                            style={
                                theme.theme === "light" ?
                                    { backgroundColor: "#CCD9DE" }
                                :
                                    { backgroundColor: "#3F484A" }
                            }
                        />
                    </View>
                    <View className="flex flex-col space-y-3">
                        <Text className="text-sm font-bold mr-4 ml-2" style={{ color: theme.text, fontFamily: "Montserrat-Light" }}>Incomes</Text>
                        <Text className="text-sm font-bold mr-4 ml-2" style={{ color: theme.text, fontFamily: "Montserrat-Light" }}>Expenses</Text>
                    </View>

                    <View className="flex flex-col space-y-3">
                        <Text className="text-sm font-bold" style={{ color: theme.primary, fontFamily: "Montserrat-Bold" }}>
                            {
                                (totalPercentage * 100).toFixed(0) + "%"
                            }
                        </Text>
                        <Text className="text-sm font-bold" style={{ color: theme.primary, fontFamily: "Montserrat-Bold" }}>
                            {
                                ((1 - totalPercentage) * 100).toFixed(0) + "%"
                            }
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView 
                className="flex-1"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View className="flex flex-row items-center justify-between px-6">
                    <Text className="text-lg font-bold" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>Incomes</Text>
                    <TouchableOpacity 
                        className="flex flex-row items-center justify-between"
                        onPress={() => {
                            setModalVisible(true)
                            setType("incomes")
                        }}
                    >
                        <Ionicons name="add-circle" size={40} color={theme.primary} />
                    </TouchableOpacity>
                </View>

                <View className="flex flex-row items-center justify-start px-6 pt-2">
                    {
                        budgetCategories.filter(budgetCategory => budgetCategory.type === "incomes").length === 0 ? (
                            <TouchableOpacity
                                className="rounded-lg m-2 shadow-sm flex flex-row items-center justify-center p-3"
                                style={{
                                    backgroundColor: "rgb(77, 122, 128)",
                                    width: 120,
                                    height: 120
                                }}
                                onPress={() => {
                                    setModalVisible(true)
                                    setType("incomes")
                                }}
                            >
                                <View className="flex flex-col items-center">
                                    <Ionicons name="add-circle" size={36} color="#fff" />
                                    <Text className="text-base text-white pt-1" style={{ fontFamily: "Montserrat-Bold" }}>Add</Text>
                                </View>
                            </TouchableOpacity>
                        ) : null
                    }

                    <FlatList
                        data={budgetCategories.filter(budgetCategory => budgetCategory.type === "incomes")}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <BudgetCategoriesCard 
                                category={item} 
                                date={date} 
                                edit={editVisible}
                            />
                        )}
                        keyExtractor={item => item.name}
                    />
                </View>

                <View className="flex flex-row items-center justify-between px-6 pt-4">
                    <Text className="text-lg font-bold" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>Expenses</Text>
                    <TouchableOpacity 
                        className="flex flex-row items-center justify-between"
                        onPress={() => {
                            setModalVisible(true)
                            setType("expenses")
                        }}
                    >
                        <Ionicons name="add-circle" size={40} color={theme.primary} />
                    </TouchableOpacity>
                </View>

                <View className="flex flex-row items-center justify-between px-6 pt-2">
                {
                        budgetCategories.filter(budgetCategory => budgetCategory.type === "expenses").length === 0 ? (
                            <TouchableOpacity
                                className="rounded-lg m-2 shadow-sm flex flex-row items-center justify-center p-3"
                                style={{
                                    backgroundColor: "rgb(77, 122, 128)",
                                    width: 120,
                                    height: 120
                                }}
                                onPress={() => {
                                    setModalVisible(true)
                                    setType("expenses")
                                }}
                            >
                                <View className="flex flex-col items-center">
                                    <Ionicons name="add-circle" size={36} color="#fff" />
                                    <Text className="text-base text-white pt-1" style={{ fontFamily: "Montserrat-Bold" }}>Add</Text>
                                </View>
                            </TouchableOpacity>
                        ) : null
                    }

                    <FlatList
                        data={budgetCategories.filter(budgetCategory => budgetCategory.type === "expenses")}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <BudgetCategoriesCard
                                category={item}
                                date={date}
                                edit={editVisible}
                            />
                        )}
                        keyExtractor={item => item.name}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default BudgetCategoriesScreen