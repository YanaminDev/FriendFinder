// ─── DrinkingScreen ────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import SelectionOption from '../../components/common/SelectionOption';
import Button from '../../components/common/Button';
import { useAppDispatch } from '../../redux/hooks';
import { setDrinkingId } from '../../redux/userLifeStyleSlice';
import { getDrinking, Drinking } from '../../service/drinking.service';

const DrinkingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<string | null>(null);
  const [options, setOptions] = useState<Drinking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDrinking()
      .then(setOptions)
      .finally(() => setLoading(false));
  }, []);

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="คุณดื่มแอลกอฮอล์ไหม?"
      subtitle="ข้อมูลนี้จะแสดงบนโปรไฟล์ของคุณ"
      footer={
        <Button
          label="เสร็จสิ้น"
          onPress={() => {
            if (selected) {
              dispatch(setDrinkingId(selected));
              navigation.navigate('Exercise');
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

export default DrinkingScreen;
