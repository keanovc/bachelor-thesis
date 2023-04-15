import { View, Text, TouchableOpacity, Image, Animated, ScrollView, RefreshControl } from 'react-native'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import Emoji from 'react-native-emoji'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import { BarChart } from 'react-native-chart-kit'

import ThemeContext from '../../../context/ThemeContext'
import { UserContext } from '../../../context/UserContext'
import { firebase } from '../../../config/firebase'
import env from '../../../config/env'
import { calculateMonthAndYear } from '../../../utils/calculateMonthAndYear'
import { calculateBudgets } from '../../../utils/calculateBudgets'
import { setRightCurrency } from '../../../utils/setRightCurrency'

const HomeScreen = () => {
    const API_KEY = env.QUOTES_API_KEY

    const theme = useContext(ThemeContext)
    const navigation = useNavigation()
    const [user] = useContext(UserContext)

    const [showMessage, setShowMessage] = useState(false)
    const [quote, setQuote] = useState("")
    const [refreshing, setRefreshing] = useState(false)
    const show = new Animated.Value(0)

    const budgetsRef = firebase.firestore().collection("users").doc(user.uid).collection("budgets")
    const [budgets, setBudgets] = useState([])

    const goalsRef = firebase.firestore().collection("users").doc(user.uid).collection("goals")
    const [goals, setGoals] = useState([])
    
    const [type, setType] = useState("incomes")

    const [totalIncomes, setTotalIncomes] = useState(0)
    const [totalExpenses, setTotalExpenses] = useState(0)

    useEffect(() => {
        if (user) {
            setTimeout(() => {
                setShowMessage(true)
            }, 3000)
        }
    }, [user])

    useEffect(() => {
        if (showMessage) {
            Animated.timing(show, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }).start()
        }
    }, [showMessage])

    const options = {
        method: 'GET',
        url: 'https://quotes-by-api-ninjas.p.rapidapi.com/v1/quotes',
        params: {category: 'inspirational'},
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'quotes-by-api-ninjas.p.rapidapi.com'
        }
    };

    const axiosGetQuote = async () => {
        await axios.request(options).then(function (response) {
            setQuote(response.data[0])
        }).catch(function (error) {
            console.error(error);
        });
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        axiosGetQuote()
        setRefreshing(false)
    }, [])

    useEffect(() => {
        axiosGetQuote()
        
        getIsDateOrMonthlyIsTrue().then((budgetsArray) => {
            const budgets = budgetsArray.map((doc) => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data };
            });
            setBudgets(budgets);
        });
    }, [])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getIsDateOrMonthlyIsTrue().then((budgetsArray) => {
                const budgets = budgetsArray.map((doc) => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data };
                });
                setBudgets(budgets);
            });
        });

        return unsubscribe;
    }, [navigation]);

    async function getIsDateOrMonthlyIsTrue() {
        const isDateFirstMonth = budgetsRef.where("date", "==", calculateMonthAndYear(0).dateMonthAndYear).get();
        const isDateSecondMonth = budgetsRef.where("date", "==", calculateMonthAndYear(1).dateMonthAndYear).get();
        const isDateThirdMonth = budgetsRef.where("date", "==", calculateMonthAndYear(2).dateMonthAndYear).get();
        const isDateFourthMonth = budgetsRef.where("date", "==", calculateMonthAndYear(3).dateMonthAndYear).get();
        const isMonthly = budgetsRef.where("monthly", "==", true).get();

        const [dateFirstMonthQuerySnapshot, dateSecondMonthQuerySnapshot, dateThirdMonthQuerySnapshot, dateFourthMonthQuerySnapshot, monthlyQuerySnapshot] = await Promise.all([
            isDateFirstMonth,
            isDateSecondMonth,
            isDateThirdMonth,
            isDateFourthMonth,
            isMonthly
        ]);

        const dateFirstMonthArray = dateFirstMonthQuerySnapshot.docs;
        const dateSecondMonthArray = dateSecondMonthQuerySnapshot.docs;
        const dateThirdMonthArray = dateThirdMonthQuerySnapshot.docs;
        const dateFourthMonthArray = dateFourthMonthQuerySnapshot.docs;
        const monthlyBudgetArray = monthlyQuerySnapshot.docs;

        const budgetsArray = dateFirstMonthArray.concat(dateSecondMonthArray, dateThirdMonthArray, dateFourthMonthArray, monthlyBudgetArray)

        return budgetsArray;
    }
    
    const data = {
        labels: [
            calculateMonthAndYear(3).datePreviousMonth.toString().substring(4, 7),
            calculateMonthAndYear(2).datePreviousMonth.toString().substring(4, 7),
            calculateMonthAndYear(1).datePreviousMonth.toString().substring(4, 7),
            calculateMonthAndYear(0).datePreviousMonth.toString().substring(4, 7)
        ],
        datasets: [{
            data: [ 
                calculateBudgets(budgets, 3, type),
                calculateBudgets(budgets, 2, type),
                calculateBudgets(budgets, 1, type),
                calculateBudgets(budgets, 0, type)
            ],
        }]
    }

    useEffect(() => {
        setTotalIncomes(calculateBudgets(budgets, 0, "incomes") + calculateBudgets(budgets, 1, "incomes") + calculateBudgets(budgets, 2, "incomes") + calculateBudgets(budgets, 3, "incomes"))
        setTotalExpenses(calculateBudgets(budgets, 0, "expenses") + calculateBudgets(budgets, 1, "expenses") + calculateBudgets(budgets, 2, "expenses") + calculateBudgets(budgets, 3, "expenses"))
    }, [budgets])

    useEffect(() => {
        goalsRef
        .where("moneySaved", "==", 0)
        .onSnapshot((querySnapshot) => {
            const goals = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data };
            });
            setGoals(goals);
        });
    }, [])

    return (
        <View  className="flex-1" style={{ backgroundColor: theme.background }}>
            <View 
                className="h-1/4 h- w-full flex justify-end items-start py-4 px-6"
                style={{ backgroundColor: theme.primary }}
            >
                <View className="flex flex-row items-center justify-between w-full">
                    <View className="flex flex-col items-start">
                        <View className="flex flex-row items-center justify-center">
                            <Text className="text-white text-sm text-center mr-1" style={{ fontFamily: "Montserrat-Regular" }}>Welcome back!</Text>
                            <Emoji name="wave" style={{ fontSize: 14 }} />
                        </View>
                        <Text className="text-white text-2xl text-center" style={{ fontFamily: "Montserrat-SemiBold" }}>{user.fullname}</Text>
                    </View>

                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Settings')}
                        className="bg-gray-200 w-14 h-14 rounded-full self-center overflow-hidden"
                    >
                        {user.profilePicture !== "default" ? (
                            <Image source={{ uri: user.profilePicture }} className="flex-1" />
                        ) : (
                            <View className="items-center justify-center flex-1">
                                <Ionicons name="add" size={48} color="lightgray" />
                            </View>
                        )}
                    </TouchableOpacity>

                    <View className="absolute -top-1 -right-1 bg-white w-5 h-5 rounded-full items-center justify-center">
                        <Ionicons name="settings" size={12} color={theme.primary} />
                    </View>
                </View>
            </View>

            <ScrollView 
                className="flex-1 flex flex-col px-6 py-8"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {
                    quote && (
                        <View className="flex flex-col">
                            <Text 
                                className="text-9xl -mb-28"
                                style={{ 
                                    fontFamily: "Montserrat-SemiBold" ,
                                    color: theme.secondary
                                }}
                            >“</Text>

                            <View className="px-4">
                                <Text className="text-sm" style={{ color: theme.text, fontFamily: "Montserrat-MediumItalic" }}>
                                    {
                                        quote.quote.length > 120 
                                        ?
                                            quote.quote.substring(0, 100) + "..." 
                                        :
                                            quote.quote
                                    }
                                </Text>

                                <View className="w-8 h-0.5 rounded-full mt-2" style={{ backgroundColor: theme.secondary }} />
                            
                                <Text className="text-xs mt-1" style={{ color: theme.secondary, fontFamily: "Montserrat-Medium" }}>
                                    {quote.author}
                                </Text>
                            </View>
                        </View>
                    )
                }

                <View className="flex flex-row items-center justify-between mt-8">
                    <Text className="text-lg" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>Budgets</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('BudgetCategories')}>
                        <Text className="text-sm" style={{ color: theme.secondary, fontFamily: "Montserrat-Medium" }}>See all</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex">
                    <View className="flex flex-row items-center justify-start flex-wrap pt-2">
                        <TouchableOpacity 
                            className="flex flex-col items-center justify-center rounded-2xl shadow-sm w-[155px] h-20 m-2"
                            style={{ backgroundColor: type === "incomes" ? theme.primary : theme.accent }}
                            onPress={() => setType("incomes")}
                        >
                            <Text className="text-lg text-green-500" style={{ fontFamily: "Montserrat-SemiBold" }}>
                                { setRightCurrency(user, totalIncomes) }
                            </Text>

                            <Text className="text-sm" style={{ color: type === "incomes" ? "white" : theme.text, fontFamily: "Montserrat-Medium" }}>Incomes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            className="flex flex-col items-center justify-center rounded-2xl shadow-sm w-[155px] h-20 m-2"
                            style={{ backgroundColor: type === "expenses" ? theme.primary : theme.accent }}
                            onPress={() => setType("expenses")}
                        >
                            <Text className="text-lg text-red-500" style={{ fontFamily: "Montserrat-SemiBold" }}>
                                { setRightCurrency(user, totalExpenses) }
                            </Text>

                            <Text className="text-sm" style={{ color: type === "expenses" ? "white" : theme.text, fontFamily: "Montserrat-Medium" }}>Expenses</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View 
                    className="flex flex-col mt-2 mx-2 p-4 items-center justify-center rounded-2xl shadow-sm"
                    style={{ backgroundColor: data.datasets[0].data.reduce((a, b) => a + b, 0) === 0 ? theme.secondary : theme.accent }}
                >
                    <BarChart
                        data={data}
                        width={300}
                        height={180}
                        chartConfig={{
                            backgroundGradientFrom: data.datasets[0].data.reduce((a, b) => a + b, 0) === 0 ? theme.secondary : theme.accent,
                            backgroundGradientTo: data.datasets[0].data.reduce((a, b) => a + b, 0) === 0 ? theme.secondary : theme.accent,
                            decimalPlaces: 0,
                            color: data.datasets[0].data.reduce((a, b) => a + b, 0) === 0 ? (opacity = 0.5) => `rgba(255, 255, 255, ${opacity})` : (opacity = 1) => `#4D7A80`,
                        }}
                        bezier
                        fromZero
                    />
                    
                    {
                        data.datasets[0].data.reduce((a, b) => a + b, 0) === 0 && (
                            <View className="absolute items-center justify-center flex-1">
                                <Text className="text-lg" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>No data</Text>
                                <Text className="text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Medium" }}>Add some budgets</Text>

                                <TouchableOpacity
                                    onPress={() => navigation.navigate('BudgetCategories')}
                                    className="flex flex-row items-center justify-center mt-2 px-4 py-2 rounded-xl shadow-sm"
                                    style={{ backgroundColor: theme.primary }}
                                >
                                    <Text className="text-sm" style={{ color: "white", fontFamily: "Montserrat-Medium" }}>Add Budgets</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </View>

                <View className="flex flex-row items-center justify-between mt-8">
                    <Text className="text-lg" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>New Goals</Text>

                    <TouchableOpacity onPress={() => navigation.navigate('GoalsCategories')}>
                        <Text className="text-sm" style={{ color: theme.secondary, fontFamily: "Montserrat-Medium" }}>See all</Text>
                    </TouchableOpacity>
                </View>

                <View className="mt-2 mb-32">
                    {
                        goals.length === 0 ? (
                            <TouchableOpacity
                                className="flex flex-row items-center justify-center mx-2 my-2 px-12 py-6 rounded-xl shadow-sm"
                                style={{ backgroundColor: theme.secondary }}
                                onPress={() => navigation.navigate('GoalsCategories')}
                            >
                                <Ionicons name="add-circle" size={24} color={theme.primary} />
                                <Text className="text-lg ml-4" style={{ color: theme.primary, fontFamily: "Montserrat-SemiBold" }}>Add a new goal</Text>
                            </TouchableOpacity>
                        ) : (
                            goals.map((goal, index) => (
                                <View
                                    key={index}
                                    className="flex flex-row items-center justify-between mx-2 my-2 px-12 py-2 rounded-xl shadow-sm"
                                    style={{ backgroundColor: theme.accent }}
                                >
                                    <Emoji name={goal.icon} style={{ fontSize: 30 }} />
        
                                    <View className="flex flex-col ml-6">
                                        <Text className="text-sm font-bold" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>{goal.name}</Text>
        
                                        <Text className="text-xs mt-2" style={{ color: theme.primary, fontFamily: "Montserrat-Bold" }}>{setRightCurrency(user, goal.moneySaved)}</Text>
        
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
                                            <Text className="text-xs" style={{ color: "lightgray", fontFamily: "Montserrat-Light" }}>{setRightCurrency(user, goal.money)}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        )
                    }
                </View>
            </ScrollView>

            <View className="flex-1 flex flex-row items-center justify-center absolute bottom-5 right-5">
                {showMessage && (
                    <Animated.View
                        className="flex flex-col items-center justify-center p-3 rounded-md shadow-sm mr-3 z-10"
                        style={{
                            backgroundColor: theme.primary,
                            transform: [
                                {
                                    translateY: show.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [100, 0]
                                    })
                                }
                            ]
                        }}
                    >
                        <Text className="text-xs text-center text-white" style={{ fontFamily: "Montserrat-Medium" }}>Need some financial tips?</Text>
                    </Animated.View>
                )}

                <TouchableOpacity
                    className="p-3 rounded-full shadow-sm"
                    style={{ backgroundColor: theme.primary }}
                    onPress={() => navigation.navigate('Message')}
                >
                    <Image
                        className="w-10 h-10 rounded-full"
                        source={require('../../../../assets/images/robot-placeholder.png')}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default HomeScreen