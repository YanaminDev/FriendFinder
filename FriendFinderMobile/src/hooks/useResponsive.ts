// ─── useResponsive ─────────────────────────────────────────────────────────────
// Central responsive hook — use this across all screens for tablet/iPad support.

import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isTablet = width >= 768;

  // Max width for centered content on iPad (65% of screen, capped at 600)
  const maxContentWidth = isTablet ? Math.min(width * 0.65, 600) : width;

  // Horizontal padding scaled by device
  const horizontalPadding = isTablet ? 32 : 28;

  // Bottom padding — safe area + fixed offset (ไม่ขึ้นกับ height)
  const bottomPadding = Math.max(insets.bottom + 24, 40);

  return {
    width,
    height,
    isTablet,
    maxContentWidth,
    horizontalPadding,
    bottomPadding,
  };
};
