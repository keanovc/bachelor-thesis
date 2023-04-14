import { View, Text, ActivityIndicator, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native'
import React, { useState, useContext } from 'react'
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'

import env from '../../../config/env'
import ThemeContext from '../../../context/ThemeContext'
import { UserContext } from '../../../context/UserContext'
import { IconButton } from '../../../components'

const MessageScreen = () => {
    const API_KEY = env.API_KEY_CHATGPT
    const API_URL = env.API_URL_CHATGPT

    const theme = useContext(ThemeContext)
    const navigation = useNavigation()
    const [user] = useContext(UserContext)

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)

    const handleSend = async (newMessages = []) => {
        try {
            // Get the user's message
            const userMessage = newMessages[0]

            // Add the user's message to the messages state
            setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
            const messageText = userMessage.text.toLowerCase()
            const keywords = ['finance', 'money', 'bank', 'account', 'loan', 'credit', 'debit', 'card', 'transaction', 'transfer', 'withdraw', 'deposit', 'balance', 'check', 'bill', 'payment', 'loan', 'mortgage', 'insurance', 'invest', 'investing', 'investor', 'stock', 'bond', 'mutual fund', '401k', 'retirement', 'retire', 'retirement plan', 'retirement account', 'pension', 'pension plan', 'pension account', 'social security', 'tax', 'taxes', 'tax return', 'tax refund', 'tax preparation', 'tax preparation service', 'tax preparation company', 'tax preparation firm', 'tax preparation office', 'tax preparation business', 'tax preparation agency', 'tax preparation agent', 'tax preparation accountant', 'tax preparation advisor', 'tax preparation consultant', 'tax preparation expert',]
        
            // Check if the user's message contains any of the keywords
            if (!keywords.some(keyword => messageText.includes(keyword))) {
                const botMessage = {
                    _id: new Date().getTime() + 1,
                    text: 'I\'m your Visional Bot. I can answer any questions you have about your finances.',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'Visional Bot',
                    },
                }

                setMessages(previousMessages => GiftedChat.append(previousMessages, botMessage))

                return
            }

            // Send a request to the API
            setLoading(true)
            const response = await axios.post(API_URL, {
                prompt: `Given the following context: ${messageText}`,
                max_tokens: 1200,
                temperature: 0.2,
                n: 1,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                }
            })

            const financeMessage = response.data.choices[0].text.trim()
            const botMessage = {
                _id: new Date().getTime() + 1,
                text: financeMessage,
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'Visional Bot',
                }
            }

            setMessages(previousMessages => GiftedChat.append(previousMessages, botMessage))
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <KeyboardAvoidingView
            className="flex-1"
        >
            <View 
                className="flex-1"
                style={{ backgroundColor: theme.background }}
            >
                <View 
                    className="flex-row items-center justify-between px-5 pt-16 pb-3"
                    style={{
                        backgroundColor: theme.primary,
                    }}
                >
                    <View className="flex-row items-center">
                        <IconButton
                            onPress={() => navigation.goBack()}
                            icon="chevron-back"
                        />

                        <View className="ml-4">
                            <Text className="text-lg" style={{ color: "white", fontFamily: "Montserrat-SemiBold" }}>Visional Bot</Text>

                            <View className="flex-row items-center">
                                <View className="w-2 h-2 rounded-full bg-green-500 ml-1" />
                                <Text className="text-sm ml-2" style={{ color: "white", fontFamily: "Montserrat-Light" }}>Powered by ChatGPT</Text>
                            </View>
                        </View>
                    </View>

                    <Image
                        className="w-10 h-10 rounded-full"
                        source={require('../../../../assets/images/robot-placeholder.png')}
                    />
                </View>

                <GiftedChat
                    messages={messages}
                    user={{ 
                        _id: 1,
                        name: user.fullname,
                        avatar: user.profilePicture,
                    }}
                    placeholder="Type a finance question"
                    isTyping
                    renderFooter={() => {
                        if (loading) {
                            return (
                                <View className="flex-row items-center justify-center py-3">
                                    <ActivityIndicator size="small" color={theme.secondary} />
                                    <Text className="ml-2 text-sm" style={{ color: theme.secondary, fontFamily: "Montserrat-SemiBold" }}>Visional Bot is typing...</Text>
                                </View>
                            )
                        }
                    }}
                    showUserAvatar
                    onSend={newMessages => handleSend(newMessages)}
                    onPressAvatar={() => navigation.navigate('Settings')}
                    renderBubble={(props) => (
                        <Bubble
                            {...props}
                            wrapperStyle={{
                                left: {
                                    backgroundColor: theme.accent,
                                    borderRadius: 15,
                                },
                                right: {
                                    backgroundColor: theme.primary,
                                    borderRadius: 15,
                                }
                            }}
                            textStyle={{
                                left: {
                                    color: theme.text,
                                    fontFamily: "Montserrat-Regular",
                                    fontSize: 14,
                                    lineHeight: 20,
                                },
                                right: {
                                    color: "white",
                                    fontFamily: "Montserrat-Regular",
                                    fontSize: 14,
                                    lineHeight: 20,
                                }
                            }}
                        />
                    )}
                    renderSend={(props) => (
                        <TouchableOpacity
                            className="mr-4 mb-2"
                            disabled={!props.text.trim()}
                            style={{ opacity: !props.text.trim() ? 0.5 : 1 }}
                            onPress={() => props.onSend({ text: props.text.trim() }, true)}
                        >
                            <Ionicons name="send" size={24} color={theme.primary} />
                        </TouchableOpacity>
                    )}
                    textInputStyle={{
                        borderRadius: 10,
                        fontFamily: "Montserrat-Regular",
                        fontSize: 14,
                        lineHeight: 20,
                        color: theme.text,
                        paddingHorizontal: 10,
                        marginHorizontal: 10,
                    }}
                    textInputProps={{
                        placeholderTextColor: "#A0A0A0",
                    }}
                    minInputToolbarHeight={100}
                    maxInputLength={1000}
                    renderInputToolbar={(props) => (
                        <InputToolbar
                            {...props}
                            containerStyle={{
                                backgroundColor: theme.accent,
                                borderTopWidth: 0,
                                borderBottomWidth: 0,
                                borderRadius: 15,
                                marginHorizontal: 30,
                                marginBottom: 40,
                                paddingVertical: 5,
                                shadowColor: "#3C3C3C",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.1,
                                shadowRadius: 3.84,
                                elevation: 5,
                            }}
                        />
                    )}
                />
            </View>
        </KeyboardAvoidingView>
    )
}

export default MessageScreen