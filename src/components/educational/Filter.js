import { View, Text, TextInput, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useContext } from 'react'
import Emoji from 'react-native-emoji'

import ThemeContext from '../../context/ThemeContext'

const Filter = ({
    name,
    icon,
    search,
    selectedCategory,
    setSelectedCategory,
}) => {
    const theme = useContext(ThemeContext)

    return (
        <TouchableOpacity
            onPress={() => {
                setSelectedCategory(search)
            }}
            className="px-5 py-3 rounded-full mr-2 shadow-sm flex flex-row items-center justify-center"
            style={{ backgroundColor: selectedCategory === search ? theme.primary : theme.accent, }}
        >
            <Emoji name={icon} style={{ fontSize: 16 }} />
            <Text className="ml-1" style={{ color: selectedCategory === search ? "white" : theme.text, fontFamily: selectedCategory === search ? "Montserrat-Bold" : "Montserrat-Light", fontSize: 12 }}>{name}</Text>
        </TouchableOpacity>
    )
}

export default Filter