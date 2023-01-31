import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { EventRegister } from 'react-native-event-listeners';
import Theme from './src/styles/Theme';
import ThemeContext from './src/context/ThemeContext';

import { UserProvider } from './src/context/UserContext';
import { FireBaseProvider } from './src/context/FireBaseContext';

import AppStackScreens from './src/stacks/AppStackScreens';

export default function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const listener = EventRegister.addEventListener('toggleTheme', (value) => {
      setDarkMode(value)
    })

    return () => {
      EventRegister.removeEventListener(listener)
    }
  }, [darkMode])

  return (
    <ThemeContext.Provider value={Theme[darkMode ? 'dark' : 'light']}>
      <FireBaseProvider>
        <UserProvider>
          <NavigationContainer theme={darkMode ? DarkTheme : DefaultTheme}>
            <AppStackScreens />
            <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
          </NavigationContainer>
        </UserProvider>
      </FireBaseProvider>
    </ThemeContext.Provider>
  );
}