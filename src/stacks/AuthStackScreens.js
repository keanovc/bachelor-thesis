import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';

const AuthStackScreens = () => {
    const AuthStack = createStackNavigator();

    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="SignIn" component={SignInScreen} />
            <AuthStack.Screen name="SignUp" component={SignUpScreen} />
        </AuthStack.Navigator>
    )
}

export default AuthStackScreens