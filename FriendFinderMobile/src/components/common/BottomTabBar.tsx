// ─── BottomTabBar ─────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { cn } from '../../utils/cn';
import { TabRoute } from '../../types';

const TABS: { route: TabRoute; label: string; icon: string }[] = [
  { route: 'HOME',    label: 'HOME',    icon: '🏠' },
  { route: 'HISTORY', label: 'HISTORY', icon: '🕐' },
  { route: 'CHAT',    label: 'CHAT',    icon: '💬' },
  { route: 'PROFILE', label: 'PROFILE', icon: '👤' },
];

interface BottomTabBarProps {
  activeTab: TabRoute;
  onTabPress: (tab: TabRoute) => void;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabPress }) => (
  <View className="flex-row bg-white border-t border-gray-200 pb-2 pt-1">
    {TABS.map(({ route, label, icon }) => {
      const active = activeTab === route;
      return (
        <TouchableOpacity
          key={route}
          className="flex-1 items-center justify-center py-1 gap-0.5"
          onPress={() => onTabPress(route)}
          activeOpacity={0.7}
        >
          <Text className={cn('text-xl', active ? 'opacity-100' : 'opacity-40')}>{icon}</Text>
          <Text className={cn('text-2xs font-medium tracking-wide', active ? 'text-primary font-semibold' : 'text-gray-400')}>
            {label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

export default BottomTabBar;
