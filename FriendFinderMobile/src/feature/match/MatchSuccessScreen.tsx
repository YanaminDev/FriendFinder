// ─── MatchSuccessScreen ────────────────────────────────────────────────────────

import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import { useResponsive } from '../../hooks/useResponsive';

const MatchSuccessScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { maxContentWidth, horizontalPadding } = useResponsive();
  return (
  <SafeAreaView className="flex-1 bg-white items-center justify-center">
    <View style={{ width: '100%', maxWidth: maxContentWidth, paddingHorizontal: horizontalPadding, alignItems: 'center' }}>
      <Text className="text-7xl mb-4">🎉</Text>
      <Text className="text-2xl font-bold text-gray-900 text-center mb-2">Match สำเร็จ!</Text>
      <Text className="text-base text-gray-500 text-center mb-10 leading-6">
        ยอดเยี่ยม! การนัดหมายของคุณถูกยืนยันแล้ว{'\n'}สนุกกับการพบปะครั้งนี้นะ 💗
      </Text>
      <View className="w-full" style={{ rowGap: 12 }}>
        <Button label="ไปที่ Chat" onPress={() => navigation.navigate('Home')} />
        <Button variant="outline" color="gray" label="กลับหน้าหลัก" onPress={() => navigation.navigate('Home')} />
      </View>
    </View>
  </SafeAreaView>
  );
};

export default MatchSuccessScreen;
