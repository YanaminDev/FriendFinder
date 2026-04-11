
// ─── LoginScreen ──────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppLogo from '../../components/common/AppLogo';
import Button from '../../components/common/Button';
import AlertModal from '../../components/common/AlertModal';
import { colors } from '../../constants/theme';
import { login } from '../../service/user.service';
import { useAppDispatch } from '../../redux/hooks';
import { setCredentials, setIsAuthenticated } from '../../redux/authSlice';
import { setUserId } from '../../redux/userSlice';

interface AlertState {
  visible: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>({ visible: false, type: 'info', title: '', message: '' });

  const showAlert = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, callback?: () => void) => {
    setAlert({ visible: true, type, title, message });
    if (callback) {
      setTimeout(callback, 300);
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      showAlert('warning', 'ข้อมูลไม่สมบูรณ์', 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    setLoading(true);
    try {
      const response = await login({ username, password });
      dispatch(setCredentials({ username, password }));
      dispatch(setUserId(response.user_id));  // ← เพิ่ม user_id
      dispatch(setIsAuthenticated(true));
      showAlert('success', 'สำเร็จ', response.message || 'เข้าสู่ระบบสำเร็จ', () => {
        navigation.replace('Home');
      });
    } catch (error: any) {
      const errorMsg = error?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
      showAlert('error', 'ข้อผิดพลาด', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            disabled={!username.trim() || !password.trim() || loading}
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

    <AlertModal
      visible={alert.visible}
      type={alert.type as any}
      title={alert.title}
      message={alert.message}
      buttonLabel="ตกลง"
      onPress={() => setAlert({ visible: false, type: 'info', title: '', message: '' })}
    />
    </>
  );
};

export default LoginScreen;
