// ─── BirthdayScreen ───────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import Button from '../../components/common/Button';
import { cn } from '../../utils/cn';

const BirthdayScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const isValid =
    day.length === 2 &&
    month.length === 2 &&
    year.length === 4 &&
    +day >= 1 && +day <= 31 &&
    +month >= 1 && +month <= 12;

  const fieldClass = 'border border-gray-300 rounded-xl h-[52px] text-xl font-bold text-gray-900 text-center bg-white';

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="วันเกิดของคุณ"
      subtitle="ข้อมูลนี้จะไม่แสดงต่อสาธารณะ"
      footer={
        <Button
          label="ดำเนินการต่อ"
          onPress={() => navigation.navigate('InterestedGender')}
          disabled={!isValid}
        />
      }
    >
      <View className="flex-row gap-3 justify-center">
        {/* Day */}
        <View className="flex-1 items-center gap-2">
          <TextInput
            value={day}
            onChangeText={v => setDay(v.replace(/\D/g, '').slice(0, 2))}
            placeholder="DD"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
            maxLength={2}
            className={cn(fieldClass, 'w-full')}
          />
          <Text className="text-xs text-gray-400">วัน</Text>
        </View>

        {/* Month */}
        <View className="flex-1 items-center gap-2">
          <TextInput
            value={month}
            onChangeText={v => setMonth(v.replace(/\D/g, '').slice(0, 2))}
            placeholder="MM"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
            maxLength={2}
            className={cn(fieldClass, 'w-full')}
          />
          <Text className="text-xs text-gray-400">เดือน</Text>
        </View>

        {/* Year */}
        <View className="flex-[2] items-center gap-2">
          <TextInput
            value={year}
            onChangeText={v => setYear(v.replace(/\D/g, '').slice(0, 4))}
            placeholder="YYYY"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
            maxLength={4}
            className={cn(fieldClass, 'w-full')}
          />
          <Text className="text-xs text-gray-400">ปี (ค.ศ.)</Text>
        </View>
      </View>
    </OnboardingLayout>
  );
};

export default BirthdayScreen;
