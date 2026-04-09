// ─── LanguageScreen ───────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import SelectionOption from '../../components/common/SelectionOption';
import Button from '../../components/common/Button';
import { useAppDispatch } from '../../redux/hooks';
import { setLanguageId } from '../../redux/userInformationSlice';
import { getLanguage, Language } from '../../service/language.service';

const LanguageScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<string | null>(null);
  const [options, setOptions] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLanguage()
      .then(setOptions)
      .finally(() => setLoading(false));
  }, []);

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="ภาษาที่ใช้"
      subtitle="เลือกภาษาหลักที่ใช้"
      footer={
        <Button
          label="ดำเนินการต่อ"
          onPress={() => {
            if (selected) {
              dispatch(setLanguageId(selected));
              navigation.navigate('BloodType');
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
              label={`${opt.icon}  ${opt.name}`}
              selected={selected === opt.id}
              onPress={() => setSelected(opt.id)}
            />
          ))
        )}
      </View>
    </OnboardingLayout>
  );
};

export default LanguageScreen;
