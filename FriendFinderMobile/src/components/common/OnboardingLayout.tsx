// ─── OnboardingLayout ─────────────────────────────────────────────────────────
// Shared wrapper for all onboarding/profile-setup steps.

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppLogo from './AppLogo';
import { useResponsive } from '../../hooks/useResponsive';

interface OnboardingLayoutProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onClose?: () => void;
  onSkip?: () => void;
  onCancel?: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  title,
  subtitle,
  onBack,
  onClose,
  onSkip,
  onCancel,
  footer,
  children,
}) => {
  const { maxContentWidth, horizontalPadding, bottomPadding } = useResponsive();

  return (
  <SafeAreaView className="flex-1 bg-white">
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top row */}
      <View
        className="flex-row justify-between items-center pt-3 min-h-11 mx-auto w-full"
        style={{ maxWidth: maxContentWidth, paddingHorizontal: horizontalPadding }}
      >
        {onBack ? (
          <TouchableOpacity onPress={onBack}>
            <Text className="text-3xl text-primary font-bold leading-8">‹</Text>
          </TouchableOpacity>
        ) : onClose ? (
          <TouchableOpacity onPress={onClose}>
            <Text className="text-lg text-primary font-bold">✕</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {onSkip && (
          <TouchableOpacity onPress={onSkip}>
            <Text className="text-base text-gray-500 font-medium">ข้าม</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
      >
        <View style={{ width: '100%', maxWidth: maxContentWidth, paddingHorizontal: horizontalPadding, paddingBottom: 16 }}>
          {/* Logo */}
          <View className="items-center my-5">
            <AppLogo size="md" showText={false} />
          </View>

          {/* Title + Subtitle */}
          <Text className="text-xl font-bold text-gray-900 mb-1">{title}</Text>
          {subtitle && <Text className="text-sm text-gray-500 mb-6">{subtitle}</Text>}
          {!subtitle && <View className="mb-6" />}

          {/* Content */}
          <View className="gap-3">{children}</View>
        </View>
      </ScrollView>

      {/* Bottom */}
      <View
        className="gap-3 mx-auto w-full"
        style={{ maxWidth: maxContentWidth, paddingHorizontal: horizontalPadding, paddingBottom: bottomPadding }}
      >
        {footer}
        {onCancel && (
          <TouchableOpacity onPress={onCancel} className="items-center py-2">
            <Text className="text-base text-gray-900 font-medium underline">ยกเลิก</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  </SafeAreaView>
  );
};

export default OnboardingLayout;
