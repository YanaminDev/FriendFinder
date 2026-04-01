// ─── LookingForScreen ─────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import SelectionOption from '../../components/common/SelectionOption';
import Button from '../../components/common/Button';

const OPTIONS = [
  { value: 'friend', label: '🤝  หาเพื่อน' },
  { value: 'date', label: '💕  หาคนคุย / เดต' },
  { value: 'relationship', label: '💍  หาคู่รัก' },
  { value: 'activity', label: '🎯  หาเพื่อนทำกิจกรรม' },
];

const LookingForScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="คุณกำลังมองหาอะไร?"
      subtitle="เลือกสิ่งที่คุณต้องการในตอนนี้"
      footer={
        <Button
          label="ดำเนินการต่อ"
          onPress={() => navigation.navigate('Language')}
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

export default LookingForScreen;
