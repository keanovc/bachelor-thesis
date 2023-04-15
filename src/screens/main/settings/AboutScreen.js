import { View, Text, SafeAreaView, ScrollView, Image } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'

import ThemeContext from '../../../context/ThemeContext'
import { IconButton } from '../../../components'

const AboutScreen = () => {
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()

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

                <View className="mt-4">
                    <Image
                        source={require('../../../../assets/images/logo.png')}
                        style={{ width: 200, height: 70, alignSelf: 'center' }}
                    />

                    <View className="mt-4" style={{ borderBottomColor: theme.primary, borderBottomWidth: 1 }}/>

                    <ScrollView 
                        className="mt-4"
                        contentContainerStyle={{ paddingBottom: 300 }}
                    >
                        <Text className="mt-4 text-sm" style={{ color: theme.primary, fontFamily: "Montserrat-SemiBold" }}>Name of the app:</Text>
                        <Text className="mt-2 text-lg" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>Visional</Text>

                        <Text className="mt-6 text-sm" style={{ color: theme.primary, fontFamily: "Montserrat-SemiBold" }}>A brief description of the app:</Text>
                        <Text className="mt-2 text-lg" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                            Visional helps young adults manage their finances and achieve financial independence.
                        </Text>

                        <Text className="mt-6 text-sm" style={{ color: theme.primary, fontFamily: "Montserrat-SemiBold" }}>Functionalities:</Text>
                        <Text className="mt-2 text-lg" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                            Comprehensive budgeting and expense tracking, educational resources, goal setting, and an AI chatbot to answer questions.
                        </Text>

                        <Text className="mt-6 text-sm" style={{ color: theme.primary, fontFamily: "Montserrat-SemiBold" }}>The purpose of the app:</Text>
                        <Text className="mt-2 text-lg" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                            To provide young adults with the right tools and knowledge to manage their money wisely and guide them towards financial independence.
                        </Text>

                        <Text className="mt-6 text-sm" style={{ color: theme.primary, fontFamily: "Montserrat-SemiBold" }}>Developer:</Text>
                        <Text className="mt-2 text-lg" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                            Keano Van Cuyck
                        </Text>

                        <Text className="mt-6 text-sm" style={{ color: theme.primary, fontFamily: "Montserrat-SemiBold" }}>App version:</Text>
                        <Text className="mt-2 text-lg" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                            1.0.0
                        </Text>

                        <Text className="mt-6 text-sm" style={{ color: theme.primary, fontFamily: "Montserrat-SemiBold" }}>Contact information:</Text>
                        <Text className="mt-2 text-lg" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                            Email: keano.vancuyck@gmail.com
                            Phone: +32 495 33 69 72
                        </Text>

                        <Text className="mt-6 text-sm" style={{ color: theme.primary, fontFamily: "Montserrat-SemiBold" }}>Copyright:</Text>
                        <Text className="mt-2 text-lg" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                            Visional is a registered trademark of Keano Van Cuyck.
                        </Text>
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default AboutScreen