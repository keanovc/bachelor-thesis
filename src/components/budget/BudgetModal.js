import { View, Text, KeyboardAvoidingView, TouchableOpacity, SafeAreaView, TextInput, Modal, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import NumericInput from 'react-native-numeric-input'

import ThemeContext from '../../context/ThemeContext'
import { UserContext } from '../../context/UserContext'
import { firebase } from '../../config/firebase'

const BudgetModal = ({ category, closeModal, budget, date, loading }) => {
    const [user, setUser] = useContext(UserContext)
    const theme = useContext(ThemeContext)

    const budgetCategoriesRef = firebase.firestore().collection("users").doc(user.uid).collection("budgetCategories")
    const budgetRef = firebase.firestore().collection("users").doc(user.uid).collection("budgets")

    const [budgetName, setBudgetName] = useState(budget ? budget.name : "")
    const [budgetMoney, setBudgetMoney] = useState(budget ? budget.money : 0)

    const [monthly, setMonthly] = useState(budget ? budget.monthly : false)

    const createBudget = () => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp()
        const data = {
            name: budgetName,
            money: budgetMoney,
            monthly: monthly,
            type: category.type,
            categoryId: category.id,
            createdAt: timestamp,
        }
        monthly ? data.date = null : data.date = date
        budgetRef
            .add(data)
            .then(() => {
                loading()
                closeModal()
            })
            .catch((error) => {
                alert(error)
            })
        budgetCategoriesRef
            .doc(category.id)
            .update({
                total: firebase.firestore.FieldValue.increment(budgetMoney)
            })
            .catch((error) => {
                alert(error)
            }
        )
    }

    const editBudget = () => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp()
        const data = {
            name: budgetName,
            money: budgetMoney,
            monthly: monthly ? monthly : false,
            createdAt: timestamp,
        }
        monthly ? data.date = null : data.date = date
        console.log(data)
        budgetRef
            .doc(budget.id)
            .update(data)
            .then(() => {
                loading()
                closeModal()
            })
            .catch((error) => {
                alert(error)
            })
    }
    
    const deleteBudget = () => {
        budgetRef
            .doc(budget.id)
            .delete()
            .then(() => {
                loading()
                closeModal()
            })
            .catch((error) => {
                alert(error)
            })
    }

    return (
        <SafeAreaView className="flex flex-col items-center justify-center w-full h-full" style={{ backgroundColor: theme.background }}>
            <KeyboardAvoidingView className="flex flex-col justify-center w-full h-full">
                <TouchableOpacity className="absolute top-0 right-0 m-4" onPress={closeModal}>
                    <Ionicons name="close" size={30} color={theme.primary} />
                </TouchableOpacity>

                <View className="flex flex-col">
                    <Text 
                        className="ml-4 text-lg" 
                        style={{ 
                            fontFamily: "Montserrat-Medium",
                            color: theme.text,
                        }}
                    >
                        {budget ? "Edit Budget" : "Create Budget"}
                    </Text>

                    <View
                        className="w-80 bg-gray-300 mt-2"
                        style={{ height: 2, backgroundColor: theme.primary }}
                    />

                    <View className="flex flex-row items-center justify-center">
                        <TextInput 
                            className="mt-4 w-80 h-12 rounded-lg px-4" 
                            style={{
                                color: theme.text,
                                backgroundColor: theme.input,
                                fontFamily: "Montserrat-Regular",
                                fontSize: 14,
                            }} 
                            placeholder={
                                category.type === "incomes" ? "Salary" : "Groceries"
                            }
                            placeholderTextColor="#9E9E9E"
                            value={budgetName}
                            onChangeText={text => setBudgetName(text)}
                        />
                    </View>

                    <Text 
                        className="mt-8 ml-4 text-lg" 
                        style={{ 
                            fontFamily: "Montserrat-Medium",
                            color: theme.text,
                        }}
                    >
                        Budget Money
                    </Text>

                    <View 
                        className="w-80 bg-gray-300 mt-2" 
                        style={{ height: 2, backgroundColor: theme.primary }}
                    />

                    <View className="flex flex-row mt-4 items-center justify-center">
                        <NumericInput
                            value={budgetMoney}
                            onChange={value => setBudgetMoney(value)}
                            totalWidth={160}
                            totalHeight={50}
                            iconSize={25}
                            step={100}
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
                            }}
                            inputStyle={{ 
                                fontFamily: "Montserrat-Regular",
                                fontSize: 14,
                                color: theme.text,
                            }}
                        />
                    </View>

                    <Text 
                        className="mt-8 ml-4 text-lg" 
                        style={{ 
                            fontFamily: "Montserrat-Medium",
                            color: theme.text,
                        }}
                    >
                        Budget Type
                    </Text>

                    <View
                        className="w-80 bg-gray-300 mt-2"
                        style={{ height: 2, backgroundColor: theme.primary }}
                    />

                    <View className="flex flex-row mt-4 items-center justify-between mx-9">
                        <TouchableOpacity
                            onPress={() => setMonthly(false)}
                            className="w-36 h-12 rounded-md flex items-center justify-center shadow-sm"
                            style={{ backgroundColor: monthly ? theme.input : theme.primary }}
                        >
                            <Text className="text-md" style={{ fontFamily: "Montserrat-Medium", color: monthly ? theme.text : "#fff" }}>Once</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setMonthly(true)}
                            className="w-36 h-12 rounded-md flex items-center justify-center shadow-sm"
                            style={{ backgroundColor: monthly ? theme.primary : theme.input }}
                        >
                            <Text className="text-md" style={{ fontFamily: "Montserrat-Medium", color: monthly ? "#fff" : theme.text }}>Monthly</Text>
                        </TouchableOpacity>
                    </View>

                    {
                        budget ? (
                            <View className="flex flex-col items-center justify-center">
                                <TouchableOpacity
                                    className="mt-8 w-80 h-12 rounded-md flex items-center justify-center"
                                    style={{ backgroundColor: theme.primary }}
                                    onPress={() => editBudget()}
                                >
                                    <Text className="text-center text-white" style={{ fontFamily: "Montserrat-Bold" }}>Update</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="mt-2 w-80 h-12 rounded-md flex items-center justify-center"
                                    onPress={
                                        () => Alert.alert(
                                            "Delete Budget",
                                            "Are you sure you want to delete this budget?",
                                            [
                                                {
                                                    text: "Cancel",
                                                    onPress: () => console.log("Cancel Pressed"),
                                                    style: "cancel"
                                                },
                                                { text: "OK", onPress: () => deleteBudget() }
                                            ],
                                            { cancelable: false }
                                        )
                                    }
                                >
                                    <Text className="text-center text-red-500 underline" style={{ fontFamily: "Montserrat-Bold" }}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View className="flex flex-row mt-8 items-center justify-center">
                                <TouchableOpacity 
                                    disabled={budgetName === ""}
                                    className="p-4 w-80 bg-gray-300 rounded-md"
                                    style={{ backgroundColor: theme.primary, opacity: budgetName === "" ? 0.5 : 1 }}
                                    onPress={createBudget}
                                >
                                    <Text className="text-center text-white" style={{ fontFamily: "Montserrat-Bold" }}>Create</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default BudgetModal