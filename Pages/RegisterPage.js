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
  ScrollView,
} from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../context/AuthContext';
import CountryCode from '../Components/CountryCode';

export default function RegisterPage({ navigation }) {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneValid, setPhoneValid] = useState(false);
  const [agreePolicies, setAgreePolicies] = useState(false);
  const [agreeLoyalty, setAgreeLoyalty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+84');

  const validatePhone = (value) => {
    setPhone(value);
    
    // Chỉ cho phép nhập số
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // Kiểm tra độ dài 10 số
    const isValid = /^[0-9]{10}$/.test(numericValue);
    
    setPhone(numericValue); // Cập nhật giá trị đã được làm sạch
    setPhoneValid(isValid);
  };

  const isPasswordMatch = password && confirmPassword && password === confirmPassword;

  const handleRegister = async () => {
    // Kiểm tra các trường bắt buộc
    if (!email || !password || !confirmPassword || !firstName || !lastName || !phone) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Kiểm tra đồng ý điều khoản
    if (!agreePolicies || !agreeLoyalty) {
      alert('Bạn phải đồng ý với các điều khoản và chính sách để tiếp tục.');
      return;
    }

    // Kiểm tra mật khẩu khớp
    if (!isPasswordMatch) {
      alert('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }

    // Kiểm tra số điện thoại hợp lệ
    if (!phoneValid) {
      alert('Số điện thoại không hợp lệ');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        email,
        displayName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        phoneNumber: {
          countryCode: selectedCountryCode,
          number: phone
        },
        role: 'user',
        memberLevel: 'MEMBER',
        drips: 0,
        prepaid: 0
      };

      const success = await register(email, password, userData);
      if (success) {
        alert('Đăng ký thành công!');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
              <View style={styles.logoContainer}>
                <Image source={require('../assets/logo.png')} style={styles.logo} />
                <Text style={styles.logoText}>Đăng Ký Tài Khoản</Text>
              </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.textInput}
                placeholderTextColor="#6a6a6a"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* First Name */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Họ"
                value={firstName}
                onChangeText={setFirstName}
                style={styles.textInput}
                placeholderTextColor="#6a6a6a"
              />
            </View>

            {/* Last Name */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Tên"
                value={lastName}
                onChangeText={setLastName}
                style={styles.textInput}
                placeholderTextColor="#6a6a6a"
              />
            </View>

            {/* Phone Number with Country Code */}
            <View style={styles.phoneContainer}>
              <CountryCode 
                selectedCode={selectedCountryCode}
                onSelectCountry={(code) => setSelectedCountryCode(code)}
                editable={true}
              />
              <View style={[styles.inputContainer, styles.phoneInput]}>
                <TextInput
                  placeholder="Số Điện Thoại"
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
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Mật Khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.textInput}
                placeholderTextColor="#6a6a6a"
              />
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Nhập Lại Mật Khẩu"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.textInput}
                placeholderTextColor="#6a6a6a"
              />
              {isPasswordMatch && (
                <Feather name="check-circle" size={20} color="green" />
              )}
            </View>

            {/* Checkboxes */}
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
                Tôi đồng ý với <Text style={styles.linkText}>Các Điều Khoản & Chính Sách</Text>
              </Text>
            </View>

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
                Tôi đồng ý với <Text style={styles.linkText}>Chương Trình Thành Viên</Text>
              </Text>
            </View>

            {/* Register Button */}
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
                </Text>
              </Pressable>
            </View>

            {/* Social Media Registration */}
            <View style={styles.loginWith}>
              <Text style={styles.loginWithHeader}>Hoặc đăng ký với</Text>
              <View style={styles.loginWithLogoContainer}>
                <Image style={styles.loginWithLogo} source={require('../assets/facebook.png')} />
                <Image style={styles.loginWithLogo} source={require('../assets/google.png')} />
              </View>
            </View>

              {/* Login Link */}
              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>
                  Đã có tài khoản? <Text style={styles.loginTextBold}>Đăng Nhập!</Text>
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
    marginVertical: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  icon: {
    marginRight: 5,
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  loginText: {
    marginTop: 20,
    marginBottom: 20,
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
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    marginVertical: 8,
  },
  checkboxLabel: {
    marginLeft: 35,
    marginTop: 5,
    fontSize: 14,
    color: '#333',
    position: 'absolute'
  },
  linkText: {
    color: '#0066cc',
    textDecorationLine: 'underline',
  },

  loginWithHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },

  loginWithLogoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginWithLogo: {
    width: 40,
    height: 40,
    marginHorizontal: 15,
  },

  registerButtonDisabled: {
    opacity: 0.7,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 0,
  },
  phoneInput: {
    flex: 1,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#a9a9a9',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
  },
  countryCodeContainer: {
    width: '35%',
    marginRight: 0,
  },
  checkIcon: {
    marginLeft: 5,
    marginRight: 5,
  },
});
