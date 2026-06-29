// ShiftPe Design Tokens
export const colors = {
  // Brand
  primary: "#FF3D57",
  primaryDark: "#E62E47",
  primarySoft: "#FFE5EA",
  primaryTint: "#FFF1F4",
  secondary: "#FF6B8C",
  accentPurple: "#7B61FF",
  accentPurpleSoft: "#EFEBFF",

  // Text
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textTertiary: "#94A3B8",
  textInverse: "#FFFFFF",

  // Surface
  background: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceSoft: "#F8FAFC",
  surfaceTertiary: "#F1F5F9",

  // Border
  border: "#E5E7EB",
  borderStrong: "#CBD5E1",
  divider: "#F1F5F9",

  // Status
  success: "#10B981",
  successSoft: "#D1FAE5",
  warning: "#F59E0B",
  warningSoft: "#FEF3C7",
  danger: "#EF4444",
  dangerSoft: "#FEE2E2",

  // Overlay
  overlay: "rgba(15, 23, 42, 0.5)",
  scrim: "rgba(0, 0, 0, 0.35)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  xl: 24,
  xxl: 32,
  pill: 999,
};

export const typography = {
  // Sizes
  displayLG: 36,
  displayMD: 32,
  h1: 28,
  h2: 24,
  h3: 20,
  body: 16,
  bodySm: 14,
  caption: 12,
  micro: 10,
  // Weights – capped at 500 per design system note, use sizes for hierarchy
  weightRegular: "400" as const,
  weightMedium: "500" as const,
};

export const shadows = {
  card: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  button: {
    shadowColor: "#FF3D57",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  floating: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  soft: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
};
