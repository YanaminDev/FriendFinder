// ─── GenderScreen ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import SelectionOption from '../../components/common/SelectionOption';
import Button from '../../components/common/Button';

const OPTIONS = [
  { value: 'male', label: '👨  ชาย' },
  { value: 'female', label: '👩  หญิง' },
  { value: 'other', label: '🧑  อื่นๆ' },
];

const GenderScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="เพศของคุณ"
      subtitle="บอกเราว่าคุณเป็นใคร"
      footer={
        <Button
          label="ดำเนินการต่อ"
          onPress={() => navigation.navigate('Birthday')}
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

export default GenderScreen;
