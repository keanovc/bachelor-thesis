import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { UserProvider } from './src/context/UserContext';
import { FireBaseProvider } from './src/context/FireBaseContext';

import AppStackScreens from './src/stacks/AppStackScreens';

export default function App() {
  return (
    <FireBaseProvider>
      <UserProvider>
        <NavigationContainer>
          <AppStackScreens />
        </NavigationContainer>
      </UserProvider>
    </FireBaseProvider>
  );
}