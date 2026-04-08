// ─── SearchBar ────────────────────────────────────────────────────────────────

import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { cn } from '../../utils/cn';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  className,
}) => (
  <View className={cn('flex-row items-center bg-gray-100 rounded-full px-4 py-3 gap-2.5', className)}>
    <Text className="text-gray-400 text-base">🔍</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9ca3af"
      className="flex-1 text-base text-gray-900 p-0"
      returnKeyType="search"
    />
  </View>
);

export default SearchBar;
