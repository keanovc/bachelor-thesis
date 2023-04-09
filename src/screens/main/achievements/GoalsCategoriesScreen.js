import { View, Text, SafeAreaView, ScrollView, Modal, TouchableOpacity } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import ThemeContext from '../../../context/ThemeContext'
import { UserContext } from '../../../context/UserContext'
import { Ionicons } from '@expo/vector-icons'
import GoalsCategories from '../../../components/achievements/GoalsCategories'
import GoalsCategoryModal from '../../../components/achievements/GoalsCategoryModal'
import { firebase } from '../../../config/firebase'

const GoalsCategoriesScreen = () => {
    const theme = useContext(ThemeContext)
    const [user, setUser] = useContext(UserContext)
    const [modalVisible, setModalVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)

    const [goalsCategories, setGoalsCategories] = useState([])
    const goalsCategoriesRef = firebase.firestore().collection("users").doc(user.uid).collection('goalsCategories')

    useEffect(() => {
        goalsCategoriesRef
            .onSnapshot(
                querySnapshot => {
                    const newGoalsCategories = []
                    querySnapshot.forEach(doc => {
                        const {name, color, icon, goals, totalBalance} = doc.data()
                        newGoalsCategories.push({
                            id: doc.id,
                            name,
                            color,
                            icon,
                            goals,
                            totalBalance
                        })
                    })
                    setGoalsCategories(newGoalsCategories)
                },
                error => {
                    alert(error)
                }
            )
    }, [])

    return (
        <SafeAreaView className="flex-1"
            style={{ backgroundColor: theme.background }}
        >
            <Modal animationType="slide" visible={modalVisible}>
                <GoalsCategoryModal closeModal={() => setModalVisible(false)} />
            </Modal>
            
            <View className="my-4 px-6 flex flex-row items-center justify-between">
                <Text className="text-3xl font-bold" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>Goals 
                    <Text className="text-3xl font-bold" style={{ color: theme.primary, fontFamily: "Montserrat-Regular" }}> Categories</Text>
                </Text>

                <TouchableOpacity
                    className="bg-white rounded-full p-2"
                    onPress={() => setEditVisible(!editVisible)}
                >
                    <Ionicons name="create-outline" size={16} color={theme.primary} />
                </TouchableOpacity>
            </View>

            <View className="flex flex-row items-center justify-between pl-6 pr-12 py-4 mx-6 mb-4 mt-2 bg-white rounded-2xl shadow-sm">
                <View className="flex flex-row items-center justify-center">
                    <Text className="ml-2 text-sm" style={{ color: theme.primary, fontFamily: "Montserrat-Light" }}>Total Balance:</Text>
                </View>

                <View className="flex flex-row items-center justify-center">
                    <Text className="mr-2 text-2xl font-bold" style={{ color: theme.primary, fontFamily: "Montserrat-Bold" }}>$1000</Text>
                </View>
            </View>

            <ScrollView className="flex mx-auto w-11/12">
                <View className="flex flex-row items-center justify-start flex-wrap">
                    {goalsCategories.map((category, index) => (
                        <GoalsCategories key={index} category={category} edit={editVisible} />
                    ))}
                </View>
            </ScrollView>

            <View className="absolute bottom-0 right-0 m-4">
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Ionicons name="add-circle" size={60} color={theme.primary} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default GoalsCategoriesScreen