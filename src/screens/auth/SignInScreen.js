import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, ScrollView, Image, SafeAreaView } from 'react-native'
import React, { useState, useContext } from 'react'
import { useForm, Controller } from "react-hook-form";
import ThemeContext from '../../context/ThemeContext'

import { UserContext } from '../../context/UserContext'
import { FireBaseContext } from '../../context/FireBaseContext'

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const theme = useContext(ThemeContext)

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
                <SafeAreaView className="flex-1">
                    <View className="px-10 pt-36">
                        {/* <View className="items-center justify-center mt-4">
                            <Image
                                source={require('../../../assets/images/logo.png')}
                                style={{ width: 250, resizeMode: 'contain' }}
                            />
                        </View> */}

                        <View className="mt-6">
                            <Text className="text-2xl text-gray-800" style={{ fontFamily: "Montserrat-Medium" }} >
                                Welcome back.
                            </Text>
                            <Text className="text-gray-400 text-xs" style={{ fontFamily: "Montserrat-Regular" }}>
                                Bring clarity to your financial future
                            </Text>
                        </View>

                        <View className="mt-8">
                            <View>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className="bg-gray-100 rounded-lg w-full py-3 px-3 text-gray-700 leading-tight"
                                            style={{ fontFamily: "Montserrat-Regular" }}
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
                                {errors.email && <Text className="text-red-500 text-xs mt-1" style={{ fontFamily: "Montserrat-Regular" }}>
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
                                            style={{ fontFamily: "Montserrat-Regular" }}
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
                                {errors.password && <Text className="text-red-500 text-xs mt-1" style={{ fontFamily: "Montserrat-Regular" }}>
                                    {errors.password.type === "required" && "This is required."}
                                    {errors.password.type === "minLength" && "Password must be at least 8 characters."}
                                    {errors.password.type === "pattern" && "Password cannot contain spaces."}
                                </Text>}
                            </View>

                            <View className="mt-2 ml-auto">
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('ForgotPassword')}
                                >
                                    <Text className="text-xs text-gray-400" style={{ fontFamily: "Montserrat-Medium" }}>
                                        Forgot password?
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View className="mt-6">
                                <TouchableOpacity 
                                    onPress={handleSubmit(onSubmit)} 
                                    disabled={loading} 
                                    className="rounded-lg py-3 px-3 w-full"
                                    style={{ backgroundColor: theme.primary }}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Text className="text-white text-center text-md" style={{ fontFamily: "Montserrat-SemiBold" }}>Sign In</Text>
                                    )}
                                </TouchableOpacity>
                            </View>

                            <View className="flex flex-row items-center justify-center mt-6">
                                <TouchableOpacity onPress={() => navigation.navigate("SignUp")} className="flex-row">
                                    <Text className="text-gray-400 text-xs" style={{ fontFamily: "Montserrat-Regular" }}>Don't have an account?</Text>
                                    <Text 
                                        className="text-xs ml-1 font-bold"
                                        style={{ 
                                            color: theme.primary,
                                            fontFamily: "Montserrat-Medium"
                                        }}
                                    >
                                        Sign Up
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="
                            -right-48
                            -bottom-28
                            z-0
                        ">
                            <Image
                                source={require('../../../assets/images/hand-welcome.png')}
                                className="
                                    absolute
                                    w-40
                                    h-56
                                    -rotate-12
                                "
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default SignInScreen