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
                </Text>
            </View>

            <Markdown
                markdownStyles={{
                    h1: {
                        fontFamily: "Montserrat-SemiBold",
                        fontSize: 20,
                        color: theme.text,
                        marginVertical: 10
                    },
                    h2: {
                        fontFamily: "Montserrat-SemiBold",
                        fontSize: 18,
                        color: theme.text,
                        marginVertical: 10
                    },
                    h3: {
                        fontFamily: "Montserrat-SemiBold",
                        fontSize: 16,
                        color: theme.text,
                        marginVertical: 10
                    },
                    h4: {
                        fontFamily: "Montserrat-SemiBold",
                        fontSize: 14,
                        color: theme.text,
                        marginVertical: 10
                    },
                    h5: {
                        fontFamily: "Montserrat-SemiBold",
                        fontSize: 12,
                        color: theme.text,
                        marginVertical: 10
                    },
                    h6: {
                        fontFamily: "Montserrat-SemiBold",
                        fontSize: 10,
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
                    list: {
                        fontFamily: "Montserrat-Regular",
                        fontSize: 14,
                        color: theme.text
                    },
                    listItem: {
                        fontFamily: "Montserrat-Regular",
                        fontSize: 14,
                        color: theme.text,
                        marginVertical: 5
                    },
                    listItemContent: {
                        fontFamily: "Montserrat-Regular",
                        fontSize: 14,
                        color: theme.text,
                        marginVertical: 5
                    },
                    listItemNumber: {
                        fontFamily: "Montserrat-Bold",
                        fontSize: 14,
                        color: theme.text,
                        marginVertical: 5
                    },
                    listItemBullet: {
                        fontFamily: "Montserrat-Bold",
                        fontSize: 14,
                        color: theme.text,
                        marginVertical: 5
                    },
                    u: {
                        fontFamily: "Montserrat-Regular",
                        fontSize: 14,
                        color: theme.text,
                        textDecorationLine: "underline"
                    },
                    strong: {
                        fontFamily: "Montserrat-Bold",
                        fontSize: 14,
                        color: theme.text
                    },
                    em: {
                        fontFamily: "Montserrat-Italic",
                        fontSize: 14,
                        color: theme.text
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