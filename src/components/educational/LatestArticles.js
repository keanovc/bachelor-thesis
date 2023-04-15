import { View, Text, ActivityIndicator } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'

import ThemeContext from '../../context/ThemeContext'
import useFetch from '../../hooks/useFetch'
import env from "../../config/env";
import LatestArticleCard from './LatestArticleCard'

const rapidApiKey = env.RAPID_API_KEY

const LatestArticles = ({
    selectedCategory
}) => {
    const theme = useContext(ThemeContext)
    
    const [dataIds, setDataIds] = useState([])
    const [data, setData] = useState([])

    const headers = {
        "x-rapidapi-key": rapidApiKey,
        "x-rapidapi-host": "medium2.p.rapidapi.com"
    };

    const { data: dataAll, isLoading, error, refetch } = useFetch(`topfeeds/${selectedCategory}/new`, 
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

        // const promises = dataIds.map((id) => 
        //     fetch(baseUrl + endpoint + id, { headers }).then(response => response.json()) 
        // );

        const promises = dataIds.map(async (id) => {
            const response = await fetch(baseUrl + endpoint + id, {
                method: "GET",
                headers: headers,
            });
            const data = await response.json();
            return data;
        });

        const articles = await Promise.all(promises);
        setData(articles);
    }

    useEffect(() => {
        getArticlesInfo();
    }, [dataIds])

    useEffect(() => {
        refetch()
    }, [selectedCategory])

    return (
        <View className="mt-2">
            <View className="flex flex-row items-center justify-between">
                <Text className="text-lg font-bold" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>Latest Articles</Text>
            </View>

            <View className="flex flex-col items-center justify-center mt-2 mb-6 px-2">
                {
                    isLoading ? (
                        <ActivityIndicator size="large" color={theme.primary} />
                    ) : error ? (
                        <Text>Something went wrong</Text>
                    ) : (
                        data?.map((article) => (
                            <LatestArticleCard key={article.id} article={article} />
                        ))
                    )
                }
            </View>
        </View>
    )
}

export default LatestArticles