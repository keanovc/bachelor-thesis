import { View, Text, Modal, TouchableOpacity, FlatList } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import Emoji from 'react-native-emoji';
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '../../../context/UserContext'
import ThemeContext from '../../../context/ThemeContext'
import BudgetModal from '../../../components/budget/BudgetModal';
import { firebase } from '../../../config/firebase'
import BudgetItem from '../../../components/budget/BudgetItem';

const BudgetScreen = ({ route }) => {
    const category = route.params.category
    const date = route.params.date
    const navigation = useNavigation()
    const [user, setUser] = useContext(UserContext)
    const theme = useContext(ThemeContext)

    const [modalVisible, setModalVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)

    const budgetsRef = firebase.firestore().collection("users").doc(user.uid).collection("budgets")
    const [budgets, setBudgets] = useState([])

    const [loading, setLoading] = useState(false)

    async function getIsDateOrMonthlyIsTrue() {
        const isDate = budgetsRef.where("date", "==", date ? date : getToday().toString().substring(0, 4) + " " + getToday().toString().substring(5, 7)).where("type", "==", category.type).where("categoryId", "==", category.id).get();
        const isMonthly = budgetsRef.where("monthly", "==", true).where("type", "==", category.type).where("categoryId", "==", category.id).get();

        const [dateQuerySnapshot, monthlyQuerySnapshot] = await Promise.all([
            isDate, 
            isMonthly
        ]);

        const dateBudgetsArray = dateQuerySnapshot.docs;
        const monthlyBudgetArray = monthlyQuerySnapshot.docs;

        const budgetsArray = dateBudgetsArray.concat(monthlyBudgetArray);

        return budgetsArray;
    }

    useEffect(() => {
        getIsDateOrMonthlyIsTrue()
            .then((querySnapshot) => {
                const newBudgets = []
                querySnapshot.forEach((doc) => {
                    const budget = doc.data()
                    budget.id = doc.id
                    newBudgets.push(budget)
                })
                setBudgets(newBudgets)
            })
    }, [loading])

    return (
        <View className="flex-1" style={{ backgroundColor: theme.background }}>
            <Modal animationType="slide" visible={modalVisible}>
                <BudgetModal 
                    category={category} 
                    date={date} 
                    closeModal={() => setModalVisible(false)} 
                    loading={() => setLoading(!loading)}
                />
            </Modal>

            <View 
                className="flex-col px-4 pt-20 pb-8"
                style={{ 
                    backgroundColor: theme.primary,
                }}
            >
                <View className="flex-row justify-between items-center px-4">
                    <TouchableOpacity className="bg-white rounded-lg p-2" onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back-outline" size={20} color={theme.primary} />
                    </TouchableOpacity>
                    
                    <Text className="text-xl" style={{ color: "#fff", fontFamily: "Montserrat-Medium" }}>
                        {category.name}
                    </Text>

                    <TouchableOpacity 
                        className="bg-white rounded-lg p-2"
                        onPress={() => setEditVisible(!editVisible)}
                    >
                        <Ionicons name="create-outline" size={20} color={theme.primary} />
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-between items-center px-4 pt-8">
                    <View className="flex-col">
                        <Text className="text-xs" style={{ color: "#fff", fontFamily: "Montserrat-Light" }}>
                            {
                                category.type == "incomes" ? "TOTAL INCOMES ($)" : "TOTAL EXPENSES ($)"
                            }
                        </Text>
                        <Text className="text-3xl pt-2" style={{ color: "#fff", fontFamily: "Montserrat-Medium" }}>
                            {
                                budgets.reduce((acc, curr) => {
                                    return acc + curr.money
                                }, 0)
                            }
                        </Text>
                    </View>
                </View>
            </View>

            <View className="flex-1 px-6 pt-4">
                <FlatList
                    data={budgets}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <BudgetItem
                            item={item}
                            category={category}
                            loading={() => setLoading(!loading)}
                            edit={editVisible}
                            date={date}
                        />
                    )}
                />

                <View className="absolute bottom-10 right-5 m-4">
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Ionicons name="add-circle" size={60} color={theme.primary} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default BudgetScreen