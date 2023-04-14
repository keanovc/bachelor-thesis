import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { EventRegister } from 'react-native-event-listeners';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import Theme from './src/constants/theme';
import ThemeContext from './src/context/ThemeContext';

import { UserProvider } from './src/context/UserContext';
import { FireBaseProvider } from './src/context/FireBaseContext';

import AppStackScreens from './src/stacks/AppStackScreens';

export default function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [fontsLoaded] = useFonts({
    'Montserrat-Italic': require('./assets/fonts/Montserrat-Italic.ttf'),
    'Montserrat-MediumItalic': require('./assets/fonts/Montserrat-MediumItalic.ttf'),
    'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-SemiBold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
    'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Light': require('./assets/fonts/Montserrat-Light.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);
  
  useEffect(() => {
    const listener = EventRegister.addEventListener('toggleTheme', (value) => {
      setDarkMode(value)
    })

    return () => {
      EventRegister.removeEventListener(listener)
    }
  }, [darkMode])

  if (!fontsLoaded) {
    return undefined;
  } else {
    SplashScreen.hideAsync();
  }

  return (
    <ThemeContext.Provider value={Theme[darkMode ? 'dark' : 'light']}>
      <FireBaseProvider>
        <UserProvider>
          <NavigationContainer theme={darkMode ? DarkTheme : DefaultTheme}>
            <AppStackScreens />
            <StatusBar 
              barStyle={darkMode ? 'light-content' : 'dark-content'} 
              backgroundColor={darkMode ? '#121212' : '#F5F8FE'}
            />
          </NavigationContainer>
        </UserProvider>
      </FireBaseProvider>
    </ThemeContext.Provider>
  );
}