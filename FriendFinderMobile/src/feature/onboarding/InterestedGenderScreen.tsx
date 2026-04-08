// ─── InterestedGenderScreen ───────────────────────────────────────────────────

import React, { useState } from 'react';
import { View } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import SelectionOption from '../../components/common/SelectionOption';
import Button from '../../components/common/Button';

const OPTIONS = [
  { value: 'male', label: '👨  ชาย' },
  { value: 'female', label: '👩  หญิง' },
  { value: 'all', label: '💫  ทุกเพศ' },
];

const InterestedGenderScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="คุณสนใจเพศไหน?"
      subtitle="ใช้สำหรับการแนะนำผู้ใช้ที่เหมาะสม"
      footer={
        <Button
          label="ดำเนินการต่อ"
          onPress={() => navigation.navigate('LookingFor')}
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

export default InterestedGenderScreen;
