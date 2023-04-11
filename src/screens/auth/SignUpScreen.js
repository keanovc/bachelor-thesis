import { View, Image, Text, TextInput, TouchableOpacity, ActivityIndicator, Platform, ScrollView, KeyboardAvoidingView, SafeAreaView } from 'react-native'
import React, { useState, useContext } from 'react'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useForm, Controller } from "react-hook-form";

import ThemeContext from '../../context/ThemeContext'
import { FireBaseContext } from '../../context/FireBaseContext'
import { UserContext } from '../../context/UserContext'
import { AuthInputField, LargeButton } from '../../components/index'

const SignUpScreen = ({ navigation }) => {
    const [fullname, setFullname] = useState('')
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
            fullname: "",
            username: "",
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
                fullname,
                username,
                email,
                password,
                profilePicture
            }

            const createdUser = await firebase.createUserWithEmailAndPassword(user)
            const uid = firebase.getCurrentUser().uid
            const userInfo = await firebase.getUserInfo(uid)

            setUser({
                ...createdUser,
                uid: uid,
                username: userInfo.username,
                fullname: userInfo.fullname,
                email: userInfo.email,
                profilePicture: userInfo.profilePicture,
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
                style={{ 
                    backgroundColor: theme.background,
                }}
        >
            <ScrollView
                bounces={false}
            >
                <SafeAreaView className="flex-1">
                    <View className="px-10 pt-36">
                        <Text className="text-2xl font-light text-gray-800" style={{ fontFamily: "Montserrat-Medium" }}>
                            Create an account!
                        </Text>
                        <Text className="text-gray-400 text-xs" style={{ fontFamily: "Montserrat-Regular" }}>
                            Bring clarity to your financial future
                        </Text>

                        <TouchableOpacity 
                            onPress={addProfilePicture}
                            className="bg-slate-200 w-20 h-20 rounded-full self-center overflow-hidden mt-6"
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
                                }}
                                render={({ field: { onChange, onBlur } }) => (
                                    <AuthInputField
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        value={fullname}
                                        setValue={setFullname}
                                        placeholder="Full Name"
                                        autoCapitalize='none'
                                        autoCompleteType='username'
                                        autoCorrect={false}
                                    />
                                )}
                                name="fullname"
                            />
                            {errors.fullname && <Text className="text-red-500 text-xs mt-1" style={{ fontFamily: "Montserrat-Regular" }}>
                                {errors.fullname.type === "required" && "Full name is required"}
                            </Text>}
                        </View>

                        <View className="mt-4">
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                    pattern: /^[^\s]+$/,
                                }}
                                render={({ field: { onChange, onBlur } }) => (
                                    <AuthInputField
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        value={username}
                                        setValue={setUsername}
                                        placeholder="Display Name"
                                        autoCapitalize='none'
                                        autoCompleteType='username'
                                        autoCorrect={false}
                                    />
                                )}
                                name="username"
                            />
                            {errors.username && <Text className="text-red-500 text-xs mt-1" style={{ fontFamily: "Montserrat-Regular" }}>
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
                                    />
                                )}
                                name="password"
                            />
                            {errors.password && <Text className="text-red-500 text-xs mt-1" style={{ fontFamily: "Montserrat-Regular" }}>
                                {errors.password.type === "required" && "This is required."}
                                {errors.password.type === "minLength" && "Password must be at least 8 characters."}
                                {errors.password.type === "pattern" && "Password cannot contain spaces"}
                            </Text>}
                        </View>

                        <View className="mt-8">
                            <LargeButton
                                handleSubmit={handleSubmit}
                                onSubmit={onSubmit}
                                loading={loading}
                                text="Create"
                            />

                            {/* <TouchableOpacity 
                                onPress={handleSubmit(onSubmit)}
                                disabled={loading} 
                                className="w-full h-12 rounded-md items-center justify-center mx-auto"
                                style={{ backgroundColor: theme.primary }}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text className="text-white text-center text-md" style={{ fontFamily: "Montserrat-SemiBold" }}>Create</Text>
                                )}
                            </TouchableOpacity> */}
                        </View>

                        <View className="flex flex-row items-center justify-center mt-6">
                            <TouchableOpacity onPress={() => navigation.navigate("SignIn")} className="flex-row">
                                <Text className="text-gray-400 text-sm">Already have an account?</Text>
                                <Text 
                                    className="text-sm ml-1 font-bold"
                                    style={{ 
                                        color: theme.primary,
                                        fontFamily: 'Montserrat-Medium'
                                    }}
                                >
                                    Sign In
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default SignUpScreen