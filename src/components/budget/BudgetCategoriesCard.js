import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React, { useContext, useState } from 'react'
import Emoji from 'react-native-emoji';
import { useNavigation } from '@react-navigation/native'
import ThemeContext from '../../context/ThemeContext'
import BudgetCategoryModal from './BudgetCategoryModal';

const BudgetCategoriesCard = ({ category, date, edit }) => {
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()

    const [editVisible, setEditVisible] = useState(false)

    return (
        <TouchableOpacity 
            className="rounded-lg m-2 shadow-sm flex flex-row items-center justify-center p-3"
            style={
                edit ? 
                    { 
                        opacity: 0.5, 
                        backgroundColor: "lightgray",
                        width: 120,
                        height: 120,
                    } 
                : 
                    {
                        width: 120,
                        height: 120,
                        backgroundColor: category.color,
                    }
            }
            onPress={
                edit ?
                    () => setEditVisible(!editVisible)
                :
                    () => navigation.navigate('Budget', { category, date: date })
            }
            onLongPress={() => setEditVisible(!editVisible)}
        >
            {
                edit &&
                    <View 
                        className="flex flex-row items-center justify-center py-2 px-6 rounded-full absolute z-10"
                        style={{ backgroundColor: theme.primary }}
                    >
                        <Text className="text-xs text-white" style={{ fontFamily: "Montserrat-Bold" }}>
                            Edit
                        </Text>
                    </View>
            }

            <Modal animationType="slide" visible={editVisible}>
                <BudgetCategoryModal closeModal={() => setEditVisible(false)} category={category}  />
            </Modal>
            
            <View className="flex flex-col items-center">
                <Emoji name={category.icon} style={{ fontSize: 30 }} />
                <Text className="text-base text-white pt-1" style={{ fontFamily: "Montserrat-Regular" }}>{category.name}</Text>
                {/* <Text className="text-base text-white" style={{ fontFamily: "Montserrat-Bold" }}>$ 0</Text> */}
            </View>
        </TouchableOpacity>
    )
}

export default BudgetCategoriesCard