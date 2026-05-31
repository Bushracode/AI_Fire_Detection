// app/_layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/auth';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/auth';

export default function RootLayout() {
    return (
        <AuthProvider>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: COLORS.background },
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="auth/login" />
                <Stack.Screen name="auth/signup" />
                <Stack.Screen name="auth/admin-login" />
                <Stack.Screen name="admin/dashboard" />
                <Stack.Screen name="user/dashboard" />
            </Stack>
        </AuthProvider>
    );
}
