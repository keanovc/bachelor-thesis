import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState, useContext } from 'react'
import CountryFlag from "react-native-country-flag";
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { en, nl, es } from '../../../services/i18n/supportedLanguages';

const i18n = new I18n();
i18n.translations = { en, nl, es };
i18n.locale = Localization.locale;
i18n.enableFallbacks = true;

const LanguageSelectorScreen = () => {
  const [locale, setLocale] = useState(i18n.locale)

  const changeLanguage = (locale) => {
    i18n.locale = locale;
    setLocale(locale)

    AsyncStorage.setItem('locale', locale)
  }

  return (
    <View className="flex flex-col items-center justify-center h-full">
      <Text className="text-lg" style={{ fontFamily: "Montserrat-SemiBold" }}>{i18n.t('welcome')}</Text>

      <Text className="text-lg mt-4" style={{ fontFamily: "Montserrat-SemiBold" }}>Select your language</Text>

      <View className="mt-4 space-y-4">
        <TouchableOpacity onPress={() => changeLanguage('en')}>
          <CountryFlag isoCode="gb" size={20} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changeLanguage('nl')}>
          <CountryFlag isoCode="nl" size={20} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changeLanguage('es')}>
          <CountryFlag isoCode="es" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default LanguageSelectorScreen