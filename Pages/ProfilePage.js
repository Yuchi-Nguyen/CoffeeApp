import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, Keyboard, Pressable, KeyboardAvoidingView, Platform, Button, RootTagContext } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../context/AuthContext';
import CountryCode from '../Components/CountryCode';

const Profile = () => {
  return (
    <View>
      <CountryCode/>
    </View>
  )
}

export default Profile