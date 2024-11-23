import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, Keyboard, Pressable, KeyboardAvoidingView, Platform, Button, RootTagContext } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../context/AuthContext';
import CountryCode from '../Components/CountryCode';
import Header from '../Components/UserInfoHeader'

const Profile = () => {
  return (
    <View>
      <Header
      userName="Uchiha Obito"
      memberLevel="MEMBER"
      drips={120}
      prepaid={5000}
    />
    </View>
  )
}

export default Profile