import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import Swiper from 'react-native-swiper';
import Header from '../Components/Header';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { LanguageContext } from '../context/LanguageContext';

const Home = () => {
  const navigation = useNavigation();
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentLanguage } = useContext(LanguageContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch banners
        const bannersSnapshot = await getDocs(collection(db, 'banners'));
        const bannersData = bannersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBanners(bannersData);

        // Fetch categories
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map(doc => {
          console.log('Category data:', doc.data());
          return {
            id: doc.id,
            ...doc.data()
          };
        });
        const sortedCategories = categoriesData.sort((a, b) => {
          const idA = parseInt(a.id);
          const idB = parseInt(b.id);
          return idA - idB;
        });
        setCategories(sortedCategories);

        // Fetch promotions
        const promotionsSnapshot = await getDocs(collection(db, 'promotions'));
        const promotionsData = promotionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPromotions(promotionsData);

        // Fetch bestSellers
        const bestSellersSnapshot = await getDocs(collection(db, 'bestSellers'));
        const bestSellersData = bestSellersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBestSellers(bestSellersData);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryPress = (categoryId) => {
    navigation.navigate('Order', {
      screen: 'OrderScreen',
      params: { selectedCategoryId: categoryId }
    });
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { product });
  };

  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ₫";
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => navigation.navigate('Order', { selectedCategoryId: item.id })}
    >
      <Image source={{ uri: item.icon }} style={styles.categoryImage} />
      <Text style={styles.categoryName}>{item.name[currentLanguage]}</Text>
    </TouchableOpacity>
  );

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
            renderItem={renderCategory}
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
                <Text style={styles.productPrice}>{formatCurrency(item.price)}</Text>
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
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    textAlign: 'center',
  },
  promoItem: {
    marginRight: 16,
    width: 150, 
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
    textAlign: 'center', 
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
