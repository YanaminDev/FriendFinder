// ─── SmokingScreen ────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import SelectionOption from '../../components/common/SelectionOption';
import Button from '../../components/common/Button';

const OPTIONS = [
  { value: 'no', label: '🚭  ไม่สูบ' },
  { value: 'occasionally', label: '🌬️  สูบบางครั้ง' },
  { value: 'yes', label: '🚬  สูบเป็นประจำ' },
];

const SmokingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="คุณสูบบุหรี่ไหม?"
      subtitle="ข้อมูลนี้จะแสดงบนโปรไฟล์ของคุณ"
      footer={
        <Button
          label="ดำเนินการต่อ"
          onPress={() => navigation.navigate('Drinking')}
          disabled={!selected}
        />
      }
    >
      <View className="gap-3">
        {OPTIONS.map(opt => (
          <SelectionOption
            key={opt.value}
            label={opt.label}
            selected={selected === opt.value}
            onPress={() => setSelected(opt.value)}
          />
        ))}
      </View>
    </OnboardingLayout>
  );
};

export default SmokingScreen;
