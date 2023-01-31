import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useState, useContext } from 'react'

import { UserContext } from '../context/UserContext'
import { FireBaseContext } from '../context/FireBaseContext'

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const firebase = useContext(FireBaseContext)
    const [_, setUser] = useContext(UserContext)

    const validate = () => {
        if (email === '') {
            setEmailError('Email is required')
        } else if (!email.includes('@') || !email.includes('.')) {
            setEmailError('Please enter a valid email')
        } else if (email.indexOf(' ') >= 0) {
            setEmailError('Email cannot contain spaces')
        } else if (password === '') {
            setPasswordError('Password is required')
            setEmailError('')
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters')
            setEmailError('')
        } else if (password.indexOf(' ') >= 0) {
            setPasswordError('Password cannot contain spaces')
            setEmailError('')
        } else {
            setEmailError('')
            setPasswordError('')
            return true
        }
    }

    const signIn = async () => {
        setLoading(true)

        try {
            if (validate()) {
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
            }
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

                <View className="mx-8 mt-16 mb-8">
                    <View>
                        <Text className="text-xs text-gray-400 mb-2 uppercase">Email Address</Text>
                        <TextInput
                            className="border-b border-gray-300 h-8 text-xs"
                            placeholder="Enter your email address"
                            autoCapitalize='none'
                            autoCompleteType='email'
                            autoCorrect={false}
                            autoFocus={true}
                            keyboardType='email-address'
                            onChangeText={email => setEmail(email.trim())}
                            value={email}
                        />
                        {emailError ? (
                            <Text className="text-red-500 text-xs">{emailError}</Text>
                        ) : null}
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
                        {passwordError ? (
                            <Text className="text-red-500 text-xs">{passwordError}</Text>
                        ) : null}
                    </View>
                </View>

                <View className="mx-8 mt-8">
                    <TouchableOpacity onPress={signIn} disabled={loading} className="bg-[#8022D9] w-full h-12 rounded-md items-center justify-center mx-auto">
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