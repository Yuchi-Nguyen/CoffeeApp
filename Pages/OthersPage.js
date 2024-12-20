import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, ScrollView, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../context/AuthContext';
import CountryCode from '../Components/CountryCode';
import Header from '../Components/UserInfoHeader';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { LanguageContext } from '../context/LanguageContext';

const OthersPage = () => {
  const { user, logout } = useContext(AuthContext);
  const { currentLanguage } = useContext(LanguageContext);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [selectedGender, setSelectedGender] = useState('Nam');
  const [disableDatePicker, setDisableDatePicker] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [profile, setProfile] = useState({
    displayName: '',
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: '',
    phoneNumber: {
      countryCode: '+84',
      number: ''
    },
    email: '',
    drips: 0,
    prepaid: 0
  });

  const translations = {
    vi: {
      account: 'Tài khoản',
      profile: 'Hồ sơ',
      settings: 'Cài đặt',
      generalInfo: 'Thông tin chung',
      policies: 'Chính sách',
      loyaltyProgram: 'Chương trình thành viên',
      aboutApp: 'Về ứng dụng',
      version: 'Phiên bản',
      helpCenter: 'Trung tâm trợ giúp',
      faqs: 'Câu hỏi thường gặp',
      feedbackSupport: 'Phản hồi & Hỗ trợ',
      logout: 'Đăng xuất',
      logoutConfirm: 'Đăng xuất',
      logoutMessage: 'Bạn có chắc chắn muốn đăng xuất?',
      cancel: 'Hủy',
      error: 'Lỗi',
      logoutError: 'Không thể đăng xuất. Vui lòng thử lại.'
    },
    en: {
      account: 'Account',
      profile: 'Profile',
      settings: 'Settings',
      generalInfo: 'General Information',
      policies: 'Policies',
      loyaltyProgram: 'Loyalty Program',
      aboutApp: 'About App',
      version: 'Version',
      helpCenter: 'Help Center',
      faqs: 'FAQs',
      feedbackSupport: 'Feedback & Support',
      logout: 'Logout',
      logoutConfirm: 'Logout',
      logoutMessage: 'Are you sure you want to logout?',
      cancel: 'Cancel',
      error: 'Error',
      logoutError: 'Cannot logout. Please try again.'
    }
  };

  const t = translations[currentLanguage];

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        setIsLoading(true);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setProfile({
              displayName: userData.displayName || '',
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              gender: userData.gender || '',
              birthDate: userData.birthDate || '',
              phoneNumber: userData.phoneNumber || { countryCode: '+84', number: '' },
              email: userData.email || '',
              drips: userData.drips || 0,
              prepaid: userData.prepaid || 0
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleInputChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setProfile({ ...profile, gender });
    setShowGenderModal(false);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleInputChange('birthDate', formattedDate);
    }
  };

  useEffect(() => {
    setDisableDatePicker(!isEditable);
  }, [isEditable]);

  const handleLogout = () => {
    Alert.alert(
      t.logoutConfirm,
      t.logoutMessage,
      [
        {
          text: t.cancel,
          style: "cancel"
        },
        {
          text: t.logout,
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert(t.error, t.logoutError);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <>
      <Header
        userName={profile.displayName || `${profile.firstName} ${profile.lastName}`}
        memberLevel="MEMBER"
        drips={profile.drips}
        prepaid={profile.prepaid}
      />
      <View style={styles.container}>
        <ScrollView style={styles.content}>
          {/* Account Group */}
          <Text style={styles.groupTitle}>{t.account}</Text>
          <View style={styles.group}>
            <TouchableOpacity 
              style={styles.menuItemWithBorder}
              onPress={handleProfilePress}
            >
              <View style={styles.menuLeft}>
                <Feather name="user" size={20} color="#666" style={styles.menuIcon} />
                <Text style={styles.menuText}>{t.profile}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Feather name="settings" size={20} color="#666" style={styles.menuIcon} />
                <Text style={styles.menuText}>{t.settings}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
          </View>
  
          {/* General Information Group */}
          <Text style={styles.groupTitle}>{t.generalInfo}</Text>
          <View style={styles.group}>
            <TouchableOpacity style={styles.menuItemWithBorder}>
              <View style={styles.menuLeft}>
                <Feather name="file-text" size={20} color="#666" style={styles.menuIcon} />
                <Text style={styles.menuText}>{t.policies}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItemWithBorder}>
              <View style={styles.menuLeft}>
                <Feather name="award" size={20} color="#666" style={styles.menuIcon} />
                <Text style={styles.menuText}>{t.loyaltyProgram}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Feather name="info" size={20} color="#666" style={styles.menuIcon} />
                <Text style={styles.menuText}>{t.aboutApp}</Text>
              </View>
              <View style={styles.versionContainer}>
                <Text style={styles.versionLabel}>{t.version}</Text>
                <Text style={styles.versionText}>1.0.0</Text>
              </View>
            </TouchableOpacity>
          </View>
  
          {/* Help Center Group */}
          <Text style={styles.groupTitle}>{t.helpCenter}</Text>
          <View style={styles.group}>
            <TouchableOpacity style={styles.menuItemWithBorder}>
              <View style={styles.menuLeft}>
                <Feather name="help-circle" size={20} color="#666" style={styles.menuIcon} />
                <Text style={styles.menuText}>{t.faqs}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Feather name="message-circle" size={20} color="#666" style={styles.menuIcon} />
                <Text style={styles.menuText}>{t.feedbackSupport}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
          </View>
  
          {/* Logout Section */}
          <View style={[styles.logoutSection]}>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>{t.logout}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    position: 'relative'
  },
  header: {
    width: '100%',
    backgroundColor: '#e77105',
    paddingBottom: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute'
  },
  headerText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  group: {
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
    marginTop: 10,
    marginLeft: 15,
    color: '#1a1a1a',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  menuItemWithBorder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  menuText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
    color: '#404040',
  },
  versionText: {
    fontSize: 14,
    color: '#404040',
  },
  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  versionLabel: {
    fontSize: 14,
    color: '#404040',
  },
  logoutSection: {
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#d65d00',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default OthersPage;