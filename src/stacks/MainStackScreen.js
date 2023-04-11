import React, { useContext } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import ThemeContext from '../context/ThemeContext'
import 'react-native-gesture-handler'

// Main Screens
import HomeScreen from '../screens/main/home/HomeScreen'
import BudgetCategoriesScreen from '../screens/main/budget/BudgetCategoriesScreen'
import GoalsCategoriesScreen from '../screens/main/achievements/GoalsCategoriesScreen'
import EducationalScreen from '../screens/main/educational/EducationalScreen'

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
            paddingHorizontal: 10
        },

        tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'ios-home';

            switch (route.name) {
                case 'Home':
                    iconName = focused ? 'grid' : 'grid-outline';
                    break;
                case 'BudgetCategories':
                    iconName = focused ? 'wallet' : 'wallet-outline';
                    break;
                case 'GoalsCategories':
                    iconName = focused ? 'golf' : 'golf-outline';
                    break;
                case 'Educational':
                    iconName = focused ? 'school' : 'school-outline';
                    break;
            }

            return <Ionicons name={iconName} size={size} color={color} />;
        },
    })

    return (
        <MainStack.Navigator screenOptions={screenOptions}>
            <MainStack.Screen name="Home" component={HomeScreen} />
            <MainStack.Screen name="BudgetCategories" component={BudgetCategoriesScreen} />
            <MainStack.Screen name="GoalsCategories" component={GoalsCategoriesScreen} />
            <MainStack.Screen name="Educational" component={EducationalScreen} />
        </MainStack.Navigator>
    )
}

export default MainStackScreen