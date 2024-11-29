import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Pages/Home';
import OrderPage from '../Pages/OrderPage';
import ActivitiesPage from '../Pages/ActivitiesPage';
import StoresPage from '../Pages/StoresPage';
import OthersPage from '../Pages/OthersPage';
import ProductDetails from '../Pages/ProductDetails';
import CartScreen from '../Pages/Cart';
import Feather from 'react-native-vector-icons/Feather';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tạo Stack Navigator cho Home
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
}

// Tạo Stack Navigator cho Order
function OrderStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrderScreen" component={OrderPage} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
}

export default function MainBottom() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Order') {
            iconName = 'coffee';
          } else if (route.name === 'Activities') {
            iconName = 'clock';
          } else if (route.name === 'Stores') {
            iconName = 'map-pin';
          } else if (route.name === 'Others') {
            iconName = 'menu';
          }
          return (
            <View style={{ position: 'relative' }}>
              <Feather name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: '#4290f5',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
        },
      })}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Order" component={OrderStack} />
      <Tab.Screen name="Activities" component={ActivitiesPage} />
      <Tab.Screen name="Stores" component={StoresPage} />
      <Tab.Screen name="Others" component={OthersPage} />
    </Tab.Navigator>
  );
}