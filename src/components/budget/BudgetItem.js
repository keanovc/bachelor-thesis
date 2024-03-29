import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React, { useState, useContext } from 'react'
import { Ionicons } from '@expo/vector-icons'

import ThemeContext from '../../context/ThemeContext'
import BudgetModal from './BudgetModal'
import { setRightCurrency } from '../../utils/setRightCurrency'

const BudgetItem = ({ item, category, loading, edit, date, user }) => {
    const [editVisible, setEditVisible] = useState(false)
    const theme = useContext(ThemeContext)

    const toDateTime = (secs) => {
        var t = new Date(1970, 0, 1);
        t.setSeconds(secs);
        return t;
    }

    return (
        <TouchableOpacity 
            className="py-4 border-b"
            style={{
                borderColor: theme.accent,
            }}
            onPress={
                edit ? () => setEditVisible(!editVisible) : null
            }
            onLongPress={
                category.id !== "goals" ? () => setEditVisible(!editVisible) : null
            }
        >
            <Modal animationType="slide" visible={editVisible}>
                <BudgetModal closeModal={() => setEditVisible(false)} loading={loading} category={category} budget={item} date={date} />
            </Modal>

            <View className="flex flex-row items-center justify-between">
                <View className="flex flex-row items-center">
                    {
                        edit ? (
                            <View
                                className="mr-4 bg-white rounded-full p-2"
                            >
                                <Ionicons name="ios-create" size={16} color={theme.primary} />
                            </View>
                        ) : null
                    }

                    <View className="flex-col">
                        <Text className="text-base" style={{ color:theme.text, fontFamily: "Montserrat-SemiBold" }}>
                            {item.name}
                        </Text>
                        <Text className="text-xs" style={{ color:theme.text, fontFamily: "Montserrat-Light" }}>
                            {toDateTime(item.createdAt.seconds).toDateString()}
                        </Text>
                    </View>
                </View>

                <View className="flex flex-col items-end">
                    <Text 
                        className="text-base"
                        style={{ 
                            fontFamily: "Montserrat-SemiBold",
                            color: category.type == "incomes" ? "#48BB78" : "#F66565",
                        }}
                    >
                        {setRightCurrency(user, item.money)}
                    </Text>

                    <Text className="text-xs" style={{ color:theme.text, fontFamily: "Montserrat-Light" }}>
                        {
                            category.id !== "goals" ? (
                                item.monthly ? "/monthly" : "/once"
                            ) : null
                        }
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default BudgetItem