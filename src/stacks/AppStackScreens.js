import React, { useContext, useState, useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserContext } from '../context/UserContext';

import AuthStackScreens from './AuthStackScreens';
import MainStackScreen from './MainStackScreen';

import LoadingScreen from '../screens/others/LoadingScreen';
import OnBoardingScreen from '../screens/others/OnBoardingScreen';

import WalkthroughScreen from '../screens/auth/WalkthroughScreen';
import MessageScreen from '../screens/main/home/MessageScreen';
import GoalsScreen from '../screens/main/achievements/GoalsScreen';
import ProfileScreen from '../screens/main/settings/ProfileScreen';
import LanguageSelectorScreen from '../screens/main/settings/LanguageSelectorScreen';

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
                    {/* Main */}
                    <AppStack.Screen name="Main" component={MainStackScreen} />
                    {/* Home */}
                    <AppStack.Screen name="Message" component={MessageScreen} />
                    {/* Goals */}
                    <AppStack.Screen name="Goals" component={GoalsScreen} />
                    {/* Settings */}
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