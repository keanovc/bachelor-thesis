import { View, Text, KeyboardAvoidingView, TouchableOpacity, SafeAreaView, TextInput, FlatList, Modal } from 'react-native'
import React, { useContext, useState } from 'react'
import ThemeContext from '../../context/ThemeContext'
import { UserContext } from '../../context/UserContext'
import { Ionicons } from '@expo/vector-icons'
import { firebase } from '../../config/firebase'
import DatePicker, { getToday } from 'react-native-modern-datepicker'
import NumericInput from 'react-native-numeric-input'

const AddGoalModal = ({ category, closeModal }) => {
    const [user, setUser] = useContext(UserContext)
    const theme = useContext(ThemeContext)
    const startDate = getToday()

    const goalsRef = firebase.firestore().collection("users").doc(user.uid).collection('goalsCategories').doc(category.id).collection('goals')

    const [goalName, setGoalName] = useState("")
    const [goalMoney, setGoalMoney] = useState(0)
    const [goalDate, setGoalDate] = useState(startDate)

    const [openDateModal, setOpenDateModal] = useState(false)

    const iconNames = [
        "basketball",
        "beer",
        "book",
        "bus",
        "car",
        "cash",
        "football",
        "game-controller",
        "gift",
        "golf",
        "headset",
        "heart",
        "home",
        "ice-cream",
        "images",
    ]

    const [goalIcon, setGoalIcon] = useState(iconNames[0])

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

    const renderIcons = (icon) => {
        return (
            <TouchableOpacity
                key={icon}
                onPress={() => setGoalIcon(icon)}
                className="w-12 h-12 rounded-md m-2 flex items-center justify-center"
                style={{ backgroundColor: theme.primary, opacity: goalIcon === icon ? 0.5 : 1 }}
            >
                <Ionicons name={icon} size={24} color="#fff" />

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
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default AddGoalModal