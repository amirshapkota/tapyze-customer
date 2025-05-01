// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import WelcomeScreen from './app/screens/WelcomeScreen'; 
import AuthScreen from './app/screens/AuthScreen';
import DashboardScreen from './app/screens/DashboardScreen';
import CardManagementScreen from './app/screens/CardManagementScreen';
import StatementsScreen from './app/screens/StatementsScreen';
import SettingsScreen from './app/screens/SettingsScreen';
import EditProfileScreen from './app/screens/EditProfileScreen';
import ChangePasswordScreen from './app/screens/ChangePasswordScreen';
import ForgotPasswordScreen from './app/screens/ForgotPasswordScreen';
import DepositScreen from './app/screens/DepositScreen';
import WithdrawScreen from './app/screens/WithdrawScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const SettingsStack = createStackNavigator();
const HomeStack = createStackNavigator();
const CardStack = createStackNavigator();
const StatementsStack = createStackNavigator();

// Settings stack navigator
const SettingsStackNavigator = () => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen 
        name="SettingsMain" 
        component={SettingsScreen} 
        options={{ headerShown: false }}
      />
      <SettingsStack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ headerShown: false }}
      />
      <SettingsStack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen} 
        options={{ headerShown: false }}
      />
      <SettingsStack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen} 
        options={{ headerShown: false }}
      />
    </SettingsStack.Navigator>
  );
};

// Home stack navigator
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="DashboardMain" 
        component={DashboardScreen} 
        options={{ headerShown: false }}
      />
      <HomeStack.Screen 
        name="Deposit" 
        component={DepositScreen} 
        options={{ headerShown: false }}
      />
      <HomeStack.Screen 
        name="Withdraw" 
        component={WithdrawScreen} 
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
};

// Card stack navigator
const CardStackNavigator = () => {
  return (
    <CardStack.Navigator>
      <CardStack.Screen 
        name="CardMain" 
        component={CardManagementScreen} 
        options={{ headerShown: false }}
      />
      {/* Add card-related screens here if needed */}
    </CardStack.Navigator>
  );
};

// Statements stack navigator
const StatementsStackNavigator = () => {
  return (
    <StatementsStack.Navigator>
      <StatementsStack.Screen 
        name="StatementsMain" 
        component={StatementsScreen} 
        options={{ headerShown: false }}
      />
      {/* Add statement-related screens here if needed */}
    </StatementsStack.Navigator>
  );
};

// Bottom tab navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Card') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Statements') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ed7b0e',
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarStyle: {
          backgroundColor: 'white',
          paddingVertical: 12,
          paddingHorizontal: 15,
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.05,
          shadowRadius: 5,
          elevation: 5,
        },
        headerShown: false
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Card" component={CardStackNavigator} />
      <Tab.Screen name="Statements" component={StatementsStackNavigator} />
      <Tab.Screen name="Settings" component={SettingsStackNavigator} />
    </Tab.Navigator>
  );
};

function App() {
  // Simple auth state management for testing
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          // Auth screens
          <>
            <Stack.Screen 
              name="Welcome" 
              component={WelcomeScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Auth" 
              component={AuthScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="ForgotPassword" 
              component={ForgotPasswordScreen} 
              options={{ headerShown: false }} 
            />
          </>
        ) : (
          // Main app screens
          <Stack.Screen
            name="MainApp"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
