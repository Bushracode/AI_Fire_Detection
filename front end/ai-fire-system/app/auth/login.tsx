// app/auth/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS } from '../../constants/auth';
import { useAuth } from '../../context/auth';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = () => {
        // Simple validation
        if (email && password) {
            // Note: building code will be fetched from backend later
            login('user', 'TBD-FROM-BACKEND');
        } else {
            Alert.alert("Required", "Please enter both email and password.");
        }
    };

    return (
        <View style={styles.container}>
            {/* Tab Header */}
            <View style={styles.tabContainer}>
                <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                    <Text style={styles.activeTabText}>User Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => router.push('/auth/admin-login')}
                >
                    <Text style={styles.tabText}>Admin Access</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>AI Fire System</Text>
            <Text style={styles.subtitle}>Enter credentials to monitor your safety</Text>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#666"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#666"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                    <Text style={styles.linkText}>Don't have an account? <Text style={{ color: COLORS.accent }}>Sign Up</Text></Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 20,
        justifyContent: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 40,
        borderRadius: 10,
        backgroundColor: COLORS.surface,
        padding: 5,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: COLORS.accent,
    },
    tabText: {
        color: COLORS.textMuted,
        fontWeight: '600',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.text,
        textAlign: 'center',
    },
    subtitle: {
        color: COLORS.textMuted,
        textAlign: 'center',
        marginBottom: 30,
    },
    form: {
        gap: 15,
    },
    input: {
        backgroundColor: COLORS.surface,
        padding: 18,
        borderRadius: 12,
        color: COLORS.text,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    button: {
        backgroundColor: COLORS.accent,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 18,
    },
    linkText: {
        color: COLORS.textMuted,
        textAlign: 'center',
        marginTop: 20,
    }
});