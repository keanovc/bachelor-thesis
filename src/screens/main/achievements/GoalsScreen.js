import { View, Text, SafeAreaView, TouchableOpacity, FlatList, Modal, Keyboard, Pressable } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import ThemeContext from '../../../context/ThemeContext'
import { UserContext } from '../../../context/UserContext'
import { Ionicons } from '@expo/vector-icons'
import { firebase } from '../../../config/firebase'
import { useNavigation } from '@react-navigation/native'
import Goals from '../../../components/achievements/Goals'
import AddGoalModal from '../../../components/achievements/AddGoalModal'

const GoalsScreen = ({ route }) => {
    const [user, setUser] = useContext(UserContext)
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()

    const { category } = route.params

    const [goals, setGoals] = useState([])
    const goalsRef = firebase.firestore().collection('users').doc(user.uid).collection('goalsCategories').doc(category.id).collection('goals')
    const [modalVisible, setModalVisible] = useState(false)

    let completedGoals
    let totalGoals

    if (goals === undefined || goals.length === 0) {
        completedGoals = 0
        totalGoals = 0
    } else {
        completedGoals = goals.filter(goal => goal.completed).length
        totalGoals = goals.length
    }

    const filter = [
        {
            id: 1,
            name: "All",
            icon: "list",
        },
        {
            id: 2,
            name: "New",
            icon: "add-circle",
        },
        {
            id: 3,
            name: "In Progress",
            icon: "time",
        },
        {
            id: 4,
            name: "Completed",
            icon: "checkmark-circle",
        }
    ]

    const [filterGoals, setFilterGoals] = useState(filter[0])

    useEffect(() => {
        goalsRef
            .orderBy("createdAt", "desc")
            .onSnapshot(
                querySnapshot => {
                    const newGoals = []
                    querySnapshot.forEach(doc => {
                        const {name, money, moneySaved, completed, date, icon} = doc.data()
                        newGoals.push({
                            id: doc.id,
                            name,
                            money,
                            moneySaved,
                            completed,
                            date,
                            icon
                        })
                    })
                    setGoals(newGoals)
                },
                error => {
                    alert(error)
                }
            )
    }, [])

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
            <Modal animationType="slide" visible={modalVisible}>
                <AddGoalModal category={category} closeModal={() => setModalVisible(false)} />
            </Modal>

            <View className="flex flex-row items-center mx-5 pt-5">
                <TouchableOpacity className="bg-white rounded-md p-2" onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back-outline" size={30} color={theme.primary} />
                </TouchableOpacity>

                <View className="flex flex-col">
                    <Text className="text-2xl ml-4" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>
                        {category.name}
                    </Text>

                    <Text className="text-md ml-4" style={{ color: theme.text, fontFamily: "Montserrat-Light" }}>
                        {completedGoals} of {totalGoals} goals completed
                    </Text>
                </View>
            </View>

            <View className="flex flex-row items-center justify-between mx-5">
                <View className="flex flex-row items-center justify-center">
                    <FlatList
                        data={filter}
                        renderItem={({ item }) => 
                            <TouchableOpacity 
                                className="flex flex-row items-center justify-center bg-white rounded-full py-2 px-4 shadow-sm m-1"
                                onPress={() => {
                                    setFilterGoals(item)
                                    Keyboard.dismiss()
                                }}
                                style={{ backgroundColor: filterGoals.id === item.id ? theme.primary : "white" }}
                            >
                                <Ionicons name={item.icon} size={18} color={filterGoals.id === item.id ? theme.background : theme.primary} />
                                <Text className="ml-1 text-sm" style={{ color: filterGoals.id === item.id ? theme.background : theme.primary, fontFamily: "Montserrat-Light" }}>{item.name}</Text>
                            </TouchableOpacity>
                        }
                        keyExtractor={(item) => item.id}
                        className="mt-4"
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </View>

            <FlatList
                data={
                    filterGoals.id === 1 ? goals :
                    filterGoals.id === 2 ? goals.filter(goal => goal.moneySaved === 0) :
                    filterGoals.id === 3 ? goals.filter(goal => goal.moneySaved > 0 && goal.moneySaved < goal.money) :
                    filterGoals.id === 4 ? goals.filter(goal => goal.moneySaved === goal.money) :
                    goals
                }
                numColumns={1}
                renderItem={({ item }) => <Goals goal={item} category={category} />}
                keyExtractor={(item) => item.id}
                className="mt-4"
            />
            

            <View className="absolute bottom-10 right-5 m-4">
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Ionicons name="add-circle" size={60} color={theme.primary} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default GoalsScreen