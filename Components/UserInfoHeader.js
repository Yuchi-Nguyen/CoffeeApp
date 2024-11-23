import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Image,
    TextInput,
    Alert
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';

const Header = ({ userName, memberLevel, drips, prepaid }) => {
    const [languageModalVisible, setLanguageModalVisible] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState({
        name: 'Tiếng Việt',
        flag: require('../assets/vn-flag.png'),
    });
    const [avatar, setAvatar] = useState(null);

    const handleSelectLanguage = (language) => {
        setSelectedLanguage(language);
        setLanguageModalVisible(false);
    };

    const handleOpenLib = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Quyền truy cập thư viện ảnh bị từ chối.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const handleOpenCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Quyền truy cập camera bị từ chối.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const handleChooseAvatar = () => {
        Alert.alert(
            'Chọn ảnh đại diện',
            'Bạn muốn chọn ảnh từ thư viện hay chụp ảnh mới?',
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Thư viện', onPress: handleOpenLib },
                { text: 'Camera', onPress: handleOpenCamera },
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Nút chọn ngôn ngữ */}
            <TouchableOpacity
                style={styles.languageButton}
                onPress={() => setLanguageModalVisible(true)}
            >
                <Image
                    source={selectedLanguage.flag}
                    style={styles.flagIcon}
                />
                <Feather name="chevron-down" size={20} color="#fff" />
            </TouchableOpacity>

            {/* Modal chọn ngôn ngữ */}
            <Modal
                visible={languageModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setLanguageModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.languageOption}
                        onPress={() =>
                            handleSelectLanguage({
                                name: 'Tiếng Việt',
                                flag: require('../assets/vn-flag.png'),
                            })
                        }
                    >
                        <Image
                            source={require('../assets/vn-flag.png')}
                            style={styles.flagIcon}
                        />
                        <Text style={styles.languageText}>Tiếng Việt</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.languageOption, styles.languageOptionEng]}
                        onPress={() =>
                            handleSelectLanguage({
                                name: 'English',
                                flag: require('../assets/uk-flag.png'),
                            })
                        }
                    >
                        <Image
                            source={require('../assets/uk-flag.png')}
                            style={styles.flagIcon}
                        />
                        <Text style={styles.languageText}>English</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Layout Header */}
            <View style={styles.headerLayout}>
                {/* Ảnh đại diện */}
                <TouchableOpacity onPress={handleChooseAvatar}>
                    {avatar ? (
                        <Image source={{ uri: avatar }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Feather name="camera" size={30} color="#999" />
                        </View>
                    )}
                </TouchableOpacity>

                {/* Thông tin người dùng */}
                <View style={styles.userInfo}>
                    <View style={styles.userNameAndRole}>
                        <Text style={styles.userName}>{userName}</Text>
                        <Text style={styles.memberLevel}>{memberLevel}</Text>
                    </View>
                    <View style={styles.userStats}>
                        <View style={styles.statItem}>
                            <Feather name="award" size={16} color="#fff" style={styles.icon} />
                            <Text style={styles.dripsText}>Drips: {drips}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Feather name="credit-card" size={16} color="#fff" style={styles.icon} />
                            <Text style={styles.prepaidText}>Prepaid: {prepaid}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Nút Top-up */}
            <TouchableOpacity style={styles.topUpButton}>
                <Text style={styles.topUpText}>Top-up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        marginTop: 50,
        backgroundColor: '#e77105',
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 10,
        right: 10,
    },
    flagIcon: {
        width: 45,
        height: 30,
        marginRight: 5,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 5,
    },
    languageOptionEng: {
        paddingHorizontal: 21,
    },
    languageText: {
        marginLeft: 10,
        fontSize: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#eaeaea',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    userInfo: {
        marginLeft: 20,
        flex: 1,
    },
    userNameAndRole: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    memberLevel: {
        fontSize: 14,
        color: '#fff',
        marginLeft: 10,
    },
    userStats: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 5,
        height: 40
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    icon: {
        marginRight: 5,
    },
    dripsText: {
        marginRight: 10,
        fontSize: 14,
        color: '#fff',
    },
    prepaidText: {
        fontSize: 14,
        color: '#fff',
    },
    topUpButton: {
        marginTop: 15,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#007bff',
        borderRadius: 5,
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    topUpText: {
        color: '#fff',
        fontSize: 14,
    },
});

export default Header;
