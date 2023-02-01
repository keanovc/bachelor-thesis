import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useState, useContext } from 'react'
import { useForm, Controller } from "react-hook-form";

import { UserContext } from '../context/UserContext'
import { FireBaseContext } from '../context/FireBaseContext'

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const firebase = useContext(FireBaseContext)
    const [_, setUser] = useContext(UserContext)

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: "",
            password: "",
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
                <View className="mt-52">
                    <Text className="text-center text-3xl font-light text-gray-700">
                        Welcome back.
                    </Text>
                </View>

                <View className="mx-8 mt-8 mb-8">
                    <View className="mt-6">
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
                                    placeholder="Email"
                                    placeholderTextColor="#A9A9A9"
                                    autoCapitalize='none'
                                    autoCompleteType='email'
                                    autoCorrect={false}
                                    autoFocus={true}
                                />
                            )}
                            name="email"
                        />
                        {errors.email && <Text className="text-red-500">
                            {errors.email.type === "required" && "This is required."}
                            {errors.email.type === "pattern" && "Please enter a valid email."}
                        </Text>}
                    </View>

                    <View className="mt-10">
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
                            {errors.password.type === "pattern" && "Password must not contain spaces."}
                        </Text>}
                    </View>
                </View>

                <View className="mx-8 mt-8">
                    <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={loading} className="bg-[#8022D9] w-full h-12 rounded-md items-center justify-center mx-auto">
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text className="text-white text-center text-md">Sign In</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* <View className="flex flex-row items-center justify-center mt-8">
                    <View className="bg-gray-300 h-0.5 w-24" />
                    <Text className="text-gray-400 text-xs mx-4">OR</Text>
                    <View className="bg-gray-300 h-0.5 w-24" />
                </View>

                <View className="mx-8 mt-8">
                    <TouchableOpacity className="bg-[#DD4B39] w-full h-12 rounded-md items-center justify-center mx-auto">
                        <Text className="text-white text-center text-md">Sign In with Google</Text>
                    </TouchableOpacity>
                </View> */}

                <View className="flex flex-row items-center justify-center mt-8">
                    <TouchableOpacity onPress={() => navigation.navigate("SignUp")} className="flex-row">
                        <Text className="text-gray-400 text-xs">Don't have an account?</Text>
                        <Text className="text-[#8022D9] text-xs ml-1 font-bold">Sign Up</Text>
                    </TouchableOpacity>
                </View>

                <View className="absolute w-full -top-14 z-50">
                    <View className="bg-[#8022D9] absolute w-96 h-96 rounded-full -top-44 -right-20" />
                    <View className="bg-[#23A6D5] absolute w-56 h-56 rounded-full -top-14 -left-14" />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default SignInScreen