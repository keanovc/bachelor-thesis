import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import ThemeContext from '../../context/ThemeContext'

const ArticleItem = ({ title }) => {
    const theme = useContext(ThemeContext)

    return (
        <TouchableOpacity className="flex-row items-center justify-between px-2 py-4 border-b border-gray-300">
            <View className="flex-row items-center">
                <View className="ml-4">
                    <Text className="text-lg font-bold"
                        style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}
                    >
                        {title}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ArticleItem