// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from './app/screens/WelcomeScreen'; 
import AuthScreen from './app/screens/AuthScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{
            headerShown: false,
          }}/>
        <Stack.Screen name="Auth" component={AuthScreen} options={{
            headerShown: false,
          }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
