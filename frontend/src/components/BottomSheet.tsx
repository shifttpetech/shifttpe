import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, BackHandler } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoints?: number[];
  enableDrag?: boolean;
};

export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  snapPoints = [0.5],
  enableDrag = true,
}: Props) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const context = useSharedValue({ y: 0 });
  const maxHeight = SCREEN_HEIGHT * Math.max(...snapPoints);

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    translateY.value = withSpring(destination, { damping: 20, stiffness: 150 });
  }, []);

  const close = useCallback(() => {
    scrollTo(SCREEN_HEIGHT);
    setTimeout(onClose, 300);
  }, [onClose, scrollTo]);

  useEffect(() => {
    if (visible) {
      scrollTo(SCREEN_HEIGHT - maxHeight);
    } else {
      scrollTo(SCREEN_HEIGHT);
    }
  }, [visible, maxHeight, scrollTo]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible) {
        close();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [visible, close]);

  const gesture = Gesture.Pan()
    .enabled(enableDrag)
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = Math.max(
        context.value.y + event.translationY,
        SCREEN_HEIGHT - maxHeight
      );
    })
    .onEnd((event) => {
      if (event.velocityY > 500 || translateY.value > SCREEN_HEIGHT - maxHeight / 2) {
        runOnJS(close)();
      } else {
        scrollTo(SCREEN_HEIGHT - maxHeight);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [SCREEN_HEIGHT, SCREEN_HEIGHT - maxHeight],
      [0, 0.5]
    ),
  }));

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
      </Animated.View>

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.sheet, { maxHeight, paddingBottom: insets.bottom + 16 }, sheetStyle]}>
          <View style={styles.handle} />
          
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Pressable onPress={close} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>
          )}

          <View style={styles.content}>{children}</View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: spacing.lg,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.h3,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
});
