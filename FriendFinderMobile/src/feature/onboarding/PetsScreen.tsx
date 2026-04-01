// ─── PetsScreen ────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import SelectionOption from '../../components/common/SelectionOption';
import Button from '../../components/common/Button';

const OPTIONS = [
  { value: 'none', label: '🚫  ไม่มีสัตว์เลี้ยง' },
  { value: 'cat', label: '🐱  แมว' },
  { value: 'dog', label: '🐶  หมา' },
  { value: 'other', label: '🐾  อื่นๆ' },
];

const PetsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="คุณมีสัตว์เลี้ยงไหม?"
      subtitle="ข้อมูลนี้จะแสดงบนโปรไฟล์ของคุณ"
      footer={
        <Button
          label="เสร็จสิ้น"
          onPress={() => navigation.navigate('Home')}
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

export default PetsScreen;
