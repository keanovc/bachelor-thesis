import { View, Text, SafeAreaView, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native'
import React, { useState, useContext } from 'react'
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons'
import env from '../config/env'

import ThemeContext from '../context/ThemeContext'
import { UserContext } from '../context/UserContext'

const MessageScreen = () => {
    const API_KEY = env.API_KEY
    const API_URL = env.API_URL

    const [data, setData] = useState([])
    const [message, setMessage] = useState('')

    const [user, setUser] = useContext(UserContext)
    const theme = useContext(ThemeContext)

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
            <SafeAreaView className="flex-1"
                style={{ backgroundColor: theme.background }}
            >
                <View className="flex-row items-center justify-between p-4 border-b border-gray-300">
                    <View className="flex-row items-center">
                        <View className="ml-4">
                            <Text className="text-sm font-regular"
                                style={{ color: theme.text }}
                            >
                                Hello, {user.username}
                            </Text>
                            <Text className="text-lg font-bold"
                                style={{ color: theme.text }}
                            >
                                How can I help you?
                            </Text>
                        </View>
                    </View>
                    <Image
                        className="w-10 h-10 rounded-full"
                        source={{ uri: user.profilePicture }}
                    />
                </View>

                <FlatList 
                    className="flex-1 px-6 pb-8"
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View className="my-2">
                            {item.type === 'user' && (
                                <View className="flex-row-reverse">
                                    <View className="
                                        bg-indigo-500 rounded-xl p-2
                                        shadow-md
                                    ">
                                        <Text className="text-white">{item.text}</Text>
                                    </View>
                                </View>
                            )}
                            {item.type === 'bot' && (
                                <View className="flex-row">
                                    <View className="
                                        bg-white rounded-xl p-2
                                        shadow-md
                                    ">
                                        <Text>{item.text}</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}
                />

                <View 
                    className="
                        flex-row items-center justify-between p-4
                        border-t border-gray-300
                    "
                >
                    <TextInput
                        className="
                            flex-1 rounded-md h-12
                            bg-gray-200
                            px-4
                        "
                        value={message}
                        onChangeText={text => setMessage(text)}
                        placeholder="Type your message here..."
                        style={{ color: theme.text }}
                    />
                    <TouchableOpacity
                        className="ml-2 items-center justify-center"
                        onPress={sendMessage}
                    >
                        <Ionicons name="send" size={24} color={
                            message.length > 0 ? '#667eea' : '#a0aec0'
                        } />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default MessageScreen