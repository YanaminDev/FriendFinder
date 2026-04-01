// ─── SplashScreen ─────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import AppLogo from '../../components/common/AppLogo';
import Button from '../../components/common/Button';

const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => (
  <SafeAreaView className="flex-1 bg-white">
    <View className="flex-1 px-8 justify-between">
      {/* Center logo */}
      <View className="flex-1 items-center justify-center">
        <AppLogo size="lg" />
      </View>

      {/* Bottom CTAs */}
      <View className="gap-3.5 pb-8">
        <Button
          label="ลงทะเบียนผู้ใช้ใหม่ คลิก!"
          onPress={() => navigation.navigate('PhoneNumber')}
        />
        <TouchableOpacity className="items-center py-2" onPress={() => navigation.navigate('Login')}>
          <Text className="text-base text-gray-800 font-medium">มีบัญชีแล้ว</Text>
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>
);

export default SplashScreen;
