import { View, Text, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Keyboard, Pressable } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import ThemeContext from '../../context/ThemeContext'
import { UserContext } from '../../context/UserContext'
import { Ionicons } from '@expo/vector-icons'
import { firebase } from '../../config/firebase'
import { useNavigation } from '@react-navigation/native'

const Goals = ({ category, closeModal }) => {
    const [user, setUser] = useContext(UserContext)
    const theme = useContext(ThemeContext)

    const [goals, setGoals] = useState([])
    const goalsRef = firebase.firestore().collection('users').doc(user.uid).collection('goalsCategories').doc(category.id).collection('goals')
    const [addGoals, setAddGoals] = useState(false)

    let completedGoals
    let totalGoals

    if (category.goals === undefined) {
        completedGoals = 0
        totalGoals = 0
    } else {
        completedGoals = category.goals.filter(goal => goal.completed).length
        totalGoals = category.goals.length
    }

    useEffect(() => {
        goalsRef
            .onSnapshot(
                querySnapshot => {
                    const newGoals = []
                    querySnapshot.forEach(doc => {
                        const {name} = doc.data()
                        newGoals.push({
                            id: doc.id,
                            name,
                        })
                    })
                    setGoals(newGoals)
                },
                error => {
                    alert(error)
                }
            )
    }, [])

    const deleteGoal = (goal) => {
        goalsRef
            .doc(goal.id)
            .delete()
            .then(() => {
                alert("Goal deleted!")
            })
            .catch((error) => {
                alert(error)
            })
    }

    const addGoal = () => {
        if (addGoals && addGoals.length > 0) {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp()
            const data = {
                name: addGoals,
                userId: user.uid,
                createdAt: timestamp,
            }
            goalsRef
                .add(data)
                .then(_doc => {
                    setAddGoals("")
                    Keyboard.dismiss()
                })
                .catch((error) => {
                    alert(error)
                })
        }
    }

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
            <TouchableOpacity className="absolute top-16 right-4 m-4 z-10" onPress={closeModal}>
                <Ionicons name="close" size={30} color={theme.primary} />
            </TouchableOpacity>

            <Text className="text-2xl px-6 pt-3" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>
                {category.name}
            </Text>

            <Text className="text-md px-6" style={{ color: theme.text, fontFamily: "Montserrat-Light" }}>
                {completedGoals} of {totalGoals} goals completed
            </Text>

            <FlatList
                data={goals}
                numColumns={1}
                renderItem={({ item }) => (
                    <View className="flex flex-row items-center justify-between w-full h-16 px-6">
                        <Text style={{ color: theme.text, fontFamily: "Montserrat-Medium", fontSize: 16 }}>{item.name}</Text>
                        <TouchableOpacity
                            className="w-10 h-10 rounded-full bg-gray-300 items-center justify-center"
                            onPress={() => deleteGoal(item)}
                        >
                            <Ionicons name="trash" size={30} color={theme.primary} />
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />

            <KeyboardAvoidingView behavior="padding">
                <View className="flex flex-row items-center justify-between w-full h-16 px-6">
                    <TextInput
                        placeholder="Add a goal"
                        placeholderTextColor={theme.text}
                        style={{ color: theme.text, fontFamily: "Montserrat-Medium", fontSize: 16 }}
                        className="border-b-2 border-gray-300 w-10/12 pb-2"
                        value={addGoals}
                        onChangeText={(name) => setAddGoals(name)}
                    />
                    <TouchableOpacity
                        className="w-10 h-10 rounded-full bg-gray-300 items-center justify-center"
                        onPress={addGoal}
                    >
                        <Ionicons name="add" size={30} color={theme.primary} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Goals