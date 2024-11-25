import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { AuthProvider } from './context/AuthContext';
import RootNavigator from './Navigation/RootNavigator';
import Header from './Components/UserInfoHeader';
import Profile from './Pages/ProfilePage';
import AppNavigator from './Navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <RootNavigator />
    </AuthProvider>
  );
}
