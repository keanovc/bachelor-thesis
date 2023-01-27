import { View, StatusBar, Text, TextInput, TouchableOpacity, ActivityIndicator, Platform, Image } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'

const SignUpScreen = ({ navigation }) => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [profilePicture, setProfilePicture] = useState()
    
    const getPermission = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
            return status
        }
    }
    
    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            })

            if (!result.canceled) {
                setProfilePicture(result.assets[0].uri)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const addProfilePicture = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!')
            return
        }

        pickImage()
    }

    return (
        <View className="flex-1">
            <View className="mt-52">
                <Text className="text-center text-3xl font-light text-gray-700">
                    Sign up to get started.
                </Text>
            </View>

            <View className="mx-8 mt-10 mb-8">
                <TouchableOpacity 
                    onPress={addProfilePicture}
                    className="bg-gray-200 w-20 h-20 rounded-full self-center overflow-hidden"
                >
                    {profilePicture ? (
                        <Image source={{ uri: profilePicture }} className="flex-1" />
                    ) : (
                        <View className="items-center justify-center flex-1">
                            <AntDesign name="plus" size={24} color="white" />
                        </View>
                    )}
                </TouchableOpacity>

                <View className="mt-8">
                    <Text className="text-xs text-gray-400 mb-2 uppercase">Username</Text>
                    <TextInput
                        className="border-b border-gray-300 h-8 text-xs"
                        placeholder="Enter your username"
                        autoCapitalize='none'
                        autoCorrect={false}
                        autoFocus={true}
                        onChangeText={username => setUsername(username.trim())}
                        value={username}
                    />
                </View>

                <View className="mt-8">
                    <Text className="text-xs text-gray-400 mb-2 uppercase">Email Address</Text>
                    <TextInput
                        className="border-b border-gray-300 h-8 text-xs"
                        placeholder="Enter your email address"
                        autoCapitalize='none'
                        autoCompleteType='email'
                        autoCorrect={false}
                        keyboardType='email-address'
                        onChangeText={email => setEmail(email.trim())}
                        value={email}
                    />
                </View>

                <View className="mt-8">
                    <Text className="text-xs text-gray-400 mb-2 uppercase">Password</Text>
                    <TextInput
                        className="border-b border-gray-300 h-8 text-xs"
                        placeholder="Enter your password"
                        autoCapitalize='none'
                        autoCompleteType='password'
                        autoCorrect={false}
                        secureTextEntry={true}
                        onChangeText={password => setPassword(password.trim())}
                        value={password}
                    />
                </View>
            </View>

            <View className="mx-8 mt-8">
                <TouchableOpacity disabled={loading} className="bg-[#8022D9] w-full h-12 rounded-md items-center justify-center mx-auto">
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text className="text-white text-center text-md">Sign Up</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View className="flex flex-row items-center justify-center mt-8">
                <TouchableOpacity onPress={() => navigation.navigate("SignIn")} className="flex-row">
                    <Text className="text-xs text-gray-400">Already have an account?</Text>
                    <Text className="text-[#8022D9] text-xs ml-1 font-bold">Sign In</Text>
                </TouchableOpacity>
            </View>

            <View className="absolute w-full -top-14 z-50">
                <View className="bg-[#8022D9] absolute w-96 h-96 rounded-full -top-44 -right-20" />
                <View className="bg-[#23A6D5] absolute w-56 h-56 rounded-full -top-14 -left-14" />
            </View>
            <StatusBar barStyle="light-content" />
        </View>
    )
}

export default SignUpScreen