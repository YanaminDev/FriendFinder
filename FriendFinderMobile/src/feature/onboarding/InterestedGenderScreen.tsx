// ─── InterestedGenderScreen ───────────────────────────────────────────────────

import React, { useState } from 'react';
import { View } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import SelectionOption from '../../components/common/SelectionOption';
import Button from '../../components/common/Button';
import { useAppDispatch } from '../../redux/hooks';
import { setInterestedGender } from '../../redux/userSlice';

const OPTIONS = [
  { value: 'male', label: 'ชาย', icon: 'male' as const },
  { value: 'female', label: 'หญิง', icon: 'female' as const },
  { value: 'lgbtq', label: 'LGBTQ+', icon: 'heart' as const },
];

const InterestedGenderScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="คุณสนใจเพศไหน?"
      subtitle="ใช้สำหรับการแนะนำผู้ใช้ที่เหมาะสม"
      footer={
        <Button
          label="ดำเนินการต่อ"
          onPress={() => {
            if (selected) {
              dispatch(setInterestedGender(selected as 'male' | 'female' | 'lgbtq'));
              navigation.navigate('LookingFor');
            }
          }}
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
            icon={opt.icon}
          />
        ))}
      </View>
    </OnboardingLayout>
  );
};

export default InterestedGenderScreen;
