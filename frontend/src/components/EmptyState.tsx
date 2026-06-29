import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from './PrimaryButton';
import { colors, radius, spacing, typography } from '../theme';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  iconColor?: string;
  iconBgColor?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  iconColor = colors.textTertiary,
  iconBgColor = colors.surfaceSoft,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <Ionicons name={icon} size={40} color={iconColor} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction && (
        <View style={styles.buttonContainer}>
          <PrimaryButton label={actionLabel} onPress={onAction} size="md" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.xxl,
    gap: spacing.sm,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.h3,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
});
