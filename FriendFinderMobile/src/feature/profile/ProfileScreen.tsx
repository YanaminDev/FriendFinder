// ─── ProfileScreen ─────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/common/AppHeader';
import InfoRow from '../../components/profile/InfoRow';
import { getUserProfile, UserProfile } from '../../service/user.service';
import { getUserInformation, UserInformation } from '../../service/user_information.service';
import { getUserLifeStyle, UserLifeStyle } from '../../service/user_life_style.service';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userInfo, setUserInfo] = useState<UserInformation | null>(null);
  const [userLifeStyle, setUserLifeStyle] = useState<UserLifeStyle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);

        const [info, lifeStyle] = await Promise.all([
          getUserInformation(profile.user_id),
          getUserLifeStyle(profile.user_id),
        ]);
        setUserInfo(info);
        setUserLifeStyle(lifeStyle);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
      <AppHeader
        title="Profile"
        rightElement={
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <Text className="text-2xl">✏️</Text>
          </TouchableOpacity>
        }
      />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

          {/* Avatar + name */}
          <View className="items-center py-6 bg-white">
            <View className="w-24 h-24 rounded-full bg-gray-200 mb-3 items-center justify-center">
              <Text className="text-4xl">👤</Text>
            </View>
            <Text className="text-xl font-bold text-gray-900">{userProfile?.user_show_name || '-'}</Text>
            <Text className="text-sm text-gray-500 mt-1">{userInfo?.user_bio || 'เขียนอธิบายเกี่ยวกับตัวคุณ...'}</Text>
          </View>

          {/* Info */}
          <View className="px-4 py-2 bg-white mt-2">
            <Text className="text-sm font-semibold text-gray-500 py-3">ข้อมูลส่วนตัว</Text>
            <InfoRow iconName="cake" label="วันเกิด" value={userProfile?.birth_of_date ? new Date(userProfile.birth_of_date).toLocaleDateString('th-TH') : '-'} />
            <InfoRow iconName="resize" label="ส่วนสูง" value={userInfo?.user_height ? `${userInfo.user_height} cm` : '-'} />
            <InfoRow iconName="water" label="กรุ๊ปเลือด" value={userInfo?.blood_group || '-'} />
            <InfoRow iconName="school" label="การศึกษา" value={userInfo?.education?.name || '-'} />
            <InfoRow iconName="globe" label="ภาษา" value={userInfo?.language?.name || '-'} />
            <InfoRow iconName="flame" label="การสูบบุหรี่" value={userLifeStyle?.smoke?.name || '-'} />
            <InfoRow iconName="wine" label="การดื่มแอลกอฮอล์" value={userLifeStyle?.drinking?.name || '-'} />
            <InfoRow iconName="barbell" label="การออกกำลังกาย" value={userLifeStyle?.workout?.name || '-'} />
            <InfoRow iconName="paw" label="สัตว์เลี้ยง" value={userLifeStyle?.pet?.name || '-'} />
          </View>

        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
