
// ─── LoginScreen ──────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AppLogo from '../../components/common/AppLogo';
import Button from '../../components/common/Button';
import { useResponsive } from '../../hooks/useResponsive';
import AlertModal from '../../components/common/AlertModal';
import { colors } from '../../constants/theme';
import { login, googleLogin } from '../../service/user.service';
import { useAppDispatch } from '../../redux/hooks';
import { setCredentials, setIsAuthenticated, setGoogleSignupData } from '../../redux/authSlice';
import { setUserId, setShowName } from '../../redux/userSlice';
import { saveAuthData } from '../../utils/tokenStorage';

WebBrowser.maybeCompleteAuthSession();

interface AlertState {
  visible: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  callback?: () => void;
}

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { maxContentWidth, horizontalPadding } = useResponsive();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>({ visible: false, type: 'info', title: '', message: '', callback: undefined });

  const [googleRequest, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });


  useEffect(() => {
    if (!googleResponse) return;
    if (googleResponse.type === 'success') {
      const idToken = googleResponse.authentication?.idToken || (googleResponse.params as any)?.id_token;
      if (idToken) {
        handleGoogleSignIn(idToken);
      } else {
        setGoogleLoading(false);
        showAlert('error', 'ข้อผิดพลาด', 'ไม่ได้รับ idToken จาก Google');
      }
    } else if (googleResponse.type === 'error' || googleResponse.type === 'dismiss' || googleResponse.type === 'cancel') {
      setGoogleLoading(false);
    }
  }, [googleResponse]);

  const handleGoogleSignIn = async (idToken: string) => {
    try {
      const res = await googleLogin(idToken);
      if (res.isNew) {
        dispatch(setGoogleSignupData({ googleId: res.google_id, picture: res.picture || undefined }));
        if (res.suggested_name) {
          dispatch(setShowName(res.suggested_name));
        }
        setGoogleLoading(false);
        navigation.replace('UserInfo');
        return;
      }
      dispatch(setCredentials({ username: res.username, password: '', accessToken: res.accessToken, refreshToken: res.refreshToken }));
      dispatch(setUserId(res.user_id));
      dispatch(setIsAuthenticated(true));
      await saveAuthData(res.accessToken, res.refreshToken, res.user_id);
      setGoogleLoading(false);
      showAlert('success', 'สำเร็จ', res.message || 'เข้าสู่ระบบสำเร็จ', () => {
        navigation.replace('Home');
      });
    } catch (error: any) {
      setGoogleLoading(false);
      if (error?.status === 403) {
        showAlert('error', 'บัญชีถูก Ban', 'บัญชีของคุณถูก ban และไม่สามารถเข้าสู่ระบบได้');
        return;
      }
      if (error?.status === 409 || error?.data?.is_online) {
        showAlert('warning', 'แจ้งเตือน', 'บัญชีนี้กำลังถูกใช้งานอยู่ที่อื่น กรุณาลองใหม่อีกครั้ง');
        return;
      }
      showAlert('error', 'ข้อผิดพลาด', error?.message || 'เข้าสู่ระบบ Google ไม่สำเร็จ');
    }
  };

  const handleGooglePress = async () => {
    setGoogleLoading(true);
    try {
      await promptGoogleAsync();
    } catch (err) {
      setGoogleLoading(false);
      showAlert('error', 'ข้อผิดพลาด', 'ไม่สามารถเปิด Google sign-in ได้');
    }
  };

  const showAlert = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, callback?: () => void) => {
    setAlert({ visible: true, type, title, message, callback });
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      showAlert('warning', 'ข้อมูลไม่สมบูรณ์', 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    setLoading(true);
    try {
      const response = await login({ username, password });

      dispatch(setCredentials({ username, password, accessToken: response.accessToken, refreshToken: response.refreshToken }));
      dispatch(setUserId(response.user_id));
      dispatch(setIsAuthenticated(true));
      await saveAuthData(response.accessToken, response.refreshToken, response.user_id);
      showAlert('success', 'สำเร็จ', response.message || 'เข้าสู่ระบบสำเร็จ', () => {
        navigation.replace('Home');
      });
    } catch (error: any) {
      // ตรวจสอบหากบัญชีถูก ban (403 Forbidden)
      if (error?.status === 403) {
        showAlert('error', 'บัญชีถูก Ban', 'บัญชีของคุณถูก ban และไม่สามารถเข้าสู่ระบบได้');
        return;
      }
      // ตรวจสอบหากบัญชีถูก login ที่อื่นอยู่ (409 Conflict)
      if (error?.status === 409 || error?.data?.is_online) {
        showAlert('warning', 'แจ้งเตือน', 'บัญชีนี้กำลังถูกใช้งานอยู่ที่อื่น กรุณาลองใหม่อีกครั้ง', () => {
          navigation.replace('Splash');
        });
        return;
      }
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
        <TouchableOpacity style={{ paddingHorizontal: horizontalPadding, paddingTop: 12 }} onPress={() => navigation.goBack()}>
          <Text className="text-3xl text-primary font-bold leading-8">‹</Text>
        </TouchableOpacity>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 24 }}
        >
        <View style={{ width: '100%', maxWidth: maxContentWidth, paddingHorizontal: horizontalPadding }}>
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

          {/* Google Sign-in */}
          <TouchableOpacity
            onPress={handleGooglePress}
            disabled={googleLoading}
            className="border border-gray-300 rounded-xl h-12 flex-row items-center justify-center gap-3"
            style={{ opacity: googleLoading ? 0.6 : 1 }}
          >
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text className="text-base text-gray-800 font-semibold">
              {googleLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย Google'}
            </Text>
          </TouchableOpacity>



          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-base text-gray-600">ยังไม่มีบัญชี? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Splash')}>
              <Text className="text-base text-primary font-semibold">ลงทะเบียน</Text>
            </TouchableOpacity>
          </View>
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
      onPress={() => {
        if (alert.callback) {
          alert.callback();
        }
        setAlert({ visible: false, type: 'info', title: '', message: '', callback: undefined });
      }}
    />
    </>
  );
};

export default LoginScreen;
