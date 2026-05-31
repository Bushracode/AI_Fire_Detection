// app/user/dashboard.tsx
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    SafeAreaView, Dimensions, Platform, Alert
} from 'react-native';
import {
    ShieldAlert, ShieldCheck, Video, Phone,
    Activity, LogOut, Bell, Map, ShieldX, Users, Megaphone, Camera, CheckCircle, Image as ImageIcon
} from 'lucide-react-native';
import { COLORS } from '../../constants/auth';
import { useAuth } from '../../context/auth';
import * as Linking from 'expo-linking';
import * as Haptics from 'expo-haptics';
import Animated, {
    useSharedValue, useAnimatedStyle, withRepeat,
    withTiming, withSequence, Easing
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 800;

export default function UserDashboard() {
    const { logout, buildingCode } = useAuth();
    const [panicMode, setPanicMode] = useState(false);
    const [isSafe, setIsSafe] = useState(false);

    // Reanimated Values for Panic Overlay
    const flashOpacity = useSharedValue(0);

    useEffect(() => {
        let interval: any;
        if (panicMode) {
            flashOpacity.value = withRepeat(
                withSequence(
                    withTiming(0.8, { duration: 400, easing: Easing.ease }),
                    withTiming(0.2, { duration: 400, easing: Easing.ease })
                ),
                -1,
                true
            );

            if (Platform.OS !== 'web') {
                interval = setInterval(() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                }, 800);
            }
        } else {
            flashOpacity.value = withTiming(0, { duration: 500 });
            if (interval) clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [panicMode]);

    const panicStyle = useAnimatedStyle(() => ({
        opacity: flashOpacity.value,
    }));

    const dialEmergency = (number: string) => {
        Linking.openURL(`tel:${number}`);
    };

    const handleFalseAlarm = () => {
        Alert.alert("False Alarm Reported", "Admin has been notified to stand down. Thank you for verifying.");
        setPanicMode(false);
        setIsSafe(false);
    };

    const handleSafeCheckIn = () => {
        Alert.alert("Status Updated", "You have been marked as SAFE. Responders have been notified.");
        setIsSafe(true);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>AI FIRE DETECTION SYSTEM | USER</Text>
                <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                    <LogOut color={COLORS.textDark} size={18} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollBody}>
                
                {/* SAFETY STATUS */}
                <View style={[styles.bentoCard, styles.statusCard, panicMode && styles.statusCardDanger, isSafe && styles.statusCardSafe]}>
                    <View style={styles.statusHeader}>
                        {panicMode ? (
                            isSafe ? <CheckCircle color="#fff" size={40} /> : <ShieldAlert color="#fff" size={40} />
                        ) : <ShieldCheck color="#fff" size={40} />}
                        <Text style={styles.statusText}>
                            {panicMode ? (isSafe ? "MARKED AS SAFE" : "EVACUATE IMMEDIATELY") : "SYSTEM NORMAL"}
                        </Text>
                    </View>
                    <Text style={styles.statusSubtext}>Building: {buildingCode || 'BLD-2024-X7'}</Text>
                    
                    {/* CONDITIONAL ACTION BUTTONS */}
                    {panicMode && !isSafe && (
                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#10b981' }]} onPress={handleSafeCheckIn}>
                                <CheckCircle color="#fff" size={18} />
                                <Text style={[styles.actionText, { color: '#fff' }]}>I Am Safe</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#fff' }]} onPress={handleFalseAlarm}>
                                <ShieldX color={COLORS.accent} size={18} />
                                <Text style={[styles.actionText, { color: COLORS.accent }]}>False Alarm</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* EVACUATION ROUTE (FULL WIDTH) */}
                <TouchableOpacity style={[styles.bentoCard, styles.evacCard]} onPress={() => Alert.alert("Evacuation Map", "Opening optimal exit route overlay...")}>
                    <View style={styles.evacContent}>
                        <Map color={COLORS.textDark} size={28} />
                        <View style={{ marginLeft: 15 }}>
                            <Text style={styles.evacTitle}>View Evacuation Map</Text>
                            <Text style={styles.evacSub}>Tap to view safe exit routes</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* BENTO GRID ROW 1 (CAMERAS & CONTACTS) */}
                <View style={styles.bentoRow}>
                    <View style={[styles.bentoCard, styles.bentoHalf]}>
                        <Video color={COLORS.success} size={28} />
                        <Text style={styles.bentoValue}>12/12</Text>
                        <Text style={styles.bentoLabel}>Active Cameras</Text>
                    </View>
                    <TouchableOpacity style={[styles.bentoCard, styles.bentoHalf]} onPress={() => Alert.alert("Emergency Contacts", "Opening contact manager...")}>
                        <Users color={COLORS.nominal} size={28} />
                        <Text style={styles.bentoValue}>2</Text>
                        <Text style={styles.bentoLabel}>Linked Contacts</Text>
                    </TouchableOpacity>
                </View>

                {/* EMERGENCY DISPATCH */}
                <Text style={styles.sectionTitle}>EMERGENCY DISPATCH</Text>
                <View style={styles.dispatchRow}>
                    <TouchableOpacity style={[styles.dispatchBtn, { backgroundColor: '#e11d48' }]} onPress={() => dialEmergency('16')}>
                        <Phone color="#fff" size={20} />
                        <Text style={styles.dispatchText}>Fire (16)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.dispatchBtn, { backgroundColor: '#f59e0b' }]} onPress={() => dialEmergency('1122')}>
                        <Phone color="#fff" size={20} />
                        <Text style={styles.dispatchText}>Rescue (1122)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.dispatchBtn, { backgroundColor: '#2563eb' }]} onPress={() => dialEmergency('15')}>
                        <Phone color="#fff" size={20} />
                        <Text style={styles.dispatchText}>Police (15)</Text>
                    </TouchableOpacity>
                </View>

                {/* BUILDING BROADCASTS */}
                <Text style={styles.sectionTitle}>BUILDING BROADCASTS</Text>
                <View style={[styles.bentoCard, { backgroundColor: '#334155', borderColor: '#475569' }]}>
                    <View style={styles.broadcastHeader}>
                        <Megaphone color={COLORS.nominal} size={18} />
                        <Text style={styles.broadcastTitle}>Management Update</Text>
                    </View>
                    <Text style={styles.broadcastText}>
                        System Test & Fire Drill scheduled for tomorrow at 10:00 AM. Please proceed to the assembly point upon hearing alarms.
                    </Text>
                    <Text style={styles.broadcastTime}>Posted: 2 hours ago</Text>
                </View>

                {/* RECENT ALERTS */}
                <Text style={styles.sectionTitle}>RECENT ALERT HISTORY</Text>
                <View style={styles.bentoCard}>
                    <View style={styles.alertItem}>
                        <View style={styles.snapshotPlaceholder}>
                            <ImageIcon color={COLORS.textMuted} size={20} />
                        </View>
                        <View style={styles.alertDetails}>
                            <Text style={styles.alertText}>AI Detection: Fire</Text>
                            <Text style={styles.alertTime}>Today, 08:45 AM (Kitchen Cam 2)</Text>
                            <TouchableOpacity onPress={() => Alert.alert("View Snapshot", "Loading AI Snapshot...")}>
                                <Text style={styles.viewSnapshotText}>View Snapshot</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.alertItem, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                        <View style={styles.snapshotPlaceholder}>
                            <Activity color={COLORS.textMuted} size={20} />
                        </View>
                        <View style={styles.alertDetails}>
                            <Text style={styles.alertText}>Camera Diagnostics</Text>
                            <Text style={styles.alertTime}>Yesterday, 00:00 AM (All Clear)</Text>
                        </View>
                    </View>
                </View>

                {/* SIMULATION CONTROLS */}
                <TouchableOpacity
                    style={[styles.simBtn, panicMode && styles.simBtnActive]}
                    onPress={() => {
                        setPanicMode(!panicMode);
                        if(panicMode) setIsSafe(false);
                    }}
                >
                    <Text style={styles.simBtnText}>{panicMode ? "RESET SYSTEM" : "SIMULATE AI FIRE DETECTION"}</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* PANIC OVERLAY */}
            <Animated.View style={[styles.panicOverlay, panicStyle]} pointerEvents="none">
                <View style={styles.panicOverlayInner} />
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.background },
    header: {
        backgroundColor: COLORS.sidebar,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
        zIndex: 10
    },
    headerTitle: { fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontSize: 16, fontWeight: 'bold', color: COLORS.textDark },
    logoutBtn: { padding: 5 },

    scrollBody: { padding: 20, paddingBottom: 100 },
    
    bentoCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    bentoRow: { flexDirection: 'row', gap: 15 },
    bentoHalf: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    bentoValue: { fontSize: 28, fontWeight: '900', color: COLORS.text, marginTop: 10 },
    bentoLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: 5, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },

    statusCard: { backgroundColor: COLORS.success, borderColor: COLORS.success, alignItems: 'center', paddingVertical: 30 },
    statusCardDanger: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
    statusCardSafe: { backgroundColor: '#10b981', borderColor: '#10b981' },
    statusHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    statusText: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 1 },
    statusSubtext: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 10, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
    
    actionBtn: { flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, alignItems: 'center', gap: 8 },
    actionText: { fontWeight: 'bold', fontSize: 13 },

    evacCard: { backgroundColor: '#cbd5e1', padding: 15 },
    evacContent: { flexDirection: 'row', alignItems: 'center' },
    evacTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark },
    evacSub: { fontSize: 11, color: COLORS.sidebarIcon, marginTop: 2 },

    sectionTitle: { fontSize: 12, color: COLORS.textMuted, fontWeight: 'bold', marginTop: 10, marginBottom: 15, letterSpacing: 2, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
    
    dispatchRow: { flexDirection: 'row', gap: 10, marginBottom: 25 },
    dispatchBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 12, gap: 8 },
    dispatchText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

    broadcastHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    broadcastTitle: { color: COLORS.nominal, fontWeight: 'bold', fontSize: 13 },
    broadcastText: { color: COLORS.text, fontSize: 13, lineHeight: 20 },
    broadcastTime: { color: COLORS.textMuted, fontSize: 10, marginTop: 10 },

    alertItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 15, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    snapshotPlaceholder: { width: 44, height: 44, borderRadius: 8, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
    alertDetails: { flex: 1 },
    alertText: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
    alertTime: { color: COLORS.textMuted, fontSize: 11, marginTop: 4, marginBottom: 8 },
    viewSnapshotText: { color: '#3b82f6', fontSize: 12, fontWeight: 'bold' },

    simBtn: { marginTop: 40, backgroundColor: '#334155', padding: 20, borderRadius: 12, alignItems: 'center' },
    simBtnActive: { backgroundColor: COLORS.success },
    simBtnText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1 },

    panicOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(244, 63, 94, 0.5)',
        zIndex: 9999,
        justifyContent: 'center',
        alignItems: 'center'
    },
    panicOverlayInner: { width: '100%', height: '100%', borderWidth: 20, borderColor: COLORS.accent }
});
