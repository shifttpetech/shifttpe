import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'neutral';

type Props = {
  label: string;
  variant?: BadgeVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: 'small' | 'medium';
};

const getVariantStyles = (variant: BadgeVariant) => {
  switch (variant) {
    case 'primary':
      return { bg: colors.primaryTint, color: colors.primary };
    case 'success':
      return { bg: colors.successSoft, color: colors.success };
    case 'warning':
      return { bg: colors.warningSoft, color: colors.warning };
    case 'danger':
      return { bg: colors.dangerSoft, color: colors.danger };
    case 'purple':
      return { bg: colors.accentPurpleSoft, color: colors.accentPurple };
    case 'neutral':
    default:
      return { bg: colors.surfaceTertiary, color: colors.textSecondary };
  }
};

export function Badge({ label, variant = 'neutral', icon, size = 'medium' }: Props) {
  const variantStyles = getVariantStyles(variant);
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: variantStyles.bg },
        isSmall && styles.badgeSmall,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={isSmall ? 10 : 12}
          color={variantStyles.color}
        />
      )}
      <Text
        style={[
          styles.label,
          { color: variantStyles.color },
          isSmall && styles.labelSmall,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

type NotificationBadgeProps = {
  count: number;
  max?: number;
};

export function NotificationBadge({ count, max = 99 }: NotificationBadgeProps) {
  if (count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <View style={styles.notificationBadge}>
      <Text style={styles.notificationText}>{displayCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  label: {
    fontSize: typography.caption,
    fontWeight: typography.weightMedium,
  },
  labelSmall: {
    fontSize: 10,
  },
  notificationBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: typography.weightMedium,
  },
});
