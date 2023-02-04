import React, { useContext } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import ThemeContext from '../context/ThemeContext'

import HomeScreen from '../screens/HomeScreen'
import MessageScreen from '../screens/MessageScreen'
import PostScreen from '../screens/PostScreen'
import NotificationScreen from '../screens/NotificationScreen'
import SettingsScreen from '../screens/SettingsScreen'

const MainStackScreen = () => {
    const MainStack = createBottomTabNavigator()
    const theme = useContext(ThemeContext)

    const screenOptions = ({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: 'lightgray',
        tabBarShowLabel: false,
        tabBarStyle: {
            showLabel: false,
            backgroundColor: theme.background,
            height: 80,
        },

        tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'ios-home';

            switch (route.name) {
                case 'Home':
                    iconName = focused ? 'home' : 'home-outline';
                    break;
                case 'Message':
                    iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    break;
                case 'Notification':
                    iconName = focused ? 'notifications' : 'notifications-outline';
                    break;
                case 'Settings':
                    iconName = focused ? 'settings' : 'settings-outline';
                    break;
            }

            if (route.name === 'Post') {
                return (
                    <Ionicons name="add-circle" size={size + 24} color={theme.primary} style={{
                        shadowColor: theme.primary,
                        shadowOffset: {
                            width: 0,
                            height: 10,
                        },
                        shadowRadius: 10,
                        shadowOpacity: 0.3,
                    }} />
                );
            }

            return <Ionicons name={iconName} size={size} color={color} />;
        },
    })

    return (
        <MainStack.Navigator screenOptions={screenOptions}>
            <MainStack.Screen name="Home" component={HomeScreen} />
            <MainStack.Screen name="Message" component={MessageScreen} />
            <MainStack.Screen name="Post" component={PostScreen} />
            <MainStack.Screen name="Notification" component={NotificationScreen} />
            <MainStack.Screen name="Settings" component={SettingsScreen} />
        </MainStack.Navigator>
    )
}

export default MainStackScreen