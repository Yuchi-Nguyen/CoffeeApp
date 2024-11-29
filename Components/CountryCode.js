import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    TextInput,
    StyleSheet,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { countries, getEmojiFlag } from 'countries-list';

const countryData = Object.keys(countries).map((key) => ({
    name: countries[key].name,
    code: `+${countries[key].phone}`,
    flag: getEmojiFlag(key),
}));

const CountryCode = ({ editable }) => {
    const vietnamIndex = countryData.findIndex(
        (country) => country.name === 'Vietnam'
    );

    const [selectedCountry, setSelectedCountry] = useState(countryData[vietnamIndex]); // Mặc định quốc gia đầu tiên
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');

    const filteredCountries = countryData.filter((country) =>
        country.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleSelectCountry = (country) => {
        setSelectedCountry(country);
        setModalVisible(false);
    };

    const renderCountryItem = ({ item }) => (
        <TouchableOpacity
            style={styles.countryItem}
            onPress={() => handleSelectCountry(item)}
        >
            <Text style={styles.flag}>{item.flag}</Text>
            <Text style={styles.countryName}>{item.name}</Text>
            <Text style={styles.countryCode}>{item.code}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { flex: 0.45 }]}>
            <TouchableOpacity
                style={styles.selectedCountry}
                onPress={() => setModalVisible(true)}
                disabled={!editable}
            >
                <Text style={styles.flag}>{selectedCountry.flag}</Text>
                <Text style={styles.countryCode}>{selectedCountry.code}</Text>
                <Feather name="chevron-down" size={20} color="#6a6a6a" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.searchBar}>
                        <Feather name="search" size={20} color="#6a6a6a" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Tìm kiếm quốc gia..."
                            placeholderTextColor="#6a6a6a"
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>
                    <FlatList
                        data={filteredCountries}
                        keyExtractor={(item, index) => `${item.code}-${index}`}
                        renderItem={renderCountryItem}
                    />
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.closeButtonText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    selectedCountry: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#a9a9a9',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 50,
    },
    flag: {
        fontSize: 20,
        marginRight: 8,
    },
    countryCode: {
        fontSize: 16,
        color: '#000',
        marginRight: 4,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: '30%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#a9a9a9',
        borderRadius: 10,
        marginBottom: 10,
        paddingHorizontal: 10,
        height: 50,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#000',
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    countryName: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        marginLeft: 10,
    },
    closeButton: {
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#e77105',
        borderRadius: 10,
        marginTop: 10,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CountryCode;
