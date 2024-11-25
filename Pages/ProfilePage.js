import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../context/AuthContext';
import CountryCode from '../Components/CountryCode';
import Header from '../Components/UserInfoHeader';
import DateTimePicker from '@react-native-community/datetimepicker';

const ProfileEdit = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false); // Modal to choose gender
  const [selectedGender, setSelectedGender] = useState('Nam'); // Default gender
  const [disableDatePicker, setDisableDatePicker] = useState(true);

  // State lưu thông tin
  const [profile, setProfile] = useState({
    firstName: 'Uchiha',
    lastName: 'Obito',
    gender: 'Nam', // Mặc định là Nam
    birthDate: '2004-08-08',
    phone: '0123456789',
    email: 'obitouchiha@gmail.com',
  });

  // Hàm xử lý thay đổi thông tin
  const handleInputChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setProfile({ ...profile, gender });
    setShowGenderModal(false); // Close modal after selecting gender
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || profile.birthDate;
    // setShowDatePicker(false);
    const formattedDate = currentDate.toISOString().split('T')[0]; // Định dạng ngày theo kiểu 'yyyy-mm-dd'
    handleInputChange('birthDate', formattedDate);
  };

  useEffect(() => {
    setDisableDatePicker(!isEditable); // Nếu isEditable là true, disableDatePicker sẽ là false
  }, [isEditable]);

  return (
    <>
      <Header
        userName="Uchiha Obito"
        memberLevel="MEMBER"
        drips={120}
        prepaid={5000}
      />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Chỉnh Sửa</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditable(!isEditable)}
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
                <DateTimePicker
                  value={new Date(profile.birthDate)}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  is24Hour={true}
                  disabled={disableDatePicker} // disable DateTimePicker based on disableDatePicker state
                  style={{marginLeft: '-20'}}
                />
              </View>
            </View>

            {/* Số điện thoại */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Số Điện Thoại</Text>
              <View style={styles.row}>
                <CountryCode />
                <View style={[styles.inputContainer, styles.phoneContainer]}>
                  <TextInput
                    style={[styles.input, styles.nonEditable]}
                    value={profile.phone}
                    editable={false} // Không thể sửa
                  />
                </View>
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
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn Giới Tính</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleGenderSelect('Nam')}
            >
              <Feather name="user" size={20} color="#007bff" />
              <Text style={styles.modalText}>Nam</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleGenderSelect('Nữ')}
            >
              <Feather name="user" size={20} color="#ff69b4" />
              <Text style={styles.modalText}>Nữ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleGenderSelect('Không Nói')}
            >
              <Feather name="help-circle" size={20} color="#ccc" />
              <Text style={styles.modalText}>Không Nói</Text>
            </TouchableOpacity>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setShowGenderModal(false)}
            >
              <Text style={styles.modalCloseText}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
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
    marginTop: 40
  },
  content: {
    padding: 15,
    overflow: 'hidden'
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 7,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  phoneContainer: {
    marginTop: 13
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
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
  }
});

export default ProfileEdit;