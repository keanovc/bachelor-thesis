import { View, Text } from 'react-native'
import React from 'react'

const BudgetScreen = ({ route }) => {
    const category = route.params.item

    return (
        <View>
            <Text>BudgetScreen</Text>
        </View>
    )
}

export default BudgetScreen