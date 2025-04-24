// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from './app/screens/WelcomeScreen'; 
import AuthScreen from './app/screens/AuthScreen';
import DashboardScreen from './app/screens/DashboardScreen';
import CardManagementScreen from './app/screens/CardManagementScreen';
import StatementsScreen from './app/screens/StatementsScreen';
import SettingsScreen from './app/screens/SettingsScreen';
import EditProfileScreen from './app/screens/EditProfileScreen';
import ChangePasswordScreen from './app/screens/ChangePasswordScreen';
import ForgotPasswordScreen from './app/screens/ForgotPasswordScreen';

const Stack = createStackNavigator();

function App() {
  return (
    // <NavigationContainer>
    //   <Stack.Navigator>
    //     <Stack.Screen name="Welcome" component={WelcomeScreen} options={{
    //         headerShown: false,
    //       }}/>
    //     <Stack.Screen name="Auth" component={AuthScreen} options={{
    //         headerShown: false,
    //       }}/>
    //   </Stack.Navigator>
    // </NavigationContainer>
    <ForgotPasswordScreen />
  );
}

export default App;
