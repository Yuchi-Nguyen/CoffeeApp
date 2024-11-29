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
      return await addDoc(collection(db, 'orders'), {
        userId,
        ...orderData,
        createdAt: new Date().toISOString(),
        status: 'pending'
      });
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async getUserOrders(userId) {
    try {
      const q = query(
        collection(db, 'orders'), 
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting user orders:', error);
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
};