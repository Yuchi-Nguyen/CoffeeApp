import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function ConfirmationPage({ navigation }) {
    useEffect(() => {
        // Có thể thêm logic hiệu ứng hoặc analytics tại đây nếu cần
    }, []);

    return (
        <View style={styles.container}>
            <ConfettiCannon count={200} origin={{ x: 0, y: 0 }} fadeOut explosionSpeed={600} />
            <Image
                source={require('../assets/checkmark.png')}
                style={styles.icon}
            />
            <Text style={styles.title}>Thank You!</Text>
            <Text style={styles.message}>Your account has been created.</Text>
            <Pressable
                style={styles.button}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.buttonText}>Continue</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
