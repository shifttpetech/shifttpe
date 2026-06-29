import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

type Props = {
  value: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
  logo?: React.ReactNode;
};

// Simple QR code pattern generator (visual mock - not scannable)
const generateQRPattern = (value: string, modules: number = 21): boolean[][] => {
  const pattern: boolean[][] = [];
  const hash = value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  for (let i = 0; i < modules; i++) {
    pattern[i] = [];
    for (let j = 0; j < modules; j++) {
      // Position detection patterns (corners)
      const isTopLeft = i < 7 && j < 7;
      const isTopRight = i < 7 && j >= modules - 7;
      const isBottomLeft = i >= modules - 7 && j < 7;
      
      if (isTopLeft || isTopRight || isBottomLeft) {
        // Create finder pattern
        const localI = isTopLeft ? i : isTopRight ? i : i - (modules - 7);
        const localJ = isTopLeft ? j : isTopRight ? j - (modules - 7) : j;
        
        const isOuterBorder = localI === 0 || localI === 6 || localJ === 0 || localJ === 6;
        const isInnerSquare = localI >= 2 && localI <= 4 && localJ >= 2 && localJ <= 4;
        
        pattern[i][j] = isOuterBorder || isInnerSquare;
      } else {
        // Generate pseudo-random pattern based on hash
        const seed = (hash + i * 31 + j * 17) % 100;
        pattern[i][j] = seed > 45;
      }
    }
  }
  
  return pattern;
};

export function QRCode({
  value,
  size = 200,
  color = colors.textPrimary,
  backgroundColor = '#fff',
  logo,
}: Props) {
  const modules = 21;
  const pattern = generateQRPattern(value, modules);
  const moduleSize = size / modules;

  return (
    <View style={[styles.container, { width: size, height: size, backgroundColor }]}>
      <View style={styles.qrGrid}>
        {pattern.map((row, i) => (
          <View key={i} style={styles.qrRow}>
            {row.map((cell, j) => (
              <View
                key={`${i}-${j}`}
                style={[
                  styles.qrCell,
                  {
                    width: moduleSize,
                    height: moduleSize,
                    backgroundColor: cell ? color : backgroundColor,
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
      {logo && <View style={styles.logoContainer}>{logo}</View>}
    </View>
  );
}

type QRScannerProps = {
  onScan: (data: string) => void;
  scanning?: boolean;
};

export function QRScannerOverlay({ scanning = true }: QRScannerProps) {
  return (
    <View style={styles.scannerContainer}>
      <View style={styles.scannerFrame}>
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
        {scanning && <View style={styles.scanLine} />}
      </View>
      <Text style={styles.scanText}>
        {scanning ? 'Align QR code within the frame' : 'Processing...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  qrGrid: {
    flexDirection: 'column',
  },
  qrRow: {
    flexDirection: 'row',
  },
  qrCell: {
    // Dynamic styles applied inline
  },
  logoContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: radius.md,
  },
  scannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  scannerFrame: {
    width: 250,
    height: 250,
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
    top: '50%',
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: colors.primary,
    opacity: 0.8,
  },
  scanText: {
    marginTop: spacing.lg,
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
