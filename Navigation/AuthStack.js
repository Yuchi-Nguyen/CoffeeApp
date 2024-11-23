import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../Pages/LoginPage';
import RegisterPage from '../Pages/RegisterPage';
import ConfirmationPage from '../Pages/ConfirmationPage';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterPage} options={{ headerShown: false }} />
      <Stack.Screen
        name="Confirmation"
        component={ConfirmationPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
