import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, shadows } from '../theme';

type ToastType = 'success' | 'error' | 'warning' | 'info';

type Props = {
  visible: boolean;
  type?: ToastType;
  message: string;
  duration?: number;
  onHide: () => void;
};

const getToastConfig = (type: ToastType) => {
  switch (type) {
    case 'success':
      return { icon: 'checkmark-circle', color: colors.success, bg: colors.successSoft };
    case 'error':
      return { icon: 'close-circle', color: colors.danger, bg: colors.dangerSoft };
    case 'warning':
      return { icon: 'warning', color: colors.warning, bg: colors.warningSoft };
    case 'info':
    default:
      return { icon: 'information-circle', color: colors.accentPurple, bg: colors.accentPurpleSoft };
  }
};

export function Toast({
  visible,
  type = 'info',
  message,
  duration = 3000,
  onHide,
}: Props) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const config = getToastConfig(type);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 15 });
      opacity.value = withTiming(1, { duration: 200 });

      const timeout = setTimeout(() => {
        hide();
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [visible]);

  const hide = () => {
    translateY.value = withTiming(-100, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(onHide)();
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { top: insets.top + spacing.sm, backgroundColor: config.bg },
        animatedStyle,
      ]}
    >
      <Pressable onPress={hide} style={styles.content}>
        <Ionicons name={config.icon as any} size={22} color={config.color} />
        <Text style={[styles.message, { color: config.color }]} numberOfLines={2}>
          {message}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    borderRadius: radius.lg,
    ...shadows.floating,
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  message: {
    flex: 1,
    fontSize: typography.bodySm,
    fontWeight: typography.weightMedium,
  },
});
