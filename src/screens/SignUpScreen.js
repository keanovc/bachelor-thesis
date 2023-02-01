import { View, StatusBar, Text, TextInput, TouchableOpacity, ActivityIndicator, Platform, Image, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useState, useContext } from 'react'
import { AntDesign } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useForm, Controller } from "react-hook-form";

import { FireBaseContext } from '../context/FireBaseContext'
import { UserContext } from '../context/UserContext'

const SignUpScreen = ({ navigation }) => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [profilePicture, setProfilePicture] = useState()

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
                className="flex-1"
                bounces={false}
            >
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
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                pattern: /^[^\s]+$/,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    className="border-b border-gray-300 w-full py-2"
                                    onBlur={onBlur}
                                    onChangeText={
                                        (value) => {
                                            onChange(value)
                                            setUsername(value)
                                        }
                                    }
                                    value={value}
                                    placeholder="Enter your username"
                                    autoCapitalize='none'
                                    autoCompleteType='username'
                                    autoCorrect={false}
                                />
                            )}
                            name="username"
                        />
                        {errors.username && <Text className="text-red-500">
                            {errors.username.type === "required" && "Username is required"}
                            {errors.username.type === "pattern" && "Username cannot contain spaces"}
                        </Text>}
                    </View>

                    <View className="mt-8">
                        <Text className="text-xs text-gray-400 mb-2 uppercase">Email</Text>
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
                        {errors.email && <Text className="text-red-500">
                            {errors.email.type === "required" && "This is required."}
                            {errors.email.type === "pattern" && "Please enter a valid email."}
                        </Text>}
                    </View>

                    <View className="mt-8">
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
                                />
                            )}
                            name="password"
                        />
                        {errors.password && <Text className="text-red-500">
                            {errors.password.type === "required" && "This is required."}
                            {errors.password.type === "minLength" && "Password must be at least 8 characters."}
                            {errors.password.type === "pattern" && "Password cannot contain spaces"}
                        </Text>}
                    </View>
                </View>

                <View className="mx-8 mt-8">
                    <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={loading} className="bg-[#8022D9] w-full h-12 rounded-md items-center justify-center mx-auto">
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text className="text-white text-center text-md">Sign Up</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="flex flex-row items-center justify-center mt-8 mb-8">
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
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default SignUpScreen