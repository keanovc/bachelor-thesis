import { View, Text, Image, TouchableOpacity, Switch, SafeAreaView, Modal, TextInput } from 'react-native'
import React, { useContext, useState } from 'react'
import { EventRegister } from 'react-native-event-listeners'
import ThemeContext from '../context/ThemeContext'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import { UserContext } from '../context/UserContext'
import { FireBaseContext } from '../context/FireBaseContext'

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

    const signIn = async () => {
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
        <SafeAreaView 
            className="flex-1 px-10"
            style={{
                backgroundColor: theme.background,
            }}
        >
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
                                <Text className="text-2xl font-bold" style={{ color: theme.text }}>Sign In</Text>
                                <Text className="text-xs font-regular mt-1 text-gray-400">
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
                            <Text className="text-lg font-semibold" style={{ color: theme.text }}>Email</Text>
                            <TextInput
                                className="border-b border-gray-300 w-full py-2"
                                placeholder="Email"
                                placeholderTextColor={theme.text}
                                autoCapitalize='none'
                                autoCompleteType='email'
                                autoCorrect={false}
                                autoFocus={true}
                                style={{ color: theme.text }}
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        <View className="mt-6">
                            <Text className="text-lg font-semibold" style={{ color: theme.text }}>Password</Text>
                            <TextInput
                                className="border-b border-gray-300 w-full py-2"
                                placeholder="Password"
                                placeholderTextColor={theme.text}
                                style={{ color: theme.text }}
                                value={password}
                                onChangeText={setPassword}
                                autoCapitalize='none'
                                autoCompleteType='password'
                                autoCorrect={false}
                                secureTextEntry={true}
                            />
                        </View>

                        <TouchableOpacity
                            className="mt-10 bg-indigo-500 rounded-md py-2"
                            onPress={signIn}
                        >
                            <Text className="text-lg font-semibold text-center text-white">Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            
            <View className="px-6">
                <View className="mt-4">
                    <Text className="text-3xl font-bold" style={{ color: theme.text }}>Settings</Text>
                </View>

                <View className="mt-4">
                    <Text className="text-lg font-semibold" style={{ color: theme.text }}>Account</Text>
                </View>

                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    className="flex-row items-center justify-between mt-6 px-4"
                >
                    <View className="flex-row items-center">
                        <Image
                            className="w-16 h-16 rounded-full"
                            source={{ uri: user.profilePicture }}
                        />

                        <View className="ml-4">
                            <Text className="text-lg font-bold" style={{ color: theme.text }}>{user.username}</Text>
                            <Text className="text-sm font-regular text-gray-400">Personal Info</Text>
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

                <View className="mt-10">
                    <Text className="text-lg font-semibold" style={{ color: theme.text }}>Preferences</Text>
                </View>

                <View className="space-y-7 mt-6">
                    <View className="flex-row items-center justify-between px-4">
                        <View className="flex-row items-center">
                            <View className="
                                bg-purple-200
                                opacity-75
                                flex-row items-center justify-center
                                w-10 h-10 rounded-full
                            ">
                                <Ionicons name="moon" size={20} color="purple" />
                            </View>

                            <View className="ml-4">
                                <Text className="text-lg font-regular" style={{ color: theme.text }}>Dark Mode</Text>
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
                            trackColor={{ false: "#ffffff", true: "#667eea" }}
                            ios_backgroundColor="#3e3e3e"
                            style={{
                                transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }]
                            }}
                            className="-mr-1"
                        />
                    </View>

                    <View className="flex-row items-center justify-between px-4">
                        <View className="flex-row items-center">
                            <View className="
                                bg-green-200
                                opacity-75
                                flex-row items-center justify-center
                                w-10 h-10 rounded-full
                            ">
                                <Ionicons name="notifications" size={20} color="green" />
                            </View>

                            <View className="ml-4">
                                <Text className="text-lg font-regular" style={{ color: theme.text }}>Notifications</Text>
                            </View>
                        </View>
                        
                        <Switch
                            value={true}
                            trackColor={{ false: "#ffffff", true: "#667eea" }}
                            ios_backgroundColor="#3e3e3e"
                            style={{
                                transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }]
                            }}
                            className="-mr-1"
                        />
                    </View>

                    <TouchableOpacity 
                        onPress={logOut}
                        className="flex-row items-center justify-between px-4"
                    >
                        <View className="flex-row items-center">
                            <View className="
                                bg-red-200
                                opacity-75
                                flex-row items-center justify-center
                                w-10 h-10 rounded-full
                            ">
                                <Ionicons name="log-out" size={20} color="red" />
                            </View>

                            <View className="ml-4">
                                <Text className="text-lg font-regular" style={{ color: theme.text }}>Log Out</Text>
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
                </View>
            </View>
        </SafeAreaView>
    )
}

export default SettingsScreen