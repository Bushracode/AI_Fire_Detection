// app/admin/dashboard.tsx
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Image,
    TouchableOpacity, SafeAreaView, Dimensions, Platform, Alert
} from 'react-native';
import {
    Activity, Users, Zap, Settings, LayoutGrid, Radio,
    AlertTriangle, LogOut, PlusCircle, Video, UserX,
    RefreshCw, Download
} from 'lucide-react-native';
import { COLORS } from '../../constants/auth';
import { useAuth } from '../../context/auth';
import Animated, {
    useSharedValue, useAnimatedStyle, withRepeat,
    withTiming, withSequence, Easing
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 800;

export default function AdminDashboard() {
    const { logout } = useAuth();
    
    // Telemetry Simulation
    const [latency, setLatency] = useState(48);
    const [nodeLoad, setNodeLoad] = useState(41);
    const [activeThreat, setActiveThreat] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(Math.floor(Math.random() * (55 - 42 + 1) + 42));
            setNodeLoad(Math.floor(Math.random() * (60 - 35 + 1) + 35));
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    // Blinking Bounding Box Animation
    const blinkOpacity = useSharedValue(1);
    useEffect(() => {
        if (activeThreat) {
            blinkOpacity.value = withRepeat(
                withSequence(
                    withTiming(0.2, { duration: 500, easing: Easing.ease }),
                    withTiming(1, { duration: 500, easing: Easing.ease })
                ),
                -1, true
            );
        } else {
            blinkOpacity.value = withTiming(1);
        }
    }, [activeThreat]);

    const handleAction = (action: string) => {
        if (action === 'verify') {
            Alert.alert("DISPATCHED", "Emergency services have been alerted via API.");
            setActiveThreat(false);
        } else if (action === 'false_alarm') {
            Alert.alert("FALSE ALARM", "Event logged. Retraining model with negative sample...");
            setActiveThreat(false);
        } else if (action === 'rotate') {
            Alert.alert("PROTOCOL ROTATED", "New Master Code generated. Users must re-authenticate.");
        } else if (action === 'export') {
            Alert.alert("EXPORTING", "Generating 256-bit encrypted history log...");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.mainWrapper}>
                {/* LEFT SIDEBAR */}
                <View style={styles.sidebar}>
                    <View style={styles.logoContainer}>
                        <Activity color={COLORS.textDark} size={28} />
                    </View>
                    <View style={styles.sidebarIcons}>
                        <SidebarIcon Icon={LayoutGrid} active />
                        <SidebarIcon Icon={Users} />
                        <SidebarIcon Icon={Zap} />
                        <SidebarIcon Icon={Settings} />
                        <SidebarIcon Icon={AlertTriangle} />
                    </View>
                    <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                        <LogOut color={COLORS.sidebarIcon} size={24} />
                    </TouchableOpacity>
                </View>

                {/* MAIN CONTENT */}
                <View style={styles.contentArea}>
                    
                    {/* TOP HEADER */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>AI FIRE DETECTION SYSTEM | COMMAND CENTER</Text>
                        
                        <View style={styles.headerStats}>
                            <View style={styles.headerStatBox}>
                                <Text style={styles.statLabel}>Edge Node Load</Text>
                                <Text style={styles.statValue}>~{nodeLoad}%</Text>
                            </View>
                            <View style={styles.headerStatBox}>
                                <Text style={styles.statLabel}>Model</Text>
                                <Text style={styles.statValue}>ViT+YOLOv8</Text>
                            </View>
                            <View style={styles.latencyBox}>
                                <Text style={styles.latencyText}>Edge Latency: {latency}ms</Text>
                                <Radio color={COLORS.textDark} size={18} style={{ marginLeft: 8 }} />
                            </View>
                        </View>
                    </View>

                    {/* DASHBOARD BODY */}
                    <ScrollView contentContainerStyle={styles.scrollBody}>
                        <View style={[styles.dashboardGrid, !isLargeScreen && { flexDirection: 'column' }]}>
                            
                            {/* CAMERA SECTION */}
                            <View style={[styles.cameraSection, !isLargeScreen && { width: '100%' }]}>
                                <View style={[styles.cameraRow, !isLargeScreen && { flexDirection: 'column' }]}>
                                    <CameraFeed
                                        id="01" zone="Zone 1" fps={22}
                                        img="https://images.unsplash.com/photo-1516550135131-fe3dcb0bedc7?q=80&w=400"
                                        status={activeThreat ? "alert" : "nominal"} 
                                        label={activeThreat ? "FIRE 99.2% CONFIDENCE" : ""}
                                        animatedOpacity={activeThreat ? blinkOpacity : null}
                                    />
                                    <CameraFeed
                                        id="02" zone="Park" fps={22}
                                        img="https://images.unsplash.com/photo-1542144611-13e9259a287c?q=80&w=400"
                                        status="nominal"
                                    />
                                </View>
                                <View style={[styles.cameraRow, !isLargeScreen && { flexDirection: 'column' }]}>
                                    <CameraFeed
                                        id="03" zone="Complex" fps={22}
                                        img="https://images.unsplash.com/photo-1449156003053-9642146d9559?q=80&w=400"
                                        status="nominal"
                                    />
                                    <CameraFeed
                                        id="04" zone="Intersection" fps={22}
                                        img="https://images.unsplash.com/photo-1475503562772-fb9a89b74b6b?q=80&w=400"
                                        status="nominal"
                                    />
                                </View>
                            </View>

                            {/* RIGHT SIDEBAR */}
                            <View style={[styles.threatSection, !isLargeScreen && { width: '100%', marginTop: 20 }]}>
                                
                                {/* ADMIN CONTROLS */}
                                <Text style={styles.sectionTitle}>ADMINISTRATOR PROTOCOLS</Text>
                                <View style={styles.adminControlsCard}>
                                    <TouchableOpacity style={styles.adminActionBtn} onPress={() => handleAction('rotate')}>
                                        <RefreshCw color={COLORS.textDark} size={16} />
                                        <Text style={styles.adminActionText}>Rotate Building Code</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.adminActionBtn} onPress={() => handleAction('export')}>
                                        <Download color={COLORS.textDark} size={16} />
                                        <Text style={styles.adminActionText}>Export Encrypted History</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.adminActionBtn, styles.dangerBtn]}>
                                        <UserX color={COLORS.text} size={16} />
                                        <Text style={[styles.adminActionText, { color: COLORS.text }]}>Disable User Access</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* THREAT STREAM */}
                                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>THREAT STREAM</Text>
                                
                                {activeThreat ? (
                                    <View style={[styles.threatCard, { borderColor: COLORS.accent, shadowColor: COLORS.accent }]}>
                                        <Text style={[styles.threatCardTitle, { color: COLORS.accent }]}>FIRE DETECTED - ZONE 1</Text>
                                        <View style={styles.threatImgBox}>
                                            <Image source={{ uri: "https://images.unsplash.com/photo-1516550135131-fe3dcb0bedc7?q=80&w=400" }} style={styles.threatImg} />
                                        </View>
                                        <View style={styles.threatDetails}>
                                            <View>
                                                <Text style={styles.threatConf}>98.2% Confidence</Text>
                                                <Text style={styles.actionReq}>Awaiting Command...</Text>
                                            </View>
                                        </View>
                                        <View style={styles.actionKnobsContainer}>
                                            <TouchableOpacity style={[styles.dispatchBtn, { backgroundColor: COLORS.accent }]} onPress={() => handleAction('verify')}>
                                                <Text style={styles.dispatchBtnText}>Verify & Dispatch</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.dispatchBtn, { backgroundColor: '#334155' }]} onPress={() => handleAction('false_alarm')}>
                                                <Text style={styles.dispatchBtnText}>False Alarm</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={[styles.threatCard, { borderColor: COLORS.nominal }]}>
                                        <Text style={[styles.threatCardTitle, { color: COLORS.nominal }]}>NO ACTIVE THREATS</Text>
                                        <Text style={styles.threatConf}>System Nominal.</Text>
                                    </View>
                                )}

                            </View>

                        </View>
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
}

const SidebarIcon = ({ Icon, active }: { Icon: any, active?: boolean }) => (
    <TouchableOpacity style={[styles.iconBox, active && styles.iconBoxActive]}>
        <Icon color={active ? COLORS.textDark : COLORS.sidebarIcon} size={24} />
    </TouchableOpacity>
);

const CameraFeed = ({ id, zone, fps, img, status, label, animatedOpacity }: any) => {
    let color = COLORS.nominal;
    if (status === 'alert') color = COLORS.accent;
    if (status === 'warning') color = COLORS.warning;

    return (
        <View style={[styles.cameraContainer, { borderColor: color, shadowColor: color }]}>
            <View style={styles.cameraHeader}>
                <Text style={styles.cameraTitle}>Cam {id} - {zone}</Text>
                <View style={styles.cameraTags}>
                    <Text style={styles.tag}>FPS: {fps}</Text>
                </View>
            </View>
            <View style={styles.feedBox}>
                <Image source={{ uri: img }} style={styles.feedImg} />
                {label && (
                    <Animated.View style={[styles.boundingBox, { borderColor: color }, animatedOpacity ? { opacity: animatedOpacity } : {}]}>
                        <Text style={[styles.boxLabel, { backgroundColor: color }]}>{label}</Text>
                    </Animated.View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.sidebar },
    mainWrapper: { flex: 1, flexDirection: 'row' },
    
    sidebar: {
        width: 60,
        backgroundColor: COLORS.sidebar,
        alignItems: 'center',
        paddingVertical: 20,
        borderRightWidth: 1,
        borderColor: '#ccc',
        zIndex: 10
    },
    logoContainer: { marginBottom: 30 },
    sidebarIcons: { gap: 15, flex: 1 },
    iconBox: { padding: 10, borderRadius: 8 },
    iconBoxActive: { backgroundColor: COLORS.sidebarActive },
    logoutBtn: { padding: 10 },

    contentArea: { flex: 1, backgroundColor: COLORS.background },
    
    header: {
        backgroundColor: COLORS.sidebar,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        zIndex: 5
    },
    headerTitle: { fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontSize: 16, fontWeight: 'bold', color: COLORS.textDark, letterSpacing: 1 },
    headerStats: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    headerStatBox: { backgroundColor: '#cbd5e1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
    statLabel: { fontSize: 9, color: COLORS.sidebarIcon, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
    statValue: { fontSize: 12, fontWeight: 'bold', color: COLORS.textDark, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
    latencyBox: { flexDirection: 'row', alignItems: 'center', paddingLeft: 10, borderLeftWidth: 1, borderColor: '#cbd5e1' },
    latencyText: { fontSize: 14, fontWeight: 'bold', color: COLORS.textDark, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },

    scrollBody: { padding: 15 },
    dashboardGrid: { flexDirection: 'row', gap: 20 },
    
    cameraSection: { flex: 3, gap: 15 },
    cameraRow: { flexDirection: 'row', gap: 15 },
    cameraContainer: {
        flex: 1,
        backgroundColor: '#1a232c',
        borderRadius: 8,
        borderWidth: 2,
        padding: 2,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    cameraHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 8, backgroundColor: 'rgba(0,0,0,0.3)' },
    cameraTitle: { color: COLORS.text, fontSize: 12, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
    cameraTags: { flexDirection: 'row', gap: 5 },
    tag: { color: COLORS.textDark, backgroundColor: '#cbd5e1', fontSize: 9, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, fontWeight: 'bold' },
    feedBox: { height: 180, width: '100%', position: 'relative', overflow: 'hidden', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 },
    feedImg: { width: '100%', height: '100%', opacity: 0.8 },
    boundingBox: { position: 'absolute', top: 30, left: 30, width: 150, height: 110, borderWidth: 2 },
    boxLabel: { color: COLORS.text, fontSize: 10, fontWeight: 'bold', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },

    threatSection: { flex: 1, minWidth: 280 },
    sectionTitle: { color: COLORS.text, fontSize: 13, fontWeight: 'bold', letterSpacing: 1, marginBottom: 10, backgroundColor: '#1e293b', padding: 8, borderRadius: 4, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
    
    adminControlsCard: { backgroundColor: '#1e293b', padding: 12, borderRadius: 8, gap: 10 },
    adminActionBtn: { backgroundColor: '#cbd5e1', flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 6, gap: 10 },
    dangerBtn: { backgroundColor: COLORS.error },
    adminActionText: { color: COLORS.textDark, fontSize: 12, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },

    threatCard: { backgroundColor: '#1a232c', borderRadius: 8, borderWidth: 2, padding: 12 },
    threatCardTitle: { fontSize: 11, fontWeight: 'bold', marginBottom: 8, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
    threatImgBox: { height: 80, width: '100%', borderRadius: 4, overflow: 'hidden', marginBottom: 10 },
    threatImg: { width: '100%', height: '100%' },
    threatDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 15 },
    threatConf: { color: COLORS.text, fontSize: 14, fontWeight: 'bold' },
    actionReq: { color: COLORS.textMuted, fontSize: 11, marginTop: 4 },
    
    actionKnobsContainer: { gap: 10 },
    dispatchBtn: { paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    dispatchBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 }
});