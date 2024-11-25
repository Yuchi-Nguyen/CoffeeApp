import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Pages/Home';
import OrderPage from '../Pages/OrderPage';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={Home}
        options={{ title: 'Trang chủ' }}
      />
      <Stack.Screen 
        name="Order" 
        component={OrderPage}
        options={{ title: 'Đặt hàng' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;