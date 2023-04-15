import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

import ThemeContext from '../../../context/ThemeContext'
import questions from '../../../data/Questions'
import { SettingsItem, IconButton } from '../../../components';

const FAQScreen = () => {
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()

    const [selected, setSelected] = useState(0)

    return (
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: theme.background }}
        >
            <View 
                className="px-6"
                style={{ backgroundColor: theme.background }}
            >
                <View className="mt-4 flex flex-row justify-between items-center">
                    <IconButton
                        onPress={() => navigation.goBack()}
                        icon="chevron-back"
                    />
                </View>

                <ScrollView 
                    className="mt-4"
                    contentContainerStyle={{ paddingBottom: 60 }}
                >
                    <View className="mt-4">
                        <Image
                            source={require('../../../../assets/images/faqs.png')}
                            style={{ width: 200, height: 150, alignSelf: 'center' }}
                        />

                        <View className="mt-4">
                            <View className="w-full">
                                {questions.map((question, index) => (
                                    <View 
                                        key={question.id} 
                                        style={{ backgroundColor: theme.accent, }}
                                        className="mt-4 p-4 rounded-lg shadow-sm"
                                    >
                                        <TouchableOpacity
                                            onPress={() => setSelected(index)}
                                            className="flex flex-row justify-between items-center"
                                        >
                                            <View className="flex flex-row items-center w-10/12">
                                                <Text className="text-sm" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>{question.question}</Text>
                                            </View>

                                            <Ionicons
                                                name={selected === index ? "chevron-up" : "chevron-down"}
                                                size={24}
                                                color={theme.text}
                                            />
                                        </TouchableOpacity>

                                        {selected === index && (
                                            <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>{question.answer}</Text>
                                        )}
                                    </View>
                                ))}
                            </View>

                            <View className="mt-6" style={{ borderBottomColor: theme.border, borderBottomWidth: 1 }} />

                            <View className="mt-4">
                                <Text className="text-lg" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>Still have questions?</Text>
                                
                                <View className="mt-4">
                                    <SettingsItem
                                        title="About"
                                        onPress={() => navigation.navigate('About')}
                                        iconBackgroundColor="#CAD8D9"
                                        iconColor="white"
                                        icon="information-circle"
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default FAQScreen