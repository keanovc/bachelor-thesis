import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import NumericInput from 'react-native-numeric-input'
import DatePicker, { getToday } from 'react-native-modern-datepicker'
import Emoji from 'react-native-emoji';

import ThemeContext from '../../../context/ThemeContext'
import { UserContext } from '../../../context/UserContext'
import { firebase } from '../../../config/firebase'
import { IconButton } from '../../../components'

const IndividualGoalScreen = ({ route }) => {
    const [user, setUser] = useContext(UserContext)
    const { goal, category, totalBudget } = route.params
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()

    const [amount, setAmount] = useState(0)
    const [goalDate, setGoalDate] = useState(goal.date)
    const [openDateModal, setOpenDateModal] = useState(false)

    const goalsRef = firebase.firestore().collection("users").doc(user.uid).collection('goalsCategories').doc(category.id).collection('goals')
    const budgetsRef = firebase.firestore().collection("users").doc(user.uid).collection('budgets')
    const budgetCategoriesRef = firebase.firestore().collection("users").doc(user.uid).collection('budgetCategories')
    const currentMonth = getToday().toString().substring(0, 4) + " " + getToday().toString().substring(5, 7)

    useEffect(() => {
        if (amount > goal.money - goal.moneySaved) {
            setAmount(goal.money - goal.moneySaved)
        }

        if (goal.moneySaved + amount >= goal.money) {
            goalsRef.doc(goal.id).update({
                completed: true
            })
        }
    }, [amount])

    const addMoney = () => {
        if (amount > 0) {
            if (amount <= totalBudget) {
                goalsRef.doc(goal.id).update({
                    moneySaved: goal.moneySaved + amount
                })
                .then(() => {
                    navigation.goBack()
                })
                .catch((error) => {
                    alert(error)
                })

                const timestamp = firebase.firestore.FieldValue.serverTimestamp()
                budgetCategoriesRef.doc("goals").get()
                    .then((doc) => {
                        if (!doc.exists) {
                            budgetCategoriesRef.doc("goals").set({
                                name: "Goals",
                                color: "#4D7A80",
                                icon: "golf",
                                type: "expenses",
                                userId: user.uid,
                                createdAt: timestamp,
                            })
                        }
                    })
                    .catch((error) => {
                        alert(error)
                    })

                const data = {
                    name: goal.name + " (" + category.name + ")",
                    money: amount,
                    date: currentMonth,
                    monthly: false,
                    type: "expenses",
                    categoryId: "goals",
                    createdAt: timestamp,
                }
                budgetsRef
                    .add(data)
                    .then((docRef) => {
                        data.id = docRef.id
                        budgetsRef.doc(docRef.id).set(data)
                    })
                    .catch((error) => {
                        alert(error)
                    })
            } else {
                alert("You don't have enough money in your budget")
            }
        } else {
            alert("Please enter a valid amount")
        }
    }

    const changeDate = (date) => {
        goalsRef.doc(goal.id).update({
            date: date
        })
        .then(() => {
            setGoalDate(date)
            setOpenDateModal(false)
        })
        .catch((error) => {
            alert(error)
        })
    }

    return (
        <View className="flex-1" style={{ backgroundColor: theme.background }}>
            <View className="absolute top-10 right-10 p-2 z-10">
                <IconButton
                    onPress={() => navigation.goBack()}
                    icon="close"
                />
            </View>

            <View 
                className="h-1/5 w-full"
                style={{ backgroundColor: theme.primary }}
            />

            <View className="flex flex-row items-center mx-12 -mt-14">
                <View 
                    className="flex flex-row items-center justify-center rounded-full p-6 shadow-sm"
                    style={{ backgroundColor: theme.accent }}
                >
                    <Emoji name={goal.icon} style={{ fontSize: 30 }} />
                </View>

                <Text className="ml-4 text-xl" style={{ color: "#fff", fontFamily: "Montserrat-Bold" }}>
                    {goal.name}
                </Text>
            </View>

            <View className="mx-12 mt-6">
                <View className="flex flex-row items-center justify-between">
                    <Text className="text-xl mt-2" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>$ {goal.moneySaved}</Text>
                    <Text className="text-xs mt-2" style={{ color: theme.text, fontFamily: "Montserrat-Light" }}>$ {goal.money}</Text>
                </View>

                <View className="flex flex-row items-center justify-center h-3 mt-2">
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
                            backgroundColor: theme.accent,
                            width: `${100 - goal.moneySaved / goal.money * 100}%`
                        }}
                    ></View>
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={openDateModal}
                >
                    <View className="flex flex-col items-center justify-center w-full h-full top-10">
                        <View 
                            className="m-20 rounded-md w-11/12 p-4 items-center shadow-lg"
                            style={{ backgroundColor: theme.accent }}
                        >
                            <DatePicker
                                mode="calendar"
                                selected={goal.date}
                                onDateChange={(date) => {
                                    setGoalDate(date)
                                    changeDate(date)
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
                </Modal>

                <TouchableOpacity 
                    className="flex flex-row items-center justify-between mt-12"
                    onPress={
                        () => {
                            if (goal.moneySaved < goal.money) {
                                setOpenDateModal(true)
                            } else {
                                alert("You have already completed this goal!")
                            }
                        }
                    }
                >
                    <View className="flex flex-row items-center">
                        <View 
                            className="flex flex-row items-center p-4 rounded-xl shadow-sm"
                            style={{ backgroundColor: theme.accent }}
                        >
                            <Ionicons name="calendar-outline" size={32} color={theme.primary} />
                        </View>

                        <View className="flex flex-col ml-4">
                            <Text className="text-xs" style={{ color: theme.text, fontFamily: "Montserrat-Light" }}>
                                Due date
                            </Text>
                            <Text className="text-lg" style={{ color: theme.text, fontFamily: "Montserrat-Medium" }}>
                                {goalDate}
                            </Text>
                        </View>
                    </View>

                    <View className="flex flex-col">
                        <Ionicons name="chevron-forward-outline" size={32} color={theme.primary} />
                    </View>
                </TouchableOpacity>

                {
                    goal.moneySaved < goal.money ? (
                        <View className="flex flex-col items-center justify-center mt-12">
                            <Text className="text-base" style={{ color: theme.text, fontFamily: "Montserrat-Medium" }}>
                                I want to add:
                            </Text>

                            <NumericInput
                                value={amount}
                                onChange={value => setAmount(value)}
                                totalWidth={290}
                                totalHeight={50}
                                iconSize={25}
                                step={10}
                                minValue={0}
                                valueType='real'
                                rounded
                                textColor={theme.primary}
                                iconStyle={{ color: 'white' }}
                                rightButtonBackgroundColor={theme.primary}
                                leftButtonBackgroundColor={theme.primary}
                                borderColor={theme.background}
                                containerStyle={{
                                    backgroundColor: theme.input,
                                    marginTop: 20,
                                }}
                                inputStyle={{ 
                                    fontFamily: "Montserrat-Regular",
                                    fontSize: 14,
                                    color: theme.text,
                                }}
                            />

                            <TouchableOpacity 
                                className="flex flex-row items-center justify-center mt-8 py-4 px-16 rounded-xl shadow-sm"
                                style={
                                    amount === 0 ?
                                        { backgroundColor: theme.primary, opacity: 0.5 } 
                                    :
                                        { backgroundColor: theme.primary }
                                }
                                onPress={addMoney}
                                disabled={amount === 0}
                            >
                                <Text className="text-sm" style={{ color: "#fff", fontFamily: "Montserrat-Medium" }}>
                                    Add
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View className="flex flex-col items-center justify-center mt-12">
                            <Text className="text-sm" style={{ color: theme.primary, fontFamily: "Montserrat-Bold" }}>
                                You have reached your goal!
                            </Text>
                        </View>
                    )
                }
            </View>
        </View>
    )
}

export default IndividualGoalScreen