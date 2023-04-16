import { View, Text, SafeAreaView, ScrollView, FlatList } from 'react-native'
import React, { useContext, useState } from 'react'
import { getToday } from 'react-native-modern-datepicker'

import ThemeContext from '../../../context/ThemeContext'
import { PopularArticles, LatestArticles, Filter } from '../../../components'

const EducationalScreen = () => {
    const theme = useContext(ThemeContext)

    const filterCategories = [
        {
            name: "Entrepreneurship",
            icon: "new",
            search: "entrepreneurship"
        },
        {
            name: "Self Improvement",
            icon: "star",
            search: "self-improvement"
        },
        {
            name: "Marketing",
            icon: "rocket",
            search: "marketing"
        },
        {
            name: "Work",
            icon: "briefcase",
            search: "work"
        },
        {
            name: "Mental Health",
            icon: "brain",
            search: "mental health"
        },
        {
            name: "Life",
            icon: "heart",
            search: "life"
        },
        {
            name: "Money",
            icon: "moneybag",
            search: "money"
        },
        {
            name: "Education",
            icon: "school",
            search: "education"
        },
    ]
    
    const [selectedCategory, setSelectedCategory] = useState(filterCategories[0].search)

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
                    <View className="flex flex-col">
                        <View className="flex flex-row items-center justify-center">
                            <FlatList
                                data={filterCategories}
                                renderItem={({ item }) => (
                                    <Filter
                                        name={item.name}
                                        icon={item.icon}
                                        search={item.search}
                                        selectedCategory={selectedCategory}
                                        setSelectedCategory={setSelectedCategory}
                                    />
                                )}
                                keyExtractor={item => item.name}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                className="py-4"
                            />
                        </View>
                    </View>

                    <PopularArticles selectedCategory={selectedCategory} />

                    <LatestArticles selectedCategory={selectedCategory} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EducationalScreen