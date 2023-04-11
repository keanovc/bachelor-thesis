import { TextInput } from 'react-native'
import React from 'react'

const AuthInputField = ({
    onBlur,
    onChange,
    value,
    setValue,
    placeholder,
    autoCapitalize,
    autoCompleteType,
    autoCorrect,
    secureTextEntry = false
}) => {
    return (
        <TextInput  
            className="rounded-lg w-full py-3 px-3 leading-tight"
            style={{ 
                color: theme.text,
                backgroundColor: theme.input,
                fontFamily: "Montserrat-Regular",
                fontSize: 14,
            }}
            onBlur={onBlur}
            onChangeText={
                (value) => {
                    onChange(value)
                    setValue(value)
                }
            }
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#A9A9A9"
            autoCapitalize={autoCapitalize}
            autoCompleteType={autoCompleteType}
            autoCorrect={autoCorrect}
            secureTextEntry={secureTextEntry}
        />
    )
}

export default AuthInputField