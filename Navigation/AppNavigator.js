import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Pages/Home';
import OrderPage from '../Pages/OrderPage';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { currentLanguage } = useContext(LanguageContext);
  
  const screenTitles = {
    vi: {
      home: 'Trang chủ',
      order: 'Đặt hàng'
    },
    en: {
      home: 'Home',
      order: 'Order'
    }
  };

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={Home}
        options={{ title: screenTitles[currentLanguage].home }}
      />
      <Stack.Screen 
        name="Order" 
        component={OrderPage}
        options={{ title: screenTitles[currentLanguage].order }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;