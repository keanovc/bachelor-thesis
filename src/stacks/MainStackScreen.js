import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'

import HomeScreen from '../screens/HomeScreen'
import MessageScreen from '../screens/MessageScreen'
import PostScreen from '../screens/PostScreen'
import NotificationScreen from '../screens/NotificationScreen'
import ProfileScreen from '../screens/ProfileScreen'

const MainStackScreen = () => {
    const MainStack = createBottomTabNavigator()

    const screenOptions = ({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: 'lightgray',
        tabBarShowLabel: false,
        tabBarStyle: {
            showLabel: false,
            backgroundColor: '#FEFEFE',
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
                case 'Profile':
                    iconName = focused ? 'person' : 'person-outline';
                    break;
            }

            if (route.name === 'Post') {
                return (
                    <Ionicons name="add-circle" size={size + 24} color="#667eea" style={{
                        shadowColor: '#667eea',
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
            <MainStack.Screen name="Profile" component={ProfileScreen} />
        </MainStack.Navigator>
    )
}

export default MainStackScreen