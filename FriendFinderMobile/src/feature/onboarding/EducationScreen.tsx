// ─── EducationScreen ──────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import SelectionOption from '../../components/common/SelectionOption';
import Button from '../../components/common/Button';

const OPTIONS = [
  { value: 'highschool', label: '🏫  มัธยมศึกษา' },
  { value: 'vocational', label: '🔧  ปวช./ปวส.' },
  { value: 'bachelor', label: '🎓  ปริญญาตรี' },
  { value: 'master', label: '📚  ปริญญาโท' },
  { value: 'doctor', label: '🏆  ปริญญาเอก' },
  { value: 'other', label: '📝  อื่นๆ' },
];

const EducationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="ระดับการศึกษา"
      subtitle="ข้อมูลเสริมสำหรับโปรไฟล์ของคุณ"
      footer={
        <Button
          label="ดำเนินการต่อ"
          onPress={() => navigation.navigate('Smoking')}
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

export default EducationScreen;
