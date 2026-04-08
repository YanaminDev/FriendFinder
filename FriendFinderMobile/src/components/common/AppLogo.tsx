// ─── AppLogo ──────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, Image } from 'react-native';
import { cn } from '../../utils/cn';
import logoImage from '../../image/logo/logo.png';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  light?: boolean;
}

const SIZE_CONFIG = {
  sm: { wrapper: 'w-8 h-8',  imageSize: { width: 32, height: 32 },    title: 'text-lg'  },
  md: { wrapper: 'w-16 h-16', imageSize: { width: 64, height: 64 },   title: 'text-2xl' },
  lg: { wrapper: 'w-24 h-24', imageSize: { width: 96, height: 96 },   title: 'text-3xl' },
} as const;

const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', showText = true, light = false }) => {
  const cfg = SIZE_CONFIG[size];

  return (
    <View className="items-center gap-2">
      <Image
        source={logoImage}
        style={{ width: cfg.imageSize.width, height: cfg.imageSize.height }}
        resizeMode="contain"
      />

      {showText && (
        <Text className={cn('font-bold tracking-wide', cfg.title, light ? 'text-white' : 'text-primary')}>
          FriendFinder
        </Text>
      )}
    </View>
  );
};

export default AppLogo;
