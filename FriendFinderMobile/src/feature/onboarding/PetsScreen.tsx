// ─── PetsScreen ────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import SelectionOption from '../../components/common/SelectionOption';
import Button from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setPetId } from '../../redux/userLifeStyleSlice';
import { setUserId } from '../../redux/userSlice';
import { getPet, Pet } from '../../service/pet.service';
import { register } from '../../service/user.service';
import { uploadUserImage } from '../../service/user_image.service';
import { createUserInformation } from '../../service/user_information.service';
import { createUserLifeStyle } from '../../service/user_life_style.service';

const PetsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<string | null>(null);
  const [options, setOptions] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { username, password, user_show_name, sex, age, birth_of_date, interested_gender } = useAppSelector(state => state.user);
  const profileImage = useAppSelector(state => state.userImage.profileImage);
  const { user_height, blood_group, language_id, education_id } = useAppSelector(state => state.userInformation);
  const { looking_for_id, drinking_id, smoke_id, workout_id } = useAppSelector(state => state.userLifeStyle);

  useEffect(() => {
    getPet()
      .then(setOptions)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    dispatch(setPetId(selected));
    console.log('Redux user:', { username, password, user_show_name, sex, age, birth_of_date, interested_gender });
    console.log('Redux lifestyle:', { looking_for_id, drinking_id, smoke_id, workout_id, pet_id: selected });
    try {
      const { user_id } = await registerUser();
      dispatch(setUserId(user_id));
      await uploadImage(user_id);
      await createProfile(user_id, selected);
      navigation.replace('Home');
    } catch (err: any) {
      Alert.alert('เกิดข้อผิดพลาด', err?.message ?? 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่');
    } finally {
      setSubmitting(false);
    }
  };

  const registerUser = async () => {
    const res = await register({ username, password, user_show_name, sex: sex as any, age: age!, birth_of_date, interested_gender: interested_gender as any });
    if (!res.user_id) throw new Error('ไม่ได้รับ user_id จาก server');
    return { user_id: res.user_id };
  };

  const uploadImage = async (user_id: string) => {
    if (!profileImage) return;
    const fileName = profileImage.split('/').pop() ?? 'profile.jpg';
    const fileType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
    await uploadUserImage(user_id, { uri: profileImage, name: fileName, type: fileType });
  };

  const createProfile = async (user_id: string, pet_id: string) => {
    await Promise.all([
      createUserInformation({ user_id, user_height: user_height!, blood_group: blood_group || undefined, language_id: language_id || undefined, education_id: education_id || undefined }),
      createUserLifeStyle({ user_id, looking_for_id, drinking_id, pet_id, smoke_id, workout_id }),
    ]);
  };

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="คุณมีสัตว์เลี้ยงไหม?"
      subtitle="ข้อมูลนี้จะแสดงบนโปรไฟล์ของคุณ"
      footer={
        <Button
          label={submitting ? 'กำลังสร้างบัญชี...' : 'เสร็จสิ้น'}
          onPress={handleSubmit}
          disabled={!selected || submitting}
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

export default PetsScreen;
