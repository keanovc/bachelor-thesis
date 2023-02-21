import { View, Text, Image, useWindowDimensions } from 'react-native'
import React from 'react'

const OnBoardingItem = ({ item }) => {
    const { width } = useWindowDimensions()

    return (
        <View className="flex-1 items-center justify-center space-y-10 pt-10" style={{ width }} >
            <Image
                source={item.image}
                className="flex-[0.7]"
                style={{
                    width,
                    resizeMode: 'contain'
                }}
            />

            <View className="flex-[0.3] pb-10">
                <Text className="text-2xl mb-2 text-[#4D7A80] text-center px-6" style={{ fontFamily: "Montserrat-Bold" }}>{item.title}</Text>
                <Text className="text-xs text-gray-400 text-center px-16" style={{ fontFamily: "Montserrat-Medium" }}>{item.description}</Text>
            </View>
        </View>
    )
}

export default OnBoardingItem