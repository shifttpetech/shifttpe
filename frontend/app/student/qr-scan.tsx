import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Confetti } from '@/src/components/Confetti';
import { colors, radius, spacing, typography } from '@/src/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ScanState = 'scanning' | 'success' | 'error';

export default function QRScan() {
  const { type, shiftId } = useLocalSearchParams<{ type: 'checkin' | 'checkout'; shiftId: string }>();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanState, setScanState] = useState<ScanState>('scanning');
  const [showConfetti, setShowConfetti] = useState(false);
  const [scanned, setScanned] = useState(false);

  const scanLineY = useSharedValue(0);
  const successScale = useSharedValue(0);
  const successOpacity = useSharedValue(0);

  const isCheckIn = type === 'checkin';

  useEffect(() => {
    // Animate scan line
    scanLineY.value = withRepeat(
      withTiming(200, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    handleScanSuccess();
  };

  const handleScanSuccess = () => {
    setScanState('success');
    successScale.value = withSpring(1, { damping: 10 });
    successOpacity.value = withTiming(1, { duration: 300 });
    
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    if (isCheckIn) {
      setShowConfetti(true);
    }

    // Navigate after animation
    setTimeout(() => {
      if (isCheckIn) {
        router.replace({ pathname: '/student/shift-running', params: { id: shiftId } } as any);
      } else {
        router.replace({ pathname: '/student/checkout-success', params: { id: shiftId } } as any);
      }
    }, 2500);
  };

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
  }));

  const successStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
    opacity: successOpacity.value,
  }));

  // Permission not determined yet
  if (!permission) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#000', '#1a1a1a']} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.permissionContainer}>
          <Ionicons name="camera" size={64} color={colors.primary} />
          <Text style={styles.permissionTitle}>Camera Access</Text>
          <Text style={styles.permissionText}>Loading camera permissions...</Text>
        </SafeAreaView>
      </View>
    );
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#000', '#1a1a1a']} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.permissionContainer}>
          <View style={styles.permissionIcon}>
            <Ionicons name="camera-outline" size={48} color={colors.primary} />
          </View>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to scan QR codes for check-in/check-out
          </Text>
          <PrimaryButton label="Grant Permission" onPress={requestPermission} />
          <Pressable onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backLinkText}>Go Back</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera Background */}
      {scanState === 'scanning' && (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
      )}

      {/* Dark overlay for success state */}
      {scanState === 'success' && (
        <LinearGradient colors={['#000', '#1a1a1a']} style={StyleSheet.absoluteFill} />
      )}

      <Confetti active={showConfetti} count={60} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>
            {isCheckIn ? 'Check In' : 'Check Out'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Scanner Area */}
        <View style={styles.scannerContainer}>
          {scanState === 'scanning' ? (
            <>
              <View style={styles.scannerFrame}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
                
                <Animated.View style={[styles.scanLine, scanLineStyle]}>
                  <LinearGradient
                    colors={['transparent', colors.primary, 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.scanLineGradient}
                  />
                </Animated.View>
              </View>

              <Text style={styles.scanText}>
                Align the QR code within the frame
              </Text>
              <Text style={styles.scanSubtext}>
                {isCheckIn
                  ? 'Scan the QR code displayed at the venue to check in'
                  : 'Scan the QR code to complete your shift'}
              </Text>
            </>
          ) : scanState === 'success' ? (
            <Animated.View style={[styles.successContainer, successStyle]}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark" size={60} color="#fff" />
              </View>
              <Text style={styles.successTitle}>
                {isCheckIn ? 'Checked In!' : 'Checked Out!'}
              </Text>
              <Text style={styles.successSubtext}>
                {isCheckIn
                  ? 'Your shift has started. Good luck!'
                  : 'Great job! Your earnings will be credited soon.'}
              </Text>
            </Animated.View>
          ) : null}
        </View>

        {/* Bottom Info */}
        {scanState === 'scanning' && (
          <View style={styles.bottomInfo}>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={20} color={colors.primary} />
              <Text style={styles.infoText}>
                Point camera at any QR code to scan
              </Text>
            </View>

            <Pressable onPress={handleScanSuccess} style={styles.manualBtn}>
              <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
              <Text style={styles.manualText}>Skip (Demo Mode)</Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weightMedium,
    color: '#fff',
  },
  scannerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  scannerFrame: {
    width: SCREEN_WIDTH - 80,
    height: SCREEN_WIDTH - 80,
    maxWidth: 280,
    maxHeight: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: colors.primary,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: radius.md,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: radius.md,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: radius.md,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: radius.md,
  },
  scanLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 3,
  },
  scanLineGradient: {
    flex: 1,
    borderRadius: 2,
  },
  scanText: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: '#fff',
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  scanSubtext: {
    fontSize: typography.bodySm,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  successContainer: {
    alignItems: 'center',
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: typography.weightMedium,
    color: '#fff',
  },
  successSubtext: {
    fontSize: typography.body,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomInfo: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.lg,
  },
  infoText: {
    flex: 1,
    fontSize: typography.bodySm,
    color: 'rgba(255,255,255,0.8)',
  },
  manualBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  manualText: {
    fontSize: typography.bodySm,
    color: colors.primary,
    fontWeight: typography.weightMedium,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  permissionIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionTitle: {
    fontSize: typography.h2,
    fontWeight: typography.weightMedium,
    color: '#fff',
    textAlign: 'center',
  },
  permissionText: {
    fontSize: typography.body,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
  backLink: {
    padding: spacing.md,
  },
  backLinkText: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: typography.weightMedium,
  },
});
