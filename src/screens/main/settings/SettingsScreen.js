import { View, Text, Image, TouchableOpacity, Switch, SafeAreaView, Modal, TextInput, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import { EventRegister } from 'react-native-event-listeners'
import ThemeContext from '../../../context/ThemeContext'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from "react-hook-form";

import { UserContext } from '../../../context/UserContext'
import { FireBaseContext } from '../../../context/FireBaseContext'
import { SettingsItem, ProfileSignIn, IconButton } from '../../../components';

const SettingsScreen = () => {
    const [user, setUser] = useContext(UserContext)
    const [darkMode, setDarkMode] = useState(false)
    const firebase = useContext(FireBaseContext)
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async () => {
        setLoading(true)

        try {
            await firebase.signInWithEmailAndPassword(email, password)
            const uid = firebase.getCurrentUser().uid
            const userInfo = await firebase.getUserInfo(uid)

            setUser({
                isLoggedIn: true,
                email: userInfo.email,
                uid: uid,
                username: userInfo.username,
                fullname: userInfo.fullname,
                profilePicture: userInfo.profilePicture,
            })
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
            navigation.navigate("Profile")
            setModalVisible(false)
        }
    }

    const logOut = () => {
        const loggedOut = firebase.logOut()
        
        if (loggedOut) {
            setUser(state => ({ ...state, isLoggedIn: false }))
        }
    } 

    return (
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: theme.background }}
        >
            <ScrollView>
                <ProfileSignIn
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    control={control}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    onSubmit={onSubmit}
                    loading={loading}
                />
                
                <View 
                    className="px-6"
                    style={
                        modalVisible ? { opacity: 0.2 } : { opacity: 1 }
                    }
                >
                    <View className="flex-row items-center justify-start mt-4">
                        <IconButton
                            onPress={() => navigation.goBack()}
                            icon="chevron-back"
                        />

                        <Text className="text-3xl ml-4" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>Settings</Text>
                    </View>

                    {/* Account Edit */}
                    <View className="mt-4">
                        <Text className="text-xl" style={{ color: theme.text, fontFamily: "Montserrat-Medium" }}>Account</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        className="flex-row items-center justify-between mt-6 px-4"
                    >
                        <View className="flex-row items-center">
                            <Image
                                className="w-16 h-16 rounded-full"
                                source={{ uri: 
                                    user.profilePicture === "default" 
                                        ? "https://firebasestorage.googleapis.com/v0/b/bachelorthesis-e377a.appspot.com/o/placeholderPictures%2Fplaceholder-person.jpeg?alt=media&token=90a1ac16-40af-45e8-ba17-211cda672ef2"
                                        : user.profilePicture
                                }}
                            />

                            <View className="ml-4">
                                <Text className="text-lg font-bold" style={{ color: theme.text, fontFamily: "Montserrat-Medium" }}>{user.fullname}</Text>
                                <Text className="text-sm font-regular text-gray-400" style={{ fontFamily: "Montserrat-Regular" }}>Personal Info</Text>
                            </View>
                        </View>

                        <View className="
                                flex-row items-center justify-center
                                w-10 h-10 rounded-md
                            "
                            style={{ backgroundColor: theme.accent }}
                        >
                            <Ionicons name="chevron-forward" size={24} color="gray" />
                        </View>
                    </TouchableOpacity>

                    {/* Preferences */}
                    <View className="mt-10">
                        <Text className="text-xl" style={{ color: theme.text, fontFamily: "Montserrat-Medium" }}>Preferences</Text>
                    </View>

                    {/* Dark Mode */}
                    <View className="space-y-4 mt-6">
                        <View className="flex-row items-center justify-between px-4">
                            <View className="flex-row items-center">
                                <View className="
                                    bg-[#F1E0FF]
                                    flex-row items-center justify-center
                                    w-12 h-12 rounded-lg
                                    shadow-sm
                                ">
                                    <Ionicons name="moon" size={20} color="purple" />
                                </View>

                                <View className="ml-4">
                                    <Text style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}>Dark Mode</Text>
                                </View>
                            </View>

                            <Switch
                                value={
                                    theme.theme === 'dark' ? true : false
                                }
                                onValueChange={(value) => {
                                    setDarkMode(value)
                                    EventRegister.emit('toggleTheme', value)
                                }}
                                trackColor={{ 
                                    false: "#ffffff", 
                                    true: theme.primary
                                }}
                                ios_backgroundColor="#3e3e3e"
                                style={{
                                    transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }]
                                }}
                                className="-mr-2"
                            />
                        </View>

                        {/* Language Selector */}
                        <View>
                            <SettingsItem
                                title="Language"
                                onPress={() => navigation.navigate('LanguageSelector')}
                                iconBackgroundColor="#E0FFE5"
                                iconColor="green"
                                icon="language"
                            />
                        </View>

                        {/* Valuta */}
                        <View>
                            <SettingsItem
                                title="Valuta"
                                onPress={() => navigation.navigate('ValutaSelector')}
                                iconBackgroundColor="#FDFFE0"
                                iconColor="#F0D800"
                                icon="card"
                            />
                        </View>

                        {/* Notifications */}
                        {/* <View>
                            <SettingsItem
                                title="Notifications"
                                onPress={() => navigation.navigate('Notifications')}
                                iconBackgroundColor="#FFEDE0"
                                iconColor="orange"
                                icon="notifications"
                            />
                        </View> */}
                        
                        {/* Log Out */}
                        <View>
                            <SettingsItem
                                title="Log Out"
                                onPress={logOut}
                                iconBackgroundColor="#FFE0E0"
                                iconColor="red"
                                icon="log-out"
                            />
                        </View>
                    </View>

                    {/* Help */}
                    <View className="mt-10 mb-6">
                        <Text className="text-xl" style={{ color: theme.text, fontFamily: "Montserrat-Medium" }}>Help</Text>

                        <View className="space-y-4 mt-6">
                            {/* About */}
                            <View>
                                <SettingsItem
                                    title="About"
                                    onPress={() => navigation.navigate('About')}
                                    iconBackgroundColor="#CAD8D9"
                                    iconColor="white"
                                    icon="information-circle"
                                />
                            </View>
                            
                            {/* FAQ */}
                            <View>
                                <SettingsItem
                                    title="FAQ"
                                    onPress={() => navigation.navigate('FAQ')}
                                    iconBackgroundColor="#CAD8D9"
                                    iconColor="white"
                                    icon="help-circle"
                                />
                            </View>

                            {/* Terms of Service */}
                            <View>
                                <SettingsItem
                                    title="Terms of Service"
                                    onPress={() => navigation.navigate('TermsOfService')}
                                    iconBackgroundColor="#CAD8D9"
                                    iconColor="white"
                                    icon="document-text"
                                />
                            </View>

                            {/* Privacy Policy */}
                            <View>
                                <SettingsItem
                                    title="Privacy Policy"
                                    onPress={() => navigation.navigate('PrivacyPolicy')}
                                    iconBackgroundColor="#CAD8D9"
                                    iconColor="white"
                                    icon="warning"
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SettingsScreen