import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { firebaseService } from '../services/firebaseService';

const ProductDetails = ({ route, navigation }) => {
  const { user } = useContext(AuthContext);
  const { product } = route.params; 
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Tính tổng tiền
  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ₫";
  };

  const calculateTotal = () => {
    const total = parseFloat(product.price) * quantity;
    return formatCurrency(total);
  };

  // Định dạng giá sản phẩm đơn lẻ
  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('vi-VN', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).replace(/,/g, '.').replace(/\./g, ',');
  };

  const handleAddToCart = async () => {
    try {
      if (!user) {
        Alert.alert('Thông báo', 'Vui lòng đăng nhập để thêm vào giỏ hàng');
        return;
      }

      const productData = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        specialInstructions: specialInstructions
      };

      await firebaseService.addToCart(user.uid, productData);
      Alert.alert('Thành công', 'Đã thêm sản phẩm vào giỏ hàng');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Lỗi', 'Không thể thêm vào giỏ hàng. Vui lòng thử lại sau.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* Nút Đóng */}
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hình Ảnh Sản Phẩm */}
          <Image source={{ uri: product.image }} style={styles.productImage} />

          {/* Chi Tiết Sản Phẩm */}
          <View style={styles.detailsContainer}>
            <View style={styles.header}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>
                {formatCurrency(product.price)}
              </Text>
            </View>
            <Text style={styles.productDescription}>{product.description}</Text>
            <Text style={styles.productSKU}>Mã sản phẩm: {product.sku}</Text>

            {/* Ghi chú đặc biệt */}
            <View style={styles.specialInstructionsContainer}>
              <Text style={styles.specialInstructionsLabel}>Ghi chú đặc biệt</Text>
              <TextInput
                style={styles.specialInstructionsInput}
                placeholder="Tùy chọn"
                value={specialInstructions}
                onChangeText={setSpecialInstructions}
              />
            </View>

            {/* Tùy Chọn Số Lượng */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Nút Thêm Vào Giỏ Hàng */}
            <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
              <Text style={styles.addButtonText}>
                ADD {calculateTotal()}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    marginTop: 38,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#000',
  },
  productImage: {
    width: '100%',
    height: 350,
    resizeMode: 'contain',
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginVertical: 10,
    padding: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  detailsContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 18,
    color: '#e91e63',
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
  },
  productSKU: {
    fontSize: 12,
    color: '#999',
  },
  specialInstructionsContainer: {
    marginVertical: 16,
  },
  specialInstructionsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  specialInstructionsInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#e91e63',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default ProductDetails;
