// app/auth/signup.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS, VALID_BUILDING_CODE } from '../../constants/auth';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [buildingNo, setBuildingNo] = useState('');
    const router = useRouter();

    const handleSignup = () => {
        if (!buildingNo) {
            Alert.alert("Required", "Building number is required to verify registration.");
            return;
        }
        if (buildingNo !== VALID_BUILDING_CODE) {
            Alert.alert("Access Denied", "This building is not registered in our database.");
            return;
        }
        Alert.alert("Registration Success", `Welcome to the AI Fire Detection System. You are registered to ${buildingNo}.`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join AI Fire System</Text>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#666"
                    value={name}
                    onChangeText={setName}
                />
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
                <TextInput
                    style={styles.input}
                    placeholder="Building Number"
                    placeholderTextColor="#666"
                    value={buildingNo}
                    onChangeText={setBuildingNo}
                    autoCapitalize="characters"
                />

                <TouchableOpacity style={styles.button} onPress={handleSignup}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/auth/login')}>
                    <Text style={styles.linkText}>Already have an account? <Text style={{ color: COLORS.accent }}>Login</Text></Text>
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
