import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useContext } from 'react'
import { checkImageUrl } from '../../utils/checkImageUrl'

const PopularArticleCard = ({ selectedArticle, item, handleCardPress }) => {
    return (
        <TouchableOpacity
            className="flex flex-col items-center justify-center rounded-2xl shadow-sm w-[200px] h-56 m-2 bg-white"
            onPress={() => handleCardPress(item)}
        >
            <View className="flex flex-col items-center justify-center w-full h-full">
                <View className="flex flex-col items-center justify-center">
                    <Image
                        source={{ uri: checkImageUrl(item.image_url) ? item.image_url : "https://images.unsplash.com/photo-1607827448387-a67db1383b59?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" }}
                        className="w-44 h-24 rounded-2xl"
                    />

                    <View className="flex flex-col items-start justify-center ml-2">
                        <Text className="text-sm font-bold pt-3 pb-1" style={{ fontFamily: "Montserrat-Bold" }}>
                            { item.title.length > 30 ? item.title.substring(0, 30) + "..." : item.title }  
                        </Text>

                        <Text className="text-xs pb-4 text-gray-500" style={{ fontFamily: "Montserrat-Light" }}>
                            { item.subtitle.length > 30 ? item.subtitle.substring(0, 30) + "..." : item.subtitle }
                        </Text>

                        <Text className="text-xs text-gray-300" style={{ fontFamily: "Montserrat-Medium" }}>{item.published_at}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default PopularArticleCard