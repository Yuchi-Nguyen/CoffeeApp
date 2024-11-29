import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import moment from 'moment';
import Header from '../Components/Header';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';  // Đảm bảo đường dẫn đúng

const StoresPage = () => {
  const [searchText, setSearchText] = useState('');
  const [currentView, setCurrentView] = useState('list');
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch stores từ Firebase khi component mount
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storesSnapshot = await getDocs(collection(db, 'stores'));
        const storesData = storesSnapshot.docs.map(doc => ({
          ...doc.data(),
          // Đảm bảo location là object với latitude và longitude
          location: {
            latitude: doc.data().location.latitude,
            longitude: doc.data().location.longitude
          }
        }));
        setStores(storesData);
        
        // Kiểm tra selectedStore từ AsyncStorage
        const savedStoreId = await AsyncStorage.getItem('selectedStoreId');
        if (savedStoreId) {
          const store = storesData.find(s => s.id === savedStoreId);
          if (store) {
            setSelectedStore(store);
          } else {
            setSelectedStore(storesData[0]); // Mặc định store đầu tiên
          }
        } else {
          setSelectedStore(storesData[0]); // Mặc định store đầu tiên
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stores:', error);
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Hàm xử lý khi chọn cửa hàng
  const handleStoreSelect = async (store) => {
    setSelectedStore(store);
    try {
      await AsyncStorage.setItem('selectedStoreId', store.id);
    } catch (error) {
      console.error('Error saving selected store:', error);
    }
  };

  // Hàm kiểm tra trạng thái mở cửa
  const isOpen = (openHours) => {
    const [start, end] = openHours.split(" - ");
    const now = moment();
    return now.isBetween(moment(start, "HH:mm"), moment(end, "HH:mm"));
  };

  // Lọc cửa hàng theo tên hoặc địa chỉ
  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchText.toLowerCase()) ||
      store.address.toLowerCase().includes(searchText.toLowerCase())
  );

  // Đưa cửa hàng đang được chọn lên đầu danh sách
  const sortedStores = selectedStore
    ? [selectedStore, ...filteredStores.filter(store => store.id !== selectedStore.id)]
    : filteredStores;

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Thanh Header */}
      <Header />

      {/* Thanh tìm kiếm với icon */}
      <View style={styles.searchBar}>
        <Feather name="search" size={20} color="#6a6a6a" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm cửa hàng..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Chuyển đổi giữa danh sách và bản đồ với icon */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={() => setCurrentView('list')} style={styles.toggleButton}>
          <Ionicons name="list" size={24} color={currentView === 'list' ? '#e91e63' : '#000'} />
          <Text style={[styles.toggleText, currentView === 'list' && styles.activeText]}>Danh sách</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentView('map')} style={styles.toggleButton}>
          <Ionicons name="map" size={24} color={currentView === 'map' ? '#e91e63' : '#000'} />
          <Text style={[styles.toggleText, currentView === 'map' && styles.activeText]}>Bản đồ</Text>
        </TouchableOpacity>
      </View>

      {currentView === 'list' ? (
        <FlatList
          data={sortedStores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.storeItem, selectedStore && selectedStore.id === item.id ? styles.selectedItem : {}]}
              onPress={() => handleStoreSelect(item)}
            >
              <View style={styles.storeContent}>
                {/* Ảnh cửa hàng */}
                <Image source={{ uri: item.image }} style={styles.storeImage} />
                
                {/* Thông tin cửa hàng */}
                <View style={styles.storeInfo}>
                  <Text style={styles.storeName}>{item.name}</Text>
                  <Text style={styles.storeAddress}>{item.address}</Text>
                  <Text style={styles.storePhone}>{item.phone}</Text>

                  {/* Trạng thái mở cửa và tag "Đang lựa chọn" */}
                  <View style={styles.statusContainer}>
                    <Text style={styles.storeStatus}>
                      {isOpen(item.openHours) ? 'Open' : 'Closed'}
                    </Text>

                    {/* Tag "Đang lựa chọn" nếu cửa hàng đang được chọn */}
                    {selectedStore && selectedStore.id === item.id && (
                      <Text style={styles.selectedTag}>Đang lựa chọn</Text>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        selectedStore && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: selectedStore.location.latitude,
              longitude: selectedStore.location.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {sortedStores.map((store) => (
              <Marker
                key={store.id}
                coordinate={store.location}
                title={store.name}
                description={store.address}
              />
            ))}
          </MapView>
        )
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  toggleText: {
    fontSize: 16,
    marginLeft: 8,
  },
  activeText: {
    fontWeight: 'bold',
    color: '#e91e63',
  },
  storeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  storeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  storeAddress: {
    fontSize: 14,
    color: '#555',
  },
  storePhone: {
    fontSize: 14,
    color: '#555',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  storeStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
  },
  selectedItem: {
    backgroundColor: '#eaeaea',
  },
  selectedTag: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#28a745',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    textAlign: 'center',
  },
  map: {
    flex: 1,
  },
});

export default StoresPage;
