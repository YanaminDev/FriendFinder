// ─── HeightScreen ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import Button from '../../components/common/Button';

const HeightScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [height, setHeight] = useState('');
  const cm = parseInt(height, 10);
  const isValid = !isNaN(cm) && cm >= 100 && cm <= 250;

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="ส่วนสูงของคุณ"
      subtitle="ระบุส่วนสูงเป็นเซนติเมตร"
      footer={
        <Button
          label="ดำเนินการต่อ"
          onPress={() => navigation.navigate('Education')}
          disabled={!isValid}
        />
      }
    >
      <View className="flex-row items-center gap-3">
        <View className="flex-1 border border-gray-300 rounded-xl h-[64px] justify-center px-5">
          <TextInput
            value={height}
            onChangeText={v => setHeight(v.replace(/\D/g, '').slice(0, 3))}
            placeholder="170"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
            maxLength={3}
            className="text-3xl font-bold text-gray-900 p-0 text-center"
          />
        </View>
        <Text className="text-lg font-semibold text-gray-500 w-8">ซม.</Text>
      </View>

      {isValid && (
        <Text className="text-sm text-center text-primary font-medium mt-4">
          {cm} เซนติเมตร
        </Text>
      )}
    </OnboardingLayout>
  );
};

export default HeightScreen;
