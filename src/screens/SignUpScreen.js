import { View, Image, Text, TextInput, TouchableOpacity, ActivityIndicator, Platform, ScrollView, KeyboardAvoidingView, SafeAreaView } from 'react-native'
import React, { useState, useContext } from 'react'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useForm, Controller } from "react-hook-form";

import ThemeContext from '../context/ThemeContext'
import { FireBaseContext } from '../context/FireBaseContext'
import { UserContext } from '../context/UserContext'

const SignUpScreen = ({ navigation }) => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [profilePicture, setProfilePicture] = useState()
    const theme = useContext(ThemeContext)

    const firebase = useContext(FireBaseContext)
    const [_, setUser] = useContext(UserContext)

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const addProfilePicture = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!')
            return
        }

        pickImage()
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

    const onSubmit = async () => {
        setLoading(true)

        try {
            const user = {
                username,
                email,
                password,
                profilePicture
            }

            const createdUser = await firebase.createUserWithEmailAndPassword(user)

            setUser({
                ...createdUser,
                isLoggedIn: true
            })
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <KeyboardAvoidingView 
                className="flex-1 bg-white"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView 
                bounces={false}
            >
                <SafeAreaView className="flex-1">
                    <View className="px-10">
                        <View className="items-center justify-center mt-4">
                            <Image
                                source={require('../../assets/images/logo.png')}
                                style={{ width: 250, resizeMode: 'contain' }}
                            />
                        </View>

                        <Text className="text-2xl font-light text-gray-800">
                            Create an account!
                        </Text>
                        <Text className="text-gray-400 text-xs">
                            Bring clarity to your financial future
                        </Text>

                        <TouchableOpacity 
                            onPress={addProfilePicture}
                            className="bg-gray-200 w-20 h-20 rounded-full self-center overflow-hidden mt-6"
                        >
                            {profilePicture ? (
                                <Image source={{ uri: profilePicture }} className="flex-1" />
                            ) : (
                                <View className="items-center justify-center flex-1">
                                    <Ionicons name="image" size={28} color={ theme.primary } />
                                </View>
                            )}
                        </TouchableOpacity>

                        <View className="mt-8">
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                    pattern: /^[^\s]+$/,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        className="bg-gray-100 rounded-lg w-full py-3 px-3 text-gray-700 leading-tight"
                                        onBlur={onBlur}
                                        onChangeText={
                                            (value) => {
                                                onChange(value)
                                                setUsername(value)
                                            }
                                        }
                                        value={value}
                                        placeholder="Enter your username"
                                        placeholderTextColor="#A9A9A9"
                                        autoCapitalize='none'
                                        autoCompleteType='username'
                                        autoCorrect={false}
                                    />
                                )}
                                name="username"
                            />
                            {errors.username && <Text className="text-red-500 text-xs mt-1">
                                {errors.username.type === "required" && "Username is required"}
                                {errors.username.type === "pattern" && "Username cannot contain spaces"}
                            </Text>}
                        </View>

                        <View className="mt-4">
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        className="bg-gray-100 rounded-lg w-full py-3 px-3 text-gray-700 leading-tight"
                                        onBlur={onBlur}
                                        onChangeText={
                                            (value) => {
                                                onChange(value)
                                                setEmail(value)
                                            }
                                        }
                                        value={value}
                                        placeholder="Enter your email"
                                        placeholderTextColor="#A9A9A9"
                                        autoCapitalize='none'
                                        autoCompleteType='email'
                                        autoCorrect={false}
                                    />
                                )}
                                name="email"
                            />
                            {errors.email && <Text className="text-red-500 text-xs mt-1">
                                {errors.email.type === "required" && "This is required."}
                                {errors.email.type === "pattern" && "Please enter a valid email."}
                            </Text>}
                        </View>

                        <View className="mt-4">
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                    minLength: 8,
                                    pattern: /^[^\s]+$/,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        className="bg-gray-100 rounded-lg w-full py-3 px-3 text-gray-700 leading-tight"
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
                                    />
                                )}
                                name="password"
                            />
                            {errors.password && <Text className="text-red-500 text-xs mt-1">
                                {errors.password.type === "required" && "This is required."}
                                {errors.password.type === "minLength" && "Password must be at least 8 characters."}
                                {errors.password.type === "pattern" && "Password cannot contain spaces"}
                            </Text>}
                        </View>

                        <View className="mt-8">
                            <TouchableOpacity 
                                onPress={handleSubmit(onSubmit)}
                                disabled={loading} 
                                className="w-full h-12 rounded-md items-center justify-center mx-auto"
                                style={{ backgroundColor: theme.primary }}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text className="text-white text-center text-md">Create</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View className="flex flex-row items-center justify-center mt-6">
                            <TouchableOpacity onPress={() => navigation.navigate("SignIn")} className="flex-row">
                                <Text className="text-gray-400 text-xs">Already have an account?</Text>
                                <Text 
                                    className="text-xs ml-1 font-bold"
                                    style={{ color: theme.primary }}
                                >
                                    Sign In
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="
                        -bottom-4
                        z-0
                    ">
                        <Image
                            source={require('../../assets/images/hand-create.png')}
                            className="
                                absolute
                                w-32
                                h-44
                                rotate-45
                            "
                        />
                    </View>
                </SafeAreaView>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default SignUpScreen