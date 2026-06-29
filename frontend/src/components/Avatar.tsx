import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type Props = {
  source?: string;
  name?: string;
  size?: Size;
  showOnline?: boolean;
  online?: boolean;
  verified?: boolean;
  style?: ViewStyle;
};

const SIZES: Record<Size, { container: number; text: number; icon: number; badge: number }> = {
  xs: { container: 28, text: 10, icon: 14, badge: 8 },
  sm: { container: 36, text: 12, icon: 18, badge: 10 },
  md: { container: 48, text: 16, icon: 24, badge: 12 },
  lg: { container: 64, text: 20, icon: 32, badge: 14 },
  xl: { container: 96, text: 28, icon: 48, badge: 18 },
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export function Avatar({
  source,
  name,
  size = 'md',
  showOnline = false,
  online = false,
  verified = false,
  style,
}: Props) {
  const dimensions = SIZES[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: dimensions.container,
          height: dimensions.container,
          borderRadius: dimensions.container / 2,
        },
        style,
      ]}
    >
      {source ? (
        <Image
          source={{ uri: source }}
          style={[
            styles.image,
            { borderRadius: dimensions.container / 2 },
          ]}
          contentFit="cover"
          transition={200}
        />
      ) : name ? (
        <View style={[styles.placeholder, { borderRadius: dimensions.container / 2 }]}>
          <Text style={[styles.initials, { fontSize: dimensions.text }]}>
            {getInitials(name)}
          </Text>
        </View>
      ) : (
        <View style={[styles.placeholder, { borderRadius: dimensions.container / 2 }]}>
          <Ionicons name="person" size={dimensions.icon} color={colors.primary} />
        </View>
      )}

      {showOnline && (
        <View
          style={[
            styles.onlineBadge,
            {
              width: dimensions.badge,
              height: dimensions.badge,
              borderRadius: dimensions.badge / 2,
              backgroundColor: online ? colors.success : colors.textTertiary,
            },
          ]}
        />
      )}

      {verified && (
        <View
          style={[
            styles.verifiedBadge,
            {
              width: dimensions.badge + 2,
              height: dimensions.badge + 2,
              borderRadius: (dimensions.badge + 2) / 2,
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={dimensions.badge + 2} color={colors.primary} />
        </View>
      )}
    </View>
  );
}

type AvatarGroupProps = {
  avatars: { source?: string; name?: string }[];
  max?: number;
  size?: Size;
};

export function AvatarGroup({ avatars, max = 4, size = 'sm' }: AvatarGroupProps) {
  const dimensions = SIZES[size];
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <View style={styles.group}>
      {visible.map((avatar, index) => (
        <View
          key={index}
          style={[
            styles.groupItem,
            { marginLeft: index > 0 ? -dimensions.container / 3 : 0, zIndex: visible.length - index },
          ]}
        >
          <Avatar source={avatar.source} name={avatar.name} size={size} />
        </View>
      ))}
      {remaining > 0 && (
        <View
          style={[
            styles.groupItem,
            styles.remainingBadge,
            {
              width: dimensions.container,
              height: dimensions.container,
              borderRadius: dimensions.container / 2,
              marginLeft: -dimensions.container / 3,
            },
          ]}
        >
          <Text style={[styles.remainingText, { fontSize: dimensions.text - 2 }]}>
            +{remaining}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.primary,
    fontWeight: '500',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#fff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupItem: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 999,
  },
  remainingBadge: {
    backgroundColor: colors.surfaceTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainingText: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
