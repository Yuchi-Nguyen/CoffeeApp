import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView
import Swiper from 'react-native-swiper';
import Header from '../Components/Header';
import { Data } from '../Data';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu từ Data.js
    setBanners(Data.banners);
    setCategories(Data.categories);
    setPromotions(Data.promotions);
    setBestSellers(Data.bestSellers);
  }, []);

  const handleCategoryPress = (categoryId) => {
    navigation.navigate('OrderScreen', { selectedCategoryId: categoryId });
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { product });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <Header />

      {/* Nội dung chính */}
      <ScrollView>
        {/* Banner */}
        <View style={styles.banner}>
          <Swiper autoplay autoplayTimeout={3} showsPagination={true}>
            {banners.map((item) => (
              <Image key={item.id} source={{ uri: item.image }} style={styles.bannerImage} />
            ))}
          </Swiper>
        </View>

        {/* Danh mục sản phẩm */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh mục sản phẩm</Text>
          <FlatList
            data={categories}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.categoryItem}
                onPress={() => handleCategoryPress(item.id)}
              >
                <Image source={{ uri: item.icon }} style={styles.categoryIcon} />
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        {/* Ưu đãi hiện tại */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ưu đãi hiện tại</Text>
          <FlatList
            data={promotions}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.promoItem}>
                <Image source={{ uri: item.image }} style={styles.promoImage} />
                <Text style={styles.promoText} numberOfLines={2}>
                  {item.title.length > 50 ? `${item.title.slice(0, 50)}...` : item.title}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        {/* Sản phẩm bán chạy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm bán chạy</Text>
          <FlatList
            data={bestSellers}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.productItem}
                onPress={() => handleProductPress(item)}
              >
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price} đ</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  banner: {
    height: 200,
  },
  bannerImage: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  section: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    textAlign: 'center',
  },
  promoItem: {
    marginRight: 16,
    width: 150, // Đảm bảo kích thước cố định
    flex: 1,
    justifyContent: 'space-between',
  },
  promoImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  promoText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center', // Giữ chữ căn giữa
    color: '#000',
  },
  productItem: {
    marginRight: 16,
    width: 120,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  productName: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  productPrice: {
    marginTop: 4,
    fontSize: 14,
    color: '#e77105',
    fontWeight: 'bold',
  },
});

export default Home;
