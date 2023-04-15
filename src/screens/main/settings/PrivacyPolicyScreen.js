import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'

import ThemeContext from '../../../context/ThemeContext'
import { SettingsItem, IconButton } from '../../../components';

const PrivacyPolicyScreen = () => {
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

                <ScrollView 
                    className="mt-4"
                    contentContainerStyle={{ paddingBottom: 60 }}
                >
                    <Text className="text-2xl" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>Privacy Policy</Text>
                    <Text className="mt-1 text-xs" style={{ color: theme.text, fontFamily: "Montserrat-Light" }}>Last updated: 2023-04-15</Text>

                    <View className="mt-4" style={{ borderBottomColor: theme.primary, borderBottomWidth: 1 }} />

                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        This Privacy Policy describes how Visional Mobile App ("we," "us," or "our") collects, uses, and shares personal information when you use our mobile application ("App").
                    </Text>

                    <Text className="mt-8 text-base" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>
                        Personal information we collect
                    </Text>

                    <Text className="mt-4 text-base" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        When you use our App, we collect certain personal information from you, including:
                    </Text>
                    
                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        • Information you provide: We may collect information you voluntarily provide to us, such as your name, email address, and phone number when you register for an account, or when you contact us with questions or feedback.
                    </Text>

                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        • Information about your use of the App: We may collect information about how you use the App, such as your search queries, your interactions with the App, and the features you use.
                    </Text>

                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        • Device information: We may collect information about the device you use to access our App, such as the type of device, the operating system, and the unique device ID.
                    </Text>

                    <Text className="mt-8 text-base" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>
                        How we use your personal information
                    </Text>

                    <Text className="mt-4 text-base" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        We may use your personal information for the following purposes:
                    </Text>

                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        • To provide you with access to the App and its features;
                    </Text>

                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        • To improve and develop our services;
                    </Text>

                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        • To respond to your questions and feedback;
                    </Text>

                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        • To send you marketing messages and offers if you have opted in;
                    </Text>

                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        • To comply with our legal obligations.
                    </Text>

                    <Text className="mt-8 text-base" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>
                        How we share your personal information
                    </Text>

                    <Text className="mt-4 text-base" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        We only share your personal information in the following circumstances:
                    </Text>

                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        • With our service providers: We may share your personal information with third parties who assist us in providing the App and its features, such as hosting providers, analytics services, and customer service providers.
                    </Text>

                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        • For legal reasons: We may share your personal information if we believe in good faith that disclosure is necessary to comply with a legal obligation, a legal process, or a government request.
                    </Text>

                    <Text className="mt-8 text-base" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>
                        How we protect your personal information
                    </Text>

                    <Text className="mt-4 text-base" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        We take reasonable measures to protect your personal information from unauthorized access, loss, destruction, or alteration. For example, we use encryption technology to protect your information during its transmission.
                    </Text>

                    <Text className="mt-8 text-base" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>
                        Your choices and rights
                    </Text>

                    <Text className="mt-4 text-base" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        You can update or delete your personal information at any time by contacting us. You also have the right to request that we no longer use your personal information for marketing purposes.
                    </Text>

                    <Text className="mt-8 text-base" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>
                        Updates to this policy
                    </Text>

                    <Text className="mt-4 text-base" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        We may update this Privacy Policy from time to time. If we make material changes, we will notify you by posting a prominent notice on our App.
                    </Text>

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
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default PrivacyPolicyScreen