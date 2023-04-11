import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useContext } from 'react'
import { getToday } from 'react-native-modern-datepicker'

import ThemeContext from '../../../context/ThemeContext'
import { PopularArticles, LatestArticles, Filter } from '../../../components'

const EducationalScreen = () => {
    const theme = useContext(ThemeContext)

    return (
        <SafeAreaView 
            className="flex-1"
            style={{ backgroundColor: theme.background }}
        >
            <View className="mt-4 pb-2 px-6 flex flex-row items-center justify-between">
                <View>
                    <Text className="text-2xl font-bold" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>Financial 
                        <Text className="text-2xl font-bold" style={{ color: theme.primary, fontFamily: "Montserrat-Regular" }}> Education</Text>
                    </Text>

                    <Text className="text-xs font-bold" style={{ color: theme.text, fontFamily: "Montserrat-Light" }}>{getToday()}</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex px-6">
                    <Filter />

                    {/* <PopularArticles />

                    <LatestArticles /> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EducationalScreen