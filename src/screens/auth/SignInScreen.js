import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Image, SafeAreaView } from 'react-native'
import React, { useState, useContext } from 'react'
import { useForm, Controller } from "react-hook-form";
import { EventRegister } from 'react-native-event-listeners'

import ThemeContext from '../../context/ThemeContext'
import { UserContext } from '../../context/UserContext'
import { FireBaseContext } from '../../context/FireBaseContext'
import { AuthInputField, LargeButton } from '../../components/index'

const SignInScreen = ({ navigation }) => {
    const firebase = useContext(FireBaseContext)
    const [_, setUser] = useContext(UserContext)
    const theme = useContext(ThemeContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

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
                uid: uid,
                username: userInfo.username,
                fullname: userInfo.fullname,
                email: userInfo.email,
                symbol: userInfo.symbol,
                symbolBefore: userInfo.symbolBefore,
                valuta: userInfo.valuta,
                profilePicture: userInfo.profilePicture,
                darkMode: userInfo.darkMode,
            })

            EventRegister.emit('toggleTheme', userInfo.darkMode)
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <KeyboardAvoidingView 
                className="flex-1 bg-[#F5F8FE]"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView 
                bounces={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <SafeAreaView className="flex-1 items-center justify-center">
                    <View className="px-10 w-full">
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
                                    render={({ field: { onChange, onBlur } }) => (
                                        <AuthInputField
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            value={email}
                                            setValue={setEmail}
                                            placeholder="Email"
                                            autoCapitalize='none'
                                            autoCompleteType='email'
                                            autoCorrect={false}
                                            keyboardType='email-address'
                                            login={true}
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
                                    render={({ field: { onChange, onBlur } }) => (
                                        <AuthInputField
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            value={password}
                                            setValue={setPassword}
                                            placeholder="Password"
                                            autoCapitalize='none'
                                            autoCompleteType='password'
                                            autoCorrect={false}
                                            secureTextEntry={true}
                                            keyboardType='default'
                                            login={true}
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
                                    <Text className="text-sm text-gray-400" style={{ fontFamily: "Montserrat-Medium" }}>
                                        Forgot password?
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View className="mt-6">
                                <LargeButton
                                    handleSubmit={handleSubmit}
                                    onSubmit={onSubmit}
                                    loading={loading}
                                    text="Sign In"
                                />
                            </View>

                            <View className="flex flex-row items-center justify-center mt-6">
                                <TouchableOpacity onPress={() => navigation.navigate("SignUp")} className="flex-row">
                                    <Text className="text-gray-400 text-sm" style={{ fontFamily: "Montserrat-Regular" }}>Don't have an account?</Text>
                                    <Text 
                                        className="text-sm ml-1"
                                        style={{ 
                                            color: theme.primary,
                                            fontFamily: "Montserrat-SemiBold"
                                        }}
                                    >
                                        Sign Up
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </ScrollView>

            <Image
                source={require('../../../assets/images/hand-welcome.png')}
                className="
                    absolute
                    w-40
                    h-56
                    -rotate-45
                    -bottom-10
                    -right-10
                "
            />
        </KeyboardAvoidingView>
    )
}

export default SignInScreen