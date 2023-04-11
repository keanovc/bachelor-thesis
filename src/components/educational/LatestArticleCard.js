import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'

import ThemeContext from '../../context/ThemeContext'
import { checkImageUrl } from '../../utils/checkImageUrl'

const LatestArticleCard = ({ article }) => {
    const navigation = useNavigation()
    const theme = useContext(ThemeContext)

    return (
        <TouchableOpacity
            className="flex flex-col items-center justify-center rounded-2xl shadow-sm w-full h-24 m-2"
            style={{ backgroundColor: theme.accent }}
            onPress={() => navigation.navigate("EducationDetail", { article: article })}
        >
            <View className="flex flex-row items-center justify-start w-full h-full">
                <View className="flex flex-row items-center justify-start">
                    <Image
                        source={{ uri: checkImageUrl(article.image_url) ? article.image_url : "https://images.unsplash.com/photo-1607827448387-a67db1383b59?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" }}
                        className="w-24 h-20 rounded-2xl ml-2"
                    />

                    <View className="flex flex-col items-start justify-start px-6">
                        <Text className="text-xs text-gray-300" style={{ color: theme.primary, fontFamily: "Montserrat-Medium" }}>{article.published_at}</Text>
                    
                        <Text className="text-sm font-bold pt-2 pb-1" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>
                            { article.title.length > 20 ? article.title.substring(0, 20) + "..." : article.title }  
                        </Text>

                        <Text className="text-xs text-gray-500" style={{ color: theme.text, fontFamily: "Montserrat-Light" }}>
                            { article.subtitle.length > 30 ? article.subtitle.substring(0, 30) + "..." : article.subtitle }
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default LatestArticleCard