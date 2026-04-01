// ─── LanguageScreen ───────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import SelectionOption from '../../components/common/SelectionOption';
import Button from '../../components/common/Button';

const OPTIONS = [
  { value: 'th', label: '🇹🇭  ภาษาไทย' },
  { value: 'en', label: '🇬🇧  English' },
  { value: 'zh', label: '🇨🇳  中文' },
  { value: 'ja', label: '🇯🇵  日本語' },
  { value: 'ko', label: '🇰🇷  한국어' },
];

const LanguageScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (val: string) =>
    setSelected(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="ภาษาที่ใช้"
      subtitle="เลือกได้มากกว่า 1 ภาษา"
      footer={
        <Button
          label="ดำเนินการต่อ"
          onPress={() => navigation.navigate('BloodType')}
          disabled={selected.length === 0}
        />
      }
    >
      <View className="gap-3">
        {OPTIONS.map(opt => (
          <SelectionOption
            key={opt.value}
            label={opt.label}
            selected={selected.includes(opt.value)}
            onPress={() => toggle(opt.value)}
          />
        ))}
      </View>
    </OnboardingLayout>
  );
};

export default LanguageScreen;
