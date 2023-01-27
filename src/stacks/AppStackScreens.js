import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import { UserContext } from '../context/UserContext';

import AuthStackScreens from './AuthStackScreens';
import MainStackScreen from './MainStackScreen';

const AppStackScreens = () => {
    const AppStack = createStackNavigator();
    const [user] = useContext(UserContext);

    return (
        <AppStack.Navigator screenOptions={{ headerShown: false }} >
            {user.isLoggedIn ? (
                <AppStack.Screen name="Main" component={MainStackScreen} />
            ) : (
                <AppStack.Screen name="Auth" component={AuthStackScreens} />
            )}
        </AppStack.Navigator>
    )
}

export default AppStackScreens