import React, { useContext, useState, useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserContext } from '../context/UserContext';

import AuthStackScreens from './AuthStackScreens';
import MainStackScreen from './MainStackScreen';

import LoadingScreen from '../screens/LoadingScreen';
import OnBoardingScreen from '../screens/OnBoardingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LanguageSelectorScreen from '../screens/LanguageSelectorScreen';

const AppStackScreens = () => {
    const AppStack = createStackNavigator();
    const [user] = useContext(UserContext);
    const [viewedOnBoarding, setViewedOnBoarding] = useState(false)

    const checkOnBoarding = async () => {
        try {
          const value = await AsyncStorage.getItem('@viewedOnBoarding')
          if (value !== null) {
            setViewedOnBoarding(true)
          }
        } catch (e) {
          console.log(e)
        }
    }

    useEffect(() => {
        checkOnBoarding()
    }, [])

    return (
        <AppStack.Navigator screenOptions={{ headerShown: false }} >
            {user.isLoggedIn === null ? (
                <AppStack.Screen name="Loading" component={LoadingScreen} />
            ) : !viewedOnBoarding ? (
                <>
                    <AppStack.Screen name="OnBoarding" component={OnBoardingScreen} />
                    <AppStack.Screen name="Auth" component={AuthStackScreens} />
                </>
            ) : user.isLoggedIn ? (
                <>
                    <AppStack.Screen name="Main" component={MainStackScreen} />
                    <AppStack.Screen name="Profile" component={ProfileScreen} />
                    <AppStack.Screen name="LanguageSelector" component={LanguageSelectorScreen} 
                        options={{ 
                            presentation: 'modal',
                        }}
                    />
                </>
            ) : (
                <AppStack.Screen name="Auth" component={AuthStackScreens} />
            )}
        </AppStack.Navigator>
    )
}

export default AppStackScreens