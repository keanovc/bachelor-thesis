import { View, FlatList, Animated, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useState, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

import slides from '../data/Slides'
import OnBoardingItem from '../components/onBoarding/OnBoardingItem'
import Paginator from '../components/onBoarding/Paginator'
import NextButton from '../components/onBoarding/NextButton'

const OnBoardingScreen = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const scrollX = useRef(new Animated.Value(0)).current
    const slidesRef = useRef(null)
    const navigation = useNavigation()

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
                navigation.navigate('Auth')
            } catch (e) {
                console.log(e)
            }
        }
    }

    const skip = () => {
        navigation.navigate('Auth')
        AsyncStorage.setItem('@viewedOnBoarding', 'true')
    }

    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-white">
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

            <Paginator data={slides} scrollX={scrollX} />

            <View className="flex-[0.5] items-center justify-center">
                {currentIndex === slides.length - 1 ? (
                    <TouchableOpacity
                        className="flex-row items-center justify-center bg-[#4D7A80] rounded-lg px-20 py-3 space-x-2"
                        onPress={scrollTo}
                    >
                        <Text className="text-white text-lg font-bold" >Get Started</Text>
                        <Ionicons name="arrow-forward" size={24} color="white" />
                    </TouchableOpacity>
                ) : (
                    <View className="flex-row items-center justify-center space-x-10">
                        <TouchableOpacity
                            className="flex-row items-center justify-center bg-white rounded-full px-8 py-3"
                            onPress={skip}
                        >
                            <Text className="text-[#4D7A80] text-lg font-bold" >Skip</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center justify-center bg-[#4D7A80] rounded-lg px-8 py-3 space-x-2"
                            onPress={scrollTo}
                        >
                            <Text className="text-white text-lg font-bold" >Next</Text>
                            <Ionicons name="arrow-forward" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}

export default OnBoardingScreen