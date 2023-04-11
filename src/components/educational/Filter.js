import { View, Text, TextInput, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useState, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

import ThemeContext from '../../context/ThemeContext'
import { icons } from '../../constants'

const categories = [
    "Investing",
    "Trading",
    "Cryptocurrency",
    "Stocks",
    "Bonds",
]

const Filter = () => {
    const navigation = useNavigation()
    const theme = useContext(ThemeContext)

    const [selectedCategory, setSelectedCategory] = useState("Investing")

    return (
        <View className="flex flex-col">
            <View className="flex flex-row items-center justify-center">
                <TextInput
                    value=""
                    onChange={() => {}}
                    placeholder="What are you looking for?"
                    placeholderTextColor="lightgray"
                    style={{
                        backgroundColor: theme.accent,
                        color: theme.text,
                        fontFamily: "Montserrat-Medium",
                        fontSize: 12,
                    }}
                    className="w-10/12 h-10 px-4 rounded-lg"
                />

                <TouchableOpacity
                    onPress={() => {}}
                    className="ml-4 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                        backgroundColor: theme.primary,
                    }}
                >
                    <Ionicons name="ios-search" size={18} color="#fff" />
                </TouchableOpacity>
            </View>

            <View className="flex flex-row items-center justify-center">
                <FlatList 
                    data={categories}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedCategory(item)
                                navigation.navigate("EducationalSearch", { category: item })
                            }}
                            className="px-4 py-2 rounded-full mr-2 shadow-sm"
                            style={{ backgroundColor: selectedCategory === item ? theme.primary : theme.accent, }}
                        >
                            <Text style={{ color: selectedCategory === item ? "#fff" : "lightgray", fontFamily: "Montserrat-Medium", fontSize: 12 }}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="py-4"
                />
            </View>
        </View>
    )
}

export default Filter