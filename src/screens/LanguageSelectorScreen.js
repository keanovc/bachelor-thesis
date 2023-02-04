import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import CountryFlag from "react-native-country-flag";
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const translations = {
  nl: { welcome: 'Hallo', name: 'Charlie' },
  fr: { welcome: 'Bonjour', name: 'Charlie' },
};
const i18n = new I18n(translations);

i18n.locale = getLocales()[0].languageCode;

i18n.enableFallback = true;

const LanguageSelectorScreen = () => {
  return (
    <View className="flex flex-col items-center justify-center h-full">
      <Text className="text-2xl">{i18n.t('welcome')}</Text>
      <Text className="text-2xl">{i18n.t('name')}</Text>

      <View className="flex flex-row mt-4">
        <TouchableOpacity
          className="flex flex-row items-center justify-center bg-blue-500 rounded-lg px-4 py-2 mr-2"
          onPress={() => i18n.locale = 'nl'}
        >
          <CountryFlag isoCode='nl' size={25} />
          <Text className="ml-2">Dutch</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex flex-row items-center justify-center bg-blue-500 rounded-lg px-4 py-2"
          onPress={() => i18n.locale = 'fr'}
        >
          <CountryFlag isoCode='fr' size={25} />
          <Text className="ml-2">French</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default LanguageSelectorScreen