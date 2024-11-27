import React, { useState, useEffect } from 'react';
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

import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';


const CartScreen = () => {
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
  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'Trà Sen Vàng', size: 'S', price: 50, quantity: 1 },
    { id: '2', name: 'Frezze Trà Xanh', size: 'L', price: 50, quantity: 2 },
    { id: '3', name: 'Phin Đen Đá', size: 'M', price: 20, quantity: 1 },
    { id: '4', name: 'Phindi', size: 'M', price: 25, quantity: 1 },
    { id: '5', name: 'Hồng Trà', size: 'M', price: 20, quantity: 1 },
    { id: '6', name: 'Hồng Trà Chanh', size: 'XL', price: 40, quantity: 1 },
    { id: '7', name: 'Hồng Trà Mật Ong', size: 'S', price: 20, quantity: 1 },
  ]);

  // State cho mã giảm giá
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Tính tổng tiền
  const calculateTotal = () => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return total - discount;
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (id, change) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
    );
    setCartItems(updatedItems);
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeItem = (id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
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
  const handlePlaceOrder = () => {
    alert("Đơn hàng của bạn đã được đặt thành công!");
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
