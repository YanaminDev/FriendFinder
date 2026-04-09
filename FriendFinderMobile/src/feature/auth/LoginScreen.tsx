
// ─── LoginScreen ──────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppLogo from '../../components/common/AppLogo';
import Button from '../../components/common/Button';
import { colors } from '../../constants/theme';
import { login } from '../../service/user.service';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isPasswordValid = (pwd: string) => {
    return (
      pwd.length >= 8 &&
      /[A-Z]/.test(pwd) &&
      /[a-z]/.test(pwd) &&
      /\d/.test(pwd) &&
      /[@$!%*?&]/.test(pwd)
    );
  };

  const handleLogin = async () => {
    if (!username.trim() || !isPasswordValid(password)) {
      Alert.alert('ข้อมูลไม่สมบูรณ์', 'รหัสผ่านต้อง: 8+ ตัว, มี UPPERCASE, lowercase, ตัวเลข, และอักษรพิเศษ (@$!%*?&)');
      return;
    }

    setLoading(true);
    try {
      const response = await login({ username, password });
      Alert.alert('สำเร็จ', response.message || 'เข้าสู่ระบบสำเร็จ');
      navigation.navigate('Home');
    } catch (error: any) {
      Alert.alert('ข้อผิดพลาด', error?.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Back */}
        <TouchableOpacity className="px-5 pt-3" onPress={() => navigation.goBack()}>
          <Text className="text-3xl text-primary font-bold leading-8">‹</Text>
        </TouchableOpacity>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 24 }}>
          {/* Logo */}
          <View className="items-center my-6">
            <AppLogo size="md" showText={false} />
          </View>

          <Text className="text-xl font-bold text-gray-900 mb-1">เข้าสู่ระบบ</Text>
          <Text className="text-sm text-gray-500 mb-6">ใส่ชื่อผู้ใช้และรหัสผ่าน</Text>

          {/* Username Input */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">ชื่อผู้ใช้</Text>
            <View className="border border-gray-300 rounded-xl px-4 h-12 justify-center">
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="ใส่ชื่อผู้ใช้"
                placeholderTextColor="#9ca3af"
                className="text-base text-gray-900 p-0"
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">รหัสผ่าน</Text>
            <View className="border border-gray-300 rounded-xl px-4 h-12 justify-center flex-row items-center">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="ใส่รหัสผ่าน"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                className="flex-1 text-base text-gray-900 p-0"
                returnKeyType="done"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color={colors.gray400} />
              </TouchableOpacity>
            </View>
          </View>

         

          {/* Login Button */}
          <Button
            label={loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            onPress={handleLogin}
            disabled={!username.trim() || !isPasswordValid(password) || loading}
          />

          {/* Divider */}
          <View className="flex-row items-center gap-3 my-6">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="text-sm text-gray-400">หรือ</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-base text-gray-600">ยังไม่มีบัญชี? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Splash')}>
              <Text className="text-base text-primary font-semibold">ลงทะเบียน</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
