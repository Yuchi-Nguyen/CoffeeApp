import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, Keyboard, Pressable, KeyboardAvoidingView, Platform, Button, RootTagContext } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage({ navigation }) {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const { login } = useContext(AuthContext);

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
              <Text style={styles.logoText}>Hello Again!</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Feather name="mail" size={25} color="#6a6a6a" style={styles.icon} />
                <TextInput
                  editable
                  onChangeText={text => setEmailValue(text)}
                  value={emailValue}
                  placeholder="Email/Số điện thoại"
                  style={styles.textInput}
                  placeholderTextColor="#6a6a6a"
                />
              </View>

              <View style={styles.inputContainer}>
                <Feather name="lock" size={25} color="#6a6a6a" style={styles.icon} />
                <TextInput
                  editable
                  onChangeText={text => setPasswordValue(text)}
                  value={passwordValue}
                  placeholder="Mật Khẩu"
                  style={styles.textInput}
                  placeholderTextColor="#6a6a6a"
                  secureTextEntry
                />
              </View>

              <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>

              <View style={styles.buttonContainer}>
                <Pressable
                  onPress={() => login(emailValue, passwordValue)}
                  style={styles.loginButton}>
                  <Text style={styles.buttonText}>Đăng Nhập</Text>
                </Pressable>
              </View>

              <View style={styles.loginWith}>
                <Text style={styles.loginWithHeader}>Hoặc đăng nhập với</Text>
                <View style={styles.loginWithLogoContainer}>
                  <Image style={styles.loginWithLogo} source={require('../assets/facebook.png')} />
                  <Image style={styles.loginWithLogo} source={require('../assets/google.png')} />
                </View>
              </View>

              <Pressable onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerText}>Chưa có tài khoảng? <Text style={styles.registerTextBold}>Đăng Ký!</Text></Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    marginTop: 30,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  logo: {
    width: 130,
    height: 130,
    borderRadius: 100,
    marginBottom: 10,
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: 18,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a9a9a9',
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 15,
  },
  icon: {
    marginLeft: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 15,
    paddingLeft: 8,
  },
  forgotPassword: {
    color: '#d55b9a',
    alignSelf: 'flex-end',
    marginRight: 20,
  },

  buttonContainer: {
    marginTop: 15,
    marginHorizontal: 20,
  },

  loginButton: {
    backgroundColor: '#e77105',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  loginWithHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20
  },

  loginWithLogoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 120
  },

  loginWithLogo: {
    width: 60,
    height: 60,
  },

  registerText: {
    color: 'black',
    textAlign: 'center',
    marginTop: 20,
  },

  registerTextBold: {
    fontWeight: 'bold',
    color: 'blue',
  }
});
