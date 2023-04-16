import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Controller } from 'react-hook-form'

import ThemeContext from '../../context/ThemeContext'
import AuthInputField from '../common/form/AuthInputField'
import LargeButton from '../common/form/LargeButton'

const ProfileSignIn = ({
    modalVisible,
    setModalVisible,
    control,
    errors,
    handleSubmit,
    setEmail,
    setPassword,
    onSubmit,
    loading
}) => {
    const theme = useContext(ThemeContext)

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
        >
            <View className="flex-1 justify-center items-center">
                <View 
                    className="w-11/12 rounded-xl p-10 shadow-lg"
                    style={{ backgroundColor: theme.background }}
                >
                    <TouchableOpacity
                        className="absolute top-4 right-4"
                        onPress={() => setModalVisible(false)}
                    >
                        <Ionicons name="close" size={24} color={theme.primary} />
                    </TouchableOpacity>

                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-lg font-bold" style={{ color: theme.text, fontFamily: "Montserrat-Medium" }}>Sign In</Text>
                            <Text className="text-xs font-regular mt-1 text-gray-400" style={{ fontFamily: "Montserrat-Light" }}>
                                Before you can edit your profile
                            </Text>
                        </View>
                    </View>

                    <View className="mt-6">
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <AuthInputField
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    value={value}
                                    setValue={setEmail}
                                    placeholder="Email"
                                    autoCapitalize='none'
                                    autoCompleteType='email'
                                    autoCorrect={false}
                                    keyboardType='email-address'
                                />
                            )}
                            name="email"
                        />
                        {errors.email && <Text className="text-red-500" style={{ fontFamily: "Montserrat-Regular" }}>
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
                        {errors.password && <Text className="text-red-500" style={{ fontFamily: "Montserrat-Regular" }}>
                            {errors.password.type === "required" && "This is required."}
                            {errors.password.type === "minLength" && "Password must be at least 8 characters."}
                            {errors.password.type === "pattern" && "Password cannot contain spaces."}
                        </Text>}
                    </View>

                    <View className="mt-4">
                        <LargeButton
                            handleSubmit={handleSubmit}
                            onSubmit={onSubmit}
                            loading={loading}
                            text="Sign In"
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default ProfileSignIn