// ─── ExerciseScreen ────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import SelectionOption from '../../components/common/SelectionOption';
import Button from '../../components/common/Button';

const OPTIONS = [
  { value: 'never', label: '🛋️  ไม่ออกกำลังกาย' },
  { value: 'sometimes', label: '🚶  บางครั้ง' },
  { value: 'often', label: '🏋️  เป็นประจำ' },
];

const ExerciseScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="คุณออกกำลังกายไหม?"
      subtitle="ข้อมูลนี้จะแสดงบนโปรไฟล์ของคุณ"
      footer={
        <Button
          label="ดำเนินการต่อ"
          onPress={() => navigation.navigate('Pets')}
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

export default ExerciseScreen;
