import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import ThemeContext from '../../../context/ThemeContext'

const BudgetScreen = () => {
    const theme = useContext(ThemeContext)

    return (
        <View
            className="flex-1 items-center justify-center"
            style={{ backgroundColor: theme.background }}
        >
            <Text 
                className="text-2xl font-bold"
                style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}
            >
                Budget Screen
            </Text>
        </View>
    )
}

export default BudgetScreen