import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../context/AuthContext';
import { firebaseService } from '../services/firebaseService';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';


const CartScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const Header = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Giỏ hàng</Text>
    </View>
  );

  // State cho hình thức (Dine-in hoặc Pick-up)
  const [orderType, setOrderType] = useState(null);

  // State cho time picker
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [time, setTime] = useState('');

  // Khởi tạo giá trị mặc định cho time
  useEffect(() => {
    // Format thời gian hiện tại
    const formattedTime = selectedTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    setTime(formattedTime);
  }, []);

  // Xử lý khi thời gian được chọn
  const handleTimeSelect = (event, selected) => {
    setShowTimePicker(false);
    if (selected) {
      setSelectedTime(selected);
      // Format time để hiển thị
      const formattedTime = selected.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      setTime(formattedTime);
    }
  };

  // State cho danh sách sản phẩm
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart items when component mounts
  useEffect(() => {
    loadCartItems();
  }, [user]);

  const loadCartItems = async () => {
    try {
      if (user) {
        const items = await firebaseService.getCartItems(user.uid);
        setCartItems(items);
      }
    } catch (error) {
      console.error('Error loading cart items:', error);
      Alert.alert('Lỗi', 'Không thể tải giỏ hàng. Vui lòng thử lại sau.');
    }
  };

  // State cho mã giảm giá
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Tính tổng tiền
  const calculateTotal = () => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return total - discount;
  };

  // Cập nhật số lượng s���n phẩm
  const updateQuantity = async (id, change) => {
    try {
      const item = cartItems.find(item => item.id === id);
      const newQuantity = Math.max(0, item.quantity + change);
      
      if (newQuantity === 0) {
        await firebaseService.removeFromCart(id);
      } else {
        await firebaseService.updateCartItemQuantity(id, newQuantity);
      }
      
      await loadCartItems(); // Reload cart items
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật số lượng. Vui lòng thử lại sau.');
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeItem = async (id) => {
    try {
      await firebaseService.removeFromCart(id);
      await loadCartItems(); // Reload cart items
    } catch (error) {
      console.error('Error removing item:', error);
      Alert.alert('Lỗi', 'Không thể xóa sản phẩm. Vui lòng thử lại sau.');
    }
  };

  // Áp dụng mã giảm giá
  const applyDiscountCode = () => {
    if (discountCode === 'SAVE10') {
      setDiscount(10);
      Alert.alert('Discount Applied', 'You saved $10!');
    } else {
      Alert.alert('Invalid Code', 'Please enter a valid discount code.');
    }
  };

  const [selectedStore, setSelectedStore] = useState(null);

  // Thêm useEffect để lấy thông tin cửa hàng đã chọn
  useEffect(() => {
    const getSelectedStore = async () => {
      try {
        const storeId = await AsyncStorage.getItem('selectedStoreId');
        if (storeId) {
          const storesSnapshot = await getDocs(collection(db, 'stores'));
          const stores = storesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          const store = stores.find(s => s.id === storeId);
          setSelectedStore(store);
        }
      } catch (error) {
        console.error('Error getting selected store:', error);
      }
    };

    getSelectedStore();
  }, []);

  const handlePlaceOrder = async () => {
    try {
      if (!orderType) {
        Alert.alert('Thông báo', 'Vui lòng chọn hình thức đặt hàng');
        return;
      }

      if (!selectedStore) {
        Alert.alert('Thông báo', 'Vui lòng chọn cửa hàng trong mục Stores');
        return;
      }

      Alert.alert(
        "Xác nhận đặt hàng",
        "Bạn có muốn thanh toán ngay không?",
        [
          {
            text: "Hủy",
            style: "cancel"
          },
          {
            text: "Thanh toán sau",
            onPress: async () => {
              const orderData = {
                serviceType: orderType,
                items: cartItems,
                location: selectedStore.address,
                store: {
                  id: selectedStore.id,
                  name: selectedStore.name,
                  address: selectedStore.address,
                  phone: selectedStore.phone,
                  image: selectedStore.image
                },
                total: calculateTotal(),
                time: time,
                status: 'unpaid'
              };
              await firebaseService.createOrder(user.uid, orderData);
              await firebaseService.clearCart(user.uid);
              Alert.alert('Thành công', 'Đơn hàng của bạn đã được tạo');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Activities' }],
              });
            }
          },
          {
            text: "Thanh toán ngay",
            onPress: async () => {
              const orderData = {
                serviceType: orderType,
                items: cartItems,
                location: selectedStore.address,
                store: {
                  id: selectedStore.id,
                  name: selectedStore.name,
                  address: selectedStore.address,
                  phone: selectedStore.phone,
                  image: selectedStore.image
                },
                total: calculateTotal(),
                time: time,
                status: 'paid'
              };
              await firebaseService.createOrder(user.uid, orderData);
              await firebaseService.clearCart(user.uid);
              Alert.alert('Thành công', 'Đơn hàng đã được thanh toán');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Activities' }],
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Lỗi', 'Không thể đặt hàng. Vui lòng thử lại sau.');
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      
      <ScrollView style={styles.scrollContent}>
        {/* Order Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hình thức đặt hàng</Text>
          <View style={styles.orderTypeContainer}>
            <TouchableOpacity
              style={[
                styles.orderTypeButton,
                orderType === 'Dine-in' && styles.selectedButton,
              ]}
              onPress={() => setOrderType('Dine-in')}
            >
              <Feather 
                name="coffee" 
                size={20} 
                color={orderType === 'Dine-in' ? '#fff' : '#666'} 
              />
              <Text style={[
                styles.buttonText,
                orderType === 'Dine-in' && styles.selectedButtonText
              ]}>Dine-in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.orderTypeButton,
                orderType === 'Pick-up' && styles.selectedButton,
              ]}
              onPress={() => setOrderType('Pick-up')}
            >
              <Feather 
                name="shopping-bag" 
                size={20} 
                color={orderType === 'Pick-up' ? '#fff' : '#666'} 
              />
              <Text style={[
                styles.buttonText,
                orderType === 'Pick-up' && styles.selectedButtonText
              ]}>Pick-up</Text>
            </TouchableOpacity>
          </View>
          {orderType === null && 
            <Text style={styles.errorText}>Vui lòng chọn hình thức đặt hàng</Text>
          }
        </View>

        {/* Location & Time Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Địa điểm & Thời gian</Text>
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={20} color="#666" />
            <Text style={styles.locationText}>
              Khu Phố 6, Linh Trung Thủ Đức
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.timeSelector}
            onPress={() => setShowTimePicker(true)}
          >
            <View style={styles.timeSelectorContent}>
              <Feather name="clock" size={20} color="#666" />
              <Text style={styles.timeText}>
                Thời gian: {time || 'Chọn thời gian'}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={handleTimeSelect}
            />
          )}
        </View>

        {/* Cart Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giỏ hàng của bạn</Text>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSize}>Size {item.size}</Text>
              </View>
              <Text style={styles.itemPrice}>${item.price}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, -1)}
                >
                  <Feather name="minus" size={16} color="#666" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, 1)}
                >
                  <Feather name="plus" size={16} color="#666" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeItem(item.id)}
              >
                <Feather name="trash-2" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Discount Section */}
        <View style={[styles.section, styles.discountSection]}>
          <View style={styles.discountContainer}>
            <TextInput
              style={styles.discountInput}
              placeholder="Nhập mã giảm giá"
              value={discountCode}
              onChangeText={setDiscountCode}
            />
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={applyDiscountCode}
            >
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer - Outside ScrollView */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalAmount}>${calculateTotal()}</Text>
        </View>
        <TouchableOpacity 
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderText}>Đặt hàng</Text>
          <Feather name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: 50,
  },
  scrollContent: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  orderTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  orderTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 8,
  },
  selectedButton: {
    backgroundColor: '#e77105',
    borderColor: '#e77105',
  },
  buttonText: {
    color: '#666',
    fontWeight: '500',
  },
  selectedButtonText: {
    color: '#fff',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 10,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timeSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeText: {
    fontSize: 14,
    color: '#333',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  itemSize: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    width: 60,
    textAlign: 'right',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '500',
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#dc3545',
    borderRadius: 6,
  },
  discountContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  discountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  applyButton: {
    backgroundColor: '#e77105',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    // Thêm shadow cho footer
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e77105',
  },
  placeOrderButton: {
    backgroundColor: '#28a745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    gap: 8,
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  discountSection: {
    marginBottom: 20, // Thêm margin bottom cho section cuối cùng
  },
});

export default CartScreen;
