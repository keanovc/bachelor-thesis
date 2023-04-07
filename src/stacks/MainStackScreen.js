import React, { useContext } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import ThemeContext from '../context/ThemeContext'
import 'react-native-gesture-handler'

// Main Screens
import HomeScreen from '../screens/main/home/HomeScreen'
import BudgetScreen from '../screens/main/budget/BudgetScreen'
import GoalsCategoriesScreen from '../screens/main/achievements/GoalsCategoriesScreen'
import EducationalScreen from '../screens/main/educational/EducationalScreen'
import SettingsScreen from '../screens/main/settings/SettingsScreen'

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
            backgroundColor: theme.nav,
            height: 80,
            borderTopWidth: 0,
            paddingTop: 10,
            paddingHorizontal: 10,
            shadowColor: theme.shadow,
            shadowOffset: {
                width: 0,
                height: 10,
            },
            shadowOpacity: 0.53,
            shadowRadius: 13.97,
            elevation: 21,
        },

        tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'ios-home';

            switch (route.name) {
                case 'Home':
                    iconName = focused ? 'grid' : 'grid-outline';
                    break;
                case 'Budget':
                    iconName = focused ? 'wallet' : 'wallet-outline';
                    break;
                case 'Goals':
                    iconName = focused ? 'golf' : 'golf-outline';
                    break;
                case 'Educational':
                    iconName = focused ? 'school' : 'school-outline';
                    break;
                case 'Settings':
                    iconName = focused ? 'settings' : 'settings-outline';
                    break;
            }

            return <Ionicons name={iconName} size={size} color={color} />;
        },
    })

    return (
        <MainStack.Navigator screenOptions={screenOptions}>
            <MainStack.Screen name="Home" component={HomeScreen} />
            <MainStack.Screen name="Budget" component={BudgetScreen} />
            <MainStack.Screen name="Goals" component={GoalsCategoriesScreen} />
            <MainStack.Screen name="Educational" component={EducationalScreen} />
            <MainStack.Screen name="Settings" component={SettingsScreen} />
        </MainStack.Navigator>
    )
}

export default MainStackScreen