// ─── SmokingScreen ────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import SelectionOption from '../../components/common/SelectionOption';
import Button from '../../components/common/Button';
import { useAppDispatch } from '../../redux/hooks';
import { setSmokeId } from '../../redux/userLifeStyleSlice';
import { getSmoke, Smoke } from '../../service/smoke.service';

const SmokingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<string | null>(null);
  const [options, setOptions] = useState<Smoke[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSmoke()
      .then(setOptions)
      .finally(() => setLoading(false));
  }, []);

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="คุณสูบบุหรี่ไหม?"
      subtitle="ข้อมูลนี้จะแสดงบนโปรไฟล์ของคุณ"
      footer={
        <Button
          label="ดำเนินการต่อ"
          onPress={() => {
            if (selected) {
              dispatch(setSmokeId(selected));
              navigation.navigate('Drinking');
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

export default SmokingScreen;
