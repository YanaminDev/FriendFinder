// ─── OtpScreen ────────────────────────────────────────────────────────────────

import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { cn } from '../../utils/cn';
import AppLogo from '../../components/common/AppLogo';
import Button from '../../components/common/Button';

const OTP_LENGTH = 6;

const OtpScreen: React.FC<{ navigation: any; route: { params: { phone: string } } }> = ({ navigation, route }) => {
  const { phone } = route.params;
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (value: string, i: number) => {
    const next = [...otp];
    next[i] = value.slice(-1);
    setOtp(next);
    if (value && i < OTP_LENGTH - 1) inputs.current[i + 1]?.focus();
  };

  const handleKeyPress = (key: string, i: number) => {
    if (key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity className="px-5 pt-3" onPress={() => navigation.goBack()}>
          <Text className="text-3xl text-primary font-bold leading-8">‹</Text>
        </TouchableOpacity>

        <View className="flex-1 px-7">
          <View className="items-center my-6">
            <AppLogo size="md" showText={false} />
          </View>

          <Text className="text-xl font-bold text-gray-900 mb-2">ระบุรหัสยืนยัน</Text>
          <Text className="text-sm text-gray-500 leading-5 mb-7">
            รหัสยืนยันกำลังส่งไปที่ {phone} โปรดใส่รหัสด้านล่าง
          </Text>

          {/* OTP boxes */}
          <View className="flex-row gap-2.5 justify-center">
            {Array(OTP_LENGTH).fill(null).map((_, i) => (
              <TextInput
                key={i}
                ref={el => { inputs.current[i] = el; }}
                className={cn(
                  'w-12 h-14 border rounded-xl text-xl font-bold text-gray-900 text-center bg-white',
                  otp[i] ? 'border-primary' : 'border-gray-300',
                )}
                value={otp[i]}
                onChangeText={v => handleChange(v, i)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                keyboardType="number-pad"
                maxLength={1}
              />
            ))}
          </View>

          <TouchableOpacity className="self-center mt-4 py-1" onPress={() => {}}>
            <Text className="text-sm text-primary font-medium">รับรหัสยืนยันใหม่</Text>
          </TouchableOpacity>
        </View>

        <View className="px-7 pb-20">
          <Button
            label="ดำเนินการต่อ"
            onPress={() => navigation.navigate('UserInfo')}
            disabled={!otp.every(d => d !== '')}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OtpScreen;
