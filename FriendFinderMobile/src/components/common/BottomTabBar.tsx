// ─── BottomTabBar ─────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '../../utils/cn';
import { TabRoute } from '../../types';
import { colors } from '../../constants/theme';

const TABS: { route: TabRoute; label: string; iconName: string }[] = [
  { route: 'HOME',    label: 'HOME',    iconName: 'home' },
  { route: 'HISTORY', label: 'HISTORY', iconName: 'time' },
  { route: 'CHAT',    label: 'CHAT',    iconName: 'chatbubble' },
  { route: 'PROFILE', label: 'PROFILE', iconName: 'person' },
];

interface BottomTabBarProps {
  activeTab: TabRoute;
  onTabPress: (tab: TabRoute) => void;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabPress }) => (
  <View className="flex-row bg-white pb-6 pt-2 -mt-10">
    {TABS.map(({ route, label, iconName }) => {
      const active = activeTab === route;
      return (
        <TouchableOpacity
          key={route}
          className="flex-1 items-center justify-center py-1 gap-1"
          onPress={() => onTabPress(route)}
          activeOpacity={0.6}
        >
          <Ionicons
            name={active ? (iconName as any) : (`${iconName}-outline` as any)}
            size={24}
            color={active ? colors.primary : colors.gray400}
          />
          <Text className={cn('text-2xs font-medium tracking-wide', active ? 'text-primary font-semibold' : 'text-gray-400')}>
            {label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

export default BottomTabBar;
