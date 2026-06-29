import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Standard bottom padding for screens inside a bottom-tab navigator.
 * Tab bar visual height = 64 + insets.bottom (see (tabs)/_layout.tsx).
 * We add 16-24px extra so floating banners / last card never overlap.
 */
export function useTabContentBottomPadding(extra = 24) {
  const insets = useSafeAreaInsets();
  return 64 + insets.bottom + extra;
}

export function useTabBarHeight() {
  const insets = useSafeAreaInsets();
  return 64 + insets.bottom;
}
