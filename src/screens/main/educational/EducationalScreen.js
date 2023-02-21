import { View, Text, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'

import ThemeContext from '../../../context/ThemeContext'
import env from '../../../config/env'
import ArticleItem from '../../../components/educational/ArticleItem'

const EducationalScreen = () => {
    const theme = useContext(ThemeContext)
    const [article, setArticle] = useState([])
    const [loading, setLoading] = useState(false)

    const API_KEY = "env.RAPID_API_KEY"

    const getLatestArticleIds = async () => {
        setLoading(true)

        const options = {
            method: 'GET',
            url: 'https://medium2.p.rapidapi.com/latestposts/blockchain',
            params: {limit: '10'},
            headers: {
              'X-RapidAPI-Key': API_KEY,
              'X-RapidAPI-Host': 'medium2.p.rapidapi.com'
            }
        };

        axios.request(options).then(function (response) {
            console.log(response.data);
            setArticle(response.data)
            setLoading(false)
        }).catch(function (error) {
            console.error(error);
        });
    }

    return (
        <SafeAreaView className="flex-1"
            style={{ backgroundColor: theme.background }}
        >
            <ScrollView className="flex-1 px-6">
                <View className="my-4">
                    <Text className="text-3xl font-bold" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>Learn Finance</Text>
                </View>

                <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Text>
                
                {
                    loading ? (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator size="large" color="#4D7A80" />
                        </View>
                    ) : (
                        // articles?.map((article, index) => (
                        //     <ArticleItem 
                        //         key={index} 
                        //         title={article.Title}
                        //     />
                        // ))

                        <Text>Test</Text>
                    )
                }
            </ScrollView>
        </SafeAreaView>
    )
}

export default EducationalScreen