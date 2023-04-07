import { View, Text, SafeAreaView, TouchableOpacity, FlatList, Modal, Keyboard } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import ThemeContext from '../../../context/ThemeContext'
import { UserContext } from '../../../context/UserContext'
import { Ionicons } from '@expo/vector-icons'
import { firebase } from '../../../config/firebase'
import { useNavigation } from '@react-navigation/native'
import Goals from '../../../components/achievements/Goals'
import AddGoalsModal from '../../../components/achievements/AddGoalsModal'

const GoalsScreen = ({ route }) => {
    const [user, setUser] = useContext(UserContext)
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()

    const { category } = route.params

    const [goals, setGoals] = useState([])
    const goalsRef = firebase.firestore().collection('users').doc(user.uid).collection('goalsCategories').doc(category.id).collection('goals')
    const [addGoals, setAddGoals] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

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
            <Modal animationType="slide" visible={modalVisible}>
                <AddGoalsModal category={category} closeModal={() => setModalVisible(false)} />
            </Modal>

            <TouchableOpacity className="absolute top-16 left-4 m-4 z-10 bg-white rounded-md p-2" onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back-outline" size={30} color={theme.primary} />
            </TouchableOpacity>

            <Text className="text-2xl pl-24 pt-4" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>
                {category.name}
            </Text>

            <Text className="text-md pl-24" style={{ color: theme.text, fontFamily: "Montserrat-Light" }}>
                {completedGoals} of {totalGoals} goals completed
            </Text>

            <FlatList
                data={goals}
                numColumns={1}
                renderItem={({ item }) => <Goals goal={item} />}
                keyExtractor={(item) => item.id}
                className="mt-4"
            />

            {/* <KeyboardAvoidingView behavior="padding">
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
            </KeyboardAvoidingView> */}

            <View className="absolute bottom-10 right-5 m-4">
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Ionicons name="add-circle" size={60} color={theme.primary} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default GoalsScreen