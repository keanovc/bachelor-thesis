import { View, Text, SafeAreaView, Dimensions, FlatList, TouchableOpacity, ScrollView, Modal } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import ThemeContext from '../../../context/ThemeContext'
import { UserContext } from '../../../context/UserContext'
import { Ionicons } from '@expo/vector-icons'
import BudgetCategoryModal from '../../../components/budget/BudgetCategoryModal'
import { firebase } from '../../../config/firebase'
import { useNavigation } from '@react-navigation/native'
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph } from 'react-native-chart-kit'

const BudgetCategoriesScreen = () => {
    const theme = useContext(ThemeContext)
    const [user, setUser] = useContext(UserContext)
    const [modalVisible, setModalVisible] = useState(false)
    const [income, setIncome] = useState(false)
    const navigation = useNavigation()

    const [budgetCategories, setBudgetCategories] = useState([])
    const budgetCategoriesRef = firebase.firestore().collection("users").doc(user.uid).collection("budgetCategories")

    useEffect(() => {
        budgetCategoriesRef
            .orderBy("createdAt", "desc")
            .onSnapshot(
                querySnapshot => {
                    const newBudgetCategories = []
                    querySnapshot.forEach(doc => {
                        const budgetCategory = doc.data()
                        budgetCategory.id = doc.id
                        newBudgetCategories.push(budgetCategory)
                    })
                    setBudgetCategories(newBudgetCategories)
                },
                error => {
                    console.log(error)
                }
            )
    }, [])

    return (
        <SafeAreaView className="flex-1"
            style={{ backgroundColor: theme.background }}
        >
            <Modal animationType="slide" visible={modalVisible}>
                <BudgetCategoryModal income={income} closeModal={() => setModalVisible(false)} />
            </Modal>

            <View className="my-4 px-6 flex flex-row items-center justify-between">
                <Text className="text-3xl font-bold" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>Budget 
                    <Text className="text-3xl font-bold" style={{ color: theme.primary, fontFamily: "Montserrat-Regular" }}> Overview</Text>
                </Text>
            </View>

            <View className="flex flex-row items-center justify-between px-12 pt-4">
                <Ionicons name="arrow-back" size={24} color={theme.text} />
                <View className="flex flex-row items-center justify-between">
                    <Text className="text-2xl font-bold" style={{ color: theme.primary, fontFamily: "Montserrat-Bold" }}>March</Text>
                    <Text className="text-2xl font-bold" style={{ color: theme.primary, fontFamily: "Montserrat-Medium" }}> 2021</Text>
                </View>
                <Ionicons name="arrow-forward" size={24} color={theme.text} />
            </View>

            <View className="flex flex-row items-center justify-around px-6 bg-white rounded-lg m-8 shadow-sm">
                <ProgressChart
                    data={{
                        labels: ["Progress"],
                        data: [0.78]
                    }}
                    width={100}
                    height={120}
                    strokeWidth={16}
                    radius={32}
                    chartConfig={{
                        backgroundColor: "#fff",
                        backgroundGradientFrom: "#fff",
                        backgroundGradientTo: "#fff",
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(77, 122, 128, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(77, 122, 128, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                    }}
                    hideLegend={true}
                />

                <View className="flex flex-row items-center justify-between">
                    <View className="flex flex-col space-y-3">
                        <View 
                            className="w-1 h-5 rounded-full" 
                            style={{ backgroundColor: "#93AEB2" }}
                        />
                        <View 
                            className="w-1 h-5 rounded-full" 
                            style={{ backgroundColor: "#DBE3E6" }}
                        />
                    </View>
                    <View className="flex flex-col space-y-3">
                        <Text className="text-sm font-bold mr-4 ml-2" style={{ color: theme.primary, fontFamily: "Montserrat-Light" }}>Incomes</Text>
                        <Text className="text-sm font-bold mr-4 ml-2" style={{ color: theme.primary, fontFamily: "Montserrat-Light" }}>Expenses</Text>
                    </View>

                    <View className="flex flex-col space-y-3">
                        <Text className="text-sm font-bold" style={{ color: theme.primary, fontFamily: "Montserrat-Bold" }}>78%</Text>
                        <Text className="text-sm font-bold" style={{ color: theme.primary, fontFamily: "Montserrat-Bold" }}>22%</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1">
                <View className="flex flex-row items-center justify-between px-6">
                    <Text className="text-2xl font-bold" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>Incomes</Text>
                    <TouchableOpacity 
                        className="flex flex-row items-center justify-between"
                        onPress={() => {
                            setModalVisible(true)
                            setIncome(true)
                        }}
                    >
                        <Ionicons name="add-circle" size={32} color={theme.primary} />
                    </TouchableOpacity>
                </View>

                <View className="flex flex-row items-center justify-start px-6 pt-2">
                    {
                        budgetCategories.filter(budgetCategory => budgetCategory.income === true).length === 0 ? (
                            <TouchableOpacity
                                className="rounded-lg m-2 shadow-sm flex flex-row items-center justify-center p-3"
                                style={{
                                    backgroundColor: "rgb(77, 122, 128)",
                                    width: 120,
                                    height: 140
                                }}
                                onPress={() => {
                                    setModalVisible(true)
                                    setIncome(true)
                                }}
                            >
                                <View className="flex flex-col items-center">
                                    <Ionicons name="add-circle" size={36} color="#fff" />
                                    <Text className="text-base text-white pt-1" style={{ fontFamily: "Montserrat-Bold" }}>Add</Text>
                                </View>
                            </TouchableOpacity>
                        ) : null
                    }

                    <FlatList
                        data={budgetCategories.filter(budgetCategory => budgetCategory.income === true)}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                className="rounded-lg m-2 shadow-sm flex flex-row items-center justify-start p-3"
                                style={{
                                    backgroundColor: item.color,
                                    width: 120,
                                    height: 140
                                }}
                                onPress={() => navigation.navigate('Budget', { item })}
                            >
                                <View className="flex flex-col">
                                    <Ionicons name={item.icon} size={24} color="#fff" />
                                    <Text className="text-base text-white pt-1 pb-5" style={{ fontFamily: "Montserrat-Regular" }}>{item.name}</Text>
                                    <Text className="text-base text-white" style={{ fontFamily: "Montserrat-Bold" }}>$ {item.total}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item.name}
                    />
                </View>

                <View className="flex flex-row items-center justify-between p-6">
                    <View
                        className="w-full rounded-full"
                        style={{ 
                            backgroundColor: theme.primary,
                            height: 1
                        }}
                    />
                </View>

                <View className="flex flex-row items-center justify-between px-6">
                    <Text className="text-2xl font-bold" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>Expenses</Text>
                    <TouchableOpacity 
                        className="flex flex-row items-center justify-between"
                        onPress={() => {
                            setModalVisible(true)
                            setIncome(false)
                        }}
                    >
                        <Ionicons name="add-circle" size={32} color={theme.primary} />
                    </TouchableOpacity>
                </View>

                <View className="flex flex-row items-center justify-between px-6 pt-2 pb-6">
                {
                        budgetCategories.filter(budgetCategory => budgetCategory.income === false).length === 0 ? (
                            <TouchableOpacity
                                className="rounded-lg m-2 shadow-sm flex flex-row items-center justify-center p-3"
                                style={{
                                    backgroundColor: "rgb(77, 122, 128)",
                                    width: 120,
                                    height: 140
                                }}
                                onPress={() => {
                                    setModalVisible(true)
                                    setIncome(false)
                                }}
                            >
                                <View className="flex flex-col items-center">
                                    <Ionicons name="add-circle" size={36} color="#fff" />
                                    <Text className="text-base text-white pt-1" style={{ fontFamily: "Montserrat-Bold" }}>Add</Text>
                                </View>
                            </TouchableOpacity>
                        ) : null
                    }

                    <FlatList
                        data={budgetCategories.filter(budgetCategory => budgetCategory.income === false)}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="rounded-lg m-2 shadow-sm flex flex-row items-center justify-start p-3"
                                style={{
                                    backgroundColor: item.color,
                                    width: 120,
                                    height: 140
                                }}
                            >
                                <View className="flex flex-col">
                                    <Ionicons name={item.icon} size={24} color="#fff" />
                                    <Text className="text-base text-white pt-1 pb-5" style={{ fontFamily: "Montserrat-Regular" }}>{item.name}</Text>
                                    <Text className="text-base text-white" style={{ fontFamily: "Montserrat-Bold" }}>$ {item.total}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item.name}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default BudgetCategoriesScreen