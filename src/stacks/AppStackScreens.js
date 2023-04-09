import React, { useContext, useState, useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserContext } from '../context/UserContext';

// Stack Screens
import AuthStackScreens from './AuthStackScreens';
import MainStackScreen from './MainStackScreen';

// Others
import LoadingScreen from '../screens/others/LoadingScreen';
import OnBoardingScreen from '../screens/others/OnBoardingScreen';

// Home
import MessageScreen from '../screens/main/home/MessageScreen';

// Budget
import BudgetScreen from '../screens/main/budget/BudgetScreen';

// Goals
import GoalsScreen from '../screens/main/achievements/GoalsScreen';
import IndividualGoalScreen from '../screens/main/achievements/IndividualGoalScreen';

// Settings
import SettingsScreen from '../screens/main/settings/SettingsScreen';
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

                    {/* Budget */}
                    <AppStack.Screen name="Budget" component={BudgetScreen} />

                    {/* Goals */}
                    <AppStack.Screen name="Goals" component={GoalsScreen} />
                    <AppStack.Screen name="IndGoal" component={IndividualGoalScreen} 
                        options={{
                            presentation: 'modal',
                        }}
                    />

                    {/* Settings */}
                    <AppStack.Screen name="Settings" component={SettingsScreen} />
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