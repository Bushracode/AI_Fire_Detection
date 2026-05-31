// app/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/auth';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/auth';

export default function Index() {
    const { role } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If we haven't loaded the user role yet, stay on loader
        // If role exists, go to appropriate dashboard, otherwise go to login
        if (role === 'admin') {
            router.replace('/admin/dashboard');
        } else if (role === 'user') {
            router.replace('/user/dashboard');
        } else {
            router.replace('/auth/login');
        }
    }, [role]);

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
    );
}