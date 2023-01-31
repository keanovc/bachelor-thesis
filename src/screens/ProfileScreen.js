import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import ThemeContext from '../context/ThemeContext'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useNavigation } from '@react-navigation/native'

import { UserContext } from '../context/UserContext'
import { FireBaseContext } from '../context/FireBaseContext'

const ProfileScreen = () => {
    const [user, setUser] = useContext(UserContext)
    const firebase = useContext(FireBaseContext)
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()

    const [username, setUsername] = useState(user.username)
    const [profilePicture, setProfilePicture] = useState(user.profilePicture)
    const [email, setEmail] = useState(user.email)

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

    const updateProfile = () => {
        firebase.updateProfile({
            username,
            email,
            profilePicture,
        })

        setUser({
            ...user,
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
                    <Text className="text-2xl font-semibold" style={{ color: theme.text }}>Account</Text>
                </View>

                <View className="mt-8 px-6">
                    <TouchableOpacity 
                        onPress={addProfilePicture}
                        className="bg-gray-200 w-32 h-32 rounded-full self-center overflow-hidden"
                    >
                        {profilePicture ? (
                            <Image source={{ uri: profilePicture }} className="flex-1" />
                        ) : (
                            <View className="items-center justify-center flex-1">
                                <AntDesign name="plus" size={24} color="white" />
                            </View>
                        )}
                    </TouchableOpacity>

                    <Text className="text-lg font-semibold mt-8" style={{ color: theme.text }}>Username</Text>
                    <TextInput
                        className="mt-2 px-4 py-2 rounded-md
                            bg-gray-200
                        "
                        value={username}
                        onChangeText={setUsername}
                    />

                    <Text className="text-lg font-semibold mt-4" style={{ color: theme.text }}>Email</Text>
                    <TextInput  
                        className="mt-2 px-4 py-2 rounded-md
                            bg-gray-200
                        "
                        value={email}
                        onChangeText={setEmail}
                    />

                    <TouchableOpacity
                        className="flex-row items-center justify-center
                            mt-10 px-4 py-2 rounded-md
                            bg-indigo-500
                        "
                        onPress={updateProfile}
                    >
                        <Text className="text-lg font-semibold text-white">Update</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ProfileScreen