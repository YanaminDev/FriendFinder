// ─── SplashScreen ─────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppLogo from '../../components/common/AppLogo';
import Button from '../../components/common/Button';
import { useResponsive } from '../../hooks/useResponsive';

const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { maxContentWidth, horizontalPadding, bottomPadding } = useResponsive();

  return (
  <SafeAreaView className="flex-1 bg-white">
    <View
      className="flex-1 justify-between"
      style={{ maxWidth: maxContentWidth, width: '100%', alignSelf: 'center', paddingHorizontal: horizontalPadding }}
    >
      {/* Center logo */}
      <View className="flex-1 items-center justify-center">
        <AppLogo size="lg" showText={false} />
      </View>

      {/* Bottom CTAs */}
      <View style={{ paddingBottom: bottomPadding, rowGap: 14 }}>
        <Button
          label="ลงทะเบียนผู้ใช้ใหม่ คลิก!"
          onPress={() => navigation.navigate('Password')}
        />
        <TouchableOpacity className="items-center py-2" onPress={() => navigation.navigate('Login')}>
          <Text className="text-base text-gray-800 font-medium">มีบัญชีแล้ว</Text>
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>
  );
};

export default SplashScreen;
