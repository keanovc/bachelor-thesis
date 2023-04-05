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

    const getLatestArticles = async () => {
        setLoading(true)

        const options = {
            method: 'GET',
            url: 'https://medium2.p.rapidapi.com/latestposts/blockchain',
            headers: {
              'X-RapidAPI-Key': API_KEY,
              'X-RapidAPI-Host': 'medium2.p.rapidapi.com'
            }
        };

        axios.request(options).then(function (response) {
            const articleIds = response.data.latestposts.slice(0, 5)
            getArticleDetails(articleIds)
        }).catch(function (error) {
            console.error(error);
        });
    }

    useEffect(() => {
        getLatestArticles()
    }, [])

    const getArticleDetails = async (articleIds) => {
        const articlePromises = articleIds.map(async (articleId) => {
            const options = {
                method: 'GET',
                url: 'https://medium2.p.rapidapi.com/article/' + articleId,
                headers: {
                  'X-RapidAPI-Key': API_KEY,
                  'X-RapidAPI-Host': 'medium2.p.rapidapi.com'
                }
            };

            const article = await axios.request(options)
            return article.data
        })

        const articles = await Promise.all(articlePromises)
        setArticle(articles)
        console.log(articles)
        setLoading(false)
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
                        article.map((article, index) => (
                            <ArticleItem 
                                key={index}
                                title={article.title}
                            />
                        ))
                    )
                }
            </ScrollView>
        </SafeAreaView>
    )
}

export default EducationalScreen