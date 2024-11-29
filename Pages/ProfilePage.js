import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, ScrollView, TouchableOpacity, Modal, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../context/AuthContext';
import CountryCode from '../Components/CountryCode';
import Header from '../Components/UserInfoHeader';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import * as FileSystem from 'expo-file-system';
import { updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';

const ProfileEdit = () => {
  const { user } = useContext(AuthContext);
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [disableDatePicker, setDisableDatePicker] = useState(true);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: new Date().toISOString().split('T')[0],
    phoneNumber: {
      countryCode: '+84',
      number: ''
    },
    email: '',
    drips: 0,
    prepaid: 0
  });

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        setIsLoading(true);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setProfile({
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              gender: userData.gender || '',
              birthDate: userData.birthDate || new Date().toISOString().split('T')[0],
              phoneNumber: {
                countryCode: userData.phoneNumber?.countryCode || '+84',
                number: userData.phoneNumber?.number || ''
              },
              email: userData.email || '',
              drips: userData.drips || 0,
              prepaid: userData.prepaid || 0
            });

            // Kiểm tra avatar sau khi lấy dữ liệu
            const avatarPath = `${FileSystem.documentDirectory}avatars/avatar_${user.uid}.jpg`;
            const fileInfo = await FileSystem.getInfoAsync(avatarPath);
            if (fileInfo.exists) {
              setAvatarKey(Date.now()); // Force re-render nếu có avatar
            }
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

  // Hàm xử lý thay đổi thông tin
  const handleInputChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleGenderSelect = (selectedGender) => {
    handleInputChange('gender', selectedGender);
    setShowGenderModal(false);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || profile.birthDate;
    // setShowDatePicker(false);
    const formattedDate = currentDate.toISOString().split('T')[0]; // Định dạng ngày theo kiểu 'yyyy-mm-dd'
    handleInputChange('birthDate', formattedDate);
  };

  useEffect(() => {
    setDisableDatePicker(!isEditable);
  }, [isEditable]);

  // Thêm hàm để cập nhật thông tin lên Firebase
  const handleSaveChanges = async () => {
    if (user?.uid) {
      try {
        setIsLoading(true);
        
        // Cập nhật tất cả thông tin trong Firestore, bao gồm displayName
        await updateDoc(doc(db, 'users', user.uid), {
          firstName: profile.firstName,
          lastName: profile.lastName,
          gender: profile.gender,
          birthDate: profile.birthDate,
          phoneNumber: profile.phoneNumber,
          email: profile.email,
          displayName: `${profile.firstName} ${profile.lastName}`  // Thêm displayName
        });

        setIsEditable(false);
      } catch (error) {
        console.error('Error updating user data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Thêm navigation
  const navigation = useNavigation();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e77105" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <Header
        userName={`${profile.firstName} ${profile.lastName}`}
        memberLevel="MEMBER"
        drips={profile.drips}
        prepaid={profile.prepaid}
      />
      <View style={styles.container}>
        {/* Header với nút back */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Chỉnh Sửa</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              if (isEditable) {
                handleSaveChanges();
              } else {
                setIsEditable(true);
              }
            }}
          >
            <Feather name={isEditable ? 'check' : 'edit-2'} size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <ScrollView contentContainerStyle={styles.content}>
            {/* Thông tin chung */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Thông Tin Chung</Text>
              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Họ</Text>
                  <TextInput
                    style={[styles.input, isEditable ? styles.editable : null]}
                    value={profile.firstName}
                    onChangeText={(text) => handleInputChange('firstName', text)}
                    editable={isEditable}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Tên</Text>
                  <TextInput
                    style={[styles.input, isEditable ? styles.editable : null]}
                    value={profile.lastName}
                    onChangeText={(text) => handleInputChange('lastName', text)}
                    editable={isEditable}
                  />
                </View>
              </View>

              {/* Giới tính */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Giới tính</Text>
                <TouchableOpacity
                  style={[styles.input, isEditable ? styles.editable : null]}
                  onPress={() => isEditable && setShowGenderModal(true)} // Show modal if editable
                >
                  <Text style={styles.inputValue}>{profile.gender}</Text>
                  <Feather name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Date of Birth */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Ngày Sinh</Text>
                {/* <TouchableOpacity
                  style={[styles.input, isEditable ? styles.editable : null]}
                  onPress={() => isEditable && setShowDatePicker(true)}
                >
                  <Text style={styles.inputValue}>{profile.birthDate}</Text>
                </TouchableOpacity> */}
                
                {/* {showDatePicker && (
                  <DateTimePicker
                    value={new Date(profile.birthDate)}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        const formattedDate = selectedDate.toISOString().split('T')[0];
                        handleInputChange('birthDate', formattedDate);
                      }
                    }}
                    is24Hour={true}
                  />
                )} */}
                <DateTimePicker
                  value={new Date(profile.birthDate)}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  is24Hour={true}
                  disabled={disableDatePicker} // disable DateTimePicker based on disableDatePicker state
                  style={{marginLeft: '-10'}}
                />
              </View>
            </View>

            {/* Số điện thoại */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Số Điện Thoại</Text>
              <View style={styles.phoneRowWrapper}>
                <CountryCode 
                  style={styles.countryCodeContainer}
                  editable={isEditable}
                  value={profile.phoneNumber.countryCode}
                  onSelect={(code) => handleInputChange('phoneNumber', { countryCode: code })}
                />
                <TextInput
                  style={[
                    styles.input, 
                    isEditable ? styles.editable : styles.nonEditable,
                    styles.phoneInput
                  ]}
                  value={profile.phoneNumber.number}
                  onChangeText={(text) => handleInputChange('phoneNumber', { number: text })}
                  editable={isEditable}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Email</Text>
              <TextInput
                style={[styles.input, isEditable ? styles.editable : null]}
                value={profile.email}
                onChangeText={(text) => handleInputChange('email', text)}
                editable={isEditable}
              />
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Gender Selection Modal */}
      <Modal
        visible={showGenderModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn Giới Tính</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleGenderSelect('Nam')}
            >
              <Feather name="user" size={20} color="#007AFF" />
              <Text style={styles.modalText}>Nam</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleGenderSelect('Nữ')}
            >
              <Feather name="user" size={20} color="#FF69B4" />
              <Text style={styles.modalText}>Nữ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleGenderSelect('Khác')}
            >
              <Feather name="help-circle" size={20} color="#666" />
              <Text style={styles.modalText}>Khác</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowGenderModal(false)}
            >
              <Text style={styles.modalCloseText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 5,
  },
  contentContainer: {
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    marginTop: 40,
    paddingVertical: 20
  },
  content: {
    padding: 20,
    overflow: 'hidden'
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    marginRight: 0,
    marginBottom: 15,
  },
  phoneContainer: {
    flex: 1,
    height: 40,
    alignSelf: 'center',
  },
  countryCodeContainer: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editable: {
    backgroundColor: '#fff',
    borderColor: '#e77105',
  },
  nonEditable: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  inputValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e77105',
    borderRadius: 5,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
  },
  dateModal: {
    position: 'absolute',
    top: 436,
    left: 20
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneRowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  phoneInput: {
    flex: 0.8,
    height: 40,
    marginBottom: 0,
  },
});

export default ProfileEdit;