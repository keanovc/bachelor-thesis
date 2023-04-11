import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { getToday } from 'react-native-modern-datepicker'

import ThemeContext from '../../../context/ThemeContext'
import { icons } from '../../../constants'
import { PopularArticles, LatestArticles } from '../../../components'
import Filter from '../../../components/educational/Filter'

const EducationalScreen = () => {
    const navigation = useNavigation()
    const theme = React.useContext(ThemeContext)

    return (
        <SafeAreaView 
            className="flex-1"
            style={{ backgroundColor: theme.background }}
        >
            <View className="my-4 px-6 flex flex-row items-center justify-between">
                <View>
                    <Text className="text-2xl font-bold" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>Financial 
                        <Text className="text-2xl font-bold" style={{ color: theme.primary, fontFamily: "Montserrat-Regular" }}> Education</Text>
                    </Text>

                    <Text className="text-xs font-bold" style={{ color: theme.primary, fontFamily: "Montserrat-Light" }}>{getToday()}</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex px-6">
                    <Filter />

                    <PopularArticles />

                    <LatestArticles />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EducationalScreen