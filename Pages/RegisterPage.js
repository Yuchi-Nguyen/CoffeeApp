import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
  Image,
} from 'react-native';
// import CheckBox from '@react-native-community/checkbox';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Feather from 'react-native-vector-icons/Feather';

export default function RegisterPage({ navigation }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneValid, setPhoneValid] = useState(false);
  const [agreePolicies, setAgreePolicies] = useState(false);
  const [agreeLoyalty, setAgreeLoyalty] = useState(false);

  const validatePhone = (value) => {
    setPhone(value);
    const phoneRegex = /^[0-9]{10,15}$/; // Kiểm tra số điện thoại hợp lệ
    setPhoneValid(phoneRegex.test(value));
  };

  const isPasswordMatch = password && confirmPassword && password === confirmPassword;

  const handleRegister = () => {
    if (!agreePolicies || !agreeLoyalty) {
      alert('Bạn phải đồng ý với các điều khoản và chính sách để tiếp tục.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Mật khẩu và xác nhận mật khẩu không khớp. Vui lòng kiểm tra lại.');
      return;
    }

    navigation.navigate('Confirmation');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Image source={require('../assets/logo.png')} style={styles.logo} />
              <Text style={styles.logoText}>Create New Account</Text>
            </View>

            {/* First Name */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="First Name (optional)"
                value={firstName}
                onChangeText={setFirstName}
                style={styles.textInput}
                placeholderTextColor="#6a6a6a"
              />
            </View>

            {/* Last Name */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Last Name (optional)"
                value={lastName}
                onChangeText={setLastName}
                style={styles.textInput}
                placeholderTextColor="#6a6a6a"
              />
            </View>

            {/* Phone Number */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Phone Number"
                value={phone}
                onChangeText={validatePhone}
                keyboardType="phone-pad"
                style={styles.textInput}
                placeholderTextColor="#6a6a6a"
              />
              {phoneValid && (
                <Feather name="check-circle" size={20} color="green" />
              )}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.textInput}
                placeholderTextColor="#6a6a6a"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.textInput}
                placeholderTextColor="#6a6a6a"
              />
              {isPasswordMatch && (
                <Feather name="check-circle" size={25} color="green"/>
              )}
            </View>

            {/* Checkbox Policies */}
            <View style={styles.checkboxContainer}>
              <BouncyCheckbox
                size={25}
                fillColor="green"
                unfillColor="#FFFFFF"
                iconStyle={{ borderColor: "green" }}
                innerIconStyle={{ borderWidth: 2 }}
                onPress={(isChecked) => setAgreePolicies(isChecked)}
              />
              <Text style={styles.checkboxLabel}>
                I agree to the Terms & Policies.
              </Text>
            </View>

            {/* Checkbox Loyalty Program */}
            <View style={styles.checkboxContainer}>
              <BouncyCheckbox
                size={25}
                fillColor="green"
                unfillColor="#FFFFFF"
                iconStyle={{ borderColor: "green" }}
                innerIconStyle={{ borderWidth: 2 }}
                onPress={(isChecked) => setAgreeLoyalty(isChecked)}
              />
              <Text style={styles.checkboxLabel}>
                I agree to the Membership Program.
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.registerButton}
                onPress={() => {
                  handleRegister()
                }}
              >
                <Text style={styles.buttonText}>Register</Text>
              </Pressable>
            </View>

            <View style={styles.loginWith}>
              <Text style={styles.loginWithHeader}>Or login with</Text>
              <View style={styles.loginWithLogoContainer}>
                <Image style={styles.loginWithLogo} source={require('../assets/facebook.png')} />
                <Image style={styles.loginWithLogo} source={require('../assets/google.png')} />
              </View>
            </View>

            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>Already have an account? <Text style={styles.loginTextBold}>Log In!</Text></Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Pressable>
    </KeyboardAvoidingView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -10,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 130,
    height: 130,
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
    marginTop: -10
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a9a9a9',
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 5,
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
  },
  loginText: {
    marginTop: 20,
    textAlign: 'center',
  },
  loginTextBold: {
    fontWeight: 'bold',
    color: 'blue',
  },
  registerButton: {
    backgroundColor: '#e77105',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    marginVertical: 10,
  },
  checkboxLabel: {
    marginLeft: 35,
    marginTop: 5,
    fontSize: 14,
    color: '#333',
    position: 'absolute'
  },

  loginWithHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20
  },

  loginWithLogoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 105,
  },

  loginWithLogo: {
    width: 60,
    height: 60,
    marginRight: 15
  },

});
