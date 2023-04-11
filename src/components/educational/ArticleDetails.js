import { View, Text, Image } from 'react-native'
import React, { useContext } from 'react'

import ThemeContext from '../../context/ThemeContext'
import { checkImageUrl } from '../../utils/checkImageUrl'
import Markdown from 'react-native-easy-markdown';

const ArticleDetails = ({ article, content }) => {
    const theme = useContext(ThemeContext)

    return (
        <View className="flex px-8">
            <View className="flex flex-row items-center justify-between mt-4">
                <Text className="text-xs" style={{ color: theme.primary, fontFamily: "Montserrat-Medium" }}>
                    {article.published_at}
                    {/* {
                        article.topics !== {} ? (
                            <Text className="text-xs" style={{ color: "lightgray", fontFamily: "Montserrat-Medium" }}>
                                {
                                    article.topics.map((topic, index) => {
                                        return (
                                            <Text key={index}>
                                                {index === 0 ? " • " : null}
                                                {topic} {index === article.topics.length - 1 ? null : " • "} 
                                            </Text>
                                        )
                                    })
                                }
                            </Text>
                        ) : null
                    }  */}
                </Text>
            </View>

            <Markdown
                markdownStyles={{
                    h1: {
                        fontFamily: "Montserrat-Medium",
                        fontSize: 20,
                        color: theme.text,
                        marginVertical: 10
                    },
                    text: {
                        fontFamily: "Montserrat-Regular",
                        fontSize: 14,
                        color: theme.text
                    },
                    image: {
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                        borderRadius: 10,
                        marginVertical: 10
                    },
                }}
                style={{ 
                    marginBottom: 20,
                }}
            >
                {content.markdown}
            </Markdown>
        </View>
    )
}

export default ArticleDetails