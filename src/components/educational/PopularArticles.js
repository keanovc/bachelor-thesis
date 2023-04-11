import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

import ThemeContext from '../../context/ThemeContext'
import useFetch from '../../hooks/useFetch'
import env from "../../config/env";
import PopularArticleCard from './PopularArticleCard'

const rapidApiKey = env.RAPID_API_KEY

const PopularArticles = () => {
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()
    
    const [dataIds, setDataIds] = useState([])
    const [data, setData] = useState([])

    const headers = {
        "x-rapidapi-key": rapidApiKey,
        "x-rapidapi-host": "medium2.p.rapidapi.com"
    };

    const { data: dataAll, isLoading, error } = useFetch("topfeeds/data-science/hot", 
    {
        count: 1,
        after: 0,
    });

    useEffect(() => {
        if (dataAll) {
            setDataIds(dataAll.topfeeds)
        }
    }, [dataAll])

    const getArticlesInfo = async () => {
        const baseUrl = `https://medium2.p.rapidapi.com/`;
        const endpoint = `article/`;

        const promises = dataIds.map((id) => 
            fetch(baseUrl + endpoint + id, { headers }).then(response => response.json()) 
        );

        const articles = await Promise.all(promises);
        setData(articles);
    }

    useEffect(() => {
        getArticlesInfo();
    }, [dataIds])

    return (
        <View className="mt-2">
            <View className="flex flex-row items-center justify-between">
                <Text className="text-lg" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>Popular Articles</Text>
            </View>

            <View className="flex flex-row items-center justify-center mt-2 mb-6">
                {
                    isLoading ? (
                        <ActivityIndicator size="large" color={theme.primary} />
                    ) : error ? (
                        <Text>Something went wrong</Text>
                    ) : (
                        <FlatList 
                            data={data}
                            renderItem={({ item }) => (
                                <PopularArticleCard item={item} />
                            )}
                            keyExtractor={item => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    )
                }
            </View>
        </View>
    )
}

export default PopularArticles