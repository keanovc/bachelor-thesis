import { View, Text, Image, useWindowDimensions } from 'react-native'
import React from 'react'

const OnBoardingItem = ({ item }) => {
    const { width } = useWindowDimensions()

    return (
        <View className="flex-1 items-center justify-center" style={{ width }} >
            <Image
                source={item.image}
                className="justify-center flex-[0.7]"
                style={{
                    width,
                    resizeMode: 'contain'
                }}
            />

            <View className="flex-[0.3]" >
                <Text className="text-2xl font-extrabold mb-2 text-indigo-500 text-center" >{item.title}</Text>
                <Text className="text-xs text-gray-500 text-center px-16" >{item.description}</Text>
            </View>
        </View>
    )
}

export default OnBoardingItem