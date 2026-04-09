// ─── ExerciseScreen ────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import SelectionOption from '../../components/common/SelectionOption';
import Button from '../../components/common/Button';
import { useAppDispatch } from '../../redux/hooks';
import { setWorkoutId } from '../../redux/userLifeStyleSlice';
import { getWorkout, Workout } from '../../service/workout.service';

const ExerciseScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<string | null>(null);
  const [options, setOptions] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWorkout()
      .then(setOptions)
      .finally(() => setLoading(false));
  }, []);

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="คุณออกกำลังกายไหม?"
      subtitle="ข้อมูลนี้จะแสดงบนโปรไฟล์ของคุณ"
      footer={
        <Button
          label="ดำเนินการต่อ"
          onPress={() => {
            if (selected) {
              dispatch(setWorkoutId(selected));
              navigation.navigate('Pets');
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

export default ExerciseScreen;
