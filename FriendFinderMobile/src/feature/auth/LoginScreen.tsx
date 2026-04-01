
// ─── LoginScreen ──────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => (
  <SafeAreaView className="flex-1 bg-primary">
    {/* Back */}
    <TouchableOpacity className="absolute top-14 left-5 z-10" onPress={() => navigation.goBack()}>
      <Text className="text-3xl text-white font-bold leading-8">‹</Text>
    </TouchableOpacity>

    {/* Logo */}
    <View className="flex-1 items-center justify-center gap-3">
      <Text className="text-7xl">💗</Text>
      <Text className="text-3xl font-bold text-white tracking-wide">FriendFinder</Text>
    </View>

    {/* Buttons */}
    <View className="px-7 pb-10 gap-3.5">
      <TouchableOpacity
        className="flex-row items-center justify-center bg-white rounded-full h-[54px] gap-2.5"
        onPress={() => navigation.navigate('PhoneNumber')}
        activeOpacity={0.85}
      >
        <Text className="text-lg">📞</Text>
        <Text className="text-base font-semibold text-gray-800">เข้าสู่ระบบด้วยเบอร์โทรศัพท์</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center justify-center bg-white rounded-full h-[54px] gap-2.5"
        onPress={() => {}}
        activeOpacity={0.85}
      >
        <Text className="text-lg font-bold text-blue-500">G</Text>
        <Text className="text-base font-semibold text-gray-800">เข้าสู่ระบบด้วย Google</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

export default LoginScreen;
