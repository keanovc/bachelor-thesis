import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useContext } from 'react'
import { checkImageUrl } from '../../utils/checkImageUrl'
import { useNavigation } from '@react-navigation/native'

const PopularArticleCard = ({ item }) => {
    const navigation = useNavigation()
    
    return (
        <TouchableOpacity
            className="flex flex-col items-center justify-center rounded-2xl shadow-sm w-[200px] h-60 m-2 bg-white"
            onPress={() => navigation.navigate("EducationDetail", { article: item })}
        >
            <View className="flex flex-col w-full h-full justify-between">
                <View className="py-2">
                    <View className="items-center">
                        <Image
                            source={{ uri: checkImageUrl(item.image_url) ? item.image_url : "https://images.unsplash.com/photo-1607827448387-a67db1383b59?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" }}
                            className="w-44 h-24 rounded-2xl"
                        />
                    </View>

                    <View className="flex flex-col items-start justify-center mx-2">
                        <Text className="text-sm font-bold pt-3 pb-1" style={{ fontFamily: "Montserrat-Bold" }}>
                            { item.title.length > 30 ? item.title.substring(0, 30) + "..." : item.title }  
                        </Text>

                        <Text className="text-xs pb-2 text-gray-500" style={{ fontFamily: "Montserrat-Light" }}>
                            { item.subtitle.length > 50 ? item.subtitle.substring(0, 50) + "..." : item.subtitle }
                        </Text>
                    </View>
                </View>

                <Text className="text-xs text-gray-300 ml-2 pb-4" style={{ fontFamily: "Montserrat-Medium" }}>{item.published_at}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default PopularArticleCard