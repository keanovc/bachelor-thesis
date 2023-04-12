import { View, Text, KeyboardAvoidingView, TouchableOpacity, SafeAreaView, TextInput, FlatList, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import Emoji from 'react-native-emoji';
import { Ionicons } from '@expo/vector-icons'

import ThemeContext from '../../context/ThemeContext'
import { UserContext } from '../../context/UserContext'
import { firebase } from '../../config/firebase'
import { icons, colors } from '../../constants/index'

const BudgetCategoryModal = ({ closeModal, category, type }) => {
    const [user, setUser] = useContext(UserContext)
    const theme = useContext(ThemeContext)

    const budgetCategoriesRef = firebase.firestore().collection("users").doc(user.uid).collection("budgetCategories")
    const budgetsRef = firebase.firestore().collection("users").doc(user.uid).collection("budgets")

    const [categoryName, setCategoryName] = useState(category ? category.name : "")
    const [categoryColor, setCategoryColor] = useState(category ? category.color : colors[0])
    const [categoryIcon, setCategoryIcon] = useState(category ? category.icon : icons[0])

    const createCategory = () => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp()
        const data = {
            name: categoryName,
            color: categoryColor,
            icon: categoryIcon,
            type: type,
            userId: user.uid,
            createdAt: timestamp,
        }
        budgetCategoriesRef
            .add(data)
            .then(_doc => {
                setCategoryName("")
                closeModal()
            })
            .catch((error) => {
                alert(error)
            })
    }

    const editCategory = () => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp()
        const data = {
            name: categoryName,
            color: categoryColor,
            icon: categoryIcon,
            userId: user.uid,
            createdAt: timestamp,
        }
        budgetCategoriesRef
            .doc(category.id)
            .update(data)
            .then(_doc => {
                setCategoryName("")
                closeModal()
            })
            .catch((error) => {colors
                alert(error)
            })
    }
    
    const deleteCategory = () => {
        budgetCategoriesRef
            .doc(category.id)
            .delete()
            .then(_doc => {
                setCategoryName("")
                closeModal()
            })
            .catch((error) => {
                alert(error)
            })

        budgetsRef
            .where("categoryId", "==", category.id)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    doc.ref.delete()
                })
                closeModal()
            })
            .catch((error) => {
                alert(error)
            }
        )
    }

    const renderColors = (color) => {
        return (
            <TouchableOpacity
                key={color}
                style={{ backgroundColor: color }}
                onPress={() => setCategoryColor(color)}
                className="w-12 h-12 rounded-md m-2 flex items-center justify-center"
            >
                {categoryColor === color && (
                    <Ionicons name="checkmark" size={24} color="#fff" />
                )}
            </TouchableOpacity>
        )
    }

    const renderIcons = (icon) => {
        return (
            <TouchableOpacity
                key={icon}
                onPress={() => setCategoryIcon(icon)}
                className="w-12 h-12 rounded-md m-2 flex items-center justify-center shadow-sm"
                style={{ backgroundColor: theme.accent, opacity: categoryIcon === icon ? 0.5 : 1 }}
            >
                <Emoji name={icon} style={{ fontSize: 24 }} />

                {categoryIcon === icon && (
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
                    <Text 
                        className="ml-4 text-lg" 
                        style={{ 
                            fontFamily: "Montserrat-Medium",
                            color: theme.text,
                        }}
                    >
                        {category ? "Edit" : "Create"} Category
                    </Text>

                    <View
                        className="w-80 bg-gray-300 mt-2"
                        style={{ height: 2, backgroundColor: theme.primary }}
                    />

                    <View className="flex flex-row items-center justify-center">
                        <TextInput 
                            className="mt-4 w-80 h-12 rounded-lg px-4" 
                            style={{
                                color: theme.text,
                                backgroundColor: theme.input,
                                fontFamily: "Montserrat-Regular",
                                fontSize: 14,
                            }} 
                            placeholder={
                                type == "incomes" ? "Ex. Salary" : "Ex. Subscription"
                            }
                            placeholderTextColor="#9E9E9E"
                            value={categoryName} 
                            onChangeText={text => setCategoryName(text)}
                        />
                    </View>

                    <Text 
                        className="mt-8 ml-4 text-lg" 
                        style={{ 
                            fontFamily: "Montserrat-Medium",
                            color: theme.text,
                        }}
                    >
                        Select Color
                    </Text>

                    <View 
                        className="w-80 bg-gray-300 mt-2" 
                        style={{ height: 2, backgroundColor: theme.primary }}
                    />

                    <View className="flex flex-row items-center justify-center mt-2 px-7">
                        <FlatList
                            data={colors}
                            renderItem={({ item }) => renderColors(item)}
                            keyExtractor={item => item}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    <Text 
                        className="mt-8 ml-4 text-lg" 
                        style={{ 
                            fontFamily: "Montserrat-Medium",
                            color: theme.text,
                        }}
                    >
                        Select Icon
                    </Text>

                    <View
                        className="w-80 bg-gray-300 mt-2"
                        style={{ height: 2, backgroundColor: theme.primary }}
                    />

                    <View className="flex flex-row items-center justify-center mt-2 px-7">
                        <FlatList
                            data={icons}
                            renderItem={({ item }) => renderIcons(item)}
                            keyExtractor={item => item}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    {
                        category ? (
                            <View className="flex flex-col items-center justify-center">
                                <TouchableOpacity
                                    className="mt-8 w-80 h-12 rounded-md flex items-center justify-center"
                                    style={{ backgroundColor: theme.primary }}
                                    onPress={() => editCategory()}
                                >
                                    <Text className="text-center text-white" style={{ fontFamily: "Montserrat-Bold" }}>Update</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="mt-2 w-80 h-12 rounded-md flex items-center justify-center"
                                    onPress={
                                        () => Alert.alert(
                                            "Delete Category",
                                            "Are you sure you want to delete this category, all budgets under this category will be deleted as well?",
                                            [
                                                {
                                                    text: "Cancel",
                                                    onPress: () => console.log("Cancel Pressed"),
                                                    style: "cancel"
                                                },
                                                { text: "OK", onPress: () => deleteCategory() }
                                            ],
                                            { cancelable: false }
                                        )
                                    }
                                >
                                    <Text className="text-center text-red-500 underline" style={{ fontFamily: "Montserrat-Bold" }}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View className="flex flex-row items-center justify-center">
                                <TouchableOpacity 
                                    disabled={categoryName === ""}
                                    className="mt-8 p-4 w-80 bg-gray-300 rounded-md"
                                    style={{ backgroundColor: theme.primary, opacity: categoryName === "" ? 0.5 : 1 }}
                                    onPress={createCategory}
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

export default BudgetCategoryModal