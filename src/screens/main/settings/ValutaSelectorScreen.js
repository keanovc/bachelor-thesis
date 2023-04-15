import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useContext } from 'react'
import { formatCurrency, getSupportedCurrencies } from "react-native-format-currency";
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

import ThemeContext from '../../../context/ThemeContext'
import { UserContext } from '../../../context/UserContext'
import { FireBaseContext } from '../../../context/FireBaseContext'
import { IconButton } from '../../../components';

const ValutaSelectorScreen = () => {
    const [user, setUser] = useContext(UserContext)
    const theme = useContext(ThemeContext)
    const firebase = useContext(FireBaseContext)
    const navigation = useNavigation()

    const [valuta, setValuta] = useState(user.valuta ? user.valuta : "USD")
    const [symbol, setSymbol] = useState("$")
    const [symbolBefore, setSymbolBefore] = useState(true)

    const currencyCodes = getSupportedCurrencies()

    const onSubmit = () => {
        try {
            firebase.updateCurrency({
                symbol: symbol,
                symbolBefore: symbolBefore,
                valuta: valuta,
            })

            setUser({
                ...user,
                symbol: symbol,
                symbolBefore: symbolBefore,
                valuta: valuta,
            })
        } catch (error) {
            console.log(error)
        }

        navigation.goBack()
    }

    return (
        <SafeAreaView 
            className="flex-1"
            style={{ backgroundColor: theme.background }}
        >
            <View className="px-6">
                <View className="flex flex-row items-center">
                    <IconButton
                        onPress={() => navigation.goBack()}
                        icon="chevron-back-outline"
                    />

                    <View className="flex flex-col">
                        <Text className="text-lg ml-4" style={{ color: theme.text, fontFamily: "Montserrat-SemiBold" }}>
                            Valuta Selector
                        </Text>

                        <Text className="text-xs ml-4" style={{ color: theme.text, fontFamily: "Montserrat-Light" }}>
                            Select your preferred currency
                        </Text>
                    </View>
                </View>

                <ScrollView className="flex mt-6 mb-32">
                    <View className="flex flex-row items-center justify-center flex-wrap">
                        {
                            currencyCodes.map((item, index) => {
                                const [valueFormattedWithSymbol, valueFormattedWithoutSymbol, symbol] = formatCurrency({ amount: 200, code: item.code })
                                
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        className="flex flex-row items-center justify-center w-1/4 px-2 py-8 rounded-xl m-3"
                                        style={
                                            valuta === item.code ? {
                                                backgroundColor: theme.primary,
                                            } : {
                                                backgroundColor: theme.secondary,
                                            }
                                        }
                                        onPress={() => {
                                            setValuta(item.code)
                                            setSymbol(symbol)
                                            setSymbolBefore(valueFormattedWithSymbol.startsWith(symbol))
                                        }}
                                    >
                                        <View className="flex flex-col items-center justify-center">
                                            <Text 
                                                className="mb-1"
                                                style={
                                                    valuta === item.code ? {
                                                        color: "white",
                                                        fontFamily: "Montserrat-Bold"
                                                    } : {
                                                        color: theme.text,
                                                        fontFamily: "Montserrat-SemiBold"
                                                    }
                                                }
                                            >
                                                {item.code}
                                            </Text>
                                            
                                            <Text style={
                                                valuta === item.code ? {
                                                    color: "white",
                                                    fontFamily: "Montserrat-Bold"
                                                } : {
                                                    color: theme.text,
                                                    fontFamily: "Montserrat-Light"
                                                }
                                            }>
                                                ({valueFormattedWithSymbol})
                                            </Text>
                                        </View>

                                        {
                                            valuta === item.code && (
                                                <View className="absolute right-1 top-1">
                                                    <Ionicons name="checkmark-circle" size={24} color="white" />
                                                </View>
                                            )
                                        }
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </ScrollView>
            </View>

            <View className="flex flex-row items-center justify-center absolute bottom-10 mx-10">
                <TouchableOpacity
                    className="flex flex-row items-center justify-center py-4 rounded-full"
                    style={{
                        backgroundColor: theme.primary,
                        width: "100%",
                    }}
                    onPress={onSubmit}
                >
                    <Text style={{
                        color: "white",
                        fontFamily: "Montserrat-Bold"
                    }}>
                        Save
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ValutaSelectorScreen