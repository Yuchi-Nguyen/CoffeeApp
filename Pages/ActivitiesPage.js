import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../context/AuthContext';
import { firebaseService } from '../services/firebaseService';
import { LanguageContext } from '../context/LanguageContext';

const translations = {
  vi: {
    pageTitle: 'Đơn hàng của bạn',
    orderId: 'Mã đơn:',
    total: 'Tổng tiền:',
    cancelOrder: 'Hủy đơn',
    payNow: 'Thanh toán',
    orderCancelled: 'Đơn hàng đã bị hủy',
    orderPaid: 'Đã thanh toán',
    confirmCancel: 'Xác nhận hủy đơn',
    confirmCancelMsg: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
    confirmPayment: 'Xác nhận thanh toán',
    confirmPaymentMsg: 'Bạn có chắc chắn muốn thanh toán đơn hàng này?',
    no: 'Không',
    yes: 'Có',
    cancel: 'Hủy',
    error: 'Lỗi',
    loadError: 'Không thể tải danh sách đơn hàng',
    cancelError: 'Không thể hủy đơn hàng',
    updateError: 'Không thể cập nhật trạng thái đơn hàng',
    currency: 'đ',
    orderCode: 'Mã đơn:',
    totalAmount: 'Tổng tiền:',
    items: 'x',
  },
  en: {
    pageTitle: 'Your Orders',
    orderId: 'Order ID:',
    total: 'Total:',
    cancelOrder: 'Cancel Order',
    payNow: 'Pay Now',
    orderCancelled: 'Order Cancelled',
    orderPaid: 'Paid',
    confirmCancel: 'Confirm Cancellation',
    confirmCancelMsg: 'Are you sure you want to cancel this order?',
    confirmPayment: 'Confirm Payment',
    confirmPaymentMsg: 'Are you sure you want to pay for this order?',
    no: 'No',
    yes: 'Yes',
    cancel: 'Cancel',
    error: 'Error',
    loadError: 'Cannot load orders list',
    cancelError: 'Cannot cancel order',
    updateError: 'Cannot update order status',
    currency: '$',
    orderCode: 'Order Code:',
    totalAmount: 'Total Amount:',
    items: 'x',
  }
};

const ActivitiesPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const { currentLanguage } = useContext(LanguageContext);
  const t = translations[currentLanguage];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return '#28a745'; 
      case 'unpaid':
        return '#ffc107'; 
      case 'failed':
        return '#dc3545'; 
      default:
        return '#666';     
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
      Alert.alert(t.error, t.loadError);
    }
  };

  // Handle payment
  const handlePayment = async (orderId) => {
    Alert.alert(
      t.confirmPayment,
      t.confirmPaymentMsg,
      [
        {
          text: t.cancel,
          style: "cancel"
        },
        {
          text: t.yes,
          onPress: async () => {
            try {
              await firebaseService.updateOrderStatus(orderId, 'paid');
              await loadOrders();
            } catch (error) {
              console.error('Error updating order:', error);
              Alert.alert(t.error, t.updateError);
            }
          }
        }
      ]
    );
  };

  // Handle cancel
  const handleCancel = async (orderId) => {
    Alert.alert(
      t.confirmCancel,
      t.confirmCancelMsg,
      [
        {
          text: t.no,
          style: "cancel"
        },
        {
          text: t.yes,
          onPress: async () => {
            try {
              await firebaseService.updateOrderStatus(orderId, 'failed');
              await loadOrders();
            } catch (error) {
              console.error('Error canceling order:', error);
              Alert.alert(t.error, t.cancelError);
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

  // format thời gian
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderOrderCard = (order) => (
    <View style={styles.orderCard} key={order.id}>
      {/* Header của đơn hàng */}
      <View style={styles.orderHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.orderId}>{t.orderCode} {order.id}</Text>
          <Text style={styles.serviceType}>
            <Feather 
              name={order.serviceType === 'Dine-in' ? 'coffee' : 'shopping-bag'} 
              size={14} 
            /> {order.serviceType}
          </Text>
        </View>
        <View style={styles.statusContainer}>
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
            {item.quantity}{t.items} {item.name}
          </Text>
        ))}
        <Text style={styles.totalText}>
          {t.totalAmount} {order.total.toLocaleString()}{t.currency}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {order.status === 'unpaid' && (
          <>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={() => handleCancel(order.id)}
            >
              <Text style={styles.cancelButtonText}>{t.cancelOrder}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.payButton]}
              onPress={() => handlePayment(order.id)}
            >
              <Text style={styles.payButtonText}>{t.payNow}</Text>
            </TouchableOpacity>
          </>
        )}
        {order.status === 'failed' && (
          <View style={styles.failedMessage}>
            <Text style={styles.failedText}>{t.orderCancelled}</Text>
          </View>
        )}
        {order.status === 'paid' && (
          <View style={styles.paidMessage}>
            <Text style={styles.paidText}>{t.orderPaid}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>{t.pageTitle}</Text>
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    flex: 1,
    paddingRight: 8,
  },
  serviceType: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    flexShrink: 0,
    width: 80,
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
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
    fontSize: 12,
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