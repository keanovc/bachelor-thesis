import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'

import ThemeContext from '../../context/ThemeContext'
import { checkImageUrl } from '../../utils/checkImageUrl'

const PopularArticleCard = ({ item }) => {
    const navigation = useNavigation()
    const theme = useContext(ThemeContext)
    
    return (
        <TouchableOpacity
            className="flex flex-col items-center justify-center rounded-2xl shadow-sm w-[200px] h-60 m-2"
            onPress={() => navigation.navigate("EducationDetail", { article: item })}
            style={{ backgroundColor: theme.accent }}
        >
            <View className="flex flex-col w-full h-full justify-between">
                <View className="py-2">
                    <View className="items-center">
                        <Image
                            source={{ uri: checkImageUrl(item.image_url) ? item.image_url : "https://images.unsplash.com/photo-1607827448387-a67db1383b59?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" }}
                            className="w-44 h-24 rounded-2xl"
                        />
                    </View>

                    <View className="flex flex-col items-start justify-center mx-2 px-2">
                        <Text className="text-sm font-bold pt-3 pb-1" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>
                            { item.title.length > 30 ? item.title.substring(0, 30) + "..." : item.title }  
                        </Text>

                        <Text className="text-xs pb-2 text-gray-500" style={{ color: theme.text, fontFamily: "Montserrat-Light" }}>
                            { item.subtitle.length > 50 ? item.subtitle.substring(0, 50) + "..." : item.subtitle }
                        </Text>
                    </View>
                </View>

                <Text className="text-xs text-gray-300 ml-2 pb-4 px-2" style={{ color: theme.primary, fontFamily: "Montserrat-Medium" }}>{item.published_at}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default PopularArticleCard