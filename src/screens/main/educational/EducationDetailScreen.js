import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import * as Linking from 'expo-linking';

import ThemeContext from '../../../context/ThemeContext'
import useFetch from '../../../hooks/useFetch'
import { ArticleDetails, IconButton } from '../../../components'

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
                <IconButton
                    onPress={() => navigation.goBack()}
                    icon="chevron-back-outline"
                />
                
                <Text className="text-lg uppercase" style={{ color: theme.text, fontFamily: "Montserrat-Medium" }}>
                    {article.tags[0]}
                </Text>

                <IconButton
                    onPress={() => Linking.openURL(article.url)}
                    icon="open-outline"
                />
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