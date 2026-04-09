// ─── EducationScreen ──────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import SelectionOption from '../../components/common/SelectionOption';
import Button from '../../components/common/Button';
import { useAppDispatch } from '../../redux/hooks';
import { setEducationId } from '../../redux/userInformationSlice';
import { getEducation, Education } from '../../service/education.service';

const EducationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<string | null>(null);
  const [options, setOptions] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEducation()
      .then(setOptions)
      .finally(() => setLoading(false));
  }, []);

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="ระดับการศึกษา"
      subtitle="ข้อมูลเสริมสำหรับโปรไฟล์ของคุณ"
      footer={
        <Button
          label="ดำเนินการต่อ"
          onPress={() => {
            if (selected) {
              dispatch(setEducationId(selected));
              navigation.navigate('Smoking');
            }
          }}
          disabled={!selected}
        />
      }
    >
      <View className="gap-3">
        {loading ? (
          <ActivityIndicator />
        ) : (
          options.map(opt => (
            <SelectionOption
              key={opt.id}
              label={opt.name}
              selected={selected === opt.id}
              onPress={() => setSelected(opt.id)}
              icon={opt.icon as any}
            />
          ))
        )}
      </View>
    </OnboardingLayout>
  );
};

export default EducationScreen;
