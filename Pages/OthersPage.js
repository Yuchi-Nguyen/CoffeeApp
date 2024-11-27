import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../context/AuthContext';
import CountryCode from '../Components/CountryCode';
import Header from '../Components/UserInfoHeader';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const OthersPage = () => {
  const navigation = useNavigation();
  const [isEditable, setIsEditable] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [selectedGender, setSelectedGender] = useState('Nam');
  const [disableDatePicker, setDisableDatePicker] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const [profile, setProfile] = useState({
    firstName: 'Uchiha',
    lastName: 'Obito',
    gender: 'Nam',
    birthDate: '2004-08-08',
    phone: '0123456789',
    email: 'obitouchiha@gmail.com',
  });

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

  return (
    <>
      <Header
        userName="Uchiha Obito"
        memberLevel="MEMBER"
        drips={120}
        prepaid={5000}
      />
      <View style={styles.container}>
        <ScrollView style={styles.content}>
          {/* Account Group */}
          <View style={styles.group}>
            <Text style={styles.groupTitle}>Account</Text>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleProfilePress}
            >
              <Text style={styles.menuText}>Profile</Text>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Setting</Text>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* General Information Group */}
          <View style={styles.group}>
            <Text style={styles.groupTitle}>General Information</Text>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Policies</Text>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Loyalty Program</Text>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>About App</Text>
              <View style={styles.versionContainer}>
                <Text style={styles.versionLabel}>Version</Text>
                <Text style={styles.versionText}>1.0.0</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Help Center Group */}
          <View style={styles.group}>
            <Text style={styles.groupTitle}>Help Center</Text>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>FAQs</Text>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Feedback & Support</Text>
              <Feather name="chevron-right" size={20} color="#666" />
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
  content: {
    flex: 1,
    marginTop: 80,
    paddingHorizontal: 20,
  },
  group: {
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  versionText: {
    fontSize: 14,
    color: '#666',
  },
  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  versionLabel: {
    fontSize: 14,
    color: '#666',
  },
});

export default OthersPage;