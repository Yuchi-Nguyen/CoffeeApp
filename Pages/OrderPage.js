import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Components/Header';
import { Data } from '../Data';
import { useRoute, useNavigation } from '@react-navigation/native';

const VIEW_MODES = {
  LIST: 'list',
  GRID: 'grid'
};

const OrderPage = ({ navigation }) => {
  const route = useRoute();
  const initialCategoryId = route.params?.selectedCategoryId || 1;
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);
  const [viewMode, setViewMode] = useState(VIEW_MODES.LIST); // 'list' hoặc 'grid'
  const [searchText, setSearchText] = useState(''); // Nội dung tìm kiếm
  const [orderType, setOrderType] = useState('Dine-in');
  const [showOrderTypeModal, setShowOrderTypeModal] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current; 

  useEffect(() => {
    if (route.params?.selectedCategoryId) {
      setSelectedCategory(route.params.selectedCategoryId);
    }
  }, [route.params?.selectedCategoryId]);

  // Lọc sản phẩm theo danh mục và từ khóa tìm kiếm
  const filteredProducts = Data.products.filter(
    (product) =>
      product.categoryId === selectedCategory &&
      product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const showModal = () => {
    setShowOrderTypeModal(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowOrderTypeModal(false));
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { product });
  };

  const navigationCart = useNavigation();

  const handleCartPress = () => {
    navigationCart.navigate('Cart');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search A Dish Name"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Image
          source={{
            uri: 'https://img.icons8.com/ios-filled/50/000000/search--v1.png',
          }}
          style={styles.searchIcon}
        />
      </View>

      {/* Danh mục sản phẩm */}
      <FlatList
        data={Data.categories}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        style={{ flexGrow: 0 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => setSelectedCategory(item.id)}
          >
            <Image source={{ uri: item.icon }} style={styles.categoryIcon} />
            <View style={styles.categoryTextContainer}>
              <Text
                style={[styles.categoryText, item.id === selectedCategory && styles.selectedCategoryText]}
              >
                {item.name}
              </Text>
              {item.id === selectedCategory && <View style={styles.selectedUnderline} />}
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Bộ lọc hiển thị + Danh sách sản phẩm */}
      <View style={styles.listWrapper}>
        {/* Bộ lọc hiển thị */}
        <View style={styles.filterContainer}>
          <Text style={styles.categoryTitle}>
            {Data.categories.find((cat) => cat.id === selectedCategory)?.name}
          </Text>
          <View style={styles.viewModeButtons}>
            <TouchableOpacity onPress={() => setViewMode(VIEW_MODES.LIST)}>
              <Image
                source={{
                  uri: 'https://img.icons8.com/ios-filled/50/000000/menu.png',
                }}
                style={[
                  styles.viewModeIcon,
                  { tintColor: viewMode === VIEW_MODES.LIST ? '#e91e63' : '#000000' }
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setViewMode(VIEW_MODES.GRID)}>
              <Image
                source={{
                  uri: 'https://img.icons8.com/ios-filled/50/000000/grid.png',
                }}
                style={[
                  styles.viewModeIcon,
                  { tintColor: viewMode === VIEW_MODES.GRID ? '#e91e63' : '#000000' }
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Danh sách sản phẩm */}
        <FlatList
          key={viewMode}
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={viewMode === VIEW_MODES.GRID ? 2 : 1}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.productCard, viewMode === VIEW_MODES.GRID && styles.gridCard]}
              onPress={() => handleProductPress(item)}
            >
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productContent}>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.name}
                </Text>
                {viewMode === VIEW_MODES.LIST && (
                  <Text style={styles.productDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                )}
                <Text style={styles.productSKU}>{item.sku}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không có sản phẩm nào</Text>
            </View>
          }
        />
      </View>

      {/* Thông tin cửa hàng */}
      <View style={styles.storeInfo}>
        <TouchableOpacity 
          style={styles.orderTypeSelector}
          onPress={showModal}
        >
          <Text style={styles.storeText}>{orderType}</Text>
          <Image
            source={{
              uri: 'https://img.icons8.com/ios-filled/50/ffffff/expand-arrow.png',
            }}
            style={styles.dropdownIcon}
          />
        </TouchableOpacity>
        <Text style={styles.storeText}>CoopXtra Linh Trung HCM</Text>
        <TouchableOpacity onPress={handleCartPress}>
          <Image
            source={{
              uri: 'https://img.icons8.com/ios-filled/50/000000/shopping-cart.png',
            }}
            style={styles.cartIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Modal chọn loại order */}
      <Modal
        visible={showOrderTypeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={hideModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={hideModal}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setOrderType('Dine-in');
                hideModal();
              }}
            >
              <Text style={[
                styles.modalOptionText,
                orderType === 'Dine-in' && styles.selectedOptionText
              ]}>
                Dine-in
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setOrderType('Take away');
                hideModal();
              }}
            >
              <Text style={[
                styles.modalOptionText,
                orderType === 'Take away' && styles.selectedOptionText
              ]}>
                Take away
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
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
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
  },
  searchIcon: {
    width: 24,
    height: 24,
  },
  categoryList: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 12,
    width: 80,
  },
  categoryTextContainer: {
    alignItems: 'center',
    position: 'relative',
    paddingBottom: 4, 
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    flexWrap: 'wrap',
    lineHeight: 18,
  },
  selectedCategoryText: {
    color: '#e91e63',
    fontWeight: '600',
  },
  selectedUnderline: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 2,
    backgroundColor: '#e91e63',
    borderRadius: 1,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  listWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewModeButtons: {
    flexDirection: 'row',
  },
  viewModeIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 8,
  },
  activeViewMode: {
    tintColor: '#e91e63',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  gridCard: {
    flex: 0,
    flexDirection: 'column',
    alignItems: 'center',
    width: '45%',
    marginHorizontal: '2.5%',
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  productContent: {
    flex: 1,
    padding: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  productSKU: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#e91e63',
    fontWeight: 'bold',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  storeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#e91e63',
  },
  storeText: {
    color: '#fff',
    fontSize: 14,
  },
  cartIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  orderTypeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  dropdownIcon: {
    width: 12,
    height: 12,
    tintColor: '#fff',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#e91e63',
    fontWeight: 'bold',
  },
});

export default OrderPage;
