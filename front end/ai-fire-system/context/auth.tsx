// context/auth.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

type Role = 'user' | 'admin' | null;

interface AuthContextType {
    role: Role;
    buildingCode: string | null;
    login: (role: Role, code: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [role, setRole] = useState<Role>(null);
    const [buildingCode, setBuildingCode] = useState<string | null>(null);
    const rootSegment = useSegments();
    const router = useRouter();

    useEffect(() => {
        // Check if user was logged in previously
        loadStorageData();
    }, []);

    async function loadStorageData() {
        const savedRole = await AsyncStorage.getItem('userRole');
        const savedCode = await AsyncStorage.getItem('buildingCode');
        if (savedRole && savedCode) {
            setRole(savedRole as Role);
            setBuildingCode(savedCode);
        }
    }

    const login = async (newRole: Role, code: string) => {
        setRole(newRole);
        setBuildingCode(code);
        await AsyncStorage.setItem('userRole', newRole!);
        await AsyncStorage.setItem('buildingCode', code);

        if (newRole === 'admin') {
            router.replace('/admin/dashboard');
        } else {
            router.replace('/user/dashboard');
        }
    };

    const logout = async () => {
        setRole(null);
        setBuildingCode(null);
        await AsyncStorage.clear();
        router.replace('/auth/login');
    };

    return (
        <AuthContext.Provider value={{ role, buildingCode, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};