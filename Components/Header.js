import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const Header = ({ onUserPress, onSearchPress }) => {

  const navigation = useNavigation();

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onUserPress}>
        <Feather name="user" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={handleCartPress}>
          <Image 
            source={require('../assets/coffee.png')} 
            style={styles.coffeeIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onSearchPress}>
          <Feather name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  coffeeIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain'
  }
});

export default Header;