import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from "react-hook-form";

import ThemeContext from '../../../context/ThemeContext'
import { UserContext } from '../../../context/UserContext'
import { FireBaseContext } from '../../../context/FireBaseContext'
import { AuthInputField, LargeButton } from '../../../components/index'

const ProfileScreen = () => {
    const [user, setUser] = useContext(UserContext)
    const firebase = useContext(FireBaseContext)
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()

    const [profilePicture, setProfilePicture] = useState(user.profilePicture)
    const [fullname, setFullname] = useState(user.fullname)
    const [username, setUsername] = useState(user.username)
    const [email, setEmail] = useState(user.email)

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            fullname: user.fullname,
            username: user.username,
            email: user.email,
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

    const onSubmit = () => {
        firebase.updateProfile({
            fullname,
            username,
            email,
            profilePicture,
        })

        setUser({
            ...user,
            fullname,
            username,
            email,
            profilePicture,
        })

        navigation.goBack()
    }

    return (
        <SafeAreaView
            className="flex-1 px-10"
            style={{
                backgroundColor: theme.background,
            }}
        >
            <View className="px-6">
                <View className="flex-row items-center mt-8 space-x-2">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text className="text-2xl font-semibold" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>Account</Text>
                </View>

                <View className="mt-8 px-6">
                    <TouchableOpacity 
                        onPress={addProfilePicture}
                        className="bg-gray-200 w-32 h-32 rounded-full self-center overflow-hidden"
                    >
                        {profilePicture !== "default" ? (
                            <Image source={{ uri: profilePicture }} className="flex-1" />
                        ) : (
                            <View className="items-center justify-center flex-1">
                                <Ionicons name="add" size={48} color="lightgray" />
                            </View>
                        )}
                    </TouchableOpacity>

                    <View className="mt-8">
                        <Text className="text-xs text-gray-400 mb-2 uppercase" style={{ fontFamily: "Montserrat-Regular" }}>Full name</Text>
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
                                    placeholder="Enter your full name"
                                    autoCapitalize='none'
                                    autoCompleteType='fullname'
                                    autoCorrect={false}
                                />
                            )}
                            name="fullname"
                        />
                        {errors.fullname && <Text className="text-red-500" style={{ fontFamily: "Montserrat-Regular" }}>
                            {errors.fullname.type === "required" && "Full Name is required"}
                        </Text>}
                    </View>

                    <View className="mt-4">
                        <Text className="text-xs text-gray-400 mb-2 uppercase" style={{ fontFamily: "Montserrat-Regular" }}>Username</Text>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                pattern: /^[^\s]+$/,
                            }}
                            render={({ field: { onChange, onBlur, } }) => (
                                <AuthInputField
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    value={username}
                                    setValue={setUsername}
                                    placeholder="Enter your username"
                                    autoCapitalize='none'
                                    autoCompleteType='username'
                                    autoCorrect={false}
                                />
                            )}
                            name="username"
                        />
                        {errors.username && <Text className="text-red-500" style={{ fontFamily: "Montserrat-Regular" }}>
                            {errors.username.type === "required" && "Username is required"}
                            {errors.username.type === "pattern" && "Username cannot contain spaces"}
                        </Text>}
                    </View>

                    <View className="mt-4">
                        <Text className="text-xs text-gray-400 mb-2 uppercase">Email</Text>
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
                                    placeholder="Enter your email"
                                    autoCapitalize='none'
                                    autoCompleteType='email'
                                    autoCorrect={false}
                                />
                            )}
                            name="email"
                        />
                        {errors.email && <Text className="text-red-500" style={{ fontFamily: "Montserrat-Regular" }}>
                            {errors.email.type === "required" && "This is required."}
                            {errors.email.type === "pattern" && "Please enter a valid email."}
                        </Text>}
                    </View>

                    <View className="mt-8">
                        <LargeButton
                            handleSubmit={handleSubmit}
                            onSubmit={onSubmit}
                            loading={false}
                            text="Update"
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ProfileScreen