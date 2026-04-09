// ─── LookingForScreen ─────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import SelectionOption from '../../components/common/SelectionOption';
import Button from '../../components/common/Button';
import { useAppDispatch } from '../../redux/hooks';
import { setLookingForId } from '../../redux/userLifeStyleSlice';

const OPTIONS = [
  { id: 'friend-uuid', value: 'friend', label: 'หาเพื่อน', icon: 'people' as const },
  { id: 'date-uuid', value: 'date', label: 'หาคนคุย / เดต', icon: 'heart' as const },
  { id: 'relationship-uuid', value: 'relationship', label: 'หาคู่รัก', icon: 'ribbon' as const },
  { id: 'activity-uuid', value: 'activity', label: 'หาเพื่อนทำกิจกรรม', icon: 'accessibility' as const },
];

const LookingForScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="คุณกำลังมองหาอะไร?"
      subtitle="เลือกสิ่งที่คุณต้องการในตอนนี้"
      footer={
        <Button
          label="ดำเนินการต่อ"
          onPress={() => {
            if (selected) {
              const selectedOption = OPTIONS.find(opt => opt.value === selected);
              if (selectedOption) {
                dispatch(setLookingForId(selectedOption.id));
                navigation.navigate('Language');
              }
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

export default LookingForScreen;
