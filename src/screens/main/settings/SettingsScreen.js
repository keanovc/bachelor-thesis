import { View, Text, Image, TouchableOpacity, Switch, SafeAreaView, Modal, TextInput, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import { EventRegister } from 'react-native-event-listeners'
import ThemeContext from '../../../context/ThemeContext'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from "react-hook-form";

import { UserContext } from '../../../context/UserContext'
import { FireBaseContext } from '../../../context/FireBaseContext'
import SettingsItem from '../../../components/settings/SettingsItem'

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
        <ScrollView
            className="flex-1"
            style={{ backgroundColor: theme.background }}
        >
            <SafeAreaView>
                {/* Modal */}
                <Modal
                    transparent={true}
                    visible={modalVisible}
                >
                    <View className="flex-1 justify-center items-center"
                        style={{
                            backgroundColor: "#00000080",
                        }}
                    >
                        <View className="w-3/4 rounded-md p-6 shadow-lg"
                            style={{
                                backgroundColor: theme.background,
                            }}
                        >
                            <View className="flex-row items-center justify-between">
                                <View>
                                    <Text className="text-2xl font-bold" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>Sign In</Text>
                                    <Text className="text-xs font-regular mt-1 text-gray-400" style={{ fontFamily: "Montserrat-Regular" }}>
                                        Before you can edit your profile
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Ionicons name="close" size={24} color={theme.text} />
                                </TouchableOpacity>
                            </View>

                            <View className="mt-6">
                                <Text className="text-xs text-gray-400 mb-2 uppercase" style={{ fontFamily: "Montserrat-Regular" }}>Email</Text>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className="border-b border-gray-300 w-full py-2"
                                            onBlur={onBlur}
                                            onChangeText={
                                                value => {
                                                    onChange(value)
                                                    setEmail(value)
                                                }
                                            }
                                            value={value}
                                            placeholder="Email"
                                            placeholderTextColor="#A9A9A9"
                                            autoCapitalize='none'
                                            autoCompleteType='email'
                                            autoCorrect={false}
                                            autoFocus={true}
                                            style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}
                                        />
                                    )}
                                    name="email"
                                />
                                {errors.email && <Text className="text-red-500" style={{ fontFamily: "Montserrat-Regular" }}>
                                    {errors.email.type === "required" && "This is required."}
                                    {errors.email.type === "pattern" && "Please enter a valid email."}
                                </Text>}
                            </View>

                            <View className="mt-6">
                                <Text className="text-xs text-gray-400 mb-2 uppercase">Password</Text>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                        minLength: 8,
                                        pattern: /^[^\s]+$/,
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className="border-b border-gray-300 w-full py-2"
                                            onBlur={onBlur}
                                            onChangeText={
                                                (value) => {
                                                    onChange(value)
                                                    setPassword(value)
                                                }
                                            }
                                            value={value}
                                            placeholder="Password"
                                            placeholderTextColor="#A9A9A9"
                                            autoCapitalize='none'
                                            autoCompleteType='password'
                                            autoCorrect={false}
                                            secureTextEntry={true}
                                            style={{ color: theme.text, fontFamily: "Montserrat-Regular" }}
                                        />
                                    )}
                                    name="password"
                                />
                                {errors.password && <Text className="text-red-500" style={{ fontFamily: "Montserrat-Regular" }}>
                                    {errors.password.type === "required" && "This is required."}
                                    {errors.password.type === "minLength" && "Password must be at least 8 characters."}
                                    {errors.password.type === "pattern" && "Password cannot contain spaces."}
                                </Text>}
                            </View>

                        <View className="mt-10">
                                <TouchableOpacity
                                    className="bg-indigo-500 rounded-md py-2"
                                    onPress={handleSubmit(onSubmit)}
                                    style={{ backgroundColor: theme.primary }}
                                >
                                    <Text className="text-center text-white font-semibold" style={{ fontFamily: "Montserrat-SemiBold" }}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                
                <View className="px-6">
                    <View className="mt-4">
                        <Text className="text-3xl" style={{ color: theme.text, fontFamily: "Montserrat-Bold" }}>Settings</Text>
                    </View>

                    {/* Account Edit */}
                    <View className="mt-4">
                        <Text className="text-xl" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>Account</Text>
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
                                <Text className="text-lg font-bold" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>{user.username}</Text>
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
                        <Text className="text-xl" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>Preferences</Text>
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
                        <Text className="text-xl" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>Help</Text>

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

                            {/* Cookie Policy */}
                            <View>
                                <SettingsItem
                                    title="Cookie Policy"
                                    onPress={() => navigation.navigate('CookiePolicy')}
                                    iconBackgroundColor="#CAD8D9"
                                    iconColor="white"
                                    icon="server"
                                />
                            </View>

                            {/* Community Standards */}
                            <View>
                                <SettingsItem
                                    title="Community Standards"
                                    onPress={() => navigation.navigate('CommunityStandards')}
                                    iconBackgroundColor="#CAD8D9"
                                    iconColor="white"
                                    icon="people"
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}

export default SettingsScreen