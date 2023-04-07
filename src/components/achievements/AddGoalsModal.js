import { View, Text, KeyboardAvoidingView, TouchableOpacity, SafeAreaView, TextInput, FlatList } from 'react-native'
import React, { useContext, useState } from 'react'
import ThemeContext from '../../context/ThemeContext'
import { UserContext } from '../../context/UserContext'
import { Ionicons } from '@expo/vector-icons'
import { firebase } from '../../config/firebase'

const AddGoalsModal = ({ category, closeModal }) => {
    const [user, setUser] = useContext(UserContext)
    const theme = useContext(ThemeContext)

    const goalsRef = firebase.firestore().collection("users").doc(user.uid).collection('goalsCategories').doc(category.id).collection('goals')

    const [goalName, setGoalName] = useState("")
    const [goalMoney, setGoalMoney] = useState(0)
    const [goalDate, setGoalDate] = useState("")

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
            completed: false,
            createdAt: timestamp,
        }
        goalsRef
            .add(data)
            .then(() => {
                alert("Goal created!")
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

                <View className="flex flex-col items-center justify-center">
                    <Text className="mt-8 text-lg" style={{ fontFamily: "Montserrat-Medium" }}>Goal Name</Text>

                    <View
                        className="w-80 bg-gray-300 mt-2"
                        style={{ height: 2, backgroundColor: theme.primary }}
                    />

                    <TextInput 
                        className="mt-4 w-80 h-12 rounded-md border-2 border-gray-300 pb-2 text-lg text-center" 
                        placeholder="Ex: Household"
                        style={{ color: theme.text, fontFamily: "Montserrat-Regular" }} 
                        value={goalName}
                        onChangeText={text => setGoalName(text)}
                    />

                    <Text className="mt-8 text-lg" style={{ fontFamily: "Montserrat-Medium" }}>Select Icon</Text>

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

                    <TouchableOpacity 
                        disabled={goalName === ""}
                        className="mt-8 p-4 w-80 bg-gray-300 rounded-md"
                        style={{ backgroundColor: theme.primary, opacity: goalName === "" ? 0.5 : 1 }}
                        onPress={createGoal}
                    >
                        <Text className="text-center text-white" style={{ fontFamily: "Montserrat-Bold" }}>Create</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default AddGoalsModal