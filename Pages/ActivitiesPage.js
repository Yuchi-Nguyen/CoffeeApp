import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { firebaseService } from '../services/firebaseService';

const ActivitiesPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});

  // Thêm lại hàm getStatusColor
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return '#28a745';  // màu xanh lá cho trạng thái đã thanh toán
      case 'unpaid':
        return '#ffc107';  // màu vàng cho trạng thái chưa thanh toán
      case 'failed':
        return '#dc3545';  // màu đỏ cho trạng thái đã hủy
      default:
        return '#666';     // màu mặc định
    }
  };

  // Load orders
  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      if (user) {
        const userOrders = await firebaseService.getOrders(user.uid);
        setOrders(userOrders);
        
        // Initialize timers for unpaid orders
        const initialTimeLeft = {};
        userOrders.forEach(order => {
          if (order.status === 'unpaid') {
            const createdAt = new Date(order.createdAt);
            const now = new Date();
            const elapsed = Math.floor((now - createdAt) / 1000);
            const remaining = Math.max(0, order.timeLimit - elapsed);
            initialTimeLeft[order.id] = remaining;
          }
        });
        setTimeLeft(initialTimeLeft);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách đơn hàng');
    }
  };

  // Handle payment
  const handlePayment = async (orderId) => {
    Alert.alert(
      "Xác nhận thanh toán",
      "Bạn có chắc chắn muốn thanh toán đơn hàng này?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Đồng ý",
          onPress: async () => {
            try {
              await firebaseService.updateOrderStatus(orderId, 'paid');
              await loadOrders();
            } catch (error) {
              console.error('Error updating order:', error);
              Alert.alert('Lỗi', 'Không thể cập nhật trạng thái đơn hàng');
            }
          }
        }
      ]
    );
  };

  // Handle cancel
  const handleCancel = async (orderId) => {
    Alert.alert(
      "Xác nhận hủy đơn",
      "Bạn có chắc chắn muốn hủy đơn hàng này?",
      [
        {
          text: "Không",
          style: "cancel"
        },
        {
          text: "Có",
          onPress: async () => {
            try {
              await firebaseService.updateOrderStatus(orderId, 'failed');
              await loadOrders();
            } catch (error) {
              console.error('Error canceling order:', error);
              Alert.alert('Lỗi', 'Không thể hủy đơn hàng');
            }
          }
        }
      ]
    );
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(async () => {
      setTimeLeft(prevTime => {
        const newTime = { ...prevTime };
        let needsUpdate = false;

        Object.keys(newTime).forEach(orderId => {
          if (newTime[orderId] > 0) {
            newTime[orderId] -= 1;
            if (newTime[orderId] === 0) {
              // Auto cancel order when time runs out
              firebaseService.updateOrderStatus(orderId, 'failed')
                .then(() => loadOrders())
                .catch(error => console.error('Error auto-canceling order:', error));
            }
            needsUpdate = true;
          }
        });

        return needsUpdate ? newTime : prevTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Hàm format thời gian
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderOrderCard = (order) => (
    <View style={styles.orderCard} key={order.id}>
      {/* Header của đơn hàng */}
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Mã đơn: {order.id}</Text>
          <Text style={styles.serviceType}>
            <Feather 
              name={order.serviceType === 'Dine-in' ? 'coffee' : 'shopping-bag'} 
              size={14} 
            /> {order.serviceType}
          </Text>
        </View>
        <View>
          {order.status === 'unpaid' && timeLeft[order.id] > 0 && (
            <Text style={styles.timerText}>
              <Feather name="clock" size={14} /> {formatTime(timeLeft[order.id])}
            </Text>
          )}
          <View style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor(order.status) + '20' }
          ]}>
            <Text style={[
              styles.statusText, 
              { color: getStatusColor(order.status) }
            ]}>
              {order.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Thông tin cửa hàng */}
      {order.store && (
        <View style={styles.storeInfo}>
          <Image source={{ uri: order.store.image }} style={styles.storeImage} />
          <View style={styles.storeDetails}>
            <Text style={styles.storeName}>{order.store.name}</Text>
            <Text style={styles.storeAddress}>{order.store.address}</Text>
            <Text style={styles.storePhone}>{order.store.phone}</Text>
          </View>
        </View>
      )}

      {/* Chi tiết đơn hàng */}
      <View style={styles.orderDetails}>
        <Text style={styles.location}>
          <Feather name="map-pin" size={14} /> {order.location}
        </Text>
        {order.items.map((item, index) => (
          <Text key={index} style={styles.itemText}>
            {item.quantity}x {item.name}
          </Text>
        ))}
        <Text style={styles.totalText}>
          Tổng tiền: {order.total.toLocaleString()}đ
        </Text>
      </View>

      {/* Cập nhật phần buttons */}
      <View style={styles.buttonContainer}>
        {order.status === 'unpaid' && (
          <>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={() => handleCancel(order.id)}
            >
              <Text style={styles.cancelButtonText}>Hủy đơn</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.payButton]}
              onPress={() => handlePayment(order.id)}
            >
              <Text style={styles.payButtonText}>Thanh toán</Text>
            </TouchableOpacity>
          </>
        )}
        {order.status === 'failed' && (
          <View style={styles.failedMessage}>
            <Text style={styles.failedText}>Đơn hàng đã bị hủy</Text>
          </View>
        )}
        {order.status === 'paid' && (
          <View style={styles.paidMessage}>
            <Text style={styles.paidText}>Đã thanh toán</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>Đơn hàng của bạn</Text>
      <ScrollView style={styles.scrollView}>
        {orders.map(order => renderOrderCard(order))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scrollView: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    marginBottom: 4,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dc3545',
    marginRight: 8,
  },
  payButton: {
    backgroundColor: '#28a745',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  payButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  failedMessage: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  failedText: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  paidMessage: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  paidText: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 14,
    color: '#dc3545',
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'right',
  },
  storeInfo: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  storeImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  storeAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  storePhone: {
    fontSize: 14,
    color: '#666',
  },
});

export default ActivitiesPage;