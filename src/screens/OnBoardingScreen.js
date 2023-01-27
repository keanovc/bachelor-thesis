import { View, FlatList, Animated, Text, SafeAreaView } from 'react-native'
import React, { useState, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'

import slides from '../../slides'
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
        if (currentIndex < slides.length - 1) {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 })
        } else {
            try {
                AsyncStorage.setItem('@viewedOnBoarding', 'true')
                navigation.navigate('Home')
            } catch (e) {
                console.log(e)
            }
        }
    }

    return (
        <View className="flex-1 items-center justify-center py-16 bg-white">
            <View className="flex-[3]">
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
            </View> 

            <Paginator data={slides} scrollX={scrollX} />

            <NextButton scrollTo={scrollTo} percentage={(currentIndex + 1) * (100 / slides.length)} />
        </View>
    )
}

export default OnBoardingScreen