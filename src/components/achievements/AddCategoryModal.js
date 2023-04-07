import { View, Text, KeyboardAvoidingView, TouchableOpacity, SafeAreaView, TextInput, FlatList } from 'react-native'
import React, { useContext, useState } from 'react'
import ThemeContext from '../../context/ThemeContext'
import { UserContext } from '../../context/UserContext'
import { Ionicons } from '@expo/vector-icons'
import { firebase } from '../../config/firebase'

const AddCategoryModal = ({ closeModal }) => {
    const [user, setUser] = useContext(UserContext)
    const theme = useContext(ThemeContext)

    const goalsCategoriesRef = firebase.firestore().collection("users").doc(user.uid).collection('goalsCategories')

    const [categoryName, setCategoryName] = useState("")

    const backgroundColors = [
        "#9b5fe0",
        "#16a4d8",
        "#60dbe8",
        "#8bd346",
        "#efdf48",
        "#f9a52c",
        "#d64e12",
    ]

    const [categoryColor, setCategoryColor] = useState(backgroundColors[0])

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

    const [categoryIcon, setCategoryIcon] = useState(iconNames[0])

    const createCategory = () => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp()
        const data = {
            name: categoryName,
            color: categoryColor,
            icon: categoryIcon,
            userId: user.uid,
            createdAt: timestamp,
        }
        goalsCategoriesRef
            .add(data)
            .then(_doc => {
                setCategoryName("")
                closeModal()
            })
            .catch((error) => {
                alert(error)
            })
    }

    const renderColors = () => {
        return backgroundColors.map(color => {
            return (
                <TouchableOpacity
                    key={color}
                    style={{ backgroundColor: color }}
                    onPress={() => setCategoryColor(color)}
                    className="w-8 h-8 rounded-md m-2 flex items-center justify-center"
                >
                    {categoryColor === color && (
                        <Ionicons name="checkmark" size={24} color="#fff" />
                    )}
                </TouchableOpacity>
            )
        })
    }

    const renderIcons = (icon) => {
        return (
            <TouchableOpacity
                key={icon}
                onPress={() => setCategoryIcon(icon)}
                className="w-12 h-12 rounded-md m-2 flex items-center justify-center"
                style={{ backgroundColor: theme.primary, opacity: categoryIcon === icon ? 0.5 : 1 }}
            >
                <Ionicons name={icon} size={24} color="#fff" />

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
                    <Text className="ml-4 text-lg" style={{ fontFamily: "Montserrat-Medium" }}>Category Name</Text>

                    <View
                        className="w-80 bg-gray-300 mt-2"
                        style={{ height: 2, backgroundColor: theme.primary }}
                    />

                    <View className="flex flex-row items-center justify-center">
                        <TextInput 
                            className="mt-4 w-80 h-12 rounded-md border-2 border-gray-300 pb-2 text-lg text-center" 
                            placeholder="Ex: Household"
                            style={{ color: theme.text, fontFamily: "Montserrat-Regular" }} 
                            value={categoryName} 
                            onChangeText={text => setCategoryName(text)}
                        />
                    </View>

                    <Text className="mt-8 ml-4 text-lg" style={{ fontFamily: "Montserrat-Medium" }}>Select Color</Text>

                    <View 
                        className="w-80 bg-gray-300 mt-2" 
                        style={{ height: 2, backgroundColor: theme.primary }}
                    />

                    <View className="flex flex-row items-center justify-center mt-2">
                        {renderColors()}
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
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default AddCategoryModal