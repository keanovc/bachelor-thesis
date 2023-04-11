import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, Image } from 'react-native'
import React, { useContext, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { getToday } from 'react-native-modern-datepicker'
import { Ionicons } from '@expo/vector-icons'
import * as Linking from 'expo-linking';

import ThemeContext from '../../../context/ThemeContext'
import { icons } from '../../../constants'
import useFetch from '../../../hooks/useFetch'
import ArticleDetails from '../../../components/educational/ArticleDetails'

const EducationDetailScreen = ({ route }) => {
    const article = route.params.article
    const navigation = useNavigation()
    const theme = useContext(ThemeContext)
    
    const { data, isLoading, error } = useFetch(`article/${article.id}/markdown`, {})

    return (
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: theme.background }}
        >
            <View className="flex-row justify-between items-center px-6 py-2">
                <TouchableOpacity className="bg-white rounded-lg p-2" onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
                
                <Text className="text-lg uppercase" style={{ fontFamily: "Montserrat-Medium" }}>
                    {article.tags[0]}
                </Text>

                <TouchableOpacity 
                    className="bg-white rounded-lg p-2"
                    onPress={() => Linking.openURL(article.url)}
                >
                    <Ionicons name="open-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} >
                {
                    isLoading ? (
                        <ActivityIndicator size="large" color={theme.primary} />
                    ) : error ? (
                        <Text>Something went wrong</Text>
                    ) : data.length === 0 ? (
                        <Text>No data</Text>
                    ) : (
                        <ArticleDetails 
                            article={article}
                            content={data}
                        />
                    )
                }
            </ScrollView>
        </SafeAreaView>
    )
}

export default EducationDetailScreen