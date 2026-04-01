// ─── PasswordScreen ───────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import AppLogo from '../../components/common/AppLogo';
import Button from '../../components/common/Button';

const PasswordScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity className="px-5 pt-3" onPress={() => navigation.goBack()}>
          <Text className="text-3xl text-primary font-bold leading-8">‹</Text>
        </TouchableOpacity>

        <View className="flex-1 px-6">
          <View className="items-center my-6">
            <AppLogo size="md" />
          </View>

          <Text className="text-xl font-bold text-gray-900 mb-5">ระบุรหัสผ่าน</Text>

          <View className="border border-gray-300 rounded-xl px-4 h-[52px] justify-center">
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="text-base text-gray-900 p-0"
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity className="mt-2.5 self-start py-1" onPress={() => {}}>
            <Text className="text-sm text-primary font-medium">ลืมรหัสผ่าน?</Text>
          </TouchableOpacity>
        </View>

        <View className="px-6 pb-8">
          <Button
            label="ดำเนินการต่อ"
            onPress={() => navigation.navigate('Home')}
            disabled={password.length < 4}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PasswordScreen;
