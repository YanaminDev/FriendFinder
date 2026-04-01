// ─── ProfileScreen ─────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import AppHeader from '../../components/common/AppHeader';
import InfoRow from '../../components/profile/InfoRow';
import InterestTag from '../../components/common/InterestTag';
import { MOCK_CURRENT_USER } from '../../constants/mockData';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const user = MOCK_CURRENT_USER;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AppHeader
        title="Profile"
        rightElement={
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <Text className="text-2xl">✏️</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

        {/* Avatar + name */}
        <View className="items-center py-6 bg-white">
          <Image
            source={{ uri: user.avatar }}
            className="w-24 h-24 rounded-full bg-gray-200 mb-3"
          />
          <Text className="text-xl font-bold text-gray-900">{user.name}</Text>
          <Text className="text-sm text-gray-500 mt-1">{user.bio || 'เขียนอธิบายเกี่ยวกับตัวคุณ...'}</Text>
        </View>

        {/* Interests */}
        <View className="px-4 py-4 bg-white mt-2">
          <Text className="text-sm font-semibold text-gray-500 mb-3">ความสนใจ</Text>
          <View className="flex-row flex-wrap gap-2">
            {user.interests.map(i => (
              <InterestTag key={i} label={i} variant="outline" />
            ))}
          </View>
        </View>

        {/* Info */}
        <View className="px-4 py-2 bg-white mt-2">
          <Text className="text-sm font-semibold text-gray-500 py-3">ข้อมูลส่วนตัว</Text>
          <InfoRow icon="🎂" label="วันเกิด" value={user.birthDate} />
          <InfoRow icon="📏" label="ส่วนสูง" value={`${user.height} cm`} />
          <InfoRow icon="🩸" label="กรุ๊ปเลือด" value={user.bloodGroup} />
          <InfoRow icon="🎓" label="การศึกษา" value={user.education} />
          <InfoRow icon="🌐" label="ภาษา" value={user.language} />
          <InfoRow icon="🚬" label="การสูบบุหรี่" value={user.smoking} />
          <InfoRow icon="🍺" label="การดื่มแอลกอฮอล์" value={user.drinking} />
          <InfoRow icon="🏋️" label="การออกกำลังกาย" value={user.workout} />
          <InfoRow icon="🐾" label="สัตว์เลี้ยง" value={user.pets} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
