import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { AuthProvider } from './context/AuthContext';
import RootNavigator from './Navigation/RootNavigator';
import Header from './Components/UserInfoHeader';
import Profile from './Pages/ProfilePage';
export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
