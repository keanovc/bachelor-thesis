import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'

import ThemeContext from '../../../context/ThemeContext'
import { SettingsItem, IconButton } from '../../../components';

const TermsOfServiceScreen = () => {
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
                    <Text className="text-2xl" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>Terms of Service</Text>
                    <Text className="mt-1 text-xs" style={{ color: theme.text, fontFamily: "Montserrat-Light" }}>Last updated: 2023-04-15</Text>

                    <View className="mt-4" style={{ borderBottomColor: theme.primary, borderBottomWidth: 1 }} />

                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>Dear customer,</Text>

                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        Herewith we present the general terms and conditions ("Terms") that apply to the use of our mobile application called "Visional" ("App"). By downloading and using the App, you agree to these Terms.
                    </Text>

                    <Text className="mt-8 text-base" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>
                        Terms of Use
                    </Text>

                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        <Text style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>1.1 License to use:</Text> We grant you a non-exclusive, non-transferable, revocable license to use the App in accordance with these Terms.
                    </Text>
                    
                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        <Text style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>1.2 Age restrictions:</Text> The App are intended for use by individuals who are 18 years of age or older. By using the App, you represent and warrant that you are 18 years of age or older.
                    </Text>

                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        <Text style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>1.3 Use of the App and the Website:</Text> You agree that you will not use the App for illegal purposes or in a manner that is inconsistent with these Terms. You will not post or upload any content or information that infringes the intellectual property rights of others or that is otherwise harmful, obscene, defamatory, offensive or inappropriate.
                    </Text>

                    <Text className="mt-8 text-base" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>
                        Intellectual Property Rights
                    </Text>

                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        <Text style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>2.1 Visional's intellectual property rights:</Text> All intellectual property rights relating to the App, including but not limited to copyrights, trademarks, patents, trade secrets and other proprietary rights, belong to Visional.
                    </Text>

                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        <Text style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>2.2 Limited license for users: </Text> We grant you a limited, non-exclusive, non-transferable license to use the App in accordance with these Terms.
                    </Text>

                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        <Text style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>2.3 Restrictions:</Text> You may not copy, modify, distribute, sell, or otherwise use the App for commercial purposes without our express written consent.
                    </Text>

                    <Text className="mt-8 text-base" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>
                        Termination
                    </Text>

                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        We reserve the right to terminate your access to the App at any time, without prior notice, if you violate these Terms or otherwise use the App and the Website in a manner that we, in our sole discretion, deem harmful to our interests or those of other users.
                    </Text>

                    <Text className="mt-8 text-base" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>
                        Disclaimer
                    </Text>

                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        <Text style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>4.1 Liability:</Text> Visional is not liable for any damages arising from your use of the App. You use the App at your own risk.
                    </Text>

                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        <Text style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>4.2 No warranties:</Text> Visional makes no warranties regarding the accuracy, completeness, timeliness, or reliability of the content of the App.
                    </Text>

                    <Text className="mt-8 text-base" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>
                        Changes
                    </Text>

                    <Text className="mt-4 text-sm" style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>
                        We reserve the right to modify these Terms at any time. You are encouraged to regularly review these Terms for updates.
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

export default TermsOfServiceScreen