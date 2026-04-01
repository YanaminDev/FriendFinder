// ─── SelectActivityScreen ──────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import AppHeader from '../../components/common/AppHeader';
import SelectionOption from '../../components/common/SelectionOption';
import Button from '../../components/common/Button';
import { MOCK_ACTIVITIES } from '../../constants/mockData';
import { ScrollView } from 'react-native';

const SelectActivityScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader title="เลือกกิจกรรม" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {MOCK_ACTIVITIES.map(act => (
          <SelectionOption
            key={act.id}
            label={`${act.icon}  ${act.name}`}
            selected={selected === act.id}
            onPress={() => setSelected(act.id)}
          />
        ))}
      </ScrollView>
      <View className="px-4 pb-8 bg-white border-t border-gray-100 pt-3">
        <Button
          label="ค้นหาเพื่อน"
          onPress={() => navigation.navigate('Match')}
          disabled={!selected}
        />
      </View>
    </SafeAreaView>
  );
};

export default SelectActivityScreen;
