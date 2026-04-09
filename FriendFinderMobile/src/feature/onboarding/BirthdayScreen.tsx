
// ─── BirthdayScreen ───────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import Button from '../../components/common/Button';
import { colors } from '../../constants/theme';
import { useAppDispatch } from '../../redux/hooks';
import { setBirthOfDate, setAge } from '../../redux/userSlice';

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;

// PickerColumn Component
interface PickerColumnProps {
  items: number[];
  selectedValue: number;
  onChange: (value: number) => void;
  label: string;
}

const PickerColumn: React.FC<PickerColumnProps> = ({ items, selectedValue, onChange, label }) => {
  const scrollViewRef = useRef<ScrollView>(null);

  // Scroll ไปยัง default value เมื่อ component mount
  useEffect(() => {
    const index = items.indexOf(selectedValue);
    if (index !== -1 && scrollViewRef.current) {
      const offset = index * ITEM_HEIGHT;
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: offset, animated: false });
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMomentumScrollEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    onChange(items[Math.max(0, Math.min(index, items.length - 1))]);
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    onChange(items[Math.max(0, Math.min(index, items.length - 1))]);
  };

  return (
    <View className="items-center gap-2 flex-1">
      <View
        className="border-2 rounded-2xl overflow-hidden"
        style={{
          borderColor: colors.primary,
          height: ITEM_HEIGHT * VISIBLE_ITEMS,
          width: '100%',
        }}
      >
        <ScrollView
          ref={scrollViewRef}
          scrollEnabled={true}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate={0.8}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
          nestedScrollEnabled={true}
        >
          {items.map((item) => (
            <View key={item} style={{ height: ITEM_HEIGHT, justifyContent: 'center' }}>
              <Text
                className={`text-center font-semibold ${
                  item === selectedValue ? 'text-primary text-xl' : 'text-gray-400 text-base'
                }`}
              >
                {String(item).padStart(2, '0')}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <Text className="text-xs text-gray-500 font-medium">{label}</Text>
    </View>
  );
};

const BirthdayScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const currentYear = new Date().getFullYear();
  const today = new Date();
  const defaultDay = today.getDate();
  const defaultMonth = today.getMonth() + 1;
  const defaultYear = today.getFullYear(); // Default to today's date

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i).reverse();

  const [day, setDay] = useState(defaultDay);
  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);

  const calculateAge = (birthDate: string) => {
    const [y, m, d] = birthDate.split('-').map(Number);
    const today = new Date();
    let age = today.getFullYear() - y;
    if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) {
      age--;
    }
    return age;
  };

  const birthDateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const age = calculateAge(birthDateString);
  const isValid = age >= 13;

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="วันเกิดของคุณ"
      subtitle="ต้องมีอายุอย่างน้อย 13 ปี"
      footer={
        <Button
          label="ดำเนินการต่อ"
          onPress={() => {
            if (isValid) {
              dispatch(setBirthOfDate(birthDateString));
              dispatch(setAge(age));
              navigation.navigate('InterestedGender');
            }
          }}
          disabled={!isValid}
        />
      }
    >
      <View className="gap-6">
        {/* Picker Wheels */}
        <View className="flex-row gap-2">
          <PickerColumn items={days} selectedValue={day} onChange={setDay} label="วัน" />
          <PickerColumn items={months} selectedValue={month} onChange={setMonth} label="เดือน" />
          <PickerColumn items={years} selectedValue={year} onChange={setYear} label="ปี" />
        </View>

        {/* Age Display */}
        <View className="bg-primary-light rounded-2xl px-4 py-3 items-center">
          <Text className="text-sm text-gray-600">อายุของคุณ</Text>
          <Text className="text-2xl font-bold text-primary">{age} ปี</Text>
        </View>
      </View>
    </OnboardingLayout>
  );
};

export default BirthdayScreen;
