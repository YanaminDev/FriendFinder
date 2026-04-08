// ─── DrinkingScreen ────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import SelectionOption from '../../components/common/SelectionOption';
import Button from '../../components/common/Button';

const OPTIONS = [
  { value: 'no', label: '🚫  ไม่ดื่ม' },
  { value: 'occasionally', label: '🥂  ดื่มบางครั้ง' },
  { value: 'yes', label: '🍺  ดื่มเป็นประจำ' },
];

const DrinkingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="คุณดื่มแอลกอฮอล์ไหม?"
      subtitle="ข้อมูลนี้จะแสดงบนโปรไฟล์ของคุณ"
      footer={
        <Button
          label="เสร็จสิ้น"
          onPress={() => navigation.navigate('Exercise')}
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

export default DrinkingScreen;
