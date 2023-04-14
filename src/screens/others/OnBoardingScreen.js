import { View, FlatList, Animated, Text, TouchableOpacity, SafeAreaView, useWindowDimensions } from 'react-native'
import React, { useState, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

import slides from '../../data/Slides'
import OnBoardingItem from '../../components/onBoarding/OnBoardingItem'

const OnBoardingScreen = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const scrollX = useRef(new Animated.Value(0)).current
    const slidesRef = useRef(null)
    const navigation = useNavigation()
    const { width } = useWindowDimensions()

    const viewableItemsChanged = useRef(({ viewableItems }) => {
        setCurrentIndex(viewableItems[0].index)
    }).current

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current

    const scrollTo = () => {
        if (currentIndex < slides.length - 1 ) {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 })
        } else {
            try {
                AsyncStorage.setItem('@viewedOnBoarding', 'true')
            } catch (e) {
                console.log(e)
            }
            navigation.navigate('Auth')
        }
    }

    const skip = () => {
        AsyncStorage.setItem('@viewedOnBoarding', 'true')
        navigation.navigate('Auth')
    }

    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F5F8FE]">
            <FlatList 
                data={slides}
                renderItem={({item}) => <OnBoardingItem item={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false} 
                keyExtractor={item => item.id}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={32}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                ref={slidesRef}
            />

            <View className="flex-row items-center justify-center">
                {slides.map((_, i) => {
                    const inputRange = [(i - 1) * width, i * width, (i + 1) * width]

                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [10, 20, 10],
                        extrapolate: 'clamp'
                    })

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp'
                    })

                    return <Animated.View 
                                key={i}
                                className="h-3 rounded-full bg-[#4D7A80] mx-3"
                                style={{
                                    width: dotWidth,
                                    opacity
                                }}
                            />
                })}
            </View>

            <View className="flex-[0.5] items-center justify-center">
                {currentIndex === slides.length - 1 ? (
                    <TouchableOpacity
                        className="flex-row items-center justify-center bg-[#4D7A80] rounded-lg px-20 py-3 space-x-2"
                        onPress={scrollTo}
                    >
                        <Text className="text-white text-lg" style={{ fontFamily: "Montserrat-SemiBold" }}>Get Started</Text>
                        <Ionicons name="arrow-forward" size={24} color="white" />
                    </TouchableOpacity>
                ) : (
                    <View className="flex-row items-center justify-center space-x-10">
                        <TouchableOpacity
                            className="flex-row items-center justify-center bg-white rounded-full px-8 py-3"
                            onPress={skip}
                        >
                            <Text className="text-[#4D7A80] text-lg" style={{ fontFamily: "Montserrat-SemiBold" }}>Skip</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center justify-center bg-[#4D7A80] rounded-lg px-8 py-3 space-x-2"
                            onPress={scrollTo}
                        >
                            <Text className="text-white text-lg" style={{ fontFamily: "Montserrat-SemiBold" }}>Next</Text>
                            <Ionicons name="arrow-forward" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}

export default OnBoardingScreen