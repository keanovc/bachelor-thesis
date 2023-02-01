import { View, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import Svg, { G, Circle } from 'react-native-svg'
import { AntDesign } from '@expo/vector-icons'

const NextButton = ({ percentage, scrollTo }) => {
    const size = 128
    const strokeWidth = 2
    const center = size / 2
    const radius = size / 2 - strokeWidth / 2
    const circumference = 2 * Math.PI * radius

    const progressAnimation = useRef(new Animated.Value(0)).current
    const progressRef = useRef(null)

    const animation = (toValue) => {
        return Animated.timing(progressAnimation, {
            toValue,
            duration: 250,
            useNativeDriver: true
        }).start()
    }

    useEffect(() => {
        animation(percentage)
    }, [percentage])

    useEffect(() => {
        progressAnimation.addListener((value) => {
            const strokeDashoffset = circumference - (circumference * value.value) / 100
            if (progressRef?.current) {
                progressRef.current.setNativeProps({
                    strokeDashoffset
                })
            }
        }, [percentage])

        return () => {
            progressAnimation.removeAllListeners()
        }
    }, [])

    return (
        <View className="flex-1 items-center justify-center">
            <Svg width={size} height={size} >
                <G rotation="-90" origin={center}>
                    <Circle stroke="#e2e8f0" cx={center} cy={center} r={radius} strokeWidth={strokeWidth} />
                    <Circle ref={progressRef} stroke="#4D7A80" cx={center} cy={center} r={radius} strokeWidth={strokeWidth} strokeDasharray={circumference} />
                </G>
            </Svg>

            <TouchableOpacity onPress={scrollTo} className="absolute bg-[#4D7A80] rounded-full p-6" activeOpacity={0.6}>
                <AntDesign name="arrowright" size={32} color="white" />
            </TouchableOpacity>
        </View>
    )
}

export default NextButton