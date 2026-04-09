// ─── PasswordScreen ───────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppLogo from '../../components/common/AppLogo';
import Button from '../../components/common/Button';
import { colors } from '../../constants/theme';
import { useAppDispatch } from '../../redux/hooks';
import { setCredentials } from '../../redux/authSlice';

const PasswordScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordValid = (pwd: string) => {
    return (
      pwd.length >= 8 &&
      /[A-Z]/.test(pwd) &&
      /[a-z]/.test(pwd) &&
      /\d/.test(pwd) &&
      /[@$!%*?&]/.test(pwd)
    );
  };

  const getPasswordRequirements = (pwd: string) => {
    return {
      minLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecial: /[@$!%*?&]/.test(pwd),
    };
  };

  const getPasswordStrength = (pwd: string) => {
    const reqs = getPasswordRequirements(pwd);
    const checks = Object.values(reqs);
    const strength = checks.filter(Boolean).length;
    if (strength < 2) return { text: 'อ่อน', color: colors.danger };
    if (strength < 4) return { text: 'ปานกลาง', color: colors.warning };
    return { text: 'แข็งแรง', color: colors.success };
  };

  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <View className="flex-row items-center gap-2 mb-2">
      <Ionicons
        name={met ? 'checkmark-circle' : 'ellipse-outline'}
        size={16}
        color={met ? colors.success : colors.gray300}
      />
      <Text style={{ color: met ? colors.success : colors.gray400 }} className="text-sm">
        {text}
      </Text>
    </View>
  );

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

          <Text className="text-xl font-bold text-gray-900 mb-4">สร้างบัญชี</Text>

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
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">รหัสผ่าน</Text>
            
            <View className="border border-gray-300 rounded-xl px-4 h-12 justify-center flex-row items-center mb-3">
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

          {password && (
            <View className="bg-gray-100 rounded-lg p-3 mb-4">
              <RequirementItem met={getPasswordRequirements(password).minLength} text="ต้องมีอย่างน้อย 8 ตัวอักษร" />
              <RequirementItem met={getPasswordRequirements(password).hasUpperCase} text="มีตัวพิมพ์ใหญ่ (A-Z)" />
              <RequirementItem met={getPasswordRequirements(password).hasLowerCase} text="มีตัวพิมพ์เล็ก (a-z)" />
              <RequirementItem met={getPasswordRequirements(password).hasNumber} text="มีตัวเลข (0-9)" />
              <RequirementItem met={getPasswordRequirements(password).hasSpecial} text="มีอักษรพิเศษ (@$!%*?&)" />
            </View>
          )}

          {password && (
            <View className="mb-4">
              <View className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${(getPasswordStrength(password).color === colors.danger ? 33 : getPasswordStrength(password).color === colors.warning ? 66 : 100)}%`,
                    backgroundColor: getPasswordStrength(password).color,
                  }}
                />
              </View>
              <Text style={{ color: getPasswordStrength(password).color }} className="text-sm font-medium">
                ความแข็งแรง: {getPasswordStrength(password).text}
              </Text>
            </View>
          )}
        </View>

        <View className="px-7 pb-20">
          <Button
            label="ดำเนินการต่อ"
            onPress={() => {
              dispatch(setCredentials({ username, password }));
              navigation.navigate('UserInfo', { username });
            }}
            disabled={!username.trim() || !isPasswordValid(password)}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PasswordScreen;
