import { View, Text, KeyboardAvoidingView, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from '@react-navigation/native';

import { FireBaseContext } from '../../context/FireBaseContext'
import { AuthInputField, LargeButton } from '../../components/index'

const ForgotPasswordScreen = () => {
    const { forgotPassword } = useContext(FireBaseContext)
    const navigation = useNavigation()

    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: "",
        }
    });

    const onSubmit = async () => {
        setLoading(true)

        try {
            await forgotPassword(email)
            alert('Check your email')
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
            navigation.goBack()
        }
    }

    return (
        <KeyboardAvoidingView 
            className="flex-1 bg-[#F5F8FE]"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <SafeAreaView className="flex-1 items-center justify-center">
                <View className="px-10 w-full">
                    <View className="mt-6">
                        <Text className="text-2xl text-gray-800" style={{ fontFamily: "Montserrat-Medium" }} >
                            Forgot Password
                        </Text>
                        <Text className="text-gray-400 text-xs" style={{ fontFamily: "Montserrat-Regular" }}>
                            Enter your email address to receive a link to reset your password.
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

                        <View className="mt-6">
                            <LargeButton
                                handleSubmit={handleSubmit}
                                onSubmit={onSubmit}
                                loading={loading}
                                text="Send Reset Link"
                            />
                        </View>

                        <View className="flex flex-row items-center justify-center mt-6">
                            <TouchableOpacity onPress={() => navigation.navigate("SignIn")} className="flex-row">
                                <Text className="text-gray-400 text-sm" style={{ fontFamily: "Montserrat-Regular" }}>
                                    Remember your password?
                                </Text>
                                <Text 
                                    className="text-sm ml-1"
                                    style={{ 
                                        color: "#4D7A80",
                                        fontFamily: "Montserrat-SemiBold"
                                    }}
                                >
                                    Sign In
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default ForgotPasswordScreen