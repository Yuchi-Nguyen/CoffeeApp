import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';

const CartScreen = () => {
  // State cho hình thức (Dine-in hoặc Pick-up)
  const [orderType, setOrderType] = useState(null);

  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const [customTime, setCustomTime] = useState('');
  const handleTimeChange = () => {
    if (customTime) {
      setTime(customTime); // Cập nhật state `time` với giá trị `customTime` từ TextInput
    }
  };
    
  // State cho danh sách sản phẩm
  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'Trà Sen Vàng', size: 'S', price: 50, quantity: 1 },
    { id: '2', name: 'Frezze Trà Xanh', size: 'L', price: 50, quantity: 2 },
    { id: '3', name: 'Phin Đen Đá', size: 'M', price: 20, quantity: 1 },
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
      {/* Chọn hình thức */}
      <View style={styles.orderTypeContainer}>
        <TouchableOpacity
          style={[
            styles.orderTypeButton,
            orderType === 'Dine-in' && styles.selectedButton,
          ]}
          onPress={() => setOrderType('Dine-in')}
        >
          <Text style={styles.buttonText}>Dine-in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.orderTypeButton,
            orderType === 'Pick-up' && styles.selectedButton,
          ]}
          onPress={() => setOrderType('Pick-up')}
        >
          <Text style={styles.buttonText}>Pick-up</Text>
        </TouchableOpacity>
      </View>
      {orderType === null && <Text style={styles.errorText}>Please select an order type</Text>}

      {/* Địa điểm và thời gian */}
      <View style={styles.locationContainer}>
        <Text style={styles.locationText}>Location: Khu Phố 6, Linh Trung Thủ Đức</Text>
      </View>
      <View style={styles.timeText}>
        <Text style={styles.label}>Thời gian hiện tại: {time}</Text>
        <TextInput
          style={styles.timeInput}
          placeholder="Nhập thời gian (hh:mm)"
          value={customTime}
          onChangeText={setCustomTime}
        />
        <TouchableOpacity style={styles.updateButton} onPress={handleTimeChange}>
          <Text style={styles.updateText}>Cập nhật thời gian</Text>
        </TouchableOpacity>
      </View>
      {/* Danh sách sản phẩm */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemName}>{item.size}</Text>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, -1)}
              >
                <Text style={styles.quantityText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, 1)}
              >
                <Text style={styles.quantityText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeItem(item.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Mã giảm giá */}
      <View style={styles.discountContainer}>
        <TextInput
          style={styles.discountInput}
          placeholder="Enter discount code"
          value={discountCode}
          onChangeText={setDiscountCode}
        />
        <TouchableOpacity style={styles.applyButton} onPress={applyDiscountCode}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {/* Tổng tiền */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${calculateTotal().toFixed(2)}</Text>
        {/* Nút Place Order */}
      <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
        <Text style={styles.placeOrderText}>Place Order</Text>
      </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  orderTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  orderTypeButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 150,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: 'tomato',
    borderColor: 'tomato',
  },
  buttonText: {
    color: '#f6f6f',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  locationContainer: {
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
  },
  timeText: {
    fontSize: 16,
    color: '#666',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 3,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  itemName: {
    flex: 4,
    fontSize: 16,
  },
  itemPrice: {
    flex: 0,
    fontSize: 16,
    textAlign: 'right',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0,
    justifyContent: 'space-around',
  },
  quantityButton: {
    padding: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginHorizontal: 6,
  },
  quantityText: {
    fontSize: 16,
    padding: 8,
  },
  removeButton: {
    marginLeft: 8,
    backgroundColor: '#ff5555',
    padding: 8,
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#fff',
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  discountInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  applyButton: {
    flex: 1,
    backgroundColor: 'tomato',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
  },
  totalContainer: {
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  updateButton: {
    backgroundColor: '#4290f5',
    padding: 8,
    borderRadius: 100,
    alignItems: 'center',
    marginBottom:12,
  },
  updateText: { color: '#fff', fontWeight: 'bold' },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeOrderButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 'auto',
  },
  placeOrderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CartScreen;
