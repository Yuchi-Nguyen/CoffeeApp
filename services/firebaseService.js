import { db, storage } from '../config/firebase';
import { 
  collection, getDocs, addDoc, updateDoc, 
  deleteDoc, doc, query, where 
} from 'firebase/firestore';

export const firebaseService = {
  // 1. Quản lý Products
  async getProducts() {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  },

  // 2. Quản lý Orders
  async createOrder(userId, orderData) {
    try {
      const orderRef = await addDoc(collection(db, 'orders'), {
        userId,
        ...orderData,
        createdAt: new Date().toISOString(),
        status: 'unpaid',
        timeLimit: 300, // 5 phút
      });
      return orderRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async getOrders(userId) {
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        // orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        status,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  async getCurrentUnpaidOrder(userId) {
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        where('status', '==', 'unpaid'),
        // limit(1)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty ? null : {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      };
    } catch (error) {
      console.error('Error getting current order:', error);
      throw error;
    }
  },

  // 3. Quản lý User Profile
  async updateUserProfile(userId, profileData) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, profileData);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Thêm các hàm quản lý giỏ hàng
  async addToCart(userId, productData) {
    try {
      const cartRef = collection(db, 'carts');
      const q = query(cartRef, where('userId', '==', userId), where('productId', '==', productData.id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
        const cartItem = querySnapshot.docs[0];
        const currentQuantity = cartItem.data().quantity;
        await updateDoc(doc(db, 'carts', cartItem.id), {
          quantity: currentQuantity + productData.quantity
        });
      } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        await addDoc(cartRef, {
          userId,
          productId: productData.id,
          name: productData.name,
          price: productData.price,
          size: productData.size || 'M',
          quantity: productData.quantity,
          specialInstructions: productData.specialInstructions || '',
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  async getCartItems(userId) {
    try {
      const q = query(collection(db, 'carts'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting cart items:', error);
      throw error;
    }
  },

  async updateCartItemQuantity(cartItemId, quantity) {
    try {
      const cartItemRef = doc(db, 'carts', cartItemId);
      await updateDoc(cartItemRef, { quantity });
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      throw error;
    }
  },

  async removeFromCart(cartItemId) {
    try {
      await deleteDoc(doc(db, 'carts', cartItemId));
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Thêm hàm xóa toàn bộ giỏ hàng của user
  async clearCart(userId) {
    try {
      const cartRef = collection(db, 'carts');
      const q = query(cartRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      // Xóa từng item trong giỏ hàng
      const deletePromises = querySnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },
};