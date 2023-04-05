import { View, Text, SafeAreaView, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native'
import React, { useState, useContext } from 'react'
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import env from '../../../config/env'

import ThemeContext from '../../../context/ThemeContext'

const MessageScreen = () => {
    const API_KEY = env.API_KEY_CHATGPT
    const API_URL = env.API_URL_CHATGPT

    const [data, setData] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const theme = useContext(ThemeContext)
    const navigation = useNavigation()

    const sendMessage = async () => {
        const prompt = message
        const response = await axios.post(API_URL, {
            prompt,
            max_tokens: 2048,
            temperature: 0.5,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            }
        })

        const text = response.data.choices[0].text
        setData([...data, { type: 'user', 'text': message }, { type: 'bot', 'text': text }])
        setMessage('')
    }

    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior="padding"
        >
            <View 
                className="flex-1 pb-8"
                style={{ backgroundColor: theme.background }}
            >
                <View 
                    className="flex-row items-center justify-between px-5 pt-16 pb-3"
                    style={{
                        backgroundColor: "white",
                        shadowColor: '#D3D3D3',
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}
                >
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            className="
                                w-10 h-10
                                rounded-lg
                                items-center
                                justify-center
                            "
                            style={{ backgroundColor: theme.background }}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="chevron-back" size={24} color={theme.primary} />
                        </TouchableOpacity>
                        <View className="ml-4">
                            <Text className="text-lg font-bold" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>Visional Bot</Text>

                            <View className="flex-row items-center">
                                <View className="w-2 h-2 rounded-full bg-green-500 ml-1" />
                                <Text className="text-sm ml-2 text-gray-400" style={{ fontFamily: "Montserrat-Light" }}>Powered by ChatGPT</Text>
                            </View>
                        </View>
                    </View>

                    <Image
                        className="w-10 h-10 rounded-full"
                        source={require('../../../../assets/images/robot-placeholder.png')}
                    />
                </View>

                <FlatList 
                    className="flex-1 px-6 pb-8"
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View className="my-3">
                            {item.type === 'user' && (
                                <View className="flex-row-reverse">
                                    <View 
                                        className="p-4 shadow-md rounded-tl-3xl rounded-br-3xl rounded-bl-3xl rounded-tr-md"
                                        style={{ backgroundColor: theme.primary }}
                                    >
                                        <Text className="text-white" style={{ fontFamily: "Montserrat-Medium" }}>{item.text}</Text>
                                    </View>
                                </View>
                            )}
                            {item.type === 'bot' && (
                                <View className="flex-row">
                                    <View className="p-4 shadow-md rounded-tl-md rounded-br-3xl rounded-bl-3xl rounded-tr-3xl bg-white">
                                        <Text style={{ fontFamily: "Montserrat-Regular" }}>{item.text}</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}
                />

                <View className="flex-row items-center justify-between p-5 mx-8 my-5 bg-white shadow rounded-3xl">
                    <TextInput
                        className="flex-1 px-4 text-md"
                        value={message}
                        onChangeText={text => setMessage(text)}
                        placeholder="Type your question here..."
                        style={{ fontFamily: "Montserrat-Regular" }}
                    />
                    <TouchableOpacity
                        className="ml-2 items-center justify-center"
                        onPress={sendMessage}
                        disabled={message.length === 0}
                    >
                        <Ionicons name="send" size={24} color={
                            message.length > 0 ? theme.primary : '#a0aec0'
                        } />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default MessageScreen