import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const ActivitiesPage = () => {
  // Thay đổi từ useState([...]) sang useState để có thể cập nhật
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      serviceType: 'Dine-in',
      items: [
        { name: 'Cà phê sữa', quantity: 2 },
        { name: 'Bánh mì', quantity: 1 }
      ],
      location: 'Tầng 1, Tòa nhà A',
      total: 120000,
      status: 'unpaid',
    },
    {
      id: 'ORD002',
      serviceType: 'Pick-up',
      items: [
        { name: 'Trà sữa', quantity: 3 },
        { name: 'Bánh flan', quantity: 2 }
      ],
      location: 'Tầng 2, Tòa nhà B',
      total: 180000,
      status: 'paid',
    },
  ]);

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

  // Thêm hàm xử lý thanh toán
  const handlePayment = (orderId) => {
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
          onPress: () => {
            setOrders(orders.map(order => 
              order.id === orderId 
                ? {...order, status: 'paid'}
                : order
            ));
          }
        }
      ]
    );
  };

  // Thêm hàm xử lý hủy đơn
  const handleCancel = (orderId) => {
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
          onPress: () => {
            setOrders(orders.map(order => 
              order.id === orderId 
                ? {...order, status: 'failed'}
                : order
            ));
          }
        }
      ]
    );
  };

  // Thêm state để lưu thời gian còn lại cho mỗi đơn hàng
  const [timeLeft, setTimeLeft] = useState({});

  // Thêm useEffect để xử lý đếm ngược
  useEffect(() => {
    // Khởi tạo thời gian cho các đơn unpaid
    const initialTimeLeft = {};
    orders.forEach(order => {
      if (order.status === 'unpaid') {
        initialTimeLeft[order.id] = 300; // 5 phút = 300 giây
      }
    });
    setTimeLeft(initialTimeLeft);

    // Tạo interval để đếm ngược
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = { ...prevTime };
        let needsUpdate = false;

        // Cập nhật thời gian và kiểm tra hết giờ
        Object.keys(newTime).forEach(orderId => {
          if (newTime[orderId] > 0) {
            newTime[orderId] -= 1;
            if (newTime[orderId] === 0) {
              // Tự động hủy đơn khi hết thời gian
              setOrders(prevOrders =>
                prevOrders.map(order =>
                  order.id === orderId
                    ? { ...order, status: 'failed' }
                    : order
                )
              );
            }
            needsUpdate = true;
          }
        });

        return needsUpdate ? newTime : prevTime;
      });
    }, 1000);

    // Cleanup timer
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
});

export default ActivitiesPage;