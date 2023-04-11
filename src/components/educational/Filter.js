import { View, Text, TextInput, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useState, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import Emoji from 'react-native-emoji'

import ThemeContext from '../../context/ThemeContext'

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
                <FlatList 
                    data={categories}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedCategory(item)
                                navigation.navigate("EducationalSearch", { category: item })
                            }}
                            className="px-4 py-2 rounded-full mr-2 shadow-sm flex flex-row items-center justify-center"
                            style={{ backgroundColor: selectedCategory === item ? theme.primary : theme.accent, }}
                        >
                            <Emoji name="moneybag" style={{ fontSize: 16 }} />
                            <Text className="ml-1" style={{ color: selectedCategory === item ? "white" : theme.text, fontFamily: selectedCategory === item ? "Montserrat-Bold" : "Montserrat-Light", fontSize: 12 }}>{item}</Text>
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