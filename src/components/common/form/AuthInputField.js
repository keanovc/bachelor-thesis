import { TextInput } from 'react-native'
import React, { useContext } from 'react'

import ThemeContext from '../../../context/ThemeContext'

const AuthInputField = ({
    onBlur,
    onChange,
    value,
    setValue,
    placeholder,
    autoCapitalize,
    autoCompleteType,
    autoCorrect,
    secureTextEntry = false,
    login = false,
}) => {
    const theme = useContext(ThemeContext)

    return (
        <TextInput  
            className="rounded-lg w-full py-4 px-3 leading-tight"
            style={
                login ? {
                    backgroundColor: "white",
                    color: "black",
                    fontFamily: "Montserrat-Regular",
                    fontSize: 14,
                } : {
                    backgroundColor: theme.input,
                    color: theme.text,
                    fontFamily: "Montserrat-Regular",
                    fontSize: 14,
                }
            }
            onBlur={onBlur}
            onChangeText={
                (value) => {
                    onChange(value)
                    setValue(value)
                }
            }
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#9E9E9E"
            autoCapitalize={autoCapitalize}
            autoCompleteType={autoCompleteType}
            autoCorrect={autoCorrect}
            secureTextEntry={secureTextEntry}
        />
    )
}

export default AuthInputField