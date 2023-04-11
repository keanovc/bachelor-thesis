import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import ThemeContext from '../../../context/ThemeContext'
import { UserContext } from '../../../context/UserContext'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import NumericInput from 'react-native-numeric-input'
import { firebase } from '../../../config/firebase'
import DatePicker from 'react-native-modern-datepicker'
import Emoji from 'react-native-emoji';

const IndividualGoalScreen = ({ route }) => {
    const [user, setUser] = useContext(UserContext)
    const { goal, category } = route.params
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()

    const [amount, setAmount] = useState(0)
    const [goalDate, setGoalDate] = useState(goal.date)
    const [openDateModal, setOpenDateModal] = useState(false)

    const goalsRef = firebase.firestore().collection("users").doc(user.uid).collection('goalsCategories').doc(category.id).collection('goals')

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
            goalsRef.doc(goal.id).update({
                moneySaved: goal.moneySaved + amount
            })
            .then(() => {
                navigation.goBack()
            })
            .catch((error) => {
                alert(error)
            })
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
            <TouchableOpacity className="absolute top-10 right-10 p-2 z-10 bg-white rounded-lg" onPress={() => navigation.goBack()}>
                <Ionicons name="close" size={20} color={theme.primary} />
            </TouchableOpacity>

            <View 
                className="h-1/5 w-full"
                style={{ backgroundColor: theme.primary }}
            />

            <View className="flex flex-row items-center mx-12 -mt-14">
                <View className="flex flex-row items-center justify-center bg-white rounded-full p-6 shadow-sm">
                    <Emoji name={goal.icon} style={{ fontSize: 30 }} />
                </View>

                <Text className="ml-4 text-xl" style={{ color: "#fff", fontFamily: "Montserrat-Bold" }}>
                    {goal.name}
                </Text>
            </View>

            <View className="mx-12 mt-6">
                <View className="flex flex-row items-center justify-between">
                    <Text className="text-xl mt-2" style={{ color: theme.primary, fontFamily: "Montserrat-Bold" }}>$ {goal.moneySaved}</Text>
                    <Text className="text-xs mt-2" style={{ color: theme.primary, fontFamily: "Montserrat-Light" }}>$ {goal.money}</Text>
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
                            backgroundColor: "#fff",
                            width: `${100 - goal.moneySaved / goal.money * 100}%`
                        }}
                    ></View>
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={openDateModal}
                >
                    <View className="flex flex-col items-center justify-center w-full h-full">
                        <View className="m-20 bg-white rounded-md w-11/12 p-4 items-center shadow-lg">
                            <DatePicker
                                mode="calendar"
                                selected={goal.date}
                                onDateChange={(date) => {
                                    setGoalDate(date)
                                    changeDate(date)
                                }}
                                options={{
                                    mainColor: theme.primary,
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
                    <View className="flex flex-row items-center bg-white p-4 rounded-xl shadow-sm">
                        <Ionicons name="calendar-outline" size={32} color={theme.primary} />
                    </View>

                    <View className="flex flex-col">
                        <Text className="text-xs" style={{ color: theme.primary, fontFamily: "Montserrat-Light" }}>
                            Due date
                        </Text>
                        <Text className="text-lg" style={{ color: theme.primary, fontFamily: "Montserrat-Medium" }}>
                            {goalDate}
                        </Text>
                    </View>

                    <View className="flex flex-col">
                        <Ionicons name="chevron-forward-outline" size={32} color={theme.primary} />
                    </View>
                </TouchableOpacity>

                {
                    goal.moneySaved < goal.money ? (
                        <View className="flex flex-col items-center justify-center mt-12">
                            <Text className="text-sm" style={{ color: theme.primary, fontFamily: "Montserrat-Light" }}>
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
                                    backgroundColor: "#fff",
                                    marginTop: 20,
                                }}
                                inputStyle={{ 
                                    fontFamily: "Montserrat-Regular",
                                    fontSize: 14,
                                }}
                            />

                            <TouchableOpacity 
                                className="flex flex-row items-center justify-center mt-8 py-4 px-16 rounded-xl shadow-sm"
                                style={{ backgroundColor: theme.primary }}
                                onPress={addMoney}
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