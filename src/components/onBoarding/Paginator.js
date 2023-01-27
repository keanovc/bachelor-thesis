import { View, Animated, useWindowDimensions } from 'react-native'
import React from 'react'

const Paginator = ({ data, scrollX }) => {
    const { width } = useWindowDimensions()

    return (
        <View className="flex-1 flex-row h-64 items-center justify-center">
            {data.map((_, i) => {
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
                            className="h-3 rounded-full bg-indigo-500 mx-3"
                            style={{
                                width: dotWidth,
                                opacity
                            }}
                        />
            })}
        </View>
    )
}

export default Paginator