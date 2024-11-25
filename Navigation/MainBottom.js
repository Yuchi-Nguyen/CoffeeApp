import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../Pages/Home';
import OrderPage from '../Pages/OrderPage';
import ActivitiesPage from '../Pages/ActivitiesPage';
import StoresPage from '../Pages/StoresPage';
import OthersPage from '../Pages/OthersPage';
import Feather from 'react-native-vector-icons/Feather';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Cart from '../Pages/Cart';
import CartScreen from '../Pages/Cart';

const Tab = createBottomTabNavigator();

export default function MainBottom() {
  const navigation = useNavigation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home'; // Trang chủ
          } else if (route.name === 'Order') {
            iconName = 'coffee'; // Đặt hàng
          } else if (route.name === 'Activities') {
            iconName = 'clock'; // Hoạt động
          } else if (route.name === 'Stores') {
            iconName = 'map-pin'; // Cửa hàng
          } else if (route.name === 'Others') {
            iconName = 'menu'; // Các lựa chọn khác
          } else if (route.name === 'Cart') {
            iconName = 'cart';
          }
          return (
            <View style={{ position: 'relative' }}>
              <Feather name={iconName} size={size} color={color} />
            </View>
          )
        },
        tabBarActiveTintColor: '#4290f5', // Màu cho icon khi được chọn
        tabBarInactiveTintColor: 'gray', // Màu cho icon khi không được chọn
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
        },
      })}>
      <Tab.Screen name="Home" component={Home}/>
      <Tab.Screen name="Order" component={OrderPage} />
      <Tab.Screen name="Activities" component={ActivitiesPage} />
      <Tab.Screen name="Stores" component={StoresPage} />
      <Tab.Screen name="Others" component={OthersPage} />
      <Tab.Screen name="Cart" component={CartScreen}/>
    </Tab.Navigator>
  );
}
