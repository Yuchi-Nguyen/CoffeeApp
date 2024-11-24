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

const CountryCode = () => {
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
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.selectedCountry}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.flag}>{selectedCountry.flag}</Text>
                <Text style={styles.countryCode}>{selectedCountry.code}</Text>
                <Feather name="chevron-down" size={20} color="#000" />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.searchBar}>
                        <Feather name="search" size={20} color="#000" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Tìm kiếm quốc gia..."
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
        marginVertical: 10,
    },
    selectedCountry: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 10,
    },
    flag: {
        fontSize: 20,
        marginRight: 10,
    },
    countryCode: {
        fontSize: 16,
        marginRight: 10,
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
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    countryName: {
        flex: 1,
        fontSize: 16,
    },
    closeButton: {
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#e77105',
        borderRadius: 5,
        marginTop: 10,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default CountryCode;
