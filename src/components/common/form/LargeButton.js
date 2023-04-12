import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'

import ThemeContext from '../../../context/ThemeContext'

const LargeButton = ({
    handleSubmit,
    onSubmit,
    loading,
    text
}) => {
    const theme = useContext(ThemeContext)
    
    return (
        <TouchableOpacity 
            onPress={handleSubmit(onSubmit)} 
            disabled={loading} 
            className="rounded-lg py-4 px-3 w-full"
            style={{ backgroundColor: theme.primary }}
        >
            {loading ? (
                <ActivityIndicator size="small" color="#fff" />
            ) : (
                <Text className="text-white text-center text-sm" style={{ fontFamily: "Montserrat-SemiBold" }}>
                    {text}
                </Text>
            )}
        </TouchableOpacity>
    )
}

export default LargeButton