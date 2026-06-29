import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONFETTI_COLORS = [
  '#FF3D57',
  '#7B61FF',
  '#10B981',
  '#F59E0B',
  '#EC4899',
  '#3B82F6',
  '#FACC15',
];

type ConfettiPieceProps = {
  index: number;
  onComplete?: () => void;
  isLast?: boolean;
};

function ConfettiPiece({ index, onComplete, isLast }: ConfettiPieceProps) {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0);

  const startX = Math.random() * SCREEN_WIDTH;
  const endX = startX + (Math.random() - 0.5) * 200;
  const delay = index * 30;
  const duration = 2000 + Math.random() * 1000;
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const size = 8 + Math.random() * 8;
  const isCircle = Math.random() > 0.5;

  useEffect(() => {
    scale.value = withDelay(delay, withTiming(1, { duration: 200 }));
    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT + 100, {
        duration,
        easing: Easing.out(Easing.quad),
      })
    );
    translateX.value = withDelay(
      delay,
      withSequence(
        withTiming(endX - startX + 50, { duration: duration / 3 }),
        withTiming(endX - startX - 30, { duration: duration / 3 }),
        withTiming(endX - startX, { duration: duration / 3 })
      )
    );
    rotate.value = withDelay(
      delay,
      withTiming(360 * (Math.random() > 0.5 ? 1 : -1) * 3, { duration })
    );
    opacity.value = withDelay(
      delay + duration - 500,
      withTiming(0, { duration: 500 }, (finished) => {
        if (finished && isLast && onComplete) {
          runOnJS(onComplete)();
        }
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          left: startX,
          width: size,
          height: isCircle ? size : size * 2,
          backgroundColor: color,
          borderRadius: isCircle ? size / 2 : 2,
        },
        animatedStyle,
      ]}
    />
  );
}

type Props = {
  active: boolean;
  count?: number;
  onComplete?: () => void;
};

export function Confetti({ active, count = 50, onComplete }: Props) {
  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: count }).map((_, index) => (
        <ConfettiPiece
          key={index}
          index={index}
          isLast={index === count - 1}
          onComplete={onComplete}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    pointerEvents: 'none',
  },
  confetti: {
    position: 'absolute',
    top: 0,
  },
});
