// ─── AppLogo ──────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../utils/cn';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  light?: boolean;
}

const SIZE_CONFIG = {
  sm: { wrapper: 'w-8 h-8',  emoji: 'text-xl',   title: 'text-lg'  },
  md: { wrapper: 'w-16 h-16', emoji: 'text-4xl',  title: 'text-2xl' },
  lg: { wrapper: 'w-24 h-24', emoji: 'text-5xl',  title: 'text-3xl' },
} as const;

const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', showText = true, light = false }) => {
  const cfg = SIZE_CONFIG[size];

  return (
    <View className="items-center gap-2">
      <View className={cn('rounded-full bg-primary-light items-center justify-center', cfg.wrapper)}>
        <Text className={cfg.emoji}>💗</Text>
      </View>

      {showText && (
        <Text className={cn('font-bold tracking-wide', cfg.title, light ? 'text-white' : 'text-primary')}>
          FriendFinder
        </Text>
      )}
    </View>
  );
};

export default AppLogo;
