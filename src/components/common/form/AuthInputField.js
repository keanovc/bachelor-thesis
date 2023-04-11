import { TextInput } from 'react-native'
import React, { useContext } from 'react'

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
                color: "black",
                backgroundColor: "white",
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
            placeholderTextColor="#9E9E9E"
            autoCapitalize={autoCapitalize}
            autoCompleteType={autoCompleteType}
            autoCorrect={autoCorrect}
            secureTextEntry={secureTextEntry}
        />
    )
}

export default AuthInputField