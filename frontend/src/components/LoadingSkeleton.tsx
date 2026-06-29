import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { colors, radius, spacing } from '../theme';

type Props = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export function LoadingSkeleton({
  width = '100%',
  height = 20,
  borderRadius = radius.md,
  style,
}: Props) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1500 }), -1, false);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.7, 0.3]),
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width: width as any, height, borderRadius },
        animatedStyle,
        style,
      ]}
    />
  );
}

type CardSkeletonProps = {
  lines?: number;
};

export function CardSkeleton({ lines = 3 }: CardSkeletonProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <LoadingSkeleton width={48} height={48} borderRadius={24} />
        <View style={styles.cardHeaderText}>
          <LoadingSkeleton width="60%" height={16} />
          <LoadingSkeleton width="40%" height={12} style={{ marginTop: 8 }} />
        </View>
      </View>
      {Array.from({ length: lines }).map((_, i) => (
        <LoadingSkeleton
          key={i}
          width={i === lines - 1 ? '70%' : '100%'}
          height={14}
          style={{ marginTop: spacing.sm }}
        />
      ))}
    </View>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.listItem}>
          <LoadingSkeleton width={44} height={44} borderRadius={22} />
          <View style={{ flex: 1 }}>
            <LoadingSkeleton width="70%" height={14} />
            <LoadingSkeleton width="50%" height={12} style={{ marginTop: 6 }} />
          </View>
          <LoadingSkeleton width={60} height={28} borderRadius={14} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.surfaceTertiary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cardHeaderText: {
    flex: 1,
  },
  list: {
    gap: spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
