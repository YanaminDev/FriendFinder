// ─── BloodTypeScreen ──────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import SelectionOption from '../../components/common/SelectionOption';
import Button from '../../components/common/Button';

const OPTIONS = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'O', label: 'O' },
  { value: 'AB', label: 'AB' },
  { value: 'unknown', label: 'ไม่ทราบ' },
];

const BloodTypeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="กรุ๊ปเลือดของคุณ"
      subtitle="ข้อมูลเสริมสำหรับโปรไฟล์"
      footer={
        <Button
          label="ดำเนินการต่อ"
          onPress={() => navigation.navigate('Height')}
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

export default BloodTypeScreen;
