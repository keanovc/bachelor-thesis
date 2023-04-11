import { View, Text, KeyboardAvoidingView, TouchableOpacity, SafeAreaView, TextInput, FlatList, Modal, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import ThemeContext from '../../context/ThemeContext'
import { UserContext } from '../../context/UserContext'
import { Ionicons } from '@expo/vector-icons'
import { firebase } from '../../config/firebase'
import DatePicker, { getToday } from 'react-native-modern-datepicker'
import NumericInput from 'react-native-numeric-input'
import Emoji from 'react-native-emoji';

const GoalModal = ({ category, closeModal, goal }) => {
    const [user, setUser] = useContext(UserContext)
    const theme = useContext(ThemeContext)
    const startDate = getToday()

    const goalsRef = firebase.firestore().collection("users").doc(user.uid).collection('goalsCategories').doc(category.id).collection('goals')

    const [goalName, setGoalName] = useState(goal ? goal.name : "")
    const [goalMoney, setGoalMoney] = useState(goal ? goal.money : 0)
    const [goalDate, setGoalDate] = useState(goal ? goal.date : startDate)

    const [openDateModal, setOpenDateModal] = useState(false)

    const iconNames = [
        "basketball",
        "beer",
        "book",
        "bus",
        "car",
        "moneybag",
        "football",
        "video_game",
        "gift",
        "golf",
        "musical_note",
        "heart",
        "house",
        "ice_cream",
        "iphone",
    ]

    const [goalIcon, setGoalIcon] = useState(goal ? goal.icon : iconNames[0])

    const createGoal = () => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp()
        const data = {
            name: goalName,
            icon: goalIcon,
            money: goalMoney,
            moneySaved: 0,
            date: goalDate,
            completed: false,
            createdAt: timestamp,
        }
        goalsRef
            .add(data)
            .then(() => {
                closeModal()
            })
            .catch((error) => {
                alert(error)
            })
    }

    const editGoal = () => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp()
        const data = {
            name: goalName,
            icon: goalIcon,
            money: goalMoney,
            moneySaved: goal.moneySaved,
            date: goalDate,
            completed: goal.completed,
            createdAt: timestamp,
        }
        goalsRef
            .doc(goal.id)
            .update(data)
            .then(() => {
                closeModal()
            })
            .catch((error) => {
                alert(error)
            })
    }
    
    const deleteGoal = () => {
        goalsRef
            .doc(goal.id)
            .delete()
            .then(() => {
                closeModal()
            })
            .catch((error) => {
                alert(error)
            })
    }

    const renderIcons = (icon) => {
        return (
            <TouchableOpacity
                key={icon}
                onPress={() => setGoalIcon(icon)}
                className="w-12 h-12 rounded-md m-2 flex items-center justify-center shadow-sm"
                style={{ backgroundColor: "#fff", opacity: goalIcon === icon ? 0.5 : 1 }}
            >
                <Emoji name={icon} style={{ fontSize: 24 }} />

                {goalIcon === icon && (
                    <Ionicons name="checkmark" size={24} color="black" style={{ position: "absolute", top: 10, right: 10 }} />
                )}
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView className="flex flex-col items-center justify-center w-full h-full" style={{ backgroundColor: theme.background }}>
            <KeyboardAvoidingView className="flex flex-col items-center justify-center w-full h-full">
                <TouchableOpacity className="absolute top-0 right-0 m-4" onPress={closeModal}>
                    <Ionicons name="close" size={30} color={theme.primary} />
                </TouchableOpacity>

                <View className="flex flex-col">
                    <Text className="ml-4 text-lg" style={{ fontFamily: "Montserrat-Medium" }}>Goal Name</Text>

                    <View
                        className="w-80 bg-gray-300 mt-2"
                        style={{ height: 2, backgroundColor: theme.primary }}
                    />

                    <View className="flex flex-row mt-4 items-center justify-center">
                        <TextInput 
                            className="w-80 h-12 rounded-md border-2 border-gray-300 pb-2 text-lg text-center" 
                            placeholder="Ex: Household"
                            style={{ color: theme.text, fontFamily: "Montserrat-Regular" }} 
                            value={goalName}
                            onChangeText={text => setGoalName(text)}
                        />
                    </View>

                    <Text className="mt-8 ml-4 text-lg" style={{ fontFamily: "Montserrat-Medium" }}>Select Icon</Text>

                    <View
                        className="w-80 bg-gray-300 mt-2"
                        style={{ height: 2, backgroundColor: theme.primary }}
                    />

                    <View className="flex flex-row items-center justify-center mt-2 px-7">
                        <FlatList
                            data={iconNames}
                            renderItem={({ item }) => renderIcons(item)}
                            keyExtractor={item => item}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    <Text className="mt-8 ml-4 text-lg" style={{ fontFamily: "Montserrat-Medium" }}>Goal Date & Money</Text>

                    <View
                        className="w-80 bg-gray-300 mt-2"
                        style={{ height: 2, backgroundColor: theme.primary }}
                    />

                    <View className="flex flex-row mt-4 items-center justify-center">
                        <TouchableOpacity
                            className="w-36 h-12 mr-4 rounded-md text-lg text-center flex flex-row items-center justify-center"
                            style={{ backgroundColor: theme.primary, opacity: goalDate === "" ? 0.5 : 1 }}
                            onPress={() => setOpenDateModal(true)}
                        >
                            <Text style={{ color: "#fff", fontFamily: "Montserrat-Regular" }}>{goalDate === "" ? "Select Date" : goalDate}</Text>
                        </TouchableOpacity>

                        <NumericInput
                            value={goalMoney}
                            onChange={value => setGoalMoney(value)}
                            totalWidth={160}
                            totalHeight={50}
                            iconSize={25}
                            step={300}
                            minValue={0}
                            valueType='real'
                            rounded
                            textColor={theme.primary}
                            iconStyle={{ color: 'white' }}
                            rightButtonBackgroundColor={theme.primary}
                            leftButtonBackgroundColor={theme.primary}
                            borderColor={theme.background}
                            inputStyle={{ 
                                fontFamily: "Montserrat-Regular",
                                fontSize: 14,
                            }}
                        />
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
                                    selected={goalDate}
                                    onDateChange={(date) => {
                                        setGoalDate(date)
                                        setOpenDateModal(false)
                                    }}
                                    options={{
                                        mainColor: theme.primary,
                                    }}
                                />
                            </View>
                        </View>
                    </Modal>

                    {
                        goal ? (
                            <View className="flex flex-col items-center justify-center">
                                <TouchableOpacity
                                    className="mt-8 w-80 h-12 rounded-md flex items-center justify-center"
                                    style={{ backgroundColor: theme.primary }}
                                    onPress={() => editGoal()}
                                >
                                    <Text className="text-center text-white" style={{ fontFamily: "Montserrat-Bold" }}>Update</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="mt-2 w-80 h-12 rounded-md flex items-center justify-center"
                                    onPress={
                                        () => Alert.alert(
                                            "Delete Goal",
                                            "Are you sure you want to delete this goal?",
                                            [
                                                {
                                                    text: "Cancel",
                                                    onPress: () => console.log("Cancel Pressed"),
                                                    style: "cancel"
                                                },
                                                { text: "OK", onPress: () => deleteGoal() }
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
                                    disabled={goalName === ""}
                                    className="p-4 w-80 bg-gray-300 rounded-md"
                                    style={{ backgroundColor: theme.primary, opacity: goalName === "" ? 0.5 : 1 }}
                                    onPress={createGoal}
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

export default GoalModal