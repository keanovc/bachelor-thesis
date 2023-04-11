import { TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { Ionicons } from '@expo/vector-icons'

import ThemeContext from '../../../context/ThemeContext'

const IconButton = ({
    onPress,
    icon
}) => {
    const theme = useContext(ThemeContext)

    return (
        <TouchableOpacity className="
                flex-row items-center justify-center
                w-10 h-10 rounded-md
            "
            style={{ backgroundColor: theme.accent }}
            onPress={onPress}
        >
            <Ionicons 
                name={icon}
                size={24} 
                color={theme.primary}
            />
        </TouchableOpacity>
    )
}

export default IconButton