// ─── MatchCancelledScreen ──────────────────────────────────────────────────────

import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import { useResponsive } from '../../hooks/useResponsive';

const MatchCancelledScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { maxContentWidth, horizontalPadding } = useResponsive();
  return (
  <SafeAreaView className="flex-1 bg-white items-center justify-center">
    <View style={{ width: '100%', maxWidth: maxContentWidth, paddingHorizontal: horizontalPadding, alignItems: 'center' }}>
      <Text className="text-7xl mb-4">😔</Text>
      <Text className="text-2xl font-bold text-gray-900 text-center mb-2">ยกเลิกการนัด</Text>
      <Text className="text-base text-gray-500 text-center mb-10 leading-6">
        การนัดหมายถูกยกเลิกแล้ว{'\n'}ลองค้นหาเพื่อนใหม่ได้เลย
      </Text>
      <View className="w-full" style={{ rowGap: 12 }}>
        <Button label="หาเพื่อนใหม่" onPress={() => navigation.navigate('Match')} />
        <Button variant="outline" color="gray" label="กลับหน้าหลัก" onPress={() => navigation.navigate('Home')} />
      </View>
    </View>
  </SafeAreaView>
  );
};

export default MatchCancelledScreen;
